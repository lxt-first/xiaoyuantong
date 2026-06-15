import type { User } from "../types";
export declare function useStoredUser(): User | null;
export declare function useAuth(): {
    user: User | null;
    isLoggedIn: boolean;
    token: string | null;
    requireAuth: () => void;
    logout: () => void;
};
