import request from "supertest";
import app from "../src/app"; 

describe("Auth Endpoints", () => {
  test("signup -> login happy path", async () => {
    // 1. Test Signup
    const signupRes = await request(app)
      .post("/api/auth/signup") 
      .send({ email: "testuser@example.com", password: "testpass123" });

    expect(signupRes.status).toBe(200);

    // 2. Test Login
    const loginRes = await request(app)
      .post("/api/auth/login") 
      .send({ email: "testuser@example.com", password: "testpass123" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});