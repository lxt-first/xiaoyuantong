import swaggerJsdoc from "swagger-jsdoc";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

// In production (compiled JS), routes are in dist/; in dev (tsx), they are in src/
const isDev = process.env.NODE_ENV !== "production";
const apis = isDev ? ["./src/routes/*.ts"] : ["./dist/routes/*.js"];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "校园通 API",
      version: "1.0.0",
      description: "校园本地信息聚合平台 — 校招内推、租房找房、二手交易、生活信息、考研考公",
    },
    servers: [
      { url: "http://localhost:3001", description: "本地开发" },
      { url: "/", description: "生产环境" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis,
};

const spec = swaggerJsdoc(options);

router.use("/", swaggerUi.serve, swaggerUi.setup(spec));
router.get("/json", (_req, res) => res.json(spec));

export { router as swaggerRouter };
