import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read JSON body
    const body = await request.json();

    const {
      name,
      email,
      password,
    } = body;

    // Validate
    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return NextResponse.json(
        {
          message:
            "Name, email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // Normalize email
    const normalizedEmail =
      email.trim().toLowerCase();

    // Check existing user
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      {
        message:
          "Account created successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create account",
      },
      {
        status: 500,
      }
    );
  }
}