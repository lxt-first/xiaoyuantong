# 校园通（XiaoYuanTong）项目总结

> 华北理工大学校园信息聚合平台 — 一站式校招内推、租房找房、二手交易、生活信息交流、考研考公上岸

---

## 一、Situation（背景）

华北理工大学在校学生约 4 万人，日常面临**校招信息分散、租房渠道混乱、二手交易缺乏信任、考研考公经验难以沉淀**等问题。各业务模块分散在微信群、QQ 群、贴吧等渠道，信息获取效率低、内容质量参差不齐，缺乏一个统一的校园信息平台。

---

## 二、Task（目标）

设计并开发一个面向华北理工大学学生的**全栈校园信息聚合平台**，核心任务包括：

1. **覆盖 5 大业务模块**：校招内推/面经、租房找房、二手交易、美食推荐、考研考公
2. **完整信息流闭环**：从内容发布、浏览/搜索、收藏、举报到通知推送
3. **运营数据仪表盘**：DAU/WAU、内容增长趋势、模块分布、内容质量指标
4. **移动端 PWA 体验**：支持离线访问、安装到桌面
5. **产品化交付**：涵盖用户调研、竞品分析、PRD、高保真原型、技术方案文档

---

## 三、Action（行动）

### 3.1 技术架构

| 层 | 技术选型 | 说明 |
|---|---------|------|
| 前端 | React 19 + TypeScript + Vite 6 | 函数组件 + Hooks，严格模式 |
| 后端 | Node.js + Express + TypeScript | RESTful API 设计 |
| 数据库 | SQLite（开发）/ PostgreSQL（生产） | Prisma ORM 适配 |
| 可视化 | Recharts 3 | 响应式数据仪表盘 |
| 工程化 | npm workspaces Monorepo | 前后端统一管理，共享类型 |

### 3.2 数据库设计

8 张核心表，覆盖用户、内容、互动全链路：

| 表 | 用途 | 关键字段 |
|---|------|---------|
| User | 用户 | phone, nickname, certified, school, major |
| Referral | 校招内推 | company, position, referralCode, status |
| Interview | 面经 | company, round, passed, experience |
| Rental | 租房 | area, price, community, layout, contact |
| Secondhand | 二手 | category, price, campus, status |
| FoodReview | 美食 | restaurant, rating, review |
| Exam | 考研考公 | category, subject, content |
| Notification | 通知 | type, title, content, read |
| Favorite | 收藏 | userId, targetType, targetId |
| Report | 举报 | userId, targetType, targetId, reason |

### 3.3 安全与质量保障

- **JWT 认证**：`jsonwebtoken` 签发 + 中间件验证，7 天过期，路由守卫拦截未登录请求
- **输入校验**：`zod` schema 验证所有 API 请求体，防止非法数据入库
- **限流保护**：`express-rate-limit` 全局 100 次/分钟，登录接口 10 次/分钟
- **全局错误处理**：Express 统一错误中间件，确保所有异常返回 JSON 格式
- **TypeScript 严格模式**：全栈 zero `any` 类型（核心路径），编译期发现潜在问题

### 3.4 性能优化

- **数据库并行查询**：Info 流首页 6 表并行拉取 + 内存归并排序，减少 5 次往返延迟
- **仪表盘趋势查询**：30 天数据 `Promise.all` 批量并行，从 180 次串行降为 30 次并行
- **前端无限滚动**：`IntersectionObserver` 实现游标分页，避免一次性加载全量数据
- **PWA 离线缓存**：Service Worker Cache-First 策略，静态资源缓存 + API 网络优先

### 3.5 产品化交付

- 用户调研文档（目标用户画像、核心场景）
- 竞品分析（对比现有校园信息渠道）
- 需求定义 & 产品设计文档（功能清单、流程图）
- 高保真交互原型（HTML/CSS 可交互版本）
- SVG 交互稿（多页面原型展示）

### 3.6 DevOps

- **Monorepo**：npm workspaces 统一管理 `packages/client` 和 `packages/server`
- **Docker 支持**：多阶段构建，生产镜像仅含运行时依赖
- **自动化脚本**：`npm run dev` 一键启动前后端，`concurrently` 并行运行
- **环境管理**：`.env.example` 模板 + `.gitignore` 排除敏感配置

---

## 四、Result（成果）

### 4.1 功能交付

| 模块 | 功能 |
|------|------|
| 信息流首页 | 6 分类 Tab 切换 + 子分类筛选 + 无限滚动 |
| 校招内推 | 内推信息 + 面经笔试，专业/学院筛选 |
| 租房找房 | 整租/合租/找室友，区域/价格筛选 |
| 二手交易 | 书本/生活用品/虚拟，校区筛选 |
| 考研考公 | 考研/考公分类，科目筛选 |
| 搜索 | 全模块模糊搜索，300ms 防抖 |
| 发布 | 5 种类型动态表单，照片上传（最多 3 张） |
| 详情 | 类型自适应展示，收藏/举报/分享/联系作者 |
| 个人中心 | 我的发布/收藏列表，登录态管理 |
| 消息通知 | 收藏/举报/系统通知，标记已读 |
| 数据仪表盘 | KPI 卡片 + 趋势折线图 + 模块饼图 + 质量指标 |
| PWA | manifest.json + Service Worker，可安装到桌面 |

### 4.2 技术指标

| 指标 | 数值 |
|------|------|
| 前后端代码行数 | ~3,500+ 行 TypeScript |
| 数据库表 | 10 张（含收藏/举报/通知） |
| RESTful API 端点 | 20+ 个 |
| 前端页面 | 9 个路由页面 |
| 可复用组件 | 6 个（FeedCard, BottomNav, KpiCard 等） |
| TypeScript 覆盖率 | 100%（全栈 TS） |
| Zod 校验覆盖 | 所有写操作 API（7 个 schema） |

### 4.3 项目亮点

- 从零到一独立完成：**用户调研 → 产品设计 → 原型 → 开发 → 部署**，体现全链路能力
- 全栈 TypeScript + Monorepo 架构，体现**工程化思维**
- 数据库并行查询优化，体现**性能意识**
- JWT + zod + rate-limit 三层防护，体现**安全意识**
- PWA 离线可用 + 移动端适配，体现**用户体验意识**
- 完整的产品文档体系，体现**产品思维**

---

## 五、项目信息

| 项目 | 详情 |
|------|------|
| 技术栈 | React 19 + Express + TypeScript + Prisma + Recharts + Vite |
| 架构 | npm workspaces Monorepo |
| 仓库 | 本地开发 |
| 开发周期 | 独立开发 |

---

## 六、简历一句话描述

> 独立设计并开发了一个面向 4 万在校学生的**全栈校园信息聚合平台**，覆盖校招、租房、二手、考研等 5 大业务模块。采用 React 19 + Express + TypeScript + Prisma 技术栈，Monorepo 架构管理前后端。实现了 JWT 认证、Zod 校验、接口限流、PWA 离线缓存等特性，并产出完整的用户调研、竞品分析和产品设计文档。