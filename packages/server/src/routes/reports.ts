
/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: 提交举报
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetType, targetId]
 *             properties:
 *               targetType:
 *                 type: string
 *               targetId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 举报提交成功
 *       401:
 *         description: 未登录
 */
import { Router } from "express";
import { submitReport } from "../controllers/reports";
import { authRequired } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { submitReportSchema } from "../validators";

export const reportsRouter = Router();
reportsRouter.post("/", authRequired, validate(submitReportSchema), submitReport);