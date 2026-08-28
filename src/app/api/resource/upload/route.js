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
  const fileName =
    file.name?.toLowerCase() || "";

  const mimeType =
    file.type?.toLowerCase() || "";

  // IMAGE
  if (
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(
      fileName
    )
  ) {
    return "image";
  }

  // VIDEO
  if (
    mimeType.startsWith("video/") ||
    /\.(mp4|webm|mov)$/i.test(
      fileName
    )
  ) {
    return "video";
  }

  // PDF
  if (fileName.endsWith(".pdf")) {
    return "pdf";
  }

  // DOCUMENTS
  if (fileName.endsWith(".doc")) {
    return "doc";
  }

  if (fileName.endsWith(".docx")) {
    return "docx";
  }

  // PRESENTATIONS
  if (fileName.endsWith(".ppt")) {
    return "ppt";
  }

  if (fileName.endsWith(".pptx")) {
    return "pptx";
  }

  return "other";
}

// ========================================
// CLOUDINARY UPLOAD
// ========================================

async function uploadToCloudinary(
  buffer,
  resourceType
) {
  let cloudinaryResourceType = "raw";

  // IMAGE
  if (resourceType === "image") {
    cloudinaryResourceType = "image";
  }

  // VIDEO
  if (resourceType === "video") {
    cloudinaryResourceType = "video";
  }

  console.log(
    "CLOUDINARY RESOURCE TYPE:",
    cloudinaryResourceType
  );

  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              "classshare/resources",

            resource_type:
              cloudinaryResourceType,

            use_filename: true,

            unique_filename: true,
          },

          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            console.log(
              "CLOUDINARY UPLOAD RESULT:",
              {
                resource_type:
                  result.resource_type,

                secure_url:
                  result.secure_url,

                public_id:
                  result.public_id,

                format:
                  result.format,
              }
            );

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

    // ========================================
    // CONVERT FILE → BUFFER
    // ========================================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // ========================================
    // DETECT FILE TYPE
    // ========================================

    const type =
      getResourceType(file);

    console.log(
      "UPLOADING FILE:",
      {
        name: file.name,
        mimeType: file.type,
        detectedType: type,
      }
    );

    // ========================================
    // UPLOAD TO CLOUDINARY
    // ========================================

    const uploadResult =
      await uploadToCloudinary(
        buffer,
        type
      );

    // ========================================
    // SAVE RESOURCE
    // ========================================

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

        size:
          file.size,
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

        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}