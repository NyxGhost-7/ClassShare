import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";
import cloudinary from "../../../lib/cloudinary";
import Resource from "../../../models/Resource";
import Classroom from "../../../models/Classroom";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const classroomId = formData.get("classroomId");

    if (!file || !title || !classroomId) {
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

    const classroom =
      await Classroom.findById(classroomId);

    if (!classroom) {
      return NextResponse.json(
        {
          message: "Classroom not found",
        },
        {
          status: 404,
        }
      );
    }


    const fileName =
      file.name.toLowerCase();

    const mimeType =
      file.type.toLowerCase();

    let type = "other";

    if (
      mimeType.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif)$/i.test(
        fileName
      )
    ) {
      type = "image";
    } else if (
      mimeType.startsWith("video/") ||
      /\.(mp4|webm|mov)$/i.test(
        fileName
      )
    ) {
      type = "video";
    } else if (
      fileName.endsWith(".pdf")
    ) {
      type = "pdf";
    } else if (
      fileName.endsWith(".doc")
    ) {
      type = "doc";
    } else if (
      fileName.endsWith(".docx")
    ) {
      type = "docx";
    } else if (
      fileName.endsWith(".ppt")
    ) {
      type = "ppt";
    } else if (
      fileName.endsWith(".pptx")
    ) {
      type = "pptx";
    }


    let cloudinaryResourceType = "raw";

    if (type === "image") {
      cloudinaryResourceType = "image";
    }

    if (type === "video") {
      cloudinaryResourceType = "video";
    }


    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);
console.log("🔥 NEW UPLOAD ROUTE IS RUNNING");

    const uploadResult =
      await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                resource_type:
                  cloudinaryResourceType,

                folder:
                  "classshare/resources",

                // Keep original filename
                use_filename: true,

                unique_filename: true,
              },

              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(buffer);
          console.log({
  fileName: file.name,
  mimeType: file.type,
  type,
  cloudinaryResourceType,
});
        }
      );
      console.log("🔥 NEW UPLOAD ROUTE IS RUNNING");

    const resource =
      await Resource.create({
        title: title.trim(),

        description:
          description?.trim() || "",

        type,

        url:
          uploadResult.secure_url,

        classroomId,

        size:
          file.size,

        expiresAt: new Date(
          Date.now() +
            30 *
              24 *
              60 *
              60 *
              1000
        ),
      });
console.log("CLOUDINARY RESULT:", {
  resource_type: result?.resource_type,
  secure_url: result?.secure_url,
  format: result?.format,
});
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
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "File upload failed",

        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}