import type { FC } from "react";
interface KpiCardProps {
    label: string;
    value: number | string;
    unit?: string;
    target?: string;
    trend?: "up" | "down" | "neutral";
    color?: string;
}
export declare const KpiCard: FC<KpiCardProps>;
export {};
