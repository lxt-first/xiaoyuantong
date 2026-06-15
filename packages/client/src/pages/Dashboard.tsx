import { useState, useEffect, useCallback, type FC } from "react";
import type { DashboardData, DateRangePreset } from "../types/analytics";
import { KpiCard } from "../components/KpiCard";
import { TrendChart } from "../components/TrendChart";
import { ModuleBreakdown } from "../components/ModuleBreakdown";
import { QualityMetrics } from "../components/QualityMetrics";

const PRESETS: { key: DateRangePreset; label: string }[] = [
  { key: "7d", label: "近7天" },
  { key: "30d", label: "近30天" },
  { key: "90d", label: "近90天" },
  { key: "all", label: "全部" },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preset, setPreset] = useState<DateRangePreset>("30d");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const days = preset === "7d" ? 7 : preset === "30d" ? 30 : preset === "90d" ? 90 : 365;
      const from = new Date(now.getTime() - days * 86400000).toISOString().slice(0, 10);
      const to = now.toISOString().slice(0, 10);
      const res = await fetch(`/api/analytics?from=${from}&to=${to}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as DashboardData;
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [preset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center", background: "#F3F4F6" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 13, color: "#6B7280" }}>加载数据中...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center", background: "#F3F4F6" }}>
        <div style={{ textAlign: "center", color: "#DC2626" }}>
          <p style={{ fontSize: 16, fontWeight: 600 }}>数据加载失败</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>{error ?? "未知错误"}</p>
          <button onClick={fetchData} style={{ marginTop: 12, padding: "6px 16px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>重试</button>
        </div>
      </div>
    );
  }

  const { overview, trends, categoryBreakdown, quality } = data;

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ textDecoration: "none", color: "#6B7280", fontSize: 13 }}>← 返回首页</a>
          <span style={{ color: "#D1D5DB" }}>|</span>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>数据仪表盘</h1>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 6, padding: 2 }}>
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => setPreset(p.key)} style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              background: preset === p.key ? "#fff" : "transparent",
              color: preset === p.key ? "#2563EB" : "#6B7280",
              boxShadow: preset === p.key ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
            }}>
              {p.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* ---- Overview KPI Cards ---- */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>核心指标概览</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <KpiCard label="注册用户数" value={overview.totalUsers} target="目标 ≥ 5,000" trend="up" color="#2563EB" />
            <KpiCard label="校园认证率" value={`${(overview.certifiedPublishingRate * 100).toFixed(1)}`} unit="%" target="目标 ≥ 40%" trend="up" color="#7C3AED" />
            <KpiCard label="活跃用户数" value={overview.activeUsers} target="目标 ≥ 1,000" trend="up" color="#16A34A" />
            <KpiCard label="新增用户" value={overview.newUsers} trend="neutral" color="#0891B2" />
            <KpiCard label="总内容数" value={overview.totalContent} unit="条" target="目标 ≥ 500" trend="up" color="#F59E0B" />
            <KpiCard label="人均浏览内容数" value={overview.perCapitaViews} unit="条/人" target="目标 ≥ 8" trend="up" color="#EC4899" />
            <KpiCard label="篇均浏览量" value={overview.averageViewsPerPost} unit="次" target="目标 ≥ 50" trend="up" color="#8B5CF6" />
          </div>
        </section>

        {/* ---- Trend Charts ---- */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>趋势分析</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 12 }}>
            <TrendChart title="新增用户" data={trends.newUsers} color="#7C3AED" yAxisLabel="人" />
            <TrendChart title="新增内容" data={trends.newContent} color="#F59E0B" yAxisLabel="条" />
            <TrendChart title="总浏览量" data={trends.totalViews} color="#EC4899" yAxisLabel="次" />
          </div>
        </section>

        {/* ---- Module + Quality ---- */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>内容分析</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
            <ModuleBreakdown data={categoryBreakdown} />
            <QualityMetrics data={quality} />
          </div>
        </section>

        {/* ---- Module Summary Table ---- */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>模块数据汇总</h2>
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "#374151" }}>模块</th>
                  <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600, color: "#374151" }}>内容数</th>
                  <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600, color: "#374151" }}>占比</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map((c, i) => {
                  const total = categoryBreakdown.reduce((s, x) => s + x.count, 0);
                  const pct = total > 0 ? ((c.count / total) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={c.category} style={{ borderBottom: i < categoryBreakdown.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color, display: "inline-block" }} />
                        {c.label}
                      </td>
                      <td style={{ textAlign: "right", padding: "10px 16px", color: "#111827", fontWeight: 500 }}>{c.count}</td>
                      <td style={{ textAlign: "right", padding: "10px 16px", color: "#6B7280" }}>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}