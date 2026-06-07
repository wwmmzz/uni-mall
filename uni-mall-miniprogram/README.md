# uni-app 小程序商城页面模板

这是一套基于 **uni-app + Vue3** 的小程序商城页面工程，适合用作微信小程序商城、H5 商城或 App 商城的前端页面基础模板。

## 已包含页面

| 页面 | 路径 | 说明 |
|---|---|---|
| 首页 | `pages/home/index.vue` | 搜索、轮播、分类入口、限时秒杀、猜你喜欢 |
| 分类 | `pages/category/category.vue` | 左侧分类、右侧商品列表 |
| 购物车 | `pages/cart/cart.vue` | 勾选、全选、数量修改、删除、结算 |
| 我的 | `pages/user/user.vue` | 用户信息、资产、订单入口、功能菜单 |
| 商品详情 | `pages/product/detail.vue` | 商品展示、规格、数量、收藏、加购、立即购买 |
| 搜索 | `pages/search/search.vue` | 搜索历史、热门词、结果列表 |
| 确认订单 | `pages/order/confirm.vue` | 地址、商品、运费、优惠券、留言、提交订单 |
| 订单列表 | `pages/order/list.vue` | 全部、待付款、待发货、待收货、已完成 |
| 订单详情 | `pages/order/detail.vue` | 订单状态、收货信息、商品明细、费用明细 |
| 地址列表 | `pages/address/list.vue` | 选择、默认、编辑、删除地址 |
| 地址编辑 | `pages/address/edit.vue` | 新增/编辑地址 |
| 登录 | `pages/login/login.vue` | 手机号验证码模拟登录 |
| 收藏 | `pages/favorite/list.vue` | 收藏商品列表 |
| 优惠券 | `pages/coupon/list.vue` | 领取/选择优惠券 |
| 支付结果 | `pages/payment/result.vue` | 支付成功/失败结果页 |

## 已包含组件

| 组件 | 路径 | 说明 |
|---|---|---|
| 商品卡片 | `components/ProductCard/ProductCard.vue` | 商品封面、标题、标签、价格、加购 |
| 标题栏 | `components/SectionTitle/SectionTitle.vue` | 首页区块标题 |
| 空状态 | `components/EmptyState/EmptyState.vue` | 购物车、订单、收藏空状态 |
| 数量步进器 | `components/QuantityStepper/QuantityStepper.vue` | 加减数量 |
| 价格文本 | `components/PriceText/PriceText.vue` | 统一价格样式 |

## 运行方式

### 方式一：HBuilderX

1. 打开 HBuilderX。
2. 选择「文件」→「打开目录」，打开本项目根目录。
3. 如果运行微信小程序，在 `manifest.json` 的 `mp-weixin.appid` 填入你的小程序 AppID。
4. 点击「运行」→「运行到小程序模拟器」→「微信开发者工具」。

### 方式二：CLI

```bash
npm install
npm run dev:mp-weixin
```

然后用微信开发者工具打开：

```text
dist/dev/mp-weixin
```

构建发布版：

```bash
npm run build:mp-weixin
```

发布目录：

```text
dist/build/mp-weixin
```

## 数据说明

当前项目使用本地 mock 数据和本地缓存，便于你直接跑通页面流程。

- 商品数据：`common/mock.js`
- 购物车、收藏、地址、订单、用户信息：`utils/storage.js`
- 所有封面默认使用渐变占位，不依赖外部图片域名，方便小程序直接预览。

接入真实后端时，建议替换这些位置：

```text
common/mock.js          替换为接口返回数据
utils/storage.js        保留本地缓存逻辑，订单/用户/地址改为接口
pages/order/confirm.vue 提交订单接口
pages/login/login.vue   登录接口
pages/cart/cart.vue     购物车接口
```

## 页面流程

```text
首页 / 分类 / 搜索
  ↓
商品详情
  ↓
加入购物车 或 立即购买
  ↓
购物车结算 / 直接结算
  ↓
确认订单
  ↓
支付结果
  ↓
订单列表 / 订单详情
```

## 建议二次开发

1. 将 `common/mock.js` 替换为真实接口。
2. 将 `utils/storage.js` 中订单、地址、购物车逻辑改为 API 调用。
3. 商品详情页可扩展多 SKU、库存校验、评价列表、图文详情。
4. 确认订单页可扩展发票、积分、余额、配送时间。
5. 订单列表可扩展退款、物流、售后、取消订单。
6. 小程序上线前请在 `manifest.json` 配置 AppID、权限、隐私协议和合法域名。
