import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";

export async function GET() {
  try {
    console.log("PUBLIC CLASSROOMS: Connecting to MongoDB...");

    await connectDB();

    console.log("PUBLIC CLASSROOMS: MongoDB connected");

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate("host", "name image")
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      "PUBLIC CLASSROOMS: Found",
      classrooms.length,
      "classrooms"
    );

    return NextResponse.json(
      {
        classrooms,
      },
      {
        status: 200,
      }
    );
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
