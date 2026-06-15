import type { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CategoryBreakdown } from "../types/analytics";

interface ModuleBreakdownProps {
  data: CategoryBreakdown[];
}

export const ModuleBreakdown: FC<ModuleBreakdownProps> = ({ data }) => (
  <div style={{
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    padding: "16px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>模块内容分布</div>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={96}
          paddingAngle={3}
          dataKey="count"
          nameKey="label"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: "#D1D5DB", strokeWidth: 1 }}
        >
          {data.map((entry, i) => (
            <Cell key={entry.category} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 4 }}>
      {data.map((d) => (
        <div key={d.category} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6B7280" }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: "inline-block" }} />
          {d.label} {d.count}
        </div>
      ))}
    </div>
  </div>
);