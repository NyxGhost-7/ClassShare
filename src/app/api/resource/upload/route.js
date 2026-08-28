import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";
import Resource from "../../../../models/Resource";
import Classroom from "../../../../models/Classroom";

import { authOptions } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

export const runtime = "nodejs";

// ========================================
// DETECT FILE TYPE
// ========================================

function getResourceType(file) {
  const name =
    file.name.toLowerCase();

  const extension =
    name.split(".").pop();

  if (extension === "pdf") {
    return "pdf";
  }

  if (
    extension === "doc"
  ) {
    return "doc";
  }

  if (
    extension === "docx"
  ) {
    return "docx";
  }

  if (
    extension === "ppt"
  ) {
    return "ppt";
  }

  if (
    extension === "pptx"
  ) {
    return "pptx";
  }

  if (
    file.type.startsWith("image/")
  ) {
    return "image";
  }

  if (
    file.type.startsWith("video/")
  ) {
    return "video";
  }

  return "other";
}

// ========================================
// UPLOAD TO CLOUDINARY
// ========================================

async function uploadToCloudinary(
  buffer,
  resourceType
) {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              "classshare/resources",

            resource_type:
              resourceType === "video"
                ? "video"
                : "raw",
          },

          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

      uploadStream.end(buffer);
    }
  );
}

// ========================================
// POST FILE
// ========================================

export async function POST(request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const title =
      formData.get("title");

    const description =
      formData.get("description");

    const classroomId =
      formData.get("classroomId");

    if (!file) {
      return NextResponse.json(
        {
          message:
            "File is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!classroomId) {
      return NextResponse.json(
        {
          message:
            "Classroom ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const classroom =
      await Classroom.findById(
        classroomId
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

    const userId =
      session.user.id;

    const isHost =
      classroom.host.toString() ===
      userId.toString();

    const isMember =
      classroom.members.some(
        (member) =>
          member.toString() ===
          userId.toString()
      );

    if (!isHost && !isMember) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to upload here",
        },
        {
          status: 403,
        }
      );
    }

    // Convert File → Buffer

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const type =
      getResourceType(file);

    const uploadResult =
      await uploadToCloudinary(
        buffer,
        type
      );

    const resource =
      await Resource.create({
        title:
          title?.trim() ||
          file.name,

        description:
          description?.trim() || "",

        type,

        url:
          uploadResult.secure_url,

        publicId:
          uploadResult.public_id,

        classroom:
          classroomId,

        uploadedBy:
          userId,
      });

    return NextResponse.json(
      {
        message:
          "Resource uploaded successfully",

        resource,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "UPLOAD RESOURCE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to upload resource",
      },
      {
        status: 500,
      }
    );
  }
}