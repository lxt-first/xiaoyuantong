import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import { authRouter } from "../routes/auth";
import { postsRouter } from "../routes/posts";
import { favoritesRouter } from "../routes/favorites";
import { reportsRouter } from "../routes/reports";

let app: express.Express;
let token: string;
let postId: string;
const TEST_PHONE = "19900000001";

beforeAll(() => {
  app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRouter);
  app.use("/api", postsRouter);
  app.use("/api/favorites", favoritesRouter);
  app.use("/api/reports", reportsRouter);
});

describe("Auth API", () => {
  it("should login and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ phone: TEST_PHONE, nickname: "IntegrationTest" })
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(res.body.phone).toBe(TEST_PHONE);
    token = res.body.token;
  });

  it("should reject invalid phone", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ phone: "12345" })
      .expect(400);

    expect(res.body.error).toBeDefined();
  });

  it("should return same user on re-login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ phone: TEST_PHONE })
      .expect(200);

    expect(res.body.phone).toBe(TEST_PHONE);
    token = res.body.token;
  });
});

describe("Posts API", () => {
  it("should create a referral post", async () => {
    const res = await request(app)
      .post("/api/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        module: "referral",
        company: "TestCorp",
        position: "TestPosition",
        description: "Integration test post",
      })
      .expect(200);

    expect(res.body.id).toBeDefined();
    expect(res.body.company).toBe("TestCorp");
    postId = res.body.id;
  });

  it("should get feed", async () => {
    const res = await request(app)
      .get("/api/feed")
      .expect(200);

    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("should search posts", async () => {
    const res = await request(app)
      .get("/api/search?q=TestCorp")
      .expect(200);

    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("should reject invalid module type", async () => {
    await request(app)
      .post("/api/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ module: "invalid" })
      .expect(400);
  });

  it("should reject missing required fields", async () => {
    await request(app)
      .post("/api/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ module: "referral", company: "Test" })
      .expect(400);
  });
});

describe("Favorites API", () => {
  it("should add favorite", async () => {
    const res = await request(app)
      .post("/api/favorites")
      .set("Authorization", `Bearer ${token}`)
      .send({ targetType: "referral", targetId: postId })
      .expect(200);

    expect(res.body.id).toBeDefined();
  });

  it("should get favorites", async () => {
    const res = await request(app)
      .get("/api/favorites")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("should reject favorite without auth", async () => {
    await request(app)
      .post("/api/favorites")
      .send({ targetType: "referral", targetId: postId })
      .expect(401);
  });
});

describe("Reports API", () => {
  it("should submit report", async () => {
    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${token}`)
      .send({ targetType: "referral", targetId: postId, reason: "Test report reason" })
      .expect(200);

    expect(res.body.id).toBeDefined();
  });

  it("should reject report without auth", async () => {
    await request(app)
      .post("/api/reports")
      .send({ targetType: "referral", targetId: postId, reason: "test" })
      .expect(401);
  });
});