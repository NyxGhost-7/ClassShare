
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";
import { authOptions } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

import Resource from "../../../../models/Resource";
import Classroom from "../../../../models/Classroom";

export const runtime = "nodejs";


function getResourceType(file) {
  const fileName =
    file.name?.toLowerCase() || "";

  const mimeType =
    file.type?.toLowerCase() || "";

  // Images
  if (
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(
      fileName
    )
  ) {
    return "image";
  }

  // Videos
  if (
    mimeType.startsWith("video/") ||
    /\.(mp4|webm|mov|mkv)$/i.test(
      fileName
    )
  ) {
    return "video";
  }

  // Documents
  if (fileName.endsWith(".pdf")) {
    return "pdf";
  }

  if (fileName.endsWith(".doc")) {
    return "doc";
  }

  if (fileName.endsWith(".docx")) {
    return "docx";
  }

  if (fileName.endsWith(".ppt")) {
    return "ppt";
  }

  if (fileName.endsWith(".pptx")) {
    return "pptx";
  }

  return "other";
}


function createPublicId(fileName) {
  const extension = fileName.includes(".")
    ? "." +
      fileName
        .split(".")
        .pop()
        .toLowerCase()
    : "";

  const baseName =
    fileName
      .replace(/\.[^/.]+$/, "")
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      )
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  return `${baseName || "file"}-${Date.now()}${extension}`;
}

async function uploadToCloudinary(
  buffer,
  resourceType,
  originalFileName
) {
  /*
   * Cloudinary:
   *
   * image → images + PDFs
   * video → videos
   * raw   → DOC/DOCX/PPT/PPTX/etc.
   */

  let cloudinaryResourceType =
    "raw";

  // IMAGE
  if (resourceType === "image") {
    cloudinaryResourceType = "image";
  }

  // PDF
  else if (resourceType === "pdf") {
    cloudinaryResourceType = "image";
  }

  // VIDEO
  else if (resourceType === "video") {
    cloudinaryResourceType = "video";
  }

  let publicId;

  /*
   * Only raw files receive a custom
   * public_id with their extension.
   */

  if (
    cloudinaryResourceType === "raw"
  ) {
    publicId =
      createPublicId(
        originalFileName
      );
  }

  console.log(
    "CLOUDINARY UPLOAD:",
    {
      detectedType: resourceType,
      cloudinaryResourceType,
      publicId,
    }
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

            ...(publicId && {
              public_id: publicId,
            }),

            /*
             * Raw:
             * use our own public ID
             *
             * Image/video:
             * Cloudinary generates ID
             */

            use_filename:
              cloudinaryResourceType !==
              "raw",

            unique_filename:
              cloudinaryResourceType !==
              "raw",
          },

          (error, result) => {
            if (error) {
              console.error(
                "CLOUDINARY UPLOAD ERROR:",
                error
              );

              reject(error);
              return;
            }

            console.log(
              "CLOUDINARY UPLOAD SUCCESS:",
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


export async function POST(
  request
) {
  try {
    await connectDB();
    const session =
      await getServerSession(
        authOptions
      );

  let userId = session?.user?.id
  ? session.user.id.toString()
  : null;

    if (session?.user?.id) {
      userId =session?.user?.id
  ? session.user.id.toString()
  : null;
    }

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const title =
      formData.get("title");

    const description =
      formData.get(
        "description"
      ) || "";

    const classroomId =
      formData.get(
        "classroomId"
      );

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

    if (
      !title ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Title is required",
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

    const MAX_FILE_SIZE =
      10 * 1024 * 1024;

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          message:
            "File size must be less than 10MB",
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

    if (
      !isPublic &&
      !isHost &&
      !isMember
    ) {
      return NextResponse.json(
        {
          message:
            "You must be a member of this private classroom to upload resources",
        },
        {
          status: 403,
        }
      );
    }

    const type =
      getResourceType(file);

    console.log(
      "UPLOAD DETAILS:",
      {
        fileName:
          file.name,

        mimeType:
          file.type,

        detectedType:
          type,

        size:
          file.size,

        authenticatedUser:
          userId || "anonymous",

        classroomPrivacy:
          classroom.privacy,
      }
    );

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const uploadResult =
      await uploadToCloudinary(
        buffer,
        type,
        file.name
      );


    if (
      !uploadResult?.secure_url ||
      !uploadResult?.public_id
    ) {
      console.error(
        "INVALID CLOUDINARY RESPONSE:",
        uploadResult
      );

      return NextResponse.json(
        {
          message:
            "Cloudinary upload completed but returned invalid file information",
        },
        {
          status: 500,
        }
      );
    }

    const resource =
      await Resource.create({
        title:
          title.trim(),

        description:
          description.trim(),

        type,

        url:
          uploadResult.secure_url,

        publicId:
          uploadResult.public_id,

        resourceType:
          uploadResult.resource_type,

        originalName:
          file.name,

        classroom:
          classroomId,

 

        uploadedBy:
          userId || null,

        size:
          file.size,

        expiresAt:
          new Date(
            Date.now() +
              30 *
                24 *
                60 *
                60 *
                1000
          ),
      });

    console.log(
      "RESOURCE CREATED:",
      {
        id:
          resource._id,

        title:
          resource.title,

        type:
          resource.type,

        originalName:
          resource.originalName,

        publicId:
          resource.publicId,

        resourceType:
          resource.resourceType,

        uploadedBy:
          resource.uploadedBy ||
          "anonymous",
      }
    );

    return NextResponse.json(
      {
        message:
          "File uploaded successfully",

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
          error.message ||
          "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}


