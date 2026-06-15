import type { FC } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TrendPoint } from "../types/analytics";

interface TrendChartProps {
  title: string;
  data: TrendPoint[];
  color?: string;
  yAxisLabel?: string;
}

export const TrendChart: FC<TrendChartProps> = ({ title, data, color = "#2563EB", yAxisLabel }) => (
  <div style={{
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    padding: "16px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>{title}</div>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(d: string) => d.slice(5)} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} width={32} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#9CA3AF" } } : undefined} />
        <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12 }} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

interface MultiTrendChartProps {
  title: string;
  series: { name: string; data: TrendPoint[]; color: string }[];
  yAxisLabel?: string;
}

export const MultiTrendChart: FC<MultiTrendChartProps> = ({ title, series, yAxisLabel }) => {
  const mergedData = series.length > 0
    ? series[0].data.map((pt, i) => {
        const row: Record<string, string | number> = { date: pt.date };
        series.forEach((s) => { row[s.name] = s.data[i]?.value ?? 0; });
        return row;
      })
    : [];

  return (
  <div style={{
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    padding: "16px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>{title}</div>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={mergedData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(d: string) => d.slice(5)} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} width={32} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#9CA3AF" } } : undefined} />
        <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {series.map((s) => (
          <Line key={s.name} type="monotone" dataKey={s.name} name={s.name} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);
}