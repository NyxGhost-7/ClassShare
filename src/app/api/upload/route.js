import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../lib/mongodb";
import { authOptions } from "../../../lib/auth";

import cloudinary from "../../../lib/cloudinary";
import Resource from "../../../models/Resource";
import Classroom from "../../../models/Classroom";

function getResourceType(file) {
  const fileName =
    file.name?.toLowerCase() || "";

  const mimeType =
    file.type?.toLowerCase() || "";

  // IMAGE
  if (
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)
  ) {
    return "image";
  }

  // VIDEO
  if (
    mimeType.startsWith("video/") ||
    /\.(mp4|webm|mov)$/i.test(fileName)
  ) {
    return "video";
  }

  // DOCUMENTS
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


async function uploadToCloudinary(
  buffer,
  resourceType,
  originalFileName
) {


  let cloudinaryResourceType = "raw";

  // IMAGE
  if (resourceType === "image") {
    cloudinaryResourceType = "image";
  }

  // PDF
  else if (resourceType === "pdf") {
    cloudinaryResourceType = "pdf";
  }

  // VIDEO
  else if (resourceType === "video") {
    cloudinaryResourceType = "video";
  }

  let publicId;

  /*
   * RAW FILES ONLY
   *
   * Examples:
   * document.docx
   * presentation.pptx
   *
   * → document-1750000000000.docx
   * → presentation-1750000000000.pptx
   *
   * IMPORTANT:
   * PDF is NOT handled here because PDF is uploaded
   * as an image resource.
   */

  if (cloudinaryResourceType === "raw") {
    const extension =
      originalFileName.includes(".")
        ? "." +
          originalFileName
            .split(".")
            .pop()
            .toLowerCase()
        : "";

    const baseName =
      originalFileName
        .replace(/\.[^/.]+$/, "")
        .replace(
          /[^a-zA-Z0-9-_]/g,
          "-"
        )
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    publicId =
      `${baseName || "file"}-${Date.now()}${extension}`;
  }

  console.log(
    "CLOUDINARY RESOURCE TYPE:",
    cloudinaryResourceType
  );

  console.log(
    "CLOUDINARY PUBLIC ID:",
    publicId
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

            /*
             * Only RAW files get our custom
             * public_id.
             *
             * PDF/image/video let Cloudinary
             * generate the public_id.
             */

            ...(publicId && {
              public_id: publicId,
            }),

            use_filename:
              cloudinaryResourceType !== "raw",

            unique_filename:
              cloudinaryResourceType !== "raw",
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


export async function POST(request) {
  try {
    await connectDB();

    /*
     * AUTHENTICATION
     */

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * FORM DATA
     */

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

    /*
     * VALIDATION
     */

    if (
      !file ||
      !title ||
      !classroomId
    ) {
      return NextResponse.json(
        {
          message:
            "File, title and classroom are required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * FILE SIZE
     *
     * 10 MB maximum
     */

    if (file.size > 10 * 1024 * 1024) {
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

    /*
     * FIND CLASSROOM
     */

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

    /*
     * AUTHORIZATION
     *
     * Host or member can upload.
     */

    const userId =
      session.user.id.toString();

    const isHost =
      classroom.host
        .toString() === userId;

    const isMember =
      classroom.members?.some(
        (member) =>
          member.toString() === userId
      );

    if (!isHost && !isMember) {
      return NextResponse.json(
        {
          message:
            "You do not have permission to upload resources",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * DETERMINE FILE TYPE
     */

    const type =
      getResourceType(file);

    let cloudinaryResourceType =
      "raw";

    if (type === "image") {
      cloudinaryResourceType =
        "image";
    }

    if (type === "video") {
      cloudinaryResourceType =
        "video";
    }

    console.log(
      "UPLOAD DETAILS:",
      {
        fileName: file.name,
        mimeType: file.type,
        type,
        cloudinaryResourceType,
        size: file.size,
      }
    );

    /*
     * FILE BUFFER
     */

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    /*
     * CLOUDINARY UPLOAD
     */

    const uploadResult =
      await uploadToCloudinary(
        buffer,
        type,
        file.name
      );

    /*
     * CREATE RESOURCE
     */

    const resource =
      await Resource.create({
        title:
          title.trim(),

        description:
          description?.trim() || "",

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
          userId,

        size:
          file.size,

        expiresAt:
          new Date(Date.now() +30 *24 *60 *60 *1000),
      });

    console.log(
      "RESOURCE CREATED:",
      resource._id
    );

    /*
     * SUCCESS
     */

    return NextResponse.json(
      {
        message: "File uploaded successfully", resource,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "File upload failed",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}