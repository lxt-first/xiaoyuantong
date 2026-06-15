import type { FeedItem, ModuleType, PaginatedResponse, User } from "../types";
type ErrorHandler = (message: string) => void;
export declare function setErrorHandler(handler: ErrorHandler | null): void;
export declare const api: {
    login: (phone: string, nickname?: string) => Promise<User & {
        token: string;
    }>;
    getUser: (id: string) => Promise<User>;
    getFeed: (cursor?: string, limit?: number) => Promise<{
        items: FeedItem[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    getList: (module: ModuleType, page?: number, limit?: number) => Promise<PaginatedResponse<FeedItem>>;
    getDetail: (module: ModuleType, id: string) => Promise<FeedItem>;
    createPost: (module: ModuleType, data: Record<string, unknown>) => Promise<FeedItem>;
    search: (q: string) => Promise<{
        items: FeedItem[];
    }>;
    getMyPosts: () => Promise<{
        items: FeedItem[];
    }>;
    addFavorite: (targetType: string, targetId: string) => Promise<{
        id: string;
    }>;
    removeFavorite: (targetType: string, targetId: string) => Promise<{
        success: boolean;
    }>;
    getFavorites: () => Promise<{
        items: {
            targetType: string;
            targetId: string;
        }[];
    }>;
    submitReport: (targetType: string, targetId: string, reason?: string) => Promise<{
        id: string;
    }>;
};
export {};
