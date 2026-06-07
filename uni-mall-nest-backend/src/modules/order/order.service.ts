import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { createOrderNo, createPaymentNo, roundMoney, toNumber } from '../../common/utils/money';
import { pageOffset } from '../../common/utils/pagination';
import { DatabaseService } from '../../database/database.service';
import { SqlExecutor } from '../../database/sql-executor';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';

const STATUS_TEXT: Record<string, string> = {
  unpaid: '待付款',
  paid: '待发货',
  shipped: '待收货',
  finished: '已完成',
  closed: '已关闭',
};

interface ProductForOrderRow {
  id: string;
  category_id: string;
  title: string;
  price: string;
  stock: number;
  cover_text: string;
  gradient: string;
}

interface SkuRow {
  id: string;
  stock: number;
}

interface AddressRow {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
}

interface CouponLockRow {
  user_coupon_id: string;
  coupon_id: string;
  amount: string;
  threshold_amount: string;
  category_id: string | null;
  status: 'unused' | 'used' | 'expired';
  valid_from: Date;
  valid_until: Date;
}

interface OrderRow {
  id: string;
  order_no: string;
  status: string;
  goods_amount: string;
  freight_amount: string;
  discount_amount: string;
  total_amount: string;
  coupon_id: string | null;
  address_snapshot: any;
  remark: string | null;
  pay_type: string | null;
  paid_at: Date | null;
  created_at: Date;
  items?: any[];
}

interface OrderItemRow {
  id: string;
  product_id: string;
  sku_name: string;
  title: string;
  price: string;
  quantity: number;
  cover_text: string;
  gradient: string;
}

interface ResolvedOrderInput {
  productId: string;
  skuName: string;
  quantity: number;
  cartItemIds: string[];
}

interface PreparedOrderItem {
  productId: string;
  categoryId: string;
  skuName: string;
  title: string;
  price: number;
  quantity: number;
  coverText: string;
  gradient: string;
}

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(user: AuthUser, dto: ListOrdersDto) {
    const { page, pageSize, offset } = pageOffset(dto.page, dto.pageSize);
    const params: unknown[] = [user.id];
    const where = ['o.user_id = $1'];

    if (dto.status && dto.status !== 'all') {
      params.push(dto.status);
      where.push(`o.status = $${params.length}`);
    }

    const count = await this.databaseService.one<{ count: string }>(
      `SELECT COUNT(*) AS count FROM orders o WHERE ${where.join(' AND ')}`,
      params,
    );

    params.push(pageSize, offset);
    const limitParam = params.length - 1;
    const offsetParam = params.length;

    const result = await this.databaseService.query<OrderRow>(
      `
      SELECT
        o.id, o.order_no, o.status, o.goods_amount, o.freight_amount,
        o.discount_amount, o.total_amount, o.coupon_id, o.address_snapshot,
        o.remark, o.pay_type, o.paid_at, o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi.product_id,
              'skuName', oi.sku_name,
              'title', oi.title,
              'price', oi.price,
              'quantity', oi.quantity,
              'coverText', oi.cover_text,
              'gradient', oi.gradient
            ) ORDER BY oi.created_at ASC
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE ${where.join(' AND ')}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params,
    );

    const total = Number(count.count);
    return {
      list: result.rows.map((row) => this.mapOrder(row)),
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    };
  }

  async detail(user: AuthUser, orderNo: string) {
    const order = await this.databaseService.oneOrNone<OrderRow>(
      `
      SELECT id, order_no, status, goods_amount, freight_amount, discount_amount,
             total_amount, coupon_id, address_snapshot, remark, pay_type, paid_at, created_at
      FROM orders
      WHERE order_no = $1 AND user_id = $2
      `,
      [orderNo, user.id],
    );

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    const items = await this.databaseService.query<OrderItemRow>(
      `
      SELECT id, product_id, sku_name, title, price, quantity, cover_text, gradient
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
      `,
      [order.id],
    );

    return this.mapOrder({
      ...order,
      items: items.rows.map((row) => this.mapOrderItem(row)),
    });
  }

  async create(user: AuthUser, dto: CreateOrderDto) {
    const orderNo = createOrderNo();

    await this.databaseService.withTransaction(async (tx) => {
      const address = await this.getAddressForOrder(tx, user.id, dto.addressId);
      const resolvedItems = await this.resolveOrderInputs(tx, user.id, dto);

      if (!resolvedItems.length) {
        throw new BadRequestException('暂无可结算商品');
      }

      const preparedItems: PreparedOrderItem[] = [];
      let goodsAmount = 0;

      for (const item of resolvedItems) {
        const product = await tx.oneOrNone<ProductForOrderRow>(
          `
          SELECT id, category_id, title, price, stock, cover_text, gradient
          FROM products
          WHERE id = $1 AND is_active = TRUE
          FOR UPDATE
          `,
          [item.productId],
        );

        if (!product) {
          throw new NotFoundException(`商品 ${item.productId} 不存在或已下架`);
        }

        const sku = await tx.oneOrNone<SkuRow>(
          'SELECT id, stock FROM product_skus WHERE product_id = $1 AND sku_name = $2 FOR UPDATE',
          [item.productId, item.skuName],
        );

        if (!sku) {
          throw new BadRequestException(`商品规格不存在：${product.title} / ${item.skuName}`);
        }

        if (product.stock < item.quantity || sku.stock < item.quantity) {
          throw new BadRequestException(`库存不足：${product.title}`);
        }

        await tx.query('UPDATE products SET stock = stock - $2, sales = sales + $2 WHERE id = $1', [
          product.id,
          item.quantity,
        ]);
        await tx.query('UPDATE product_skus SET stock = stock - $3 WHERE product_id = $1 AND sku_name = $2', [
          product.id,
          item.skuName,
          item.quantity,
        ]);

        const price = toNumber(product.price);
        goodsAmount = roundMoney(goodsAmount + price * item.quantity);
        preparedItems.push({
          productId: product.id,
          categoryId: product.category_id,
          skuName: item.skuName,
          title: product.title,
          price,
          quantity: item.quantity,
          coverText: product.cover_text,
          gradient: product.gradient,
        });
      }

      const freightAmount = goodsAmount >= 99 ? 0 : 8;
      const couponResult = await this.resolveCoupon(tx, user.id, dto.couponId, preparedItems, goodsAmount, freightAmount, orderNo);
      const discountAmount = couponResult.discountAmount;
      const totalAmount = roundMoney(Math.max(goodsAmount + freightAmount - discountAmount, 0));
      const status = dto.payNow === false ? 'unpaid' : 'paid';
      const paidAt = status === 'paid' ? new Date() : null;
      const payType = status === 'paid' ? '微信支付' : null;

      const order = await tx.one<{ id: string }>(
        `
        INSERT INTO orders (
          order_no, user_id, status, goods_amount, freight_amount, discount_amount,
          total_amount, coupon_id, address_snapshot, remark, pay_type, paid_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::JSONB, $10, $11, $12)
        RETURNING id
        `,
        [
          orderNo,
          user.id,
          status,
          goodsAmount,
          freightAmount,
          discountAmount,
          totalAmount,
          couponResult.couponId,
          JSON.stringify(address),
          dto.remark ?? null,
          payType,
          paidAt,
        ],
      );

      for (const item of preparedItems) {
        await tx.query(
          `
          INSERT INTO order_items (order_id, product_id, sku_name, title, price, quantity, cover_text, gradient)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
          [order.id, item.productId, item.skuName, item.title, item.price, item.quantity, item.coverText, item.gradient],
        );
      }

      const cartItemIds = resolvedItems.flatMap((item) => item.cartItemIds);
      if (cartItemIds.length) {
        await tx.query(
          `
          DELETE FROM cart_items ci
          USING carts c
          WHERE ci.cart_id = c.id AND c.user_id = $1 AND ci.id = ANY($2::UUID[])
          `,
          [user.id, cartItemIds],
        );
      }

      if (status === 'paid') {
        await tx.query(
          `
          INSERT INTO payments (order_id, payment_no, provider, amount, status, paid_at)
          VALUES ($1, $2, 'wechat', $3, 'success', NOW())
          `,
          [order.id, createPaymentNo(), totalAmount],
        );
      }
    });

    return this.detail(user, orderNo);
  }

  async pay(user: AuthUser, orderNo: string) {
    await this.databaseService.withTransaction(async (tx) => {
      const order = await tx.oneOrNone<OrderRow>(
        'SELECT * FROM orders WHERE order_no = $1 AND user_id = $2 FOR UPDATE',
        [orderNo, user.id],
      );

      if (!order) {
        throw new NotFoundException('订单不存在');
      }

      if (order.status !== 'unpaid') {
        throw new BadRequestException('当前订单状态不支持支付');
      }

      await tx.query(
        `
        UPDATE orders
        SET status = 'paid', pay_type = '微信支付', paid_at = NOW(), updated_at = NOW()
        WHERE id = $1
        `,
        [order.id],
      );
      await tx.query(
        `
        INSERT INTO payments (order_id, payment_no, provider, amount, status, paid_at)
        VALUES ($1, $2, 'wechat', $3, 'success', NOW())
        `,
        [order.id, createPaymentNo(), toNumber(order.total_amount)],
      );
    });

    return this.detail(user, orderNo);
  }

  async cancel(user: AuthUser, orderNo: string) {
    await this.databaseService.withTransaction(async (tx) => {
      const order = await tx.oneOrNone<OrderRow>(
        'SELECT * FROM orders WHERE order_no = $1 AND user_id = $2 FOR UPDATE',
        [orderNo, user.id],
      );

      if (!order) {
        throw new NotFoundException('订单不存在');
      }

      if (order.status !== 'unpaid') {
        throw new BadRequestException('仅待付款订单可取消；已支付订单请走售后退款流程');
      }

      const items = await tx.query<OrderItemRow>(
        'SELECT product_id, sku_name, quantity FROM order_items WHERE order_id = $1',
        [order.id],
      );

      for (const item of items.rows) {
        await tx.query('UPDATE products SET stock = stock + $2, sales = GREATEST(sales - $2, 0) WHERE id = $1', [
          item.product_id,
          item.quantity,
        ]);
        await tx.query('UPDATE product_skus SET stock = stock + $3 WHERE product_id = $1 AND sku_name = $2', [
          item.product_id,
          item.sku_name,
          item.quantity,
        ]);
      }

      if (order.coupon_id) {
        await tx.query(
          `
          UPDATE user_coupons
          SET status = 'unused', used_at = NULL, used_order_no = NULL
          WHERE user_id = $1 AND coupon_id = $2 AND used_order_no = $3
          `,
          [user.id, order.coupon_id, orderNo],
        );
      }

      await tx.query("UPDATE orders SET status = 'closed', updated_at = NOW() WHERE id = $1", [order.id]);
    });

    return this.detail(user, orderNo);
  }

  async finish(user: AuthUser, orderNo: string) {
    await this.databaseService.withTransaction(async (tx) => {
      const order = await tx.oneOrNone<OrderRow>(
        'SELECT * FROM orders WHERE order_no = $1 AND user_id = $2 FOR UPDATE',
        [orderNo, user.id],
      );

      if (!order) {
        throw new NotFoundException('订单不存在');
      }

      if (order.status !== 'shipped') {
        throw new BadRequestException('仅待收货订单可确认收货');
      }

      await tx.query("UPDATE orders SET status = 'finished', updated_at = NOW() WHERE id = $1", [order.id]);
    });

    return this.detail(user, orderNo);
  }

  private async getAddressForOrder(executor: SqlExecutor, userId: string, addressId?: string) {
    const row = await executor.oneOrNone<AddressRow>(
      `
      SELECT id, name, phone, province, city, district, detail
      FROM user_addresses
      WHERE user_id = $1 AND ($2::UUID IS NULL OR id = $2::UUID)
      ORDER BY is_default DESC, created_at DESC
      LIMIT 1
      `,
      [userId, addressId ?? null],
    );

    if (!row) {
      throw new BadRequestException('请选择收货地址');
    }

    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      province: row.province,
      city: row.city,
      district: row.district,
      detail: row.detail,
    };
  }

  private async resolveOrderInputs(executor: SqlExecutor, userId: string, dto: CreateOrderDto): Promise<ResolvedOrderInput[]> {
    const inputs: ResolvedOrderInput[] = [];

    if (dto.items?.length) {
      for (const item of dto.items) {
        inputs.push({
          productId: item.productId,
          skuName: item.skuName || '默认规格',
          quantity: item.quantity,
          cartItemIds: item.cartItemId ? [item.cartItemId] : [],
        });
      }
      return this.mergeInputs(inputs);
    }

    const params: unknown[] = [userId];
    const where = ['c.user_id = $1'];

    if (dto.cartItemIds?.length) {
      params.push(dto.cartItemIds);
      where.push(`ci.id = ANY($${params.length}::UUID[])`);
    } else {
      where.push('ci.checked = TRUE');
    }

    const result = await executor.query<CreateOrderItemDto & { cart_item_id: string; product_id: string; sku_name: string }>(
      `
      SELECT ci.id AS cart_item_id, ci.product_id, ci.sku_name, ci.quantity
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      WHERE ${where.join(' AND ')}
      ORDER BY ci.created_at ASC
      `,
      params,
    );

    for (const row of result.rows) {
      inputs.push({
        productId: row.product_id,
        skuName: row.sku_name,
        quantity: row.quantity,
        cartItemIds: [row.cart_item_id],
      });
    }

    return this.mergeInputs(inputs);
  }

  private mergeInputs(inputs: ResolvedOrderInput[]) {
    const map = new Map<string, ResolvedOrderInput>();
    for (const item of inputs) {
      const key = `${item.productId}::${item.skuName}`;
      const existing = map.get(key);
      if (existing) {
        existing.quantity += item.quantity;
        existing.cartItemIds.push(...item.cartItemIds);
      } else {
        map.set(key, { ...item, cartItemIds: [...item.cartItemIds] });
      }
    }
    return [...map.values()];
  }

  private async resolveCoupon(
    executor: SqlExecutor,
    userId: string,
    couponId: string | undefined,
    items: PreparedOrderItem[],
    goodsAmount: number,
    freightAmount: number,
    orderNo: string,
  ) {
    if (!couponId) {
      return { couponId: null, discountAmount: 0 };
    }

    const coupon = await executor.oneOrNone<CouponLockRow>(
      `
      SELECT
        uc.id AS user_coupon_id,
        c.id AS coupon_id,
        c.amount,
        c.threshold_amount,
        c.category_id,
        uc.status,
        c.valid_from,
        c.valid_until
      FROM user_coupons uc
      JOIN coupons c ON c.id = uc.coupon_id
      WHERE uc.user_id = $1 AND c.id = $2 AND c.is_active = TRUE
      FOR UPDATE OF uc, c
      `,
      [userId, couponId],
    );

    if (!coupon) {
      throw new BadRequestException('请先领取优惠券');
    }

    if (coupon.status !== 'unused') {
      throw new BadRequestException('优惠券不可用');
    }

    const now = Date.now();
    if (coupon.valid_from.getTime() > now || coupon.valid_until.getTime() < now) {
      throw new BadRequestException('优惠券不在有效期内');
    }

    const threshold = toNumber(coupon.threshold_amount);
    if (goodsAmount < threshold) {
      throw new BadRequestException('未达到优惠券使用门槛');
    }

    if (coupon.category_id && !items.some((item) => item.categoryId === coupon.category_id)) {
      throw new BadRequestException('该优惠券不适用于当前商品');
    }

    const discountAmount = roundMoney(Math.min(toNumber(coupon.amount), goodsAmount + freightAmount));
    await executor.query(
      `
      UPDATE user_coupons
      SET status = 'used', used_at = NOW(), used_order_no = $3
      WHERE user_id = $1 AND coupon_id = $2
      `,
      [userId, couponId, orderNo],
    );

    return { couponId: coupon.coupon_id, discountAmount };
  }

  private mapOrder(row: OrderRow) {
    const items = (row.items ?? []).map((item) => this.mapOrderItem(item));
    const address = typeof row.address_snapshot === 'string' ? JSON.parse(row.address_snapshot) : row.address_snapshot;

    return {
      id: row.order_no,
      orderNo: row.order_no,
      status: row.status,
      statusText: STATUS_TEXT[row.status] ?? row.status,
      createdAt: row.created_at,
      payType: row.pay_type,
      paidAt: row.paid_at,
      items,
      address,
      remark: row.remark,
      goodsAmount: toNumber(row.goods_amount),
      freight: toNumber(row.freight_amount),
      discount: toNumber(row.discount_amount),
      totalAmount: toNumber(row.total_amount),
      couponId: row.coupon_id,
    };
  }

  private mapOrderItem(row: any) {
    return {
      id: row.id,
      productId: row.productId ?? row.product_id,
      skuName: row.skuName ?? row.sku_name,
      title: row.title,
      price: toNumber(row.price),
      quantity: Number(row.quantity),
      cover: '',
      coverText: row.coverText ?? row.cover_text,
      gradient: row.gradient,
    };
  }
}
