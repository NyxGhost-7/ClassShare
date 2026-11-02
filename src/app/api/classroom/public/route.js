
import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";

export async function GET() {
  try {
    await connectDB();

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate("host", "name image")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      classrooms,
      source: "mongodb",
    });
  } catch (error) {
    console.error("GET PUBLIC CLASSROOMS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch public classrooms",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
