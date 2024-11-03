import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import type { JwtVariables } from "hono/jwt";
import { verifyToken } from "./middleware";
type Bindings = {
  AUTH_SECRET: string;
  JWT_VARIABLE: JwtVariables;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

// const verifyToken = async (c, next) => {
//   const authHeader = c.req.headers.get("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return c.json({ error: "Unauthorized" }, 401);
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // Verify the token
//     const decoded = verify(token, c.env.AUTH_SECRET);
//     console.log(decoded);
//     c.set("user", decoded); // Store decoded token data (e.g., user info) in context
//     await next();
//   } catch (error) {
//     return c.json({ error: "Invalid token" }, 403);
//   }
// };

// app.use("/auth/*", (c, next) => {
//   const jwtMiddleware = jwt({
//     secret: c.env.AUTH_SECRET,
//   });
//   console.log("enterd the middleware");
//   return jwtMiddleware(c, next);
// });

app.use("/auth/*", verifyToken);

app.get("/auth/protected", async (c) => {
  return c.json({
    ok: true,
    message: "Hello protected API!",
  });
});

export default app;
