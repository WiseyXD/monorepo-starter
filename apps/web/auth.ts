import NextAuth, { Session } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { JWT } from "next-auth/jwt";

import { SignJWT, importJWK } from "jose";

interface session extends Session {
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
  providers: [Twitter],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      const newToken = token as token;
      newToken.uid = token.sub ?? "nosub";
      console.log(token);

      const jwt = await generateJWT({
        id: token.sub,
        name: token.name,
        image: token.picture,
      });
      newToken.jwt = jwt;

      return newToken;
    },
    async session({ session, token }): Promise<Session> {
      // @ts-ignore
      const newSession = session as session;
      const newToken = token as token;

      // Attaching id and jwt to session user object
      newSession.user.jwt = newToken.jwt;
      newSession.user.id = newToken.uid;

      return newSession;
    },
  },
});
