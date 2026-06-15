/** 数据仪表盘类型定义 */
export interface AnalyticsOverview {
    totalUsers: number;
    totalCertified: number;
    activeUsers: number;
    newUsers: number;
    newContent: number;
    averageViewsPerPost: number;
    certifiedPublishingRate: number;
    perCapitaViews: number;
    reportRate: number;
    totalViews: number;
    totalContent: number;
}
export interface TrendPoint {
    date: string;
    value: number;
}
export interface AnalyticsTrends {
    newUsers: TrendPoint[];
    newContent: TrendPoint[];
    totalViews: TrendPoint[];
}
export interface CategoryBreakdown {
    category: string;
    label: string;
    count: number;
    color: string;
}
export interface ContentQuality {
    reportRate: number;
    totalReports: number;
    totalPosts: number;
}
export interface DashboardData {
    overview: AnalyticsOverview;
    trends: AnalyticsTrends;
    categoryBreakdown: CategoryBreakdown[];
    quality: ContentQuality;
}
export interface DateRange {
    from: string;
    to: string;
}
export type DateRangePreset = "7d" | "30d" | "90d" | "all";
