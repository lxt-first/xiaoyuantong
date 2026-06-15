import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  nickname: z.string().max(20).optional(),
});

export const createPostSchema = z.discriminatedUnion("module", [
  z.object({
    module: z.literal("referral"),
    company: z.string().min(1).max(50),
    position: z.string().min(1).max(50),
    referralCode: z.string().max(20).optional(),
    description: z.string().max(5000).optional(),
    deadline: z.string().optional(),
  }),
  z.object({
    module: z.literal("interview"),
    title: z.string().min(1).max(100),
    company: z.string().min(1).max(50),
    position: z.string().max(50).optional(),
    round: z.string().max(20).optional(),
    passed: z.boolean().optional(),
    experience: z.string().max(5000).optional(),
    questions: z.string().max(5000).optional(),
  }),
  z.object({
    module: z.literal("rental"),
    title: z.string().min(1).max(100),
    area: z.string().min(1).max(50),
    price: z.number().min(0),
    community: z.string().max(50).optional(),
    layout: z.string().max(20).optional(),
    size: z.number().optional(),
    description: z.string().max(5000).optional(),
    contact: z.string().max(100).optional(),
  }),
  z.object({
    module: z.literal("secondhand"),
    title: z.string().min(1).max(100),
    category: z.string().min(1).max(20),
    price: z.number().min(0),
    description: z.string().max(5000).optional(),
    campus: z.string().max(50).optional(),
  }),
  z.object({
    module: z.literal("food"),
    restaurant: z.string().min(1).max(50),
    rating: z.number().min(1).max(5),
    review: z.string().min(1).max(5000),
  }),
  z.object({
    module: z.literal("exam"),
    title: z.string().min(1).max(100),
    category: z.string().min(1).max(20),
    content: z.string().min(1).max(5000),
    subject: z.string().max(50).optional(),
  }),
]);

export const getListQuerySchema = z.object({
  module: z.string().min(1),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
});

export const addFavoriteSchema = z.object({
  targetType: z.string().min(1),
  targetId: z.string().min(1),
});

export const removeFavoriteSchema = z.object({
  type: z.string().min(1),
  id: z.string().min(1),
});

export const submitReportSchema = z.object({
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  reason: z.string().max(500).optional(),
});