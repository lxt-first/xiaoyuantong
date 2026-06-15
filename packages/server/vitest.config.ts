import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    setupFiles: ["src/__tests__/setup.ts"]
    env: { DATABASE_URL: process.env.DATABASE_URL || "postgresql://xiaoyuantong:xiaoyuantong_dev@localhost:5432/xiaoyuantong" },,
    hookTimeout: 30000,
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/__tests__/**", "src/services/prisma.ts"],
    },
  },
});