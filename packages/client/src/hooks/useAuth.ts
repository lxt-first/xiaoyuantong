import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";

export function useStoredUser(): User | null {
  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const nav = useNavigate();
  const user = useStoredUser();
  const isLoggedIn = !!user;
  const token = user?.id ?? null;

  const requireAuth = useCallback(() => {
    if (!isLoggedIn) nav("/login");
  }, [isLoggedIn, nav]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    nav("/");
  }, [nav]);

  return useMemo(
    () => ({ user, isLoggedIn, token, requireAuth, logout }),
    [user, isLoggedIn, token, requireAuth, logout]
  );
}
