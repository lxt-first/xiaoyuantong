import type { FeedItem, ModuleType, PaginatedResponse, User } from "../types";

const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  try {
    const stored = localStorage.getItem("token");
    if (stored) return stored;
    // fallback: read from user object for legacy support
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr) as User & { token?: string };
      return u.token || null;
    }
  } catch { /* ignore */ }
  return null;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json; charset=utf-8" };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

type ErrorHandler = (message: string) => void;
let globalErrorHandler: ErrorHandler | null = null;

export function setErrorHandler(handler: ErrorHandler | null) {
  globalErrorHandler = handler;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(BASE + url, {
      ...options,
      headers: { ...authHeaders(), ...(options?.headers as Record<string, string> || {}) },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "网络异常" }));
      const msg = err.error || `请求失败 (${res.status})`;
      globalErrorHandler?.(msg);
      throw new Error(msg);
    }
    return res.json();
  } catch (e: unknown) {
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      const msg = "网络连接失败，请检查网络";
      globalErrorHandler?.(msg);
      throw new Error(msg);
    }
    throw e;
  }
}

export const api = {
  login: (phone: string, nickname?: string) =>
    request<User & { token: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ phone, nickname }),
    }),

  getUser: (id: string) => request<User>("/auth/user/" + id),

  getFeed: (cursor?: string, limit = 20) =>
    request<{ items: FeedItem[]; nextCursor: string | null; hasMore: boolean }>(
      "/feed?limit=" + limit + (cursor ? "&cursor=" + encodeURIComponent(cursor) : "")
    ),

  getList: (module: ModuleType, page = 1, limit = 20) =>
    request<PaginatedResponse<FeedItem>>("/list?module=" + module + "&page=" + page + "&limit=" + limit),

  getDetail: (module: ModuleType, id: string) =>
    request<FeedItem>("/detail?module=" + module + "&id=" + id),

  createPost: (module: ModuleType, data: Record<string, unknown>) =>
    request<FeedItem>("/create", {
      method: "POST",
      body: JSON.stringify({ module, ...data }),
    }),

  search: (q: string) =>
    request<{ items: FeedItem[] }>("/search?q=" + encodeURIComponent(q)),

  getMyPosts: () =>
    request<{ items: FeedItem[] }>("/posts/mine"),

  addFavorite: (targetType: string, targetId: string) =>
    request<{ id: string }>("/favorites", {
      method: "POST",
      body: JSON.stringify({ targetType, targetId }),
    }),

  removeFavorite: (targetType: string, targetId: string) =>
    request<{ success: boolean }>(`/favorites?type=${targetType}&id=${targetId}`, {
      method: "DELETE",
    }),

  getFavorites: () =>
    request<{ items: { targetType: string; targetId: string }[] }>("/favorites"),

  submitReport: (targetType: string, targetId: string, reason: string = "用户举报") =>
    request<{ id: string }>("/reports", {
      method: "POST",
      body: JSON.stringify({ targetType, targetId, reason }),
    }),
};