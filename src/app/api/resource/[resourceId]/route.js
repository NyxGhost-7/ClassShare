import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";

import Resource from "../../../../models/Resource";
import Classroom from "../../../../models/Classroom";

import { authOptions } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

export async function DELETE(
  request,
  { params }
) {
  try {
    const session =
      await getServerSession(authOptions);

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

    await connectDB();

    const { resourceId } =
      await params;

    const resource =
      await Resource.findById(
        resourceId
      );

    if (!resource) {
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

    const userId =
      session.user.id;

    const isHost =
      classroom.host.toString() ===
      userId.toString();

    const isUploader =
      resource.uploadedBy.toString() ===
      userId.toString();

    if (!isHost && !isUploader) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to delete this resource",
        },
        {
          status: 403,
        }
      );
    }

    // =============================
    // DELETE FROM CLOUDINARY
    // =============================

    if (resource.publicId) {
      let resourceType = "raw";

      if (
        resource.type === "image"
      ) {
        resourceType = "image";
      }

      if (
        resource.type === "video"
      ) {
        resourceType = "video";
      }

      await cloudinary.uploader.destroy(
        resource.publicId,
        {
          resource_type:
            resourceType,
        }
      );
    }

    // =============================
    // DELETE FROM DATABASE
    // =============================

    await Resource.findByIdAndDelete(
      resourceId
    );

    return NextResponse.json({
      message:
        "Resource deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE RESOURCE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to delete resource",
      },
      {
        status: 500,
      }
    );
  }
}