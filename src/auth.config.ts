import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import UserModel from "./models/UserModel";
import { connectDB } from "./lib/db";

export default {
  providers: [CredentialsProvider],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (!session.user) return session;

      await connectDB();

      const dbUser = await UserModel.findById(token.id).select(
        "role name email",
      );

      if (!dbUser) return session;

      session.user.id = token.id as string;
      session.user.role = dbUser.role;

      session.user.name = dbUser.name;
      session.user.email = dbUser.email;

      return session;
    },
  },
} satisfies NextAuthConfig;
