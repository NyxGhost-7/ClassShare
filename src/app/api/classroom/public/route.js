import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import User from "../../../../models/User";

export async function GET() {
  try {
    await connectDB();

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate("host", "name image")
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      classrooms,
    });
  } catch (error) {
    console.error("GET PUBLIC CLASSROOMS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch public classrooms",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
