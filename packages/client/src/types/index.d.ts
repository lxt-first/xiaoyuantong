export interface User {
    id: string;
    phone: string;
    nickname: string;
    avatar: string;
    school?: string;
    major?: string;
    certified: boolean;
}
export type ModuleType = "referral" | "interview" | "rental" | "secondhand" | "food" | "exam";
export interface FeedItem {
    id: string;
    type: ModuleType;
    author: User;
    viewCount: number;
    createdAt: string;
    title?: string;
    company?: string;
    position?: string;
    referralCode?: string;
    description?: string;
    deadline?: string;
    status?: string;
    round?: string;
    passed?: boolean;
    experience?: string;
    questions?: string;
    area?: string;
    community?: string;
    price?: number;
    layout?: string;
    size?: number;
    contact?: string;
    category?: string;
    campus?: string;
    restaurant?: string;
    rating?: number;
    review?: string;
    subject?: string;
    content?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}
