import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import { connectDB } from "../lib/mongodb";
import User from "../models/User";

export const authOptions = {
  providers: [
    // -------------------------
    // GOOGLE
    // -------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // -------------------------
    // EMAIL + PASSWORD
    // -------------------------
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error(
            "This account was created using Google. Please continue with Google."
          );
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // -------------------------
    // GOOGLE LOGIN
    // -------------------------
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const existingUser = await User.findOne({
          email: user.email.toLowerCase(),
        });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email.toLowerCase(),
            image: user.image,
            provider: "google",
            password: null,
          });
        }
      }

      return true;
    },

    // -------------------------
    // JWT
    // -------------------------
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // -------------------------
    // SESSION
    // -------------------------
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};