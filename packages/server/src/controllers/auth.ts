import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../services/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 环境变量未设置");
}

export async function login(req: Request, res: Response) {
  try {
    const { phone, nickname } = req.body;

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone, nickname: nickname || `用户${phone.slice(-4)}` },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, { expiresIn: "7d" });

    return res.json({
      token,
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      school: user.school,
      major: user.major,
      certified: user.certified,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "登录失败" });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true, phone: true, nickname: true, avatar: true,
        school: true, major: true, certified: true, bio: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "用户不存在" });
    return res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ error: "获取用户信息失败" });
  }
}