import { Request, Response } from "express";
import prisma from "../services/prisma";

// POST /api/favorites
export async function addFavorite(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "请先登录" });
    const userId = user.id;
    const { targetType, targetId } = req.body;

    const existing = await prisma.favorite.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } }
    });
    if (existing) return res.json(existing);

    const fav = await prisma.favorite.create({ data: { userId, targetType, targetId } });

    // Create notification for the content owner
    try {
      const contentOwner = await getContentOwner(targetType, targetId);
      if (contentOwner && contentOwner !== userId) {
        await prisma.notification.create({
          data: { userId: contentOwner, type: "favorite", title: "有人收藏了你的内容", content: "你的内容被收藏了", targetType, targetId }
        });
      }
    } catch { /* ignore */ }

    return res.json(fav);
  } catch (err) {
    console.error("addFavorite error:", err);
    return res.status(500).json({ error: "收藏失败" });
  }
}

// DELETE /api/favorites?type=xxx&id=xxx
export async function removeFavorite(req: Request, res: Response) {
  try {
    const targetType = req.query.type as string;
    const targetId = req.query.id as string;
    const userId = (req as any).user?.id;
    if (!userId || !targetType || !targetId) return res.status(400).json({ error: "缺少参数" });

    await prisma.favorite.deleteMany({ where: { userId, targetType, targetId } });
    return res.json({ success: true });
  } catch (err) {
    console.error("removeFavorite error:", err);
    return res.status(500).json({ error: "取消收藏失败" });
  }
}

// GET /api/favorites
export async function getFavorites(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "请先登录" });
    const userId = user.id;

    const items = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ items });
  } catch (err) {
    console.error("getFavorites error:", err);
    return res.status(500).json({ error: "获取收藏列表失败" });
  }
}

async function getContentOwner(type: string, id: string): Promise<string | null> {
  const map: Record<string, any> = {
    referral: prisma.referral,
    interview: prisma.interview,
    rental: prisma.rental,
    secondhand: prisma.secondhand,
    food: prisma.foodReview,
    exam: prisma.exam,
  };
  const model = map[type];
  if (!model) return null;
  try {
    const item = await model.findUnique({ where: { id }, select: { userId: true } });
    return item?.userId || null;
  } catch { return null; }
}