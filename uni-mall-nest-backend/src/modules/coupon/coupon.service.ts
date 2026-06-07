import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { toNumber } from '../../common/utils/money';
import { DatabaseService } from '../../database/database.service';
import { ListCouponsDto } from './dto/list-coupons.dto';

interface CouponRow {
  id: string;
  title: string;
  amount: string;
  threshold_amount: string;
  description: string;
  valid_from: Date;
  valid_until: Date;
  category_id: string | null;
  stock: number;
  status: 'unused' | 'used' | 'expired' | null;
  claimed_at: Date | null;
  used_at: Date | null;
}

@Injectable()
export class CouponService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(user: AuthUser, dto: ListCouponsDto) {
    const result = await this.databaseService.query<CouponRow>(
      `
      SELECT
        c.id, c.title, c.amount, c.threshold_amount, c.description, c.valid_from,
        c.valid_until, c.category_id, c.stock, uc.status, uc.claimed_at, uc.used_at
      FROM coupons c
      LEFT JOIN user_coupons uc ON uc.coupon_id = c.id AND uc.user_id = $1
      WHERE c.is_active = TRUE
      ORDER BY c.threshold_amount ASC, c.amount DESC, c.id ASC
      `,
      [user.id],
    );

    return result.rows.map((row) => this.mapCoupon(row, dto));
  }

  async claim(user: AuthUser, couponId: string) {
    return this.databaseService.withTransaction(async (tx) => {
      const coupon = await tx.oneOrNone<CouponRow>(
        `
        SELECT c.id, c.title, c.amount, c.threshold_amount, c.description, c.valid_from,
               c.valid_until, c.category_id, c.stock, uc.status, uc.claimed_at, uc.used_at
        FROM coupons c
        LEFT JOIN user_coupons uc ON uc.coupon_id = c.id AND uc.user_id = $1
        WHERE c.id = $2 AND c.is_active = TRUE
        FOR UPDATE OF c
        `,
        [user.id, couponId],
      );

      if (!coupon) {
        throw new NotFoundException('优惠券不存在');
      }

      if (coupon.status) {
        return this.mapCoupon(coupon, {});
      }

      if (coupon.valid_until.getTime() < Date.now()) {
        throw new BadRequestException('优惠券已过期');
      }

      if (coupon.stock === 0) {
        throw new BadRequestException('优惠券已领完');
      }

      if (coupon.stock > 0) {
        await tx.query('UPDATE coupons SET stock = stock - 1 WHERE id = $1', [couponId]);
      }

      const row = await tx.one<CouponRow>(
        `
        INSERT INTO user_coupons (user_id, coupon_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, coupon_id) DO UPDATE SET claimed_at = user_coupons.claimed_at
        RETURNING
          $2::TEXT AS id,
          (SELECT title FROM coupons WHERE id = $2) AS title,
          (SELECT amount FROM coupons WHERE id = $2) AS amount,
          (SELECT threshold_amount FROM coupons WHERE id = $2) AS threshold_amount,
          (SELECT description FROM coupons WHERE id = $2) AS description,
          (SELECT valid_from FROM coupons WHERE id = $2) AS valid_from,
          (SELECT valid_until FROM coupons WHERE id = $2) AS valid_until,
          (SELECT category_id FROM coupons WHERE id = $2) AS category_id,
          (SELECT stock FROM coupons WHERE id = $2) AS stock,
          status,
          claimed_at,
          used_at
        `,
        [user.id, couponId],
      );

      return this.mapCoupon(row, {});
    });
  }

  private mapCoupon(row: CouponRow, dto: ListCouponsDto) {
    const goodsAmount = dto.goodsAmount ?? 0;
    const threshold = toNumber(row.threshold_amount);
    const amount = toNumber(row.amount);
    const inDateRange = row.valid_from.getTime() <= Date.now() && row.valid_until.getTime() >= Date.now();
    const categoryMatched = !row.category_id || !dto.categoryId || dto.categoryId === row.category_id;
    const usable = row.status === 'unused' && inDateRange && goodsAmount >= threshold && categoryMatched;

    return {
      id: row.id,
      title: row.title,
      amount,
      threshold,
      desc: row.description,
      validDate: `${row.valid_until.getFullYear()}-${String(row.valid_until.getMonth() + 1).padStart(2, '0')}-${String(row.valid_until.getDate()).padStart(2, '0')} 前有效`,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      categoryId: row.category_id,
      status: row.status ?? 'unclaimed',
      claimedAt: row.claimed_at,
      usedAt: row.used_at,
      usable,
    };
  }
}
