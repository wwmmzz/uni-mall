import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { DatabaseService } from '../../database/database.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

interface AddressRow {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  is_default: boolean;
  created_at: Date;
}

@Injectable()
export class AddressService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(user: AuthUser) {
    const result = await this.databaseService.query<AddressRow>(
      `
      SELECT id, name, phone, province, city, district, detail, is_default, created_at
      FROM user_addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
      `,
      [user.id],
    );

    return result.rows.map((row) => this.mapAddress(row));
  }

  async create(user: AuthUser, dto: CreateAddressDto) {
    return this.databaseService.withTransaction(async (tx) => {
      const countRow = await tx.one<{ count: string }>('SELECT COUNT(*) AS count FROM user_addresses WHERE user_id = $1', [
        user.id,
      ]);
      const shouldDefault = dto.isDefault ?? Number(countRow.count) === 0;

      if (shouldDefault) {
        await tx.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.id]);
      }

      const row = await tx.one<AddressRow>(
        `
        INSERT INTO user_addresses (user_id, name, phone, province, city, district, detail, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, phone, province, city, district, detail, is_default, created_at
        `,
        [user.id, dto.name, dto.phone, dto.province, dto.city, dto.district, dto.detail, shouldDefault],
      );

      return this.mapAddress(row);
    });
  }

  async update(user: AuthUser, id: string, dto: UpdateAddressDto) {
    return this.databaseService.withTransaction(async (tx) => {
      const exists = await tx.oneOrNone<{ id: string }>('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [
        id,
        user.id,
      ]);

      if (!exists) {
        throw new NotFoundException('地址不存在');
      }

      if (dto.isDefault) {
        await tx.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.id]);
      }

      const row = await tx.one<AddressRow>(
        `
        UPDATE user_addresses
        SET
          name = COALESCE($3::TEXT, name),
          phone = COALESCE($4::TEXT, phone),
          province = COALESCE($5::TEXT, province),
          city = COALESCE($6::TEXT, city),
          district = COALESCE($7::TEXT, district),
          detail = COALESCE($8::TEXT, detail),
          is_default = COALESCE($9::BOOLEAN, is_default),
          updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING id, name, phone, province, city, district, detail, is_default, created_at
        `,
        [
          id,
          user.id,
          dto.name ?? null,
          dto.phone ?? null,
          dto.province ?? null,
          dto.city ?? null,
          dto.district ?? null,
          dto.detail ?? null,
          dto.isDefault ?? null,
        ],
      );

      return this.mapAddress(row);
    });
  }

  async setDefault(user: AuthUser, id: string) {
    return this.databaseService.withTransaction(async (tx) => {
      const exists = await tx.oneOrNone<{ id: string }>('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [
        id,
        user.id,
      ]);

      if (!exists) {
        throw new NotFoundException('地址不存在');
      }

      await tx.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.id]);
      const row = await tx.one<AddressRow>(
        `
        UPDATE user_addresses
        SET is_default = TRUE, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING id, name, phone, province, city, district, detail, is_default, created_at
        `,
        [id, user.id],
      );

      return this.mapAddress(row);
    });
  }

  async remove(user: AuthUser, id: string) {
    await this.databaseService.withTransaction(async (tx) => {
      const deleted = await tx.oneOrNone<{ id: string; is_default: boolean }>(
        'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING id, is_default',
        [id, user.id],
      );

      if (!deleted) {
        throw new NotFoundException('地址不存在');
      }

      const hasDefault = await tx.one<{ count: string }>(
        'SELECT COUNT(*) AS count FROM user_addresses WHERE user_id = $1 AND is_default = TRUE',
        [user.id],
      );

      if (Number(hasDefault.count) === 0) {
        await tx.query(
          `
          UPDATE user_addresses
          SET is_default = TRUE
          WHERE id = (
            SELECT id FROM user_addresses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1
          )
          `,
          [user.id],
        );
      }
    });

    return this.list(user);
  }

  private mapAddress(row: AddressRow) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      province: row.province,
      city: row.city,
      district: row.district,
      detail: row.detail,
      isDefault: row.is_default,
      createdAt: row.created_at,
    };
  }
}
