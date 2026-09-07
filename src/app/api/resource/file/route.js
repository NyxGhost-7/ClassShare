
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { connectDB } from "../../../../lib/mongodb";
import { authOptions } from "../../../../lib/auth";

import Resource from "../../../../models/Resource";
import Classroom from "../../../../models/Classroom";

function sanitizeFileName(name) {
  if (!name) {
    return "download";
  }

  return String(name)
    // Remove path traversal
    .replace(/\.\./g, "")
    // Remove dangerous filename characters
    .replace(/[\/\\?%*:|"<>]/g, "-")
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F]/g, "")
    // Collapse spaces
    .replace(/\s+/g, " ")
    .trim()
    // Prevent empty result
    .slice(0, 180) || "download";
}





export async function GET(request) {
  try {
    await connectDB();

  
    const session =
      await getServerSession(
        authOptions
      );

    const userId =
      session?.user?.id
        ? session.user.id.toString()
        : null;

    const { searchParams } =
      new URL(request.url);

    const resourceId =
      searchParams.get("id");

    const download =
      searchParams.get("download") ===
      "true";


    if (
      !resourceId ||
      !mongoose.Types.ObjectId.isValid(
        resourceId
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid resource ID",
        },
        {
          status: 400,
        }
      );
    }

    const resource =
      await Resource.findById(
        resourceId
      );

    if (
      !resource ||
      !resource.url
    ) {
      return NextResponse.json(
        {
          message:
            "Resource not found",
        },
        {
          status: 404,
        }
      );
    }


 

    const classroom =
      await Classroom.findById(
        resource.classroom
      );

    if (!classroom) {
      return NextResponse.json(
        {
          message:
            "Classroom not found",
        },
        {
          status: 404,
        }
      );
    }

    

    const isPublic =
      classroom.privacy ===
      "public";

    const isHost =
      Boolean(
        userId &&
        classroom.host?.toString() ===
          userId
      );

    const isMember =
      Boolean(
        userId &&
        classroom.members?.some(
          (member) =>
            member.toString() ===
            userId
        )
      );

    /*
     * Public classroom:
     * anyone can access.
     *
     * Private classroom:
     * only host/member.
     */

    if (
      !isPublic &&
      !isHost &&
      !isMember
    ) {
      return NextResponse.json(
        {
          message:
            "Access denied",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       FETCH CLOUDINARY FILE
    ===================================================== */

    const cloudinaryResponse =
      await fetch(
        resource.url,
        {
          cache: "no-store",
        }
      );

    if (
      !cloudinaryResponse.ok
    ) {
      console.error(
        "CLOUDINARY ERROR:",
        cloudinaryResponse.status
      );

      return NextResponse.json(
        {
          message:
            "Unable to fetch file",
        },
        {
          status: 502,
        }
      );
    }

    /* =====================================================
       READ FILE
    ===================================================== */

    const fileBuffer =
      await cloudinaryResponse.arrayBuffer();

    /* =====================================================
       CONTENT TYPE
    ===================================================== */

    let contentType =
      cloudinaryResponse.headers.get(
        "content-type"
      ) ||
      "application/octet-stream";

    /*
     * Explicit PDF content type
     */

    if (
      resource.type === "pdf"
    ) {
      contentType =
        "application/pdf";
    }

    /* =====================================================
       SAFE FILE NAME
    ===================================================== */

    const fileName =
      sanitizeFileName(
        resource.originalName ||
          resource.title ||
          "download"
      );

    /*
     * ASCII fallback for browsers
     */

    const asciiFileName =
      fileName
        .replace(
          /[^\x20-\x7E]/g,
          "-"
        )
        .replace(
          /"/g,
          ""
        );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return new NextResponse(
      fileBuffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            contentType,

          "Content-Disposition":
            `${
              download
                ? "attachment"
                : "inline"
            }; filename="${asciiFileName}"`,

          "Content-Length":
            fileBuffer.byteLength.toString(),

          "Cache-Control":
            "private, no-store, max-age=0",

          "X-Content-Type-Options":
            "nosniff",

          "Content-Security-Policy":
            "default-src 'none'; frame-ancestors 'self';",
        },
      }
    );
  } catch (error) {
    console.error(
      "RESOURCE FILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load resource",
      },
      {
        status: 500,
      }
    );
  }
}

