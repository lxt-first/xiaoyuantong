import type { FC } from "react";
import type { ContentQuality } from "../types/analytics";

interface QualityMetricsProps {
  data: ContentQuality;
}

export const QualityMetrics: FC<QualityMetricsProps> = ({ data }) => (
  <div style={{
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    padding: "16px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 14 }}>内容质量</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Report Rate */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>举报率</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: data.reportRate <= 0.02 ? "#16A34A" : "#DC2626" }}>
            {(data.reportRate * 100).toFixed(1)}%
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "#F3F4F6", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(data.reportRate * 500, 100)}%`, borderRadius: 3, background: data.reportRate <= 0.02 ? "#16A34A" : "#DC2626", transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>目标 {"<="} 2%</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{data.totalReports} 条举报 / {data.totalPosts} 条内容</span>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: "#F9FAFB",
        borderRadius: 6,
        padding: "10px 12px",
        fontSize: 12,
        color: "#6B7280",
        lineHeight: 1.6,
      }}>
        共 {data.totalPosts} 条内容，{data.totalReports} 条举报。举报率为 {(data.reportRate * 100).toFixed(2)}%。
      </div>
    </div>
  </div>
);