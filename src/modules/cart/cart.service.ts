import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { toNumber } from '../../common/utils/money';
import { DatabaseService } from '../../database/database.service';
import { SqlExecutor } from '../../database/sql-executor';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CheckAllCartDto } from './dto/check-all-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

interface CartItemRow {
  cart_item_id: string;
  product_id: string;
  title: string;
  price: string;
  old_price: string | null;
  cover_text: string;
  gradient: string;
  sku_name: string;
  quantity: number;
  checked: boolean;
  stock: number;
  created_at: Date;
}

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(user: AuthUser) {
    const cartId = await this.getOrCreateCart(this.databaseService, user.id);
    const result = await this.databaseService.query<CartItemRow>(this.cartItemsSql(), [cartId]);
    const list = result.rows.map((row) => this.mapCartItem(row));

    return {
      list,
      checkedCount: list.filter((item) => item.checked).length,
      totalQuantity: list.reduce((sum, item) => sum + item.quantity, 0),
      checkedAmount: list.filter((item) => item.checked).reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }

  async add(user: AuthUser, dto: AddCartItemDto) {
    await this.databaseService.withTransaction(async (tx) => {
      const product = await tx.oneOrNone<{ id: string; stock: number }>(
        'SELECT id, stock FROM products WHERE id = $1 AND is_active = TRUE',
        [dto.productId],
      );

      if (!product) {
        throw new NotFoundException('商品不存在或已下架');
      }

      const skuName = dto.skuName || '默认规格';
      const sku = await tx.oneOrNone<{ id: string }>(
        'SELECT id FROM product_skus WHERE product_id = $1 AND sku_name = $2',
        [dto.productId, skuName],
      );

      if (!sku) {
        throw new BadRequestException('商品规格不存在');
      }

      const cartId = await this.getOrCreateCart(tx, user.id);
      const updated = await tx.one<{ quantity: number }>(
        `
        INSERT INTO cart_items (cart_id, product_id, sku_name, quantity, checked)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (cart_id, product_id, sku_name) DO UPDATE SET
          quantity = cart_items.quantity + EXCLUDED.quantity,
          checked = TRUE,
          updated_at = NOW()
        RETURNING quantity
        `,
        [cartId, dto.productId, skuName, dto.quantity],
      );

      if (updated.quantity > product.stock) {
        throw new BadRequestException('库存不足');
      }
    });

    return this.list(user);
  }

  async update(user: AuthUser, cartItemId: string, dto: UpdateCartItemDto) {
    await this.databaseService.withTransaction(async (tx) => {
      const row = await tx.oneOrNone<{ stock: number }>(
        `
        SELECT p.stock
        FROM cart_items ci
        JOIN carts c ON c.id = ci.cart_id
        JOIN products p ON p.id = ci.product_id
        WHERE ci.id = $1 AND c.user_id = $2
        `,
        [cartItemId, user.id],
      );

      if (!row) {
        throw new NotFoundException('购物车商品不存在');
      }

      if (dto.quantity !== undefined && dto.quantity > row.stock) {
        throw new BadRequestException('库存不足');
      }

      await tx.query(
        `
        UPDATE cart_items ci
        SET
          quantity = COALESCE($3::INT, ci.quantity),
          checked = COALESCE($4::BOOLEAN, ci.checked),
          updated_at = NOW()
        FROM carts c
        WHERE ci.cart_id = c.id AND ci.id = $1 AND c.user_id = $2
        `,
        [cartItemId, user.id, dto.quantity ?? null, dto.checked ?? null],
      );
    });

    return this.list(user);
  }

  async remove(user: AuthUser, cartItemId: string) {
    await this.databaseService.query(
      `
      DELETE FROM cart_items ci
      USING carts c
      WHERE ci.cart_id = c.id AND ci.id = $1 AND c.user_id = $2
      `,
      [cartItemId, user.id],
    );

    return this.list(user);
  }

  async checkAll(user: AuthUser, dto: CheckAllCartDto) {
    const cartId = await this.getOrCreateCart(this.databaseService, user.id);
    await this.databaseService.query('UPDATE cart_items SET checked = $1, updated_at = NOW() WHERE cart_id = $2', [
      dto.checked,
      cartId,
    ]);
    return this.list(user);
  }

  private async getOrCreateCart(executor: SqlExecutor, userId: string) {
    const row = await executor.one<{ id: string }>(
      `
      INSERT INTO carts (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
      RETURNING id
      `,
      [userId],
    );

    return row.id;
  }

  private cartItemsSql() {
    return `
      SELECT
        ci.id AS cart_item_id,
        p.id AS product_id,
        p.title,
        p.price,
        p.old_price,
        p.cover_text,
        p.gradient,
        ci.sku_name,
        ci.quantity,
        ci.checked,
        p.stock,
        ci.created_at
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at DESC
    `;
  }

  private mapCartItem(row: CartItemRow) {
    return {
      id: row.cart_item_id,
      cartId: row.cart_item_id,
      productId: row.product_id,
      title: row.title,
      price: toNumber(row.price),
      oldPrice: row.old_price === null ? null : toNumber(row.old_price),
      cover: '',
      coverText: row.cover_text,
      gradient: row.gradient,
      skuName: row.sku_name,
      quantity: Number(row.quantity),
      checked: row.checked,
      stock: Number(row.stock),
      createdAt: row.created_at,
    };
  }
}
