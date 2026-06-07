# Repository Guidelines

## 项目结构与模块组织
本仓库是一个基于 `uni-app + Vue 3` 的商城模板，主要源码位于 `src/`。

- `src/pages/`：页面级路由，如 `pages/home/index.vue`、`pages/order/detail.vue`
- `src/components/`：可复用 UI 组件，如 `ProductCard`、`QuantityStepper`
- `src/common/mock.js`：本地商品 mock 数据
- `src/utils/storage.js`：购物车、订单、地址、搜索历史等本地存储工具
- `src/static/`：底部标签图标及其他静态资源
- `src/pages.json`、`src/manifest.json`：路由与平台配置
- `dist/`：构建产物目录，不要手动修改

## 构建、测试与开发命令
首次拉取后先执行一次 `npm install` 安装依赖。

- `npm run dev:mp-weixin`：启动微信小程序开发构建
- `npm run build:mp-weixin`：生成微信小程序生产包，输出到 `dist/build/mp-weixin`
- `npm run dev:h5`：本地运行 H5 版本
- `npm run build:h5`：构建 H5 生产包
- `npm run type-check`：执行 `vue-tsc --noEmit` 类型检查

`package.json` 中还定义了 `dev:api`、`dev:api:python`、`test:api:python`，但当前仓库中不存在对应的 `server/` 和 `python_server/` 目录，使用前需要先补齐后端代码。

## 代码风格与命名约定
保持 `src/` 现有风格：2 空格缩进、Vue 单文件组件、组件优先使用 `script setup`。组件目录和文件名使用 PascalCase，例如 `components/ProductCard/ProductCard.vue`。页面文件保持功能目录下的小写命名，例如 `pages/address/edit.vue`。公共逻辑优先放在 `src/utils/`，mock 数据集中放在 `src/common/`。

## 测试说明
当前仓库没有可直接运行的前端自动化测试。最低要求是执行 `npm run type-check`，并在目标平台手动验证相关流程，通常使用 `npm run dev:mp-weixin`。如果后续补充自动化测试，建议与功能代码相邻放置，并使用清晰命名，例如 `storage.spec.js`、`ProductCard.test.js`。

## 提交与 Pull Request 规范
当前 Git 历史只有一个简短的 `init` 提交，因此建议使用简洁的祈使句提交信息，例如 `add coupon selection state` 或 `fix cart quantity update`。每次提交只聚焦一个改动点。PR 应包含变更摘要、用户可见影响、涉及页面或组件；如果是 UI 改动，应附截图；有相关 issue 时一并关联。
