import { Request, Response } from "express";
import prisma from "../services/prisma";

type ModuleType = "referral" | "interview" | "rental" | "secondhand" | "food" | "exam";

const userSelect = {
  id: true, nickname: true, avatar: true, school: true, major: true, certified: true,
};

type ModelDelegate = {
  findMany: (args: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  count: (args: any) => Promise<number>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
};

function getModel(type: ModuleType): ModelDelegate {
  const map: Record<ModuleType, ModelDelegate> = {
    referral: prisma.referral as unknown as ModelDelegate,
    interview: prisma.interview as unknown as ModelDelegate,
    rental: prisma.rental as unknown as ModelDelegate,
    secondhand: prisma.secondhand as unknown as ModelDelegate,
    food: prisma.foodReview as unknown as ModelDelegate,
    exam: prisma.exam as unknown as ModelDelegate,
  };
  return map[type];
}

interface FormattedItem {
  id: string;
  type: ModuleType;
  author: { id: string; nickname: string; avatar: string; school: string | null; major: string | null; certified: boolean };
  viewCount: number;
  createdAt: Date;
  [key: string]: unknown;
}

function formatItem(type: ModuleType, item: any): FormattedItem {
  const base: FormattedItem = {
    id: item.id,
    type,
    author: item.user,
    viewCount: item.viewCount,
    createdAt: item.createdAt,
  };
  switch (type) {
    case "referral":
      return { ...base, company: item.company, position: item.position, referralCode: item.referralCode, description: item.description, deadline: item.deadline, status: item.status };
    case "interview":
      return { ...base, title: item.title, company: item.company, position: item.position, round: item.round, passed: item.passed, experience: item.experience, questions: item.questions };
    case "rental":
      return { ...base, title: item.title, area: item.area, community: item.community, price: item.price, layout: item.layout, size: item.size, description: item.description, contact: item.contact };
    case "secondhand":
      return { ...base, title: item.title, category: item.category, price: item.price, description: item.description, campus: item.campus };
    case "food":
      return { ...base, restaurant: item.restaurant, rating: item.rating, review: item.review };
    case "exam":
      return { ...base, title: item.title, category: item.category, content: item.content, subject: item.subject };
  }
}

// GET /api/feed?limit=20&cursor=2026-01-01T00:00:00Z
export async function getFeed(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor as string | undefined;
    const take = limit + 5;

    const dateFilter = cursor ? { lt: new Date(cursor) } : undefined;
    const orderBy = { createdAt: "desc" as const };

    const [referrals, interviews, rentals, secondhands, foods, exams] = await Promise.all([
      prisma.referral.findMany({ where: { status: "active", ...(dateFilter ? { createdAt: dateFilter } : {}) }, orderBy, take, include: { user: { select: userSelect } } }),
      prisma.interview.findMany({ where: dateFilter ? { createdAt: dateFilter } : {}, orderBy, take, include: { user: { select: userSelect } } }),
      prisma.rental.findMany({ where: { status: "active", ...(dateFilter ? { createdAt: dateFilter } : {}) }, orderBy, take, include: { user: { select: userSelect } } }),
      prisma.secondhand.findMany({ where: { status: "active", ...(dateFilter ? { createdAt: dateFilter } : {}) }, orderBy, take, include: { user: { select: userSelect } } }),
      prisma.foodReview.findMany({ where: dateFilter ? { createdAt: dateFilter } : {}, orderBy, take, include: { user: { select: userSelect } } }),
      prisma.exam.findMany({ where: dateFilter ? { createdAt: dateFilter } : {}, orderBy, take, include: { user: { select: userSelect } } }),
    ]);

    const all = [
      ...referrals.map((r: any) => formatItem("referral", r)),
      ...interviews.map((i: any) => formatItem("interview", i)),
      ...rentals.map((r: any) => formatItem("rental", r)),
      ...secondhands.map((s: any) => formatItem("secondhand", s)),
      ...foods.map((f: any) => formatItem("food", f)),
      ...exams.map((e: any) => formatItem("exam", e)),
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, limit);

    const nextCursor = all.length > 0 ? all[all.length - 1].createdAt.toISOString() : null;
    const hasMore = all.length === limit;

    return res.json({ items: all, nextCursor, hasMore });
  } catch (err) {
    console.error("getFeed error:", err);
    return res.status(500).json({ error: "获取信息流失败" });
  }
}

// GET /api/list?module=xxx
export async function getList(req: Request, res: Response) {
  try {
    const module = req.query.module as ModuleType;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    if (!module || !["referral", "interview", "rental", "secondhand", "food", "exam"].includes(module)) {
      return res.status(400).json({ error: "无效的模块类型" });
    }

    const model = getModel(module);
    const where: any = {};
    if (["referral", "rental", "secondhand"].includes(module)) {
      where.status = "active";
    }

    const [total, items] = await Promise.all([
      model.count({ where }),
      model.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { user: { select: userSelect } } }),
    ]);

    return res.json({
      items: items.map((item: any) => formatItem(module, item)),
      total, page, limit,
    });
  } catch (err) {
    console.error("getList error:", err);
    return res.status(500).json({ error: "获取列表失败" });
  }
}

// GET /api/detail?module=xxx&id=xxx
export async function getDetail(req: Request, res: Response) {
  try {
    const module = req.query.module as ModuleType;
    const id = req.query.id as string;

    if (!module || !id) return res.status(400).json({ error: "缺少 module 或 id 参数" });

    const model = getModel(module);
    await model.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    const item = await model.findUnique({ where: { id }, include: { user: { select: userSelect } } });
    if (!item) return res.status(404).json({ error: "内容不存在" });

    return res.json(formatItem(module, item));
  } catch (err) {
    console.error("getDetail error:", err);
    return res.status(500).json({ error: "获取详情失败" });
  }
}

// POST /api/create
export async function createPost(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "请先登录" });

    const { module, ...data } = req.body;
    const userId = user.id;

    if (!module) return res.status(400).json({ error: "缺少 module" });
    if (!["referral", "interview", "rental", "secondhand", "food", "exam"].includes(module)) {
      return res.status(400).json({ error: "无效的模块类型" });
    }

    const model = getModel(module as ModuleType);
    const item = await model.create({ data: { ...data, userId }, include: { user: { select: userSelect } } });

    return res.json(formatItem(module as ModuleType, item));
  } catch (err) {
    console.error("createPost error:", err);
    return res.status(500).json({ error: "发布失败" });
  }
}

// GET /api/search?q=xxx
export async function search(req: Request, res: Response) {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) return res.json({ items: [] });

    const where = { contains: q };

    const [referrals, interviews, rentals, secondhands, foods, exams] = await Promise.all([
      prisma.referral.findMany({ where: { OR: [{ company: where }, { position: where }], status: "active" }, take: 10, include: { user: { select: userSelect } } }),
      prisma.interview.findMany({ where: { OR: [{ title: where }, { company: where }, { position: where }] }, take: 10, include: { user: { select: userSelect } } }),
      prisma.rental.findMany({ where: { OR: [{ title: where }, { community: where }, { area: where }], status: "active" }, take: 10, include: { user: { select: userSelect } } }),
      prisma.secondhand.findMany({ where: { OR: [{ title: where }], status: "active" }, take: 10, include: { user: { select: userSelect } } }),
      prisma.foodReview.findMany({ where: { OR: [{ restaurant: where }, { review: where }] }, take: 10, include: { user: { select: userSelect } } }),
      prisma.exam.findMany({ where: { OR: [{ title: where }, { content: where }, { subject: where }] }, take: 10, include: { user: { select: userSelect } } }),
    ]);

    const all = [
      ...referrals.map((r: any) => formatItem("referral", r)),
      ...interviews.map((i: any) => formatItem("interview", i)),
      ...rentals.map((r: any) => formatItem("rental", r)),
      ...secondhands.map((s: any) => formatItem("secondhand", s)),
      ...foods.map((f: any) => formatItem("food", f)),
      ...exams.map((e: any) => formatItem("exam", e)),
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 30);

    return res.json({ items: all });
  } catch (err) {
    console.error("search error:", err);
    return res.status(500).json({ error: "搜索失败" });
  }
}

// GET /api/posts/mine
export async function getMyPosts(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "请先登录" });

    const [referrals, interviews, rentals, secondhands, foods, exams] = await Promise.all([
      prisma.referral.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: { select: userSelect } } }),
      prisma.interview.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: { select: userSelect } } }),
      prisma.rental.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: { select: userSelect } } }),
      prisma.secondhand.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: { select: userSelect } } }),
      prisma.foodReview.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: { select: userSelect } } }),
      prisma.exam.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: { select: userSelect } } }),
    ]);

    const all = [
      ...referrals.map((r: any) => formatItem("referral", r)),
      ...interviews.map((i: any) => formatItem("interview", i)),
      ...rentals.map((r: any) => formatItem("rental", r)),
      ...secondhands.map((s: any) => formatItem("secondhand", s)),
      ...foods.map((f: any) => formatItem("food", f)),
      ...exams.map((e: any) => formatItem("exam", e)),
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({ items: all });
  } catch (err) {
    console.error("getMyPosts error:", err);
    return res.status(500).json({ error: "获取我的发布失败" });
  }
}