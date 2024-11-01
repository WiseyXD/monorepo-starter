import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
// @ts-ignore
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Twitter],
});
