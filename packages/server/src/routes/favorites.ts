
/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: 获取收藏列表
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 收藏列表
 *   post:
 *     summary: 添加收藏
 *     tags: [Favorites]
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
 *     responses:
 *       200:
 *         description: 收藏成功
 *   delete:
 *     summary: 取消收藏
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 取消收藏成功
 */
import { Router } from "express";
import { addFavorite, removeFavorite, getFavorites } from "../controllers/favorites";
import { authRequired } from "../middleware/auth";
import { validate, validateQuery } from "../middleware/validate";
import { addFavoriteSchema, removeFavoriteSchema } from "../validators";

export const favoritesRouter = Router();
favoritesRouter.get("/", authRequired, getFavorites);
favoritesRouter.post("/", authRequired, validate(addFavoriteSchema), addFavorite);
favoritesRouter.delete("/", authRequired, validateQuery(removeFavoriteSchema), removeFavorite);