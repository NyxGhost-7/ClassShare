import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";
import { authOptions } from "../../../../lib/auth";

import Resource from "../../../../models/Resource";
import Classroom from "../../../../models/Classroom";

export async function POST(request) {
  try {
    await connectDB();

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      description = "",
      url,
      classroomId,
    } = body;

    if (!title?.trim() || !url?.trim() || !classroomId) {
      return NextResponse.json(
        {
          message:
            "Title, URL and classroom are required",
        },
        { status: 400 }
      );
    }

    // Validate URL
    let parsedUrl;

    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return NextResponse.json(
        {
          message: "Invalid URL",
        },
        { status: 400 }
      );
    }

    // Only allow http/https
    if (
      !["http:", "https:"].includes(
        parsedUrl.protocol
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Only HTTP and HTTPS URLs are allowed",
        },
        { status: 400 }
      );
    }

    const classroom =
      await Classroom.findById(classroomId);

    if (!classroom) {
      return NextResponse.json(
        {
          message: "Classroom not found",
        },
        { status: 404 }
      );
    }

    const userId =
      session.user.id.toString();

    const isHost =
      classroom.host?.toString() === userId;

    const isMember =
      classroom.members?.some(
        (member) =>
          member.toString() === userId
      );

    if (!isHost && !isMember) {
      return NextResponse.json(
        {
          message: "Permission denied",
        },
        { status: 403 }
      );
    }

    const resource =
      await Resource.create({
        title: title.trim(),
        description: description.trim(),
        type: "link",
        url: parsedUrl.toString(),
        classroom: classroomId,
        uploadedBy: userId,
      });

    return NextResponse.json(
      {
        message: "URL added successfully",
        resource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADD URL RESOURCE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to add URL",
      },
      { status: 500 }
    );
  }
}