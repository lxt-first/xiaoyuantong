import { type ReactNode, type FC } from "react";
import type { User } from "../types";
interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User) => void;
    logout: () => void;
    isLoggedIn: boolean;
}
export declare const AuthProvider: FC<{
    children: ReactNode;
}>;
export declare function useAuth(): AuthState;
export {};
