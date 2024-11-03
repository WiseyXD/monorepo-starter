import { createMiddleware } from "hono/factory";
import { jwt, verify } from "hono/jwt";

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
      const decoded = await verify(token, c.env.AUTH_SECRET);
      console.log(decoded);
      await next();
    } catch (error) {
      return c.json({ error: "Invalid token" }, 403);
    }
  },
);
