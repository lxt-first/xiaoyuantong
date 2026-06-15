import { Request, Response } from "express";
import * as analyticsService from "../services/analytics";

export async function getDashboard(req: Request, res: Response) {
  try {
    const from = (req.query.from as string) ?? "2025-01-01";
    const to = (req.query.to as string) ?? new Date().toISOString().slice(0, 10);
    const [overview, trends, categoryBreakdown, quality] = await Promise.all([
      analyticsService.getDashboardOverview(from, to),
      analyticsService.getTrends(from, to),
      analyticsService.getCategoryBreakdown(from, to),
      analyticsService.getContentQuality(from, to),
    ]);
    res.json({ overview, trends, categoryBreakdown, quality });
  } catch (err) {
    console.error("Analytics dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
}