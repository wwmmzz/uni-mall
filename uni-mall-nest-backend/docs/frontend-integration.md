# uni-app 前端接入后端说明

后端全局前缀：

```text
/api/v1
```

建议前端新增：

```text
utils/request.js
api/home.js
api/product.js
api/cart.js
api/order.js
api/address.js
api/coupon.js
api/favorite.js
api/auth.js
```

## 1. request 封装示例

```js
const BASE_URL = 'http://localhost:3000/api/v1'

export function request(options) {
  const token = uni.getStorageSync('UMALL_TOKEN')

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }

        const message = res.data?.message || '请求失败'
        uni.showToast({ title: Array.isArray(message) ? message[0] : message, icon: 'none' })
        reject(res.data)
      },
      fail(err) {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}
```

## 2. 首页 / 商品

| 前端数据 | 后端接口 |
|---|---|
| banners | `GET /home` 或 `GET /banners` |
| categoryTabs | `GET /home` 或 `GET /categories` |
| categoryShortcuts | `GET /home` |
| hotProducts | `GET /products/hot` |
| newProducts | `GET /products/new` |
| 商品列表 | `GET /products?categoryId=phone&page=1&pageSize=10` |
| 搜索商品 | `GET /products?keyword=耳机&page=1&pageSize=10` |
| 商品详情 | `GET /products/:id` |

## 3. 登录

```js
import { request } from '@/utils/request'

export async function mockLogin(phone, code) {
  const res = await request({
    url: '/auth/mock-login',
    method: 'POST',
    data: { phone, code }
  })

  uni.setStorageSync('UMALL_TOKEN', res.accessToken)
  uni.setStorageSync('UMALL_USER', res.user)
  return res
}
```

## 4. 购物车映射

| 本地函数 | 后端接口 |
|---|---|
| `getCart()` | `GET /cart` |
| `addToCart(product, sku, quantity)` | `POST /cart/items` |
| 修改数量 / 勾选 | `PATCH /cart/items/:id` |
| 删除购物车项 | `DELETE /cart/items/:id` |
| 全选 / 取消全选 | `PATCH /cart/check-all` |

加购请求示例：

```js
await request({
  url: '/cart/items',
  method: 'POST',
  data: {
    productId: product.id,
    skuName: selectedSku.value,
    quantity: quantity.value
  }
})
```

## 5. 确认订单映射

本地确认订单页原来使用 `getCheckoutItems()` 和 `addOrder()`。

后端推荐两种方式：

### 从购物车结算

不传 `items` 时，后端默认读取当前用户购物车中已勾选商品。

```js
const order = await request({
  url: '/orders',
  method: 'POST',
  data: {
    addressId: address.value.id,
    couponId: selectedCoupon.value?.id,
    remark: remark.value,
    payNow: true
  }
})
```

### 立即购买

```js
const order = await request({
  url: '/orders',
  method: 'POST',
  data: {
    addressId: address.value.id,
    couponId: selectedCoupon.value?.id,
    remark: remark.value,
    payNow: true,
    items: [
      {
        productId: product.value.id,
        skuName: selectedSku.value,
        quantity: quantity.value
      }
    ]
  }
})
```

提交成功后跳转：

```js
uni.redirectTo({
  url: `/pages/payment/result?status=success&orderId=${order.orderNo}`
})
```

## 6. 订单页映射

| 前端页面 | 后端接口 |
|---|---|
| 订单列表 | `GET /orders?status=all` |
| 待付款 | `GET /orders?status=unpaid` |
| 待发货 | `GET /orders?status=paid` |
| 待收货 | `GET /orders?status=shipped` |
| 已完成 | `GET /orders?status=finished` |
| 订单详情 | `GET /orders/:orderNo` |
| 支付 | `POST /orders/:orderNo/pay` |
| 取消订单 | `POST /orders/:orderNo/cancel` |
| 确认收货 | `POST /orders/:orderNo/finish` |

## 7. 地址 / 优惠券 / 收藏

| 功能 | 后端接口 |
|---|---|
| 地址列表 | `GET /addresses` |
| 新增地址 | `POST /addresses` |
| 编辑地址 | `PATCH /addresses/:id` |
| 设为默认 | `PATCH /addresses/:id/default` |
| 删除地址 | `DELETE /addresses/:id` |
| 优惠券列表 | `GET /coupons?goodsAmount=299&categoryId=phone` |
| 领取优惠券 | `POST /coupons/:id/claim` |
| 收藏列表 | `GET /favorites` |
| 查询收藏状态 | `GET /favorites/:productId` |
| 收藏 / 取消收藏 | `POST /favorites/toggle` |
