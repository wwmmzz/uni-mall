import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser, JwtPayload } from '../../common/types/auth-user';
import { DatabaseService } from '../../database/database.service';
import { MockLoginDto } from './dto/mock-login.dto';

interface UserRow {
  id: string;
  phone: string;
  nickname: string;
  avatar_text: string;
  role: 'user' | 'admin';
  created_at: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async mockLogin(dto: MockLoginDto) {
    const user = await this.databaseService.withTransaction(async (tx) => {
      const row = await tx.one<UserRow>(
        `
        INSERT INTO users (phone, nickname, avatar_text)
        VALUES ($1, COALESCE(NULLIF($2, ''), '优选会员'), SUBSTRING($1 FROM 1 FOR 1))
        ON CONFLICT (phone) DO UPDATE SET
          nickname = COALESCE(NULLIF(EXCLUDED.nickname, ''), users.nickname),
          updated_at = NOW()
        RETURNING id, phone, nickname, avatar_text, role, created_at
        `,
        [dto.phone, dto.nickname ?? null],
      );

      await tx.query('INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [row.id]);
      await tx.query(
        `
        INSERT INTO user_coupons (user_id, coupon_id)
        SELECT $1, id FROM coupons
        WHERE is_active = TRUE
        ON CONFLICT (user_id, coupon_id) DO NOTHING
        `,
        [row.id],
      );

      return row;
    });

    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    return {
      tokenType: 'Bearer',
      accessToken: await this.jwtService.signAsync(payload),
      user: this.mapUser(user),
    };
  }

  async profile(authUser: AuthUser) {
    const user = await this.databaseService.oneOrNone<UserRow>(
      'SELECT id, phone, nickname, avatar_text, role, created_at FROM users WHERE id = $1',
      [authUser.id],
    );

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.mapUser(user);
  }

  private mapUser(row: UserRow) {
    return {
      id: row.id,
      phone: row.phone,
      nickname: row.nickname,
      avatarText: row.avatar_text,
      role: row.role,
      createdAt: row.created_at,
    };
  }
}
