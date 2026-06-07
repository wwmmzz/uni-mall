# Repository Guidelines

## 项目结构与模块组织
这个工作区包含两个应用根目录：

- `uni-mall-miniprogram/`：`uni-app + Vue 3` 前端。主要代码在 `src/`，其中页面位于 `src/pages/`，复用组件位于 `src/components/`，本地 mock 数据位于 `src/common/mock.js`，本地存储工具位于 `src/utils/storage.js`，静态资源位于 `src/static/`。
- `uni-mall-nest-backend/`：NestJS 11 后端。业务模块位于 `src/modules/`，通用守卫、类型和工具位于 `src/common/`，数据库服务位于 `src/database/`，SQL 文件位于 `database/migrations/` 和 `database/seeds/`。

修改时尽量限定在对应子项目内；前后端联调说明统一放在 `uni-mall-nest-backend/docs/frontend-integration.md`。

## 构建、测试与开发命令
进入对应子目录并先执行 `npm install` 后再运行命令。

- 前端：`npm run dev:mp-weixin` 启动微信小程序开发构建，`npm run dev:h5` 启动 H5 版本，`npm run build:mp-weixin` 生成小程序生产包，`npm run type-check` 执行 `vue-tsc --noEmit` 类型检查。
- 后端：`npm run start:dev` 以监听模式启动 Nest，`npm run build` 编译到 `dist/`，`npm run lint` 执行并修复 ESLint 问题，`npm run format` 使用 Prettier 格式化，`npm run db:migrate` 执行 SQL 迁移，`npm run db:seed` 导入种子数据。

## 代码风格与命名约定
遵循各子项目当前已有风格：

- 前端：使用 2 空格缩进、Vue 单文件组件，组件目录采用 PascalCase，例如 `ProductCard/ProductCard.vue`，页面路径保持小写，例如 `pages/order/detail.vue`。
- 后端：使用 TypeScript 和 Nest 模块化约定，函数和变量使用 camelCase，类和 DTO 使用 PascalCase，例如 `CreateOrderDto`。

优先编写贴近功能的小模块，避免过度抽象为宽泛的共享工具。

## 测试指南
当前仓库尚未提交完整的自动化测试。最低验证要求如下：

- 前端：运行 `npm run type-check`，并在微信开发者工具或 H5 中手动验证相关流程。
- 后端：运行 `npm run lint`、`npm run build`，再对 `/api/v1/health` 和受影响接口做基本联调验证。

新增测试时，尽量与功能代码就近放置，并使用清晰命名，例如 `cart.service.spec.ts`。

## 提交与 Pull Request 规范
两个子仓库当前的 Git 历史都只有简短的 `init` 风格提交，因此建议继续使用简洁的祈使句，例如 `add coupon claim validation` 或 `fix cart item total`。每次提交只聚焦一个改动点。

PR 需要说明用户可见影响，标明涉及的应用范围（`miniprogram`、`backend` 或两者），注明是否包含迁移或 seed 变更；如果是 UI 改动，附上截图；如果是接口改动，附上示例请求或响应。
