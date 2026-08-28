import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";

export async function GET() {
  try {
    await connectDB();

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate(
        "host",
        "name image"
      )
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      classrooms,
    });

  } catch (error) {
    console.error(
      "GET PUBLIC CLASSROOMS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch public classrooms",
      },
      {
        status: 500,
      }
    );
  }
}