import { createMiddleware } from "hono/factory";
import { jwt, verify } from "hono/jwt";
import { jwtVerify, importJWK } from "jose";

type Bindings = {
  AUTH_SECRET: string;
};

export const verifyToken = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    console.log("entered middleware");
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    try {
      const token = authHeader.split(" ")[1];
      console.log(token);
      const secret = c.env.AUTH_SECRET;
      const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
      const { payload } = await jwtVerify(token, jwk);
      console.log(payload);
      await next();
    } catch (error) {
      console.log(error);
      return c.json({ error: "Invalid token" }, 403);
    }
  },
);
