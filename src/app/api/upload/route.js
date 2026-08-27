import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Resource from "@/models/Resources";
import Classroom from "@/models/Classroom";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const classroomId = formData.get("classroomId");

    /* ================= VALIDATION ================= */

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

    /* ================= CLASSROOM CHECK ================= */

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

    /* ================= FILE → BUFFER ================= */

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /* ================= CLOUDINARY UPLOAD ================= */

    const uploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "classshare",
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
      }
    );

    /* ================= DETECT FILE TYPE ================= */

    const fileName = file.name.toLowerCase();

    let type = "file";

    if (fileName.endsWith(".pdf")) {
      type = "pdf";
    } else if (fileName.endsWith(".doc")) {
      type = "doc";
    } else if (fileName.endsWith(".docx")) {
      type = "docx";
    } else if (fileName.endsWith(".ppt")) {
      type = "ppt";
    } else if (fileName.endsWith(".pptx")) {
      type = "pptx";
    } else if (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png")
    ) {
      type = "image";
    }

    /* ================= SAVE RESOURCE ================= */

    const resource = await Resource.create({
      title: title.trim(),
      description: description?.trim() || "",
      type,

      url: uploadResult.secure_url,

      classroomId,

      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    });

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        resource,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

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