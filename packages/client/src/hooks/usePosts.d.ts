import type { FeedItem } from "../types";
interface UsePostsOptions {
    type?: "feed" | "mine";
    limit?: number;
}
export declare function usePosts(options?: UsePostsOptions): {
    items: FeedItem[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};
export {};
