import type { FC } from "react";

interface KpiCardProps {
  label: string;
  value: number | string;
  unit?: string;
  target?: string;
  trend?: "up" | "down" | "neutral";
  color?: string;
}

const TREND_COLORS = { up: "#16A34A", down: "#DC2626", neutral: "#6B7280" };
const TREND_ICONS = { up: "↑", down: "↓", neutral: "→" };

export const KpiCard: FC<KpiCardProps> = ({ label, value, unit, target, trend, color }) => (
  <div style={{
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    padding: "16px 20px",
    minWidth: 160,
    flex: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>
      {label}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: color ?? "#111827", lineHeight: 1.2 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      {unit && <span style={{ fontSize: 13, color: "#9CA3AF" }}>{unit}</span>}
    </div>
    {(target || trend) && (
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
        {trend && (
          <span style={{ color: TREND_COLORS[trend], fontSize: 12, fontWeight: 600 }}>
            {TREND_ICONS[trend]}
          </span>
        )}
        {target && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{target}</span>}
      </div>
    )}
  </div>
);