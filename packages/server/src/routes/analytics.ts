
/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: 获取数据仪表盘
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           example: "2025-01-01"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           example: "2026-06-15"
 *     responses:
 *       200:
 *         description: 仪表盘数据（overview, trends, categoryBreakdown, quality）
 */
import { Router } from "express";
import { getDashboard } from "../controllers/analytics";
import { adminRequired } from "../middleware/auth";

export const analyticsRouter = Router();
analyticsRouter.get("/", adminRequired, getDashboard);