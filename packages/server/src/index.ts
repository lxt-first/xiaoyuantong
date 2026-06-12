import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRouter);

app.listen(PORT, () => {
  console.log(`🏫 校园通 server running at http://localhost:${PORT}`);
});
