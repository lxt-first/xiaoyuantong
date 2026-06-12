# 🏫 校园通 (XiaoYuanTong)

校园本地信息聚合平台 — 一站式校招内推、租房找房、二手交易。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 19 + TypeScript + Vite + React Router |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | SQLite (开发) / PostgreSQL (生产) |
| ORM | Prisma |
| 包管理 | npm workspaces (monorepo) |

## 项目结构

```
xiaoyuantong/
├── packages/
│   ├── client/          # React 前端
│   │   └── src/
│   │       ├── pages/       # 页面组件
│   │       ├── components/  # 通用组件
│   │       ├── hooks/       # 自定义 Hooks
│   │       ├── stores/      # 状态管理
│   │       ├── api/         # API 请求层
│   │       └── types/       # TypeScript 类型
│   └── server/          # Express 后端
│       └── src/
│           ├── routes/      # 路由定义
│           ├── controllers/ # 控制器
│           ├── services/    # 业务逻辑
│           ├── middleware/  # 中间件
│           └── models/      # 数据模型
├── docs/                # 产品文档 (PRD / 竞品分析 / 用户调研)
├── prototypes/          # 原型设计文件
└── README.md
```

## 快速开始

```bash
# 安装依赖
npm install

# 初始化数据库
cd packages/server
npx prisma db push
cd ../..

# 启动开发环境（前后端同时启动）
npm run dev

# 或分别启动
npm run dev:server   # 后端 → http://localhost:3001
npm run dev:client   # 前端 → http://localhost:5173
```

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |

## 开发阶段

- [x] 阶段 0：项目初始化
- [ ] 阶段 1：用户调研 & 竞品分析
- [ ] 阶段 2：需求定义 & 产品设计
- [ ] 阶段 3：高保真交互原型
- [ ] 阶段 4：技术方案 & 数据库设计
- [ ] 阶段 5：MVP 开发
- [ ] 阶段 6：数据指标体系 & 看板
- [ ] 阶段 7：项目包装 & 作品集