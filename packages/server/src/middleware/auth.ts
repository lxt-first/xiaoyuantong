import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../services/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 环境变量未设置");
}

export async function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "请先登录" });
    }
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as { userId: string };
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: "无效的认证信息" });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ error: "用户不存在" });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "登录已过期，请重新登录" });
    }
    console.error("auth middleware error:", err);
    return res.status(500).json({ error: "认证服务异常" });
  }
}

export async function authOptional(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const decoded = jwt.verify(header.slice(7), JWT_SECRET as string) as unknown as { userId: string };
      const userId = decoded.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) (req as any).user = user;
    }
  } catch (err) { /* silent */ }
  next();
}