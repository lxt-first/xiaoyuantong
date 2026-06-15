# 校园通 (XiaoYuanTong) — 项目速览

## 项目简介

校园通是一个面向华北理工大学的 **校园本地信息聚合平台**，以 edu 邮箱认证为信任锚点，将散落在微信群、QQ群、小红书、闲鱼、牛客中的五大校园需求聚合到一个结构化、可检索、校友背书的平台中。

**一句话定位**：大学生活的"本地通"——校友身份背书，让每一条信息都来自真实同学。

---

## 五大核心模块

| 模块 | 子模块 | 特色 |
|------|--------|------|
| 校招内推 | 实习、找工作经验、内推、技能学习 | 专业 x 学院双维度筛选 |
| 租房找房 | 租房、出租、找合租室友 | 校友直租、无中介费 |
| 二手交易 | 书本、生活用品、非实体交易 | 分类筛选、校内面交 |
| 生活信息 | 表白、吐槽、照片分享、美食推荐 | 食堂档口级评测、星级评分 |
| 考研考公 | 考研、考公 | 校友真实经验、机构软文过滤 |

---

## 技术栈

| 层 | 技术 | 版本 |
|---|------|------|
| 前端 | React + TypeScript + Vite | React 19.1, Vite 6.3 |
| 路由 | React Router DOM | v7.6 |
| 图表 | Recharts | v3.8 |
| 后端 | Node.js + Express + TypeScript | Express 4.21 |
| ORM | Prisma | 5.22 |
| 数据库 | SQLite（开发）/ PostgreSQL（生产） | — |
| 开发工具 | tsx（热重载）、concurrently | — |
| 包管理 | npm workspaces（monorepo） | — |
| 代码风格 | Prettier | 单引号、分号、2空格缩进 |

---

## 目录结构

```
xiaoyuantong/
├── packages/
│   ├── client/                  # React 前端 (端口 5173)
│   │   ├── index.html
│   │   ├── public/
│   │   │   └── vite.svg         # 站点图标
│   │   ├── vite.config.ts       # Vite 配置，/api -> localhost:3001 代理
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.tsx         # 入口：BrowserRouter + App
│   │       ├── App.tsx          # 路由：/  /module/:type  /post/:type/:id  /publish  /login
│   │       ├── index.css        # 全局样式（完整移动端样式系统）
│   │       ├── pages/           # 页面组件（Home, ModuleList, Detail, Publish, Login, Dashboard）
│   │       ├── components/      # 通用组件（BottomNav, FeedCard, KpiCard, ModuleBreakdown, QualityMetrics, TrendChart）
│   │       ├── hooks/           # 自定义 Hooks（空，待扩展）
│   │       ├── stores/          # 状态管理（AuthContext: Context + Provider + useAuth hook）
│   │       ├── api/             # API 请求层（client.ts: 完整封装的 API client，支持 auth header）
│   │       └── types/           # TypeScript 类型（index.ts, analytics.ts）
│   └── server/                  # Express 后端 (端口 3001)
│       ├── schema.prisma        # Prisma Schema：10 个模型（完整定义）
│       ├── .env                 # 环境变量（DATABASE_URL, PORT）
│       ├── seed.ts              # 种子数据脚本（50 用户 + 200 条内容）
│       ├── tsconfig.json        # 继承 ../../tsconfig.base.json
│       └── src/
│           ├── index.ts         # Express 启动入口（cors + json + 路由注册）
│           ├── routes/          # 路由定义（health, analytics, auth, posts）
│           ├── controllers/     # 控制器（health, analytics, auth, posts）
│           ├── services/        # 业务逻辑（prisma.ts, analytics.ts: 真实 DB 查询）
│           └── middleware/      # 中间件（auth.ts: authRequired + authOptional）
├── docs/
│   ├── user-research.md         # 用户调研报告
│   ├── requirements-and-design.md # 产品需求文档 PRD v3.0
│   ├── competitive-analysis.md  # 竞品分析报告
│   ├── interaction-spec.md      # 交互规范
│   └── technical-solution.md    # 技术方案
├── prototypes/
│   ├── wireframes.html          # 低保真原型
│   ├── high-fidelity.html       # 高保真原型
│   ├── svg-screens/             # SVG 屏幕截图
│   ├── figma-plugin/            # Figma 插件原型
│   └── jsdesign-plugin/         # JsDesign 插件原型
├── package.json                 # 根 workspaces 配置 + 启动脚本
├── tsconfig.base.json           # 共享 TS 基础配置
├── .prettierrc                  # Prettier 配置
└── .gitignore
```

---

## 当前开发状态

**阶段进度**（共 7 阶段）：

- [x] **阶段 0**：项目初始化 — monorepo 脚手架、基础配置
- [x] **阶段 1**：用户调研 & 竞品分析 — 五份完整文档
- [x] **阶段 2**：需求定义 & 产品设计 — PRD v3.0 + 原型
- [x] **阶段 3**：高保真交互原型 — 已完成
- [x] **阶段 4**：技术方案 & 数据库设计 — Prisma Schema 10 模型完整定义
- [x] **阶段 5**：MVP 开发 — 核心功能已实现
- [x] **阶段 6**：数据指标体系 & 看板 — Dashboard 页面 + 实时 analytics 查询
- [x] **阶段 7**：项目包装 & 作品集

**代码实现现状**：

**前端（6 个页面 + 6 个组件）**：
- `/` — Home 首页信息流（FeedCard 列表 + BottomNav）
- `/module/:type` — ModuleList 按模块浏览（校招/面经/租房/二手/美食）
- `/post/:type/:id` — Detail 详情页（按模块类型展示不同字段）
- `/publish` — Publish 发布页（5 个模块动态表单）
- `/login` — Login 登录/注册（手机号验证）
- `/dashboard` — Dashboard 数据看板（KPI 卡片 + 趋势图 + 分类饼图 + 质量指标）
- AuthContext（React Context 状态管理 + useAuth hook）
- API client 自动携带 Bearer token 认证

**后端（4 组路由，10 个数据模型）**：
- `GET /api/health` — 健康检查
- `POST /api/auth/login` — 手机号登录/注册 + `GET /api/auth/user/:id` — 用户信息
- `GET /api/feed` — 聚合信息流 + `GET /api/list` — 分模块列表 + `GET /api/detail` — 详情 + `POST /api/create`（需认证）
- `GET /api/analytics` — 数据看板 API（Dashboard 概览/趋势/分类/质量）
- auth 中间件：authRequired（保护接口）+ authOptional（可选认证）

**Prisma Schema（10 个模型）**：
User, VerificationCode, Image, Referral, Interview, Rental, Secondhand, FoodReview, Favorite, Report

**种子数据**：50 个用户 + 200 条各模块内容（内推/面经/租房/二手/美食）

---

## 关键设计决策

### MVP 冷启动策略
1. **美食推荐 + 二手交易** 作为冷启动钩子：频次最高、门槛最低
2. **租房找房 + 校招内推** 提供核心差异化价值
3. 首期聚焦 **华北理工大学**，深耕单校网络效应
4. 运营提前准备 **50+ 条种子美食评测**

### MVP 范围（v1.0 已完成）

- ✅ 手机号注册登录、edu 邮箱认证
- ✅ 内推/面经/租房/二手/美食/考研考公 六大模块的发布与浏览
- ✅ 全局搜索、通知系统
- ✅ 收藏/举报功能
- ✅ 数据看板（KPI + 趋势图 + 分类饼图 + 质量指标）
- ✅ 游标分页无限滚动、输入校验、API 速率限制
- ✅ Docker 容器化部署

### 设计系统概要

| Token | 色值 | 用途 |
|-------|------|------|
| `--primary` | `#2563EB` | 主色 |
| `--success` | `#16A34A` | 认证标识 |
| `--danger` | `#DC2626` | 价格、举报 |
| `--warning` | `#F59E0B` | 评分星星 |
| `--bg-page` | `#F3F4F6` | 页面背景 |

模块标签色：校招蓝 #2563EB · 租房绿 #16A34A · 二手红 #DC2626 · 生活黄 #F59E0B · 考研紫 #7C3AED

---

## API 路由（全部 15 个端点）

| 方法 | 路径 | 说明 | 认证 | 校验 |
|------|------|------|:---:|:---:|
| GET | `/api/health` | 健康检查 | — | — |
| POST | `/api/auth/login` | 手机号登录/注册 | — | Zod |
| GET | `/api/auth/user/:id` | 获取用户信息 | — | — |
| GET | `/api/feed` | 聚合信息流（游标分页） | — | — |
| GET | `/api/list?module=xxx` | 分模块列表（页码分页） | — | Zod |
| GET | `/api/detail?module=xxx&id=xxx` | 内容详情 + 浏览计数 | — | — |
| POST | `/api/create` | 发布内容 | JWT | Zod |
| GET | `/api/search?q=xxx` | 全局搜索 | — | Zod |
| GET | `/api/posts/mine` | 我的发布 | JWT | — |
| GET | `/api/favorites` | 收藏列表 | JWT | — |
| POST | `/api/favorites` | 添加收藏 | JWT | Zod |
| DELETE | `/api/favorites?type=&id=` | 取消收藏 | JWT | Zod |
| POST | `/api/reports` | 举报内容 | JWT | Zod |
| GET | `/api/notifications` | 通知列表 | JWT | — |
| GET | `/api/analytics` | 数据看板（实时 DB 查询） | — | — |

## 安全

- **JWT 认证**：所有写操作需要 Bearer Token，userId 从 token 提取不信任客户端
- **输入校验**：Zod discriminatedUnion 按模块校验必填字段
- **速率限制**：全局 100 req/min/ip，登录 10 req/min/ip
- **无硬编码密钥**：JWT_SECRET 必须通过 .env 配置
- **测试覆盖**：15 个测试覆盖 Auth/Posts/Favorites/Reports/useDebounce

---

## 启动命令

```bash
npm install                  # 安装所有依赖
npx prisma generate          # 生成 Prisma Client
cd packages/server && npx prisma db push && cd ../..  # 初始化数据库
npm run seed                 # 填充种子数据
npm run dev                  # 前后端同时启动
npm run dev:server           # 仅后端 -> http://localhost:3001
npm run dev:client           # 仅前端 -> http://localhost:5173
npm run db:studio            # Prisma Studio 数据管理
```

---

## 待办事项（vNext）

- [ ] 切换数据库到 PostgreSQL（生产）
- [ ] 图片上传（multer + S3/OSS）
- [ ] CI/CD 流水线（GitHub Actions）
- [ ] 前端生产构建优化（code splitting / tree shaking）

## 完成清单（v1.0 全部完成）

- [x] 修复搜索页 `q` 参数未插值 Bug
- [x] 修复详情页/个人页 `userId` 未插值 Bug
- [x] 恢复所有页面因 PowerShel​l 反引号转义丢失的模板字符串
- [x] Publish 页添加"考研考公"发布入口（MODULES + 表单 + handlePublish）
- [x] Home 页快速发布面板添加考研考公选项
- [x] FeedCard 添加 `exam` 类型 + `···` 菜单（收藏/举报按钮）
- [x] Profile 收藏列表格式化渲染（类型标签替代原始 ID 显示）
- [x] hooks/ 目录新建 useAuth / usePosts / useDebounce
- [x] vitest 测试基础设施（前端 useDebounce 测试 + 后端 health 测试）
- [x] PWA 支持（manifest.json + Service Worker + 安装提示）