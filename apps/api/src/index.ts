import { Hono } from "hono";
import prisma from "@repo/db/api";
import { logger } from "hono/logger";
import type { JwtVariables } from "hono/jwt";
import { verifyToken } from "./middleware";
type Bindings = {
  AUTH_SECRET: string;
  JWT_VARIABLE: JwtVariables;
  USER: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use("/auth/*", verifyToken);

app.get("/auth/protected", async (c) => {
  const userId = c.get("USER").id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return c.json({
    ok: true,
    message: "Hello protected API!",
    user: "User from db" + user,
  });
});

export default app;
