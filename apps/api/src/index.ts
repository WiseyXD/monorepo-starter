import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import type { JwtVariables } from "hono/jwt";
import { bearerAuth } from "hono/bearer-auth";

type Bindings = {
  AUTH_SECRET: string;
  JWT_VARIABLE: JwtVariables;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use("/auth/*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.AUTH_SECRET,
  });
  console.log("enterd the middleware");
  return jwtMiddleware(c, next);
});

app.get("/auth/protected", async (c) => {
  return c.json({
    ok: true,
    message: "Hello protected API!",
  });
});

export default app;
