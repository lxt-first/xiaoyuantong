
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: 获取通知列表
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 通知列表
 *       401:
 *         description: 未登录
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: 标记通知已读
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 标记成功
 */
import { Router } from "express";
import { getNotifications, markRead } from "../controllers/notifications";
import { authRequired } from "../middleware/auth";

export const notificationsRouter = Router();
notificationsRouter.get("/", authRequired, getNotifications);
notificationsRouter.put("/:id/read", authRequired, markRead);
