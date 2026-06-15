# 校园通 (XiaoYuanTong) — 技术方案

> **文档版本**: v1.0 | **日期**: 2026-06-14 | **阶段**: Stage 4 — 技术方案 & 数据库设计
> **关联文档**: [PRD](./requirements-and-design.md) | [交互规范](./interaction-spec.md) | [数据库 Schema](../packages/server/schema.prisma)

---

## 目录

1. [架构总览](#1-架构总览)
2. [技术栈选型](#2-技术栈选型)
3. [后端架构设计](#3-后端架构设计)
4. [前端架构设计](#4-前端架构设计)
5. [API 设计](#5-api-设计)
6. [认证与安全](#6-认证与安全)
7. [文件上传方案](#7-文件上传方案)
8. [首页 Feed 聚合方案](#8-首页-feed-聚合方案)
9. [错误处理策略](#9-错误处理策略)
10. [目录结构规划](#10-目录结构规划)

---

## 1. 架构总览

### 1.1 系统拓扑

```
┌──────────────┐     HTTP/JSON      ┌──────────────┐     Prisma      ┌──────────────┐
│   Client     │ ◄────────────────► │   Server     │ ◄─────────────► │  SQLite/     │
│  React SPA   │   REST API         │  Express     │   ORM           │  PostgreSQL  │
│  (Vite)      │   :5173 → :3001    │  TypeScript  │                 │              │
└──────┬───────┘                    └──────────────┘                 └──────────────┘
       │
       │  static files (uploads/)
       ▼
┌──────────────┐
│  Uploads     │
│  Directory   │
└──────────────┘
```

### 1.2 分层架构（后端）

```
┌─────────────────────────────────────┐
│  Routes  ──  路由定义，URL → Controller  │
├─────────────────────────────────────┤
│  Controllers  ── 请求解析、参数校验、响应  │
├─────────────────────────────────────┤
│  Services  ── 业务逻辑、事务管理         │
├─────────────────────────────────────┤
│  Prisma Client  ── 数据访问层 (ORM)   │
├─────────────────────────────────────┤
│  Middleware  ── 认证、日志、错误处理    │
└─────────────────────────────────────┘
```

调用链：`Request → Middleware (auth/log) → Route → Controller → Service → Prisma → DB → Response`

- **Routes**：薄层，只负责 URL 映射
- **Controllers**：解析 req、调用 service、组装 res；不做业务逻辑
- **Services**：业务核心，调用 Prisma、处理事务；返回数据或抛业务错误
- **Middleware**：横切关注点（认证 JWT/session、请求日志、CORS）

---

## 2. 技术栈选型

### 2.1 确定项

| 层 | 技术 | 版本 | 选型理由 |
|---|------|------|----------|
| 前端框架 | React + TypeScript | 19.1 | PRD 已指定，团队熟悉 |
| 构建工具 | Vite | 6.3 | HMR 快，React 19 支持好 |
| 路由 | React Router DOM | 7.6 | SPA 标准方案 |
| 后端框架 | Express + TypeScript | 4.21 | 轻量、生态成熟、团队熟悉 |
| ORM | Prisma | 5.22 | 类型安全、migration 自动化 |
| 数据库(开发) | SQLite | — | 零配置，本地开发简便 |
| 数据库(生产) | PostgreSQL | — | 性能、并发、云部署友好 |
| 开发热重载 | tsx | 4.19 | 支持 TypeScript 原生 ESM |

### 2.2 MVP 沿用现有依赖的简易方案

MVP 阶段不引入额外重量级依赖，保持栈轻量：

| 能力 | MVP 方案 | 说明 |
|------|---------|------|
| 状态管理 | React Context + useReducer | 仅认证状态需要全局；其他用组件局部 state |
| 服务端请求 | fetch（封装 api 层） | 前端 `src/api/` 封装所有 fetch 调用 |
| 表单验证 | 手工校验 + 错误状态 | 发布表单字段有限，不需额外库 |
| CSS | 原生 CSS / CSS Modules | 设计系统 Token 用 CSS 变量 |
| 认证 | 自签 JWT (jsonwebtoken) | 手机验证码登录 → 签发 JWT → 前端存储 |

> **v1.1+ 候选升级**：TanStack Query（服务端状态缓存）、Zustand（复杂状态）、React Hook Form（表单）、Tailwind CSS（效率）

### 2.3 不引入的技术（MVP）

| 技术 | 不引入理由 |
|------|-----------|
| Next.js / SSR | MVP 无 SEO 需求，SPA 够用 |
| Redis | 验证码可用 DB 存储，无高并发 |
| WebSocket | MVP 无实时通知需求 |
| Docker | 单机部署先跑通 |
| 消息队列 | 无异步任务 |

---

## 3. 后端架构设计

### 3.1 模块划分

```
packages/server/src/
├── index.ts              # 入口：Express 启动、中间件注册、路由挂载
├── lib/
│   └── prisma.ts         # Prisma Client 单例
├── middleware/
│   ├── auth.ts           # JWT 认证中间件（签发 req.userId）
│   ├── requireCertified.ts # 校园认证校验（发布操作需要）
│   └── errorHandler.ts   # 全局错误处理
├── routes/
│   ├── auth.ts           # /api/auth/*
│   ├── users.ts          # /api/users/*
│   ├── referrals.ts      # /api/referrals/*
│   ├── interviews.ts     # /api/interviews/*
│   ├── rentals.ts        # /api/rentals/*
│   ├── secondhands.ts    # /api/secondhands/*
│   ├── foodReviews.ts    # /api/food-reviews/*
│   ├── favorites.ts      # /api/favorites/*
│   ├── reports.ts        # /api/reports/*
│   ├── upload.ts         # /api/upload/*
│   └── feed.ts           # /api/feed/*
├── controllers/          # 与 routes 一一对应
│   ├── auth.ts
│   ├── ...
└── services/             # 业务逻辑
    ├── auth.ts
    ├── user.ts
    ├── referral.ts
    ├── interview.ts
    ├── rental.ts
    ├── secondhand.ts
    ├── foodReview.ts
    ├── favorite.ts
    ├── report.ts
    ├── upload.ts
    └── feed.ts
```

### 3.2 认证中间件设计

```typescript
// middleware/auth.ts
// 从 Authorization: Bearer <token> 提取 JWT → 解密 → 挂载 req.userId
// 不校验是否认证学生（校园认证由 requireCertified 单独负责）

// middleware/requireCertified.ts
// 在 auth 之后使用，查询 User.certified === true
// 游客可浏览，发布需认证；发布接口使用此中间件
```

### 3.3 数据关联策略

由于 Prisma 不支持多态关联，`Image`、`Favorite`、`Report` 使用 **`(kind + ownerId)`** 模式：

- **Image**：`{ kind: "referral", ownerId: "<referral_id>" }` — 应用层做 JOIN
- **Favorite / Report**：`{ targetType: "rental", targetId: "<rental_id>" }` — 复合唯一约束防重复

查询图片示例：
```typescript
// 查询某二手物品的所有图片
const images = await prisma.image.findMany({
  where: { kind: "secondhand", ownerId: secondhandId },
  orderBy: { sortOrder: "asc" }
});
```

---

## 4. 前端架构设计

### 4.1 路由设计

```
/                           → Home（首页 Feed）
/login                      → Login（手机号登录）
/verify                     → Verify（edu 邮箱认证）
/profile/:userId            → Profile（个人主页）
/profile/edit               → ProfileEdit（编辑资料）
/referrals                  → ReferralList（内推列表）
/referrals/:id              → ReferralDetail（内推详情）
/referrals/new              → ReferralPublish（发布内推）
/interviews                 → InterviewList（面经列表）
/interviews/:id             → InterviewDetail（面经详情）
/interviews/new             → InterviewPublish（发布面经）
/rentals                    → RentalList（租房列表）
/rentals/:id                → RentalDetail（房源详情）
/rentals/new                → RentalPublish（发布房源）
/secondhands                → SecondhandList（二手列表）
/secondhands/:id            → SecondhandDetail（物品详情）
/secondhands/new            → SecondhandPublish（发布物品）
/food-reviews               → FoodReviewList（美食列表）
/food-reviews/:id           → FoodReviewDetail（美食详情）
/food-reviews/new           → FoodReviewPublish（发布美食）
```

### 4.2 组件树

```
App
├── Layout
│   ├── NavBar (顶部导航：返回 + 标题)
│   ├── BottomNav (底部 Tab：首页/校招/租房/二手/生活)
│   └── <Outlet /> (页面内容)
│
├── Pages
│   ├── Home                      # 首页信息流
│   │   ├── FeedCard              # 通用信息流卡片（模块颜色标签）
│   │   └── PublishBottomSheet    # 发布模块选择面板
│   │
│   ├── ReferralList / InterviewList / ...（各模块列表页）
│   │   ├── SearchBar
│   │   ├── FilterTabs            # 子 Tab（如内推/面经）
│   │   └── ListItem              # 列表项
│   │
│   ├── *Detail                   # 各模块详情页
│   │   ├── ImageCarousel         # 图片轮播（左右滑动 + 圆点指示器）
│   │   ├── PublisherCard         # 发布者信息卡片
│   │   ├── StarRating            # 星级评分组件（展示/交互）
│   │   └── BottomActionBar       # 收藏 + 复制联系方式
│   │
│   ├── *Publish                  # 各模块发布页
│   │   ├── ImageUploader         # 图片上传（多图 + 排序）
│   │   └── FormField             # 表单字段（label + input + 错误提示）
│   │
│   ├── Login                     # 手机号登录
│   │   └── PhoneInput + CodeInput
│   │
│   ├── Verify                    # edu 邮箱认证
│   └── Profile / ProfileEdit     # 个人主页
│
└── Shared Components
    ├── Button (Primary / Outline / Ghost / Danger)
    ├── Input / Textarea
    ├── Tag (模块颜色标签)
    ├── Toast (操作结果提示)
    ├── Modal / BottomSheet
    ├── EmptyState / ErrorState / LoadingSpinner
    └── SkeletonCard (列表骨架屏)
```

### 4.3 状态管理策略

| 状态类型 | 方案 | 说明 |
|---------|------|------|
| 认证状态 | React Context (`AuthContext`) | userId + token + certified，全局消费 |
| 页面数据 | 组件局部 `useState` + `useEffect` | 列表/详情，组件卸载即释放 |
| 表单状态 | 组件局部 `useState` | 每个发布页独立管理 |
| 缓存 | 不做（MVP） | 每次切页面重新请求，保证数据新鲜 |

```typescript
// stores/AuthContext.tsx（唯一全局状态）
interface AuthState {
  token: string | null;
  userId: string | null;
  certified: boolean;
}
```

### 4.4 API 层封装

```typescript
// api/client.ts — 统一请求封装
const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken(); // 从 Context/localStorage 取
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "网络错误" }));
    throw new ApiError(res.status, err.message);
  }
  return res.json();
}

// api/referrals.ts — 模块级 API
export const referralsApi = {
  list: (page: number) => request<Paginated<Referral>>(`/referrals?page=${page}`),
  detail: (id: string) => request<Referral>(`/referrals/${id}`),
  create: (data: CreateReferralInput) => request<Referral>("/referrals", { method: "POST", body: JSON.stringify(data) }),
  close: (id: string) => request<Referral>(`/referrals/${id}/close`, { method: "PATCH" }),
};
```

---

## 5. API 设计

### 5.1 通用约定

- **Base URL**：`/api`
- **分页**：`?page=1&pageSize=20`，返回 `{ items: T[], total: number, page: number, pageSize: number }`
- **认证**：需认证的端点标注 `[Auth]`，需校园认证的标注 `[Certified]`
- **时间格式**：ISO 8601 字符串
- **空值**：`null`（非 `undefined` 或 `""`）

### 5.2 用户认证

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| POST | `/api/auth/send-code` | 发送手机验证码 | — |
| POST | `/api/auth/login` | 验证码登录（返回 JWT） | — |
| POST | `/api/auth/send-email-code` | 发送 edu 邮箱验证码 | Auth |
| POST | `/api/auth/verify-email` | 验证 edu 邮箱 → 设置 certified=true | Auth |
| GET | `/api/auth/me` | 获取当前用户信息 | Auth |

### 5.3 用户

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| GET | `/api/users/:id` | 获取用户公开信息（昵称/头像/学校/专业/认证标识） | — |
| GET | `/api/users/:id/posts` | 获取用户发布列表（按模块分页） | — |
| PATCH | `/api/users/me` | 更新当前用户资料（昵称/头像/专业） | Auth |

### 5.4 校招内推

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| GET | `/api/referrals` | 内推列表（分页 + 可选搜索） | — |
| GET | `/api/referrals/:id` | 内推详情（含发布者信息 + 图片） | — |
| POST | `/api/referrals` | 发布内推 | Certified |
| PATCH | `/api/referrals/:id/close` | 标记为已截止（仅发布者） | Auth |
| GET | `/api/interviews` | 面经列表（分页） | — |
| GET | `/api/interviews/:id` | 面经详情 | — |
| POST | `/api/interviews` | 发布面经 | Certified |

### 5.5 租房找房

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| GET | `/api/rentals` | 房源列表（区域/价格/户型筛选） | — |
| GET | `/api/rentals/:id` | 房源详情 | — |
| POST | `/api/rentals` | 发布房源 | Certified |
| PATCH | `/api/rentals/:id/status` | 更新状态（已出租/已过期） | Auth |

### 5.6 二手交易

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| GET | `/api/secondhands` | 物品列表（分类/校区筛选） | — |
| GET | `/api/secondhands/:id` | 物品详情 | — |
| POST | `/api/secondhands` | 发布物品 | Certified |
| PATCH | `/api/secondhands/:id/status` | 更新状态（已售/已预定） | Auth |

### 5.7 美食推荐

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| GET | `/api/food-reviews` | 美食列表（分页） | — |
| GET | `/api/food-reviews/:id` | 美食详情 | — |
| POST | `/api/food-reviews` | 发布美食评测 | Certified |

### 5.8 收藏 & 举报

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| POST | `/api/favorites` | 收藏内容 `{ targetType, targetId }` | Auth |
| DELETE | `/api/favorites?targetType=X&targetId=Y` | 取消收藏 | Auth |
| GET | `/api/favorites` | 我的收藏列表（按模块分页） | Auth |
| POST | `/api/reports` | 举报内容 `{ targetType, targetId, reason }` | Auth |

### 5.9 Feed & 上传

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:---:|
| GET | `/api/feed` | 首页混合信息流（跨模块，时间倒序） | — |
| POST | `/api/upload` | 上传图片（`multipart/form-data`）→ 返回 URL | Auth |

---

## 6. 认证与安全

### 6.1 认证流程

```
1. 用户输入手机号 → POST /api/auth/send-code
   → 后端生成6位数字验证码 → 存 VerificationCode（type=phone, expires=10min）
   → MVP 阶段：打印到控制台 / 开发环境直接返回（无真实短信服务）

2. 用户输入验证码 → POST /api/auth/login { phone, code }
   → 校验码有效性（未使用 + 未过期）
   → 查找或创建 User → 签发 JWT（payload: { sub: userId }, expires: 7d）
   → 返回 { token, user: { id, phone, nickname, certified } }

3. 已登录用户认证邮箱 → POST /api/auth/send-email-code
   → 校验 eduEmail 格式（*@*.edu.*）→ 存 VerificationCode（type=email）
   → MVP 阶段：打印到控制台

4. 用户输入邮箱验证码 → POST /api/auth/verify-email { email, code }
   → 校验码 → 更新 User.eduEmail + User.certified = true
```

### 6.2 JWT 设计

```typescript
interface JwtPayload {
  sub: string;  // userId
  iat: number;  // issued at
  exp: number;  // expiration (7 days)
}
// 使用 jsonwebtoken 库 sign / verify
// 密钥存在环境变量 JWT_SECRET
```

### 6.3 安全措施

| 措施 | 说明 |
|------|------|
| 验证码频率限制 | 同一手机号 60 秒内只能发一次；同一 IP 100 次/小时 |
| 验证码有效期 | 10 分钟，用过即标记 used=true |
| 内容发布权限 | 必须 certified=true，无认证只能浏览 |
| 状态变更权限 | 发布者本人才能修改自己内容的状态 |
| SQL 注入 | Prisma 参数化查询天然防护 |
| XSS | React 默认转义输出 |

---

## 7. 文件上传方案

### 7.1 MVP 方案：本地磁盘存储

```
packages/server/uploads/
├── 2026/
│   ├── 06/
│   │   ├── abc123-uuid.jpg
│   │   └── def456-uuid.webp
```

- 后端挂载静态目录：`app.use("/uploads", express.static("uploads"))`
- 文件命名：`<uuid>.<ext>`（避免冲突）
- 文件大小限制：10MB / 张
- 格式限制：`image/jpeg, image/png, image/webp`
- 前端上传后拿到的 URL：`/uploads/2026/06/abc123.jpg`
- 图片入库：向 `Image` 表插入记录 `{ url, kind, ownerId, sortOrder }`

### 7.2 生产环境升级路径

- 阿里云 OSS / AWS S3：替换 `uploads/` 目录为上云存储
- 预签名 URL 直传：前端直接上传 OSS，减少服务器带宽
- 图片压缩：前端用 Canvas 压缩后再上传（降流量）
- CDN：CloudFront / 阿里云 CDN 加速

---

## 8. 首页 Feed 聚合方案

### 8.1 MVP 实现：应用层多源聚合

由于 SQLite 不支持 UNION 或物化视图，且 5 个模块分别独立表，Feed 聚合在应用层完成：

```typescript
// services/feed.ts
async function getFeed(page: number, pageSize: number) {
  // 1. 从各模块取最新 N 条（每个模块取 pageSize 条）
  const [referrals, interviews, rentals, secondhands, foodReviews] = await Promise.all([
    prisma.referral.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" }, take: pageSize }),
    prisma.interview.findMany({ orderBy: { createdAt: "desc" }, take: pageSize }),
    prisma.rental.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" }, take: pageSize }),
    prisma.secondhand.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" }, take: pageSize }),
    prisma.foodReview.findMany({ orderBy: { createdAt: "desc" }, take: pageSize }),
  ]);

  // 2. 统一格式，添加 type 字段 + 发布者信息
  const unified = [
    ...referrals.map(r => ({ ...r, type: "referral" })),
    ...interviews.map(i => ({ ...i, type: "interview" })),
    ...rentals.map(r => ({ ...r, type: "rental" })),
    ...secondhands.map(s => ({ ...s, type: "secondhand" })),
    ...foodReviews.map(f => ({ ...f, type: "food_review" })),
  ];

  // 3. 按时间倒序 → 分页截取
  unified.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return unified.slice((page - 1) * pageSize, page * pageSize);
}
```

- 每个模块取 `pageSize` 条，合并后排序 → 保证首页至少有各模块内容
- 数据量 < 10000 条时性能无问题
- 关联 User（发布者昵称/头像）通过 `userId` 批量查询（IN 查询）一次获取

### 8.2 扩展方向（v1.1+）

- 引入 Redis 缓存：Feed 列表缓存 1 分钟
- 数据库层面：PostgreSQL 迁移后使用物化视图或 UNION ALL
- 搜索：Elasticsearch / Meilisearch 做全文搜索 + Feed

---

## 9. 错误处理策略

### 9.1 统一错误响应格式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "手机号格式不正确"
  }
}
```

### 9.2 错误码体系

| HTTP 状态码 | code | 场景 |
|:---:|------|------|
| 400 | `VALIDATION_ERROR` | 参数校验失败 |
| 401 | `UNAUTHORIZED` | 未登录或 token 过期 |
| 403 | `FORBIDDEN` | 未认证学生，无发布权限 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `CONFLICT` | 重复收藏、重复认证 |
| 429 | `RATE_LIMITED` | 验证码发送过频 |
| 500 | `INTERNAL_ERROR` | 服务器内部错误 |

### 9.3 后端全局错误处理

```typescript
// middleware/errorHandler.ts
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "服务器内部错误" } });
}
```

### 9.4 前端错误处理

```tsx
// hooks/useApi.ts — 通用请求 Hook（可选，MVP 可以直接在组件中 try/catch）
function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, error, loading };
}
```

每个页面三种状态：
- **Loading**：SkeletonCard 骨架屏 / Spinner
- **Error**：ErrorState 组件 + "点击重试"按钮
- **Empty**：EmptyState 组件 + "还没有内容"提示

---

## 10. 目录结构规划

```
xiaoyuantong/
├── packages/
│   ├── client/
│   │   ├── src/
│   │   │   ├── api/                # API 请求封装
│   │   │   │   ├── client.ts       # 通用 fetch 封装（认证头注入、错误处理）
│   │   │   │   ├── auth.ts         # 认证相关 API
│   │   │   │   ├── referrals.ts    # 内推 API
│   │   │   │   ├── interviews.ts   # 面经 API
│   │   │   │   ├── rentals.ts      # 租房 API
│   │   │   │   ├── secondhands.ts  # 二手 API
│   │   │   │   ├── foodReviews.ts  # 美食 API
│   │   │   │   ├── favorites.ts    # 收藏 API
│   │   │   │   ├── reports.ts      # 举报 API
│   │   │   │   ├── upload.ts       # 上传 API
│   │   │   │   └── feed.ts         # Feed API
│   │   │   ├── components/         # 共享组件
│   │   │   │   ├── ui/             # 基础 UI（Button, Input, Tag, Toast, Modal）
│   │   │   │   ├── NavBar.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   ├── FeedCard.tsx
│   │   │   │   ├── ImageCarousel.tsx
│   │   │   │   ├── ImageUploader.tsx
│   │   │   │   ├── PublisherCard.tsx
│   │   │   │   ├── StarRating.tsx
│   │   │   │   ├── BottomActionBar.tsx
│   │   │   │   ├── PublishBottomSheet.tsx
│   │   │   │   └── SkeletonCard.tsx
│   │   │   ├── hooks/              # 自定义 Hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useToast.ts
│   │   │   ├── pages/              # 页面组件
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Verify.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── ProfileEdit.tsx
│   │   │   │   ├── referral/       # 校招模块
│   │   │   │   │   ├── ReferralList.tsx
│   │   │   │   │   ├── ReferralDetail.tsx
│   │   │   │   │   └── ReferralPublish.tsx
│   │   │   │   ├── interview/      # 面经模块
│   │   │   │   │   ├── InterviewList.tsx
│   │   │   │   │   ├── InterviewDetail.tsx
│   │   │   │   │   └── InterviewPublish.tsx
│   │   │   │   ├── rental/         # 租房模块
│   │   │   │   │   ├── RentalList.tsx
│   │   │   │   │   ├── RentalDetail.tsx
│   │   │   │   │   └── RentalPublish.tsx
│   │   │   │   ├── secondhand/     # 二手模块
│   │   │   │   │   ├── SecondhandList.tsx
│   │   │   │   │   ├── SecondhandDetail.tsx
│   │   │   │   │   └── SecondhandPublish.tsx
│   │   │   │   └── foodReview/     # 美食模块
│   │   │   │       ├── FoodReviewList.tsx
│   │   │   │       ├── FoodReviewDetail.tsx
│   │   │   │       └── FoodReviewPublish.tsx
│   │   │   ├── stores/
│   │   │   │   └── AuthContext.tsx  # 认证状态
│   │   │   ├── types/
│   │   │   │   └── index.ts        # 共享类型定义
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css           # 全局样式 + CSS 变量（设计系统 Token）
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── server/
│       ├── prisma/
│       │   └── migrations/         # Prisma 迁移文件
│       ├── uploads/                # 图片上传目录
│       ├── src/
│       │   ├── index.ts
│       │   ├── lib/
│       │   │   └── prisma.ts
│       │   ├── middleware/
│       │   ├── routes/
│       │   ├── controllers/
│       │   └── services/
│       ├── schema.prisma
│       └── .env
├── docs/
│   ├── user-research.md
│   ├── competitive-analysis.md
│   ├── requirements-and-design.md
│   ├── interaction-spec.md
│   └── technical-solution.md       # 本文档
├── prototypes/
│   ├── wireframes.html
│   └── high-fidelity.html
└── package.json
```

---

*文档版本: v1.0 | 更新日期: 2026-06-14 | 阶段: Stage 4 — 技术方案 & 数据库设计*