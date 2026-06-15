
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: 健康检查
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: 服务状态
 */
import { Router } from "express";
import { getHealth } from "../controllers/health";

export const healthRouter = Router();

healthRouter.get("/health", getHealth);
