import { Router } from "express";
import { login, getProfile } from "../controllers/auth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/user/:id", getProfile);/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 手机号登录/注册
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13800138000"
 *               nickname:
 *                 type: string
 *                 example: "小明"
 *     responses:
 *       200:
 *         description: 登录成功，返回 token 和用户信息
 *       400:
 *         description: 参数无效
 */

/**
 * @swagger
 * /api/auth/user/{id}:
 *   get:
 *     summary: 获取用户信息
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 用户信息
 *       404:
 *         description: 用户不存在
 */
