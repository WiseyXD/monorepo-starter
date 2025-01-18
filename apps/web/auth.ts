import NextAuth, { Session } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { JWT } from "next-auth/jwt";
import { SignJWT, importJWK } from "jose";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@repo/db/client";

export interface session extends Session {
  user: {
    jwt: string;
    id: string;
    image: string;
    name: string;
  };
}
//comment for testing

interface token extends JWT {
  jwt: string;
  uid: string;
}

const generateJWT = async (payload: any) => {
  const secret = process.env.AUTH_SECRET;

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(jwk);

  return jwt;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Twitter],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, token, user }): Promise<Session> {
      const customSession = session as any;

      if (!customSession.user) {
        customSession.user = {};
      }

      const jwt = await generateJWT({
        id: customSession.user.id,
        name: customSession.user.name,
        image: customSession.user.email,
      });

      customSession.user.jwt = jwt;

      return customSession;
    },
  },
});
