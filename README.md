# uni-mall

`uni-mall` 是一个前后端分离的商城示例项目，包含一个基于 `uni-app + Vue 3` 的小程序/H5 前端，以及一个基于 `NestJS 11 + PostgreSQL` 的商城后端。仓库采用 npm workspace 组织，适合用来做商城原型、课程练习、接口联调和二次开发。

## 项目组成

### `uni-mall-miniprogram`

前端应用，基于 `uni-app + Vue 3`，可运行在微信小程序和 H5 环境。

- 已包含首页、分类、购物车、订单、地址、登录、收藏、优惠券等商城核心页面
- 当前默认使用本地 mock 数据和本地缓存，便于直接预览和调试
- 适合后续逐步替换为真实 API

更多说明见 [uni-mall-miniprogram/README.md](/D:/download/uni-mall/uni-mall-miniprogram/README.md)。

### `uni-mall-nest-backend`

后端服务，基于 `NestJS 11` 和 `PostgreSQL`，采用原生 SQL 与事务封装实现商城业务。

- 提供商品、分类、首页、购物车、地址、优惠券、收藏、订单、登录等接口
- 内置 migration 和 seed，可快速初始化演示数据
- 提供 Swagger 文档和健康检查接口，方便联调

更多说明见 [uni-mall-nest-backend/README.md](/D:/download/uni-mall/uni-mall-nest-backend/README.md)。

## 目录结构

```text
uni-mall
├─ uni-mall-miniprogram/     # uni-app 前端
├─ uni-mall-nest-backend/    # NestJS 后端
├─ package.json              # workspace 与根脚本
└─ README.md
```

## 技术栈

- 前端：`uni-app`、`Vue 3`
- 后端：`NestJS 11`、`TypeScript`
- 数据库：`PostgreSQL`
- 包管理：`npm workspaces`

## 快速开始

### 1. 安装依赖

在仓库根目录执行：

```bash
npm install
```

### 2. 启动前端

H5 开发：

```bash
npm run dev:frontend
```

微信小程序开发构建：

```bash
npm run dev:frontend:weixin
```

### 3. 启动后端

先根据 `uni-mall-nest-backend/.env.example` 配置数据库环境，再执行：

```bash
npm run db:migrate
npm run db:seed
npm run dev:backend
```

### 4. 同时启动前后端

```bash
npm run dev
```

## 常用命令

```bash
# 前端
npm run dev:frontend
npm run dev:frontend:weixin
npm run build:frontend
npm run build:frontend:weixin
npm run type-check

# 后端
npm run dev:backend
npm run build:backend
npm run lint
npm run format
npm run db:migrate
npm run db:seed
npm run db:reset
```

## 联调说明

当前前端默认仍可使用本地 mock 数据运行；如果要切换到真实后端接口，建议优先阅读：

- [uni-mall-nest-backend/docs/frontend-integration.md](/D:/download/uni-mall/uni-mall-nest-backend/docs/frontend-integration.md)

后端默认本地地址：

- 服务：`http://localhost:3000`
- 健康检查：`GET /api/v1/health`
- Swagger：`/api/docs`

## 适用场景

- 快速搭建一个可演示的商城项目骨架
- 练习小程序商城前后端联调
- 在现有页面与接口基础上继续扩展支付、库存、营销、后台管理等能力
