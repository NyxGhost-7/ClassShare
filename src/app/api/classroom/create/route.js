import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Classroom from "@/models/Classroom";
import User from "@/models/User";

import { authOptions } from "@/lib/auth";

function generateCode() {
  return (
    "CLS-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}

export async function POST(request) {
  try {
    await connectDB();

    // =========================
    // AUTHENTICATION
    // =========================

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // USER
    // =========================

    const user = await User.findById(
      session.user.id
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // REQUEST
    // =========================

    const {
      name,
      description,
      privacy,
    } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        {
          message:
            "Classroom name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["public", "private"].includes(
        privacy
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid classroom privacy",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // PRIVATE CODE
    // =========================

    let code;

    if (privacy === "private") {
      code = generateCode();

      while (
        await Classroom.exists({
          code,
        })
      ) {
        code = generateCode();
      }
    }

    // =========================
    // CREATE
    // =========================

    const classroom =
      await Classroom.create({
        name: name.trim(),

        description:
          description?.trim() || "",

        host: user._id,

        privacy,

        ...(code && { code }),

        members: [user._id],
      });

    return NextResponse.json(
      {
        message:
          "Classroom created successfully",

        classroom,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE CLASSROOM ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create classroom",
      },
      {
        status: 500,
      }
    );
  }
}