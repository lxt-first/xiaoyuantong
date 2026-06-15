
/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: 获取信息流（混合展示所有模块）
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量（默认20，最大50）
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: 游标（ISO时间戳，用于翻页）
 *     responses:
 *       200:
 *         description: 信息流列表
 */

/**
 * @swagger
 * /api/list:
 *   get:
 *     summary: 按模块获取列表
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: module
 *         required: true
 *         schema:
 *           type: string
 *           enum: [referral, interview, rental, secondhand, food, exam]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 分页列表
 */

/**
 * @swagger
 * /api/detail:
 *   get:
 *     summary: 获取内容详情
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: module
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
 *         description: 内容详情
 *       404:
 *         description: 内容不存在
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: 全站搜索
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 搜索结果
 */

/**
 * @swagger
 * /api/create:
 *   post:
 *     summary: 创建内容
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [module]
 *             properties:
 *               module:
 *                 type: string
 *                 enum: [referral, interview, rental, secondhand, food, exam]
 *     responses:
 *       200:
 *         description: 创建成功
 *       401:
 *         description: 未登录
 */

/**
 * @swagger
 * /api/posts/mine:
 *   get:
 *     summary: 获取我的发布
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 我的发布列表
 *       401:
 *         description: 未登录
 */
import { Router } from "express";
import { getFeed, getList, getDetail, createPost, search, getMyPosts } from "../controllers/posts";
import { authRequired } from "../middleware/auth";
import { validate, validateQuery } from "../middleware/validate";
import { createPostSchema, getListQuerySchema, searchQuerySchema } from "../validators";

export const postsRouter = Router();

postsRouter.get("/feed", getFeed);
postsRouter.get("/list", validateQuery(getListQuerySchema), getList);
postsRouter.get("/detail", getDetail);
postsRouter.get("/search", validateQuery(searchQuerySchema), search);
postsRouter.post("/create", authRequired, validate(createPostSchema), createPost);
postsRouter.get("/posts/mine", authRequired, getMyPosts);