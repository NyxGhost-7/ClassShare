import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } =
      await request.json();

    if (!name || !email || !password) {
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

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "User already exists",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
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
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message:
          "Registration failed",
      },
      {
        status: 500,
      }
    );
  }
}