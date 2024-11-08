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
    email: string;
    name: string;
  };
}

interface token extends JWT {
  jwt: string;
  uid: string;
}

// interface CustomSession extends Session {
//   user: {
//     jwt: string;
//     id: string;
//     email: string;
//     name: string;
//   };
// }

// interface CustomToken extends JWT {
//   jwt: string;
//   uid: string;
// }

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

  // callbacks: {
  //   async jwt({ token, user, account }): Promise<JWT> {
  //     const newToken = token as token;
  //     newToken.uid = token.sub ?? "nosub";
  //     console.log(token);

  //     if (token.sub) {
  //       const jwt = await generateJWT({
  //         id: token.sub,
  //         name: token.name,
  //         image: token.picture,
  //       });
  //       newToken.jwt = jwt;
  //     } else {
  //       console.warn("No sub found in token; jwt will be undefined");
  //     }
  //     return newToken;
  //   },
  //   async session({ session, token }): Promise<Session> {
  //     // @ts-ignore
  //     const newSession = session as session;
  //     const newToken = token as token;

  //     // Attaching id and jwt to session user object
  //     newSession.user.jwt = newToken.jwt;
  //     newSession.user.id = newToken.uid;

  //     return newSession;
  //   },
  // },
  callbacks: {
    async session({ session, token, user }): Promise<Session> {
      const customSession = session as Session;

      // Ensure user object exists in the session
      if (!customSession.user) {
        customSession.user = {};
      }

      // console.log("session callback" + JSON.stringify(customSession.user));

      // Generate JWT and attach it to session.user.jwt
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
