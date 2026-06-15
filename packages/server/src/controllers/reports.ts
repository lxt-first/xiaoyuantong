import { Request, Response } from "express";
import prisma from "../services/prisma";

// POST /api/reports
export async function submitReport(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "请先登录" });
    const userId = user.id;
    const { targetType, targetId, reason } = req.body;

    const report = await prisma.report.create({
      data: { userId, targetType, targetId, reason: reason || "用户举报" }
    });
    return res.json(report);
  } catch (err) {
    console.error("submitReport error:", err);
    return res.status(500).json({ error: "举报失败" });
  }
}