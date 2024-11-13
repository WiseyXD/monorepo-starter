import { Hono } from "hono";
import { getPrisma } from "./db";

// TODO:try to get the db directly from ./client import

import { logger } from "hono/logger";
import { verifyToken } from "./middleware";

type Bindings = {};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use("/auth/*", verifyToken);

app.get("/auth/protected", async (c) => {
  const userId = c.get("USER").id;
  const prisma = getPrisma(c);
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
