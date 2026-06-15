import { createContext, useContext, useState, useEffect, type ReactNode, type FC } from "react";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored) as User;
        setUser(u);
        setToken(u.id);
      } catch { /* ignore */ }
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    setToken(u.id);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
