import "server-only";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";

export const authOptions = {
  providers: [
   
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

  
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

        // IMPORTANT: MongoDB ID
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
  ],

  callbacks: {
    // =========================
    // GOOGLE LOGIN
    // =========================
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          await connectDB();

          const email = user.email?.toLowerCase();

          if (!email) {
            return false;
          }

          let existingUser = await User.findOne({
            email,
          });

          // CREATE USER
          if (!existingUser) {
            existingUser = await User.create({
              name: user.name || "User",
              email,
              image: user.image || null,
              provider: "google",
              password: null,
            });
          }

          // IMPORTANT:
          // Replace Google ID with MongoDB ID
          user.id = existingUser._id.toString();

          // Keep DB values
          user.name = existingUser.name;
          user.email = existingUser.email;
          user.image = existingUser.image;
        }

        return true;
      } catch (error) {
        console.error("GOOGLE SIGN IN ERROR:", error);
        return false;
      }
    },

    // =========================
    // JWT
    // =========================
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // =========================
    // SESSION
    // =========================
    async session({ session, token }) {
      if (session.user && token.id) {
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