import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { toNumber } from '../../common/utils/money';
import { DatabaseService } from '../../database/database.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

interface FavoriteProductRow {
  id: string;
  title: string;
  price: string;
  old_price: string | null;
  cover_text: string;
  gradient: string;
  tags: string[];
  created_at: Date;
}

@Injectable()
export class FavoriteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(user: AuthUser) {
    const result = await this.databaseService.query<FavoriteProductRow>(
      `
      SELECT p.id, p.title, p.price, p.old_price, p.cover_text, p.gradient, p.tags, f.created_at
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      WHERE f.user_id = $1 AND p.is_active = TRUE
      ORDER BY f.created_at DESC
      `,
      [user.id],
    );

    return result.rows.map((row) => this.mapProduct(row));
  }

  async toggle(user: AuthUser, dto: ToggleFavoriteDto) {
    const favorited = await this.databaseService.withTransaction(async (tx) => {
      const product = await tx.oneOrNone<{ id: string }>('SELECT id FROM products WHERE id = $1 AND is_active = TRUE', [
        dto.productId,
      ]);

      if (!product) {
        throw new NotFoundException('商品不存在或已下架');
      }

      const existing = await tx.oneOrNone<{ product_id: string }>(
        'SELECT product_id FROM favorites WHERE user_id = $1 AND product_id = $2',
        [user.id, dto.productId],
      );

      if (existing) {
        await tx.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [user.id, dto.productId]);
        return false;
      }

      await tx.query('INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)', [user.id, dto.productId]);
      return true;
    });

    return {
      favorited,
      list: await this.list(user),
    };
  }

  async isFavorite(user: AuthUser, productId: string) {
    const row = await this.databaseService.oneOrNone<{ product_id: string }>(
      'SELECT product_id FROM favorites WHERE user_id = $1 AND product_id = $2',
      [user.id, productId],
    );

    return {
      productId,
      favorited: Boolean(row),
    };
  }

  private mapProduct(row: FavoriteProductRow) {
    return {
      id: row.id,
      title: row.title,
      price: toNumber(row.price),
      oldPrice: row.old_price === null ? null : toNumber(row.old_price),
      cover: '',
      coverText: row.cover_text,
      gradient: row.gradient,
      tags: row.tags ?? [],
      createdAt: row.created_at,
    };
  }
}
