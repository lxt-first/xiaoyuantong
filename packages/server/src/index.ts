import express from "express";
import path from "path";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { healthRouter } from "./routes/health";
import { analyticsRouter } from "./routes/analytics";
import { authRouter } from "./routes/auth";
import { postsRouter } from "./routes/posts";
import { favoritesRouter } from "./routes/favorites";
import { reportsRouter } from "./routes/reports";
import { notificationsRouter } from "./routes/notifications";
import { swaggerRouter } from "./routes/swagger";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
const clientUrl = process.env.CLIENT_URL;
app.use(cors(clientUrl ? { origin: clientUrl } : {}));
app.use(express.json({ limit: "100kb" }));

// Global rate limit: 100 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "请求过于频繁，请稍后再试" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Auth rate limit: 10 requests per minute per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "登录请求过于频繁，请稍后再试" },
  standardHeaders: true,
  legacyHeaders: false,
});

// In production, serve static client files
const clientDist = path.resolve(__dirname, "../../client/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// API root
app.get("/", (_req, res) => {
  res.json({ ok: true, name: "校园通 API", version: "1.0.0" });
});

// Swagger API docs
app.use("/api/docs", swaggerRouter);

// Routes
app.use("/api", healthRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authLimiter, authRouter);
app.use("/api", postsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/notifications", notificationsRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err.message);
  if (res.headersSent) return;
  res.status(500).json({ error: "服务器内部错误" });
});

app.listen(PORT, () => {
  console.log(`校园通 server running at http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api/docs`);
});
