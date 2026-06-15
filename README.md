# 校园通 (Xiaoyuantong)

> 校园本地信息聚合平台 — 校招内推 · 租房找房 · 二手交易 · 生活信息 · 考研考公

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 19 + TypeScript + Vite + recharts |
| 后端 | Express + TypeScript + Prisma |
| 数据库 | PostgreSQL（生产）/ SQLite（开发） |
| 部署 | Docker + docker-compose |

## 项目结构

```
xiaoyuantong/
├── packages/
│   ├── client/          # React 前端 (Vite)
│   │   └── src/
│   │       ├── api/     # API 客户端
│   │       ├── components/  # 共享组件
│   │       ├── hooks/   # 自定义 hooks
│   │       ├── pages/   # 页面组件
│   │       ├── stores/  # 全局状态 (Auth)
│   │       └── types/   # TypeScript 类型
│   └── server/          # Express 后端
│       ├── prisma/      # 数据库 schema + 迁移
│       └── src/
│           ├── controllers/  # 请求处理
│           ├── middleware/   # 认证/验证
│           ├── routes/       # 路由定义 + Swagger 注解
│           ├── services/     # 业务逻辑 (Prisma 客户端)
│           ├── validators/   # Zod 校验
│           └── __tests__/    # 集成测试
├── docker-compose.yml   # Docker 编排
├── Dockerfile           # 多阶段构建
└── docs/                # 设计文档
```

## 快速开始

### 本地开发

**前置条件：** Node.js 20+, npm

```bash
# 安装依赖
npm install

# 初始化数据库（本地开发用 SQLite）
npm run -w packages/server db:migrate
npm run -w packages/server db:generate

# 启动开发服务器（前后端同时启动）
npm run dev
# → 前端: http://localhost:5173
# → 后端: http://localhost:3001
# → Swagger: http://localhost:3001/api/docs
```

### Docker 部署

```bash
# 构建并启动（PostgreSQL + 后端 + 前端）
docker compose up -d --build

# 查看日志
docker compose logs -f server

# 访问
# → 应用: http://localhost:3001
# → Swagger: http://localhost:3001/api/docs
```

## API 文档

Swagger 文档已内置，启动后访问 `/api/docs`。

所有 API 以 `/api` 为前缀：

| 端点 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/health` | GET | 健康检查 | - |
| `/api/auth/login` | POST | 手机号登录/注册 | - |
| `/api/auth/user/:id` | GET | 获取用户信息 | - |
| `/api/feed` | GET | 信息流 | - |
| `/api/list` | GET | 模块列表 | - |
| `/api/detail` | GET | 内容详情 | - |
| `/api/search` | GET | 全站搜索 | - |
| `/api/create` | POST | 发布内容 | Bearer |
| `/api/posts/mine` | GET | 我的发布 | Bearer |
| `/api/favorites` | GET/POST/DELETE | 收藏管理 | Bearer |
| `/api/reports` | POST | 举报 | Bearer |
| `/api/notifications` | GET | 通知列表 | Bearer |
| `/api/notifications/:id/read` | PUT | 标记已读 | Bearer |
| `/api/analytics` | GET | 数据仪表盘 | - |

## 环境变量

复制 `packages/server/.env.example` 为 `packages/server/.env`：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | 3001 |
| `JWT_SECRET` | JWT 签名密钥 | (必填) |
| `DATABASE_URL` | 数据库连接串 | PostgreSQL |
| `CLIENT_URL` | 前端地址 (CORS) | http://localhost:5173 |

## 运行测试

```bash
# 服务端测试
npm test

# 类型检查
npm run typecheck
```
