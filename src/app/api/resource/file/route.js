import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";
import { authOptions } from "../../../../lib/auth";

import Resource from "../../../../models/Resource";
import Classroom from "../../../../models/Classroom";

function sanitizeFileName(name) {
  return (name || "download")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .trim()
    .slice(0, 180);
}

export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const resourceId = searchParams.get("id");
    const download = searchParams.get("download") === "true";

    if (!resourceId) {
      return NextResponse.json(
        { message: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resource = await Resource.findById(resourceId);

    if (!resource || !resource.url) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    const classroom = await Classroom.findById(
      resource.classroom
    );

    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id.toString();

    const isHost =
      classroom.host?.toString() === userId;

    const isMember =
      classroom.members?.some(
        (member) => member.toString() === userId
      );

    // Private classroom → host/member only
    if (
      classroom.privacy === "private" &&
      !isHost &&
      !isMember
    ) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // Server fetches Cloudinary
    const response = await fetch(resource.url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to fetch file" },
        { status: 502 }
      );
    }

    const fileBuffer = await response.arrayBuffer();

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    const fileName = sanitizeFileName(
      resource.originalName ||
        resource.title ||
        "download"
    );

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,

        "Content-Disposition": `${
          download ? "attachment" : "inline"
        }; filename="${fileName}"`,

        "Cache-Control":
          "private, no-store, max-age=0",

        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "RESOURCE FILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error.message || "Failed to load resource",
      },
      { status: 500 }
    );
  }
}