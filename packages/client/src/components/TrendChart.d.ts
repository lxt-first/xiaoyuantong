import type { FC } from "react";
import type { TrendPoint } from "../types/analytics";
interface TrendChartProps {
    title: string;
    data: TrendPoint[];
    color?: string;
    yAxisLabel?: string;
}
export declare const TrendChart: FC<TrendChartProps>;
interface MultiTrendChartProps {
    title: string;
    series: {
        name: string;
        data: TrendPoint[];
        color: string;
    }[];
    yAxisLabel?: string;
}
export declare const MultiTrendChart: FC<MultiTrendChartProps>;
export {};
