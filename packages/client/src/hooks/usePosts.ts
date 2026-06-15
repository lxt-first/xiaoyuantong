import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import type { FeedItem } from "../types";

interface UsePostsOptions {
  type?: "feed" | "mine";
  limit?: number;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { type = "feed", limit = 20 } = options;
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = type === "feed" ? await api.getFeed() : await api.getMyPosts();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { items, loading, error, refresh: fetchPosts };
}
