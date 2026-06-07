# uni-mall-nest-backend

这是为前端 `uni-mall-miniprogram` 生成的一套 NestJS 商城后端服务。

核心特点：

- NestJS 11 模块化架构
- PostgreSQL 数据库
- 原生 SQL，不使用 ORM Entity / Repository
- `pg` 连接池 + 参数化 SQL
- 显式事务封装：`BEGIN / COMMIT / ROLLBACK`
- JWT 登录鉴权
- 商品、分类、首页、购物车、地址、优惠券、收藏、订单完整接口
- 下单事务包含：地址校验、购物车/直购商品解析、商品与 SKU 库存锁定、库存扣减、优惠券锁定与核销、订单与订单明细写入、购物车清理、模拟支付流水写入
- SQL migration + seed 数据
- Swagger 文档：`/api/docs`

## 1. 快速启动

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

服务默认启动在：

```text
http://localhost:3000
```

健康检查：

```text
GET http://localhost:3000/api/v1/health
```

Swagger：

```text
http://localhost:3000/api/docs
```

## 2. 使用 Docker 启动 PostgreSQL

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

`.env.example` 默认数据库地址为：

```env
DATABASE_URL=postgres://mall:mall_password@localhost:5432/uni_mall
```

## 3. Seed 数据

Seed 数据来自前端商城 mock：

- 3 个首页 banner
- 8 个分类
- 12 个商品
- 每个商品对应多个 SKU 规格
- 3 张优惠券
- 1 个默认用户
- 1 个默认收货地址
- 购物车示例数据
- 收藏示例数据
- 1 个示例已支付订单

默认用户：

```text
手机号：13800138000
验证码：任意值；mock 登录不校验验证码
```

登录接口：

```bash
curl -X POST http://localhost:3000/api/v1/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"123456"}'
```

返回 `accessToken` 后，请求受保护接口时加入：

```http
Authorization: Bearer <accessToken>
```

## 4. 数据库脚本

```bash
npm run db:migrate   # 执行 database/migrations 下的 SQL
npm run db:seed      # 执行 database/seeds 下的 SQL
npm run db:reset     # 删除业务表后重新 migrate + seed
```

迁移文件：

```text
database/migrations/001_init.sql
```

种子文件：

```text
database/seeds/001_seed.sql
```

## 5. 核心接口

### 公共接口

```text
GET /api/v1/health
GET /api/v1/home
GET /api/v1/banners
GET /api/v1/categories
GET /api/v1/products?page=1&pageSize=10&categoryId=phone&keyword=耳机
GET /api/v1/products/hot
GET /api/v1/products/new
GET /api/v1/products/:id
```

### 登录

```text
POST /api/v1/auth/mock-login
GET  /api/v1/auth/profile
```

### 购物车

```text
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
PATCH  /api/v1/cart/check-all
```

### 地址

```text
GET    /api/v1/addresses
POST   /api/v1/addresses
PATCH  /api/v1/addresses/:id
PATCH  /api/v1/addresses/:id/default
DELETE /api/v1/addresses/:id
```

### 优惠券

```text
GET  /api/v1/coupons?goodsAmount=299&categoryId=phone
POST /api/v1/coupons/:id/claim
```

### 收藏

```text
GET  /api/v1/favorites
GET  /api/v1/favorites/:productId
POST /api/v1/favorites/toggle
```

### 订单

```text
GET  /api/v1/orders?status=all&page=1&pageSize=10
POST /api/v1/orders
GET  /api/v1/orders/:orderNo
POST /api/v1/orders/:orderNo/pay
POST /api/v1/orders/:orderNo/cancel
POST /api/v1/orders/:orderNo/finish
```

## 6. 下单接口示例

### 从购物车结算已勾选商品

不传 `items` 和 `cartItemIds` 时，后端默认结算当前用户购物车中 `checked = true` 的商品。

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "couponId": "c2",
    "remark": "请尽快发货",
    "payNow": true
  }'
```

### 直接购买商品

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": "1001", "skuName": "星河银", "quantity": 1 }
    ],
    "couponId": "c3",
    "remark": "直接购买",
    "payNow": true
  }'
```

`payNow: true` 会模拟微信支付成功，订单状态直接变为 `paid`，对应前端页面的「待发货」。

`payNow: false` 会创建 `unpaid` 订单，可再调用：

```text
POST /api/v1/orders/:orderNo/pay
```

## 7. 事务设计

`src/database/database.service.ts` 提供统一事务入口：

```ts
await databaseService.withTransaction(async (tx) => {
  await tx.query('SELECT ... FOR UPDATE', [id]);
  await tx.query('UPDATE ...', [value]);
});
```

核心事务点：

- `CartService.add`：加购时校验商品和 SKU 是否存在，并防止购物车数量超过库存。
- `AddressService.create/update/setDefault/remove`：保证同一用户最多只有一个默认地址。
- `CouponService.claim`：锁定优惠券库存，避免并发超领。
- `OrderService.create`：商城最核心事务，锁定商品和 SKU，扣减库存，核销优惠券，创建订单，写订单明细，清理购物车，写支付流水。
- `OrderService.pay/cancel/finish`：锁定订单，避免重复支付、重复取消或非法状态流转。

## 8. 前端接入建议

前端现在是本地 mock + storage。接后端时建议：

1. 新增 `utils/request.js`，统一处理 `baseURL`、`Authorization`、错误 toast。
2. `common/mock.js` 中的商品、分类、banner 数据改为请求 `/home`、`/products`。
3. `utils/storage.js` 中购物车、地址、订单、优惠券、收藏相关函数逐步替换为 API 请求。
4. 登录页调用 `/auth/mock-login`，把 `accessToken` 存入本地缓存。

更详细的接口映射见：

```text
docs/frontend-integration.md
```

## 9. 目录结构

```text
src
├─ common
│  ├─ decorators
│  ├─ guards
│  ├─ types
│  └─ utils
├─ database
│  ├─ database.module.ts
│  ├─ database.service.ts
│  └─ sql-executor.ts
└─ modules
   ├─ address
   ├─ auth
   ├─ cart
   ├─ catalog
   ├─ coupon
   ├─ favorite
   ├─ health
   └─ order
```

## 10. 生产化后续建议

当前项目是可运行的商城后端骨架，适合继续扩展：

- 接真实微信小程序登录：`code2Session` 换取 openid。
- 接真实支付：微信支付 v3 下单、回调验签、幂等处理。
- 增加后台管理端：商品、库存、订单发货、优惠券配置。
- 增加 Redis：验证码、分布式锁、热点商品缓存。
- 增加审计日志：订单状态变化、库存变化、支付回调记录。
- 增加单元测试和集成测试。
