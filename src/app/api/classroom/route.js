import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Classroom from "@/models/Classroom";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  try {
    // Check login
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const code = searchParams.get("code");
    const id = searchParams.get("id");

    let classroom;

    // =========================
    // FIND BY ID
    // =========================

    if (id) {
      classroom = await Classroom.findById(id)
        .populate(
          "host",
          "name email image"
        )
        .populate(
          "members",
          "name email image"
        );
    }

    // =========================
    // FIND BY CODE
    // =========================

    else if (code) {
      classroom = await Classroom.findOne({
        code: code.trim().toUpperCase(),
      })
        .populate(
          "host",
          "name email image"
        )
        .populate(
          "members",
          "name email image"
        );
    }

    // =========================
    // NO ID / CODE
    // =========================

    else {
      return NextResponse.json(
        {
          message:
            "Classroom ID or code is required",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // NOT FOUND
    // =========================

    if (!classroom) {
      return NextResponse.json(
        {
          message: "Classroom not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      classroom,
    });
  } catch (error) {
    console.error(
      "GET CLASSROOM ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to find classroom",
      },
      {
        status: 500,
      }
    );
  }
}