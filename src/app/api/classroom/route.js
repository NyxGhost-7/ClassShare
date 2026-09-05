import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../lib/mongodb";
import Classroom from "../../../models/Classroom";
import { authOptions } from "../../../lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const code = searchParams.get("code");
    const id = searchParams.get("id");

    // =========================
    // GET CLASSROOM BY ID
    // =========================

    if (id) {
      const classroom = await Classroom.findById(id)
        .populate("host", "name email image")
        .populate("members", "name email image");

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

      // =========================
      // PUBLIC CLASSROOM
      // No login required
      // =========================

      if (classroom.privacy === "public") {
        return NextResponse.json({
          classroom,
        });
      }

      // =========================
      // PRIVATE CLASSROOM
      // Login required
      // =========================

      const session =
        await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json(
          {
            message:
              "You must be logged in to access this private classroom",
          },
          {
            status: 401,
          }
        );
      }

      const userId =
        session.user.id.toString();

      const isHost =
        classroom.host._id.toString() ===
        userId;

      const isMember =
        classroom.members.some(
          (member) =>
            member._id.toString() ===
            userId
        );

      if (!isHost && !isMember) {
        return NextResponse.json(
          {
            message:
              "You are not a member of this classroom",
          },
          {
            status: 403,
          }
        );
      }

      return NextResponse.json({
        classroom,
      });
    }

    // =========================
    // FIND BY CODE
    // =========================

    if (code) {
      const session =
        await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json(
          {
            message:
              "You must be logged in to access a classroom by code",
          },
          {
            status: 401,
          }
        );
      }

      const classroom =
        await Classroom.findOne({
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

      const userId =
        session.user.id.toString();

      const isHost =
        classroom.host._id.toString() ===
        userId;

      const isMember =
        classroom.members.some(
          (member) =>
            member._id.toString() ===
            userId
        );

      if (!isHost && !isMember) {
        return NextResponse.json(
          {
            message:
              "You are not a member of this classroom",
          },
          {
            status: 403,
          }
        );
      }

      return NextResponse.json({
        classroom,
      });
    }

    // =========================
    // GET ALL USER CLASSROOMS
    // /api/classroom
    // =========================

    const session =
      await getServerSession(authOptions);

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

    const classrooms =
      await Classroom.find({
        $or: [
          {
            host: session.user.id,
          },
          {
            members: session.user.id,
          },
        ],
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "host",
          "name email image"
        );

    return NextResponse.json({
      classrooms,
    });
  } catch (error) {
    console.error(
      "GET CLASSROOM ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch classroom",
      },
      {
        status: 500,
      }
    );
  }
}