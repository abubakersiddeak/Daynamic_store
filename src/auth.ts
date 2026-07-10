import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";

import clientPromise from "./lib/mongoClient";

import UserModel from "./models/User";
import authConfig from "./auth.config";
import { connectDB } from "./lib/db";
import { IUserModel } from "./types/modelTyps";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "ecomarsStor",
  }) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  ...authConfig,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const { email, password } = credentials;

          await connectDB();
          const user = (await UserModel.findOne({ email }).select(
            "+password",
          )) as IUserModel | null;
          if (!user) {
            return null;
          }

          const isMatch = await bcrypt.compare(
            password.toString(),
            user.password!.toString(),
          );

          if (!isMatch) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  trustHost: true,
});
