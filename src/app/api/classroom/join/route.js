import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import Classroom from "@/models/Classroom";

import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    // =========================
    // AUTH
    // =========================

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            "You must be logged in to join a classroom",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // CODE
    // =========================

    const { code } =
      await request.json();

    if (!code?.trim()) {
      return NextResponse.json(
        {
          message:
            "Classroom code is required",
        },
        {
          status: 400,
        }
      );
    }

    const classroomCode =
      code.trim().toUpperCase();

    // =========================
    // FIND PRIVATE CLASS
    // =========================

    const classroom =
      await Classroom.findOne({
        code: classroomCode,
        privacy: "private",
      });

    if (!classroom) {
      return NextResponse.json(
        {
          message:
            "Invalid classroom code",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // CHECK MEMBER
    // =========================

    const userId =
      session.user.id;

    const alreadyMember =
      classroom.members.some(
        (member) =>
          member.toString() ===
          userId.toString()
      );

    if (alreadyMember) {
      return NextResponse.json({
        message:
          "You are already a member",
        classroom,
      });
    }

    // =========================
    // ADD MEMBER
    // =========================

    classroom.members.push(userId);

    await classroom.save();

    return NextResponse.json({
      message:
        "Successfully joined classroom",
      classroom,
    });
  } catch (error) {
    console.error(
      "JOIN CLASSROOM ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to join classroom",
      },
      {
        status: 500,
      }
    );
  }
}