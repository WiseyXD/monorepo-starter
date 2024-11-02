import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
const app = new Hono();

app.get("/", async (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

export default app;
