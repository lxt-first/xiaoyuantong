import { Request, Response } from "express";
import prisma from "../services/prisma";

// GET /api/notifications
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "请先登录" });

    const items = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ items, unreadCount: items.filter((n: { read: boolean }) => !n.read).length });
  } catch (err) {
    console.error("getNotifications error:", err);
    return res.status(500).json({ error: "获取通知失败" });
  }
}

// PUT /api/notifications/:id/read
export async function markRead(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "请先登录" });

    await prisma.notification.updateMany({
      where: { id: req.params.id as string, userId },
      data: { read: true },
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("markRead error:", err);
    return res.status(500).json({ error: "标记已读失败" });
  }
}

// GET /api/notifications/unread-count
export async function unreadCount(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.json({ count: 0 });

    const count = await prisma.notification.count({ where: { userId, read: false } });
    return res.json({ count });
  } catch (err) {
    return res.json({ count: 0 });
  }
}