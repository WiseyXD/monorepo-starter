import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());
// {
// datasources: {
//   db: {
//     url: process.env.DATABASE_URL,
//   },
// },
// }

export default prisma;
