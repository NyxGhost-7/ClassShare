import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../lib/mongodb";
import { authOptions } from "../../../lib/auth";

import Resource from "../../../models/Resource";
import Classroom from "../../../models/Classroom";

import cloudinary from "../../../lib/cloudinary";


// ========================================
// GET RESOURCES
// ========================================

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const classroomId =
      searchParams.get("classroomId");

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

    const resources =
      await Resource.find({
        classroom: classroomId,
      })
        .populate(
          "uploadedBy",
          "name email image"
        )
        .sort({
          createdAt: -1,
        });

    return NextResponse.json({
      resources,
    });

  } catch (error) {

    console.error(
      "GET RESOURCES ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch resources",
      },
      {
        status: 500,
      }
    );
  }
}


// ========================================
// DELETE RESOURCE
// ========================================

export async function DELETE(request) {
  try {

    // =========================
    // DATABASE
    // =========================

    await connectDB();


    // =========================
    // AUTHENTICATION
    // =========================

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }


    // =========================
    // RESOURCE ID
    // =========================

    const { searchParams } =
      new URL(request.url);

    const resourceId =
      searchParams.get("id");

    if (!resourceId) {
      return NextResponse.json(
        {
          message:
            "Resource ID is required",
        },
        {
          status: 400,
        }
      );
    }


    // =========================
    // FIND RESOURCE
    // =========================

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


    // =========================
    // FIND CLASSROOM
    // =========================

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


    // =========================
    // PERMISSION CHECK
    // =========================

    const userId =
      session.user.id.toString();

    const isUploader =
      resource.uploadedBy.toString() ===
      userId;

    const isHost =
      classroom.host.toString() ===
      userId;


    if (!isUploader && !isHost) {
      return NextResponse.json(
        {
          message:
            "You do not have permission to delete this resource",
        },
        {
          status: 403,
        }
      );
    }


    // =========================
    // DELETE FROM CLOUDINARY
    // =========================

    /*
      Links are not stored in Cloudinary.

      Only uploaded files have publicId.
    */

    if (resource.publicId) {
      try {

        await cloudinary.uploader.destroy(
          resource.publicId,
          {
            resource_type:
              resource.resourceType ||
              "raw",
          }
        );

      } catch (cloudinaryError) {

        console.error(
          "CLOUDINARY DELETE ERROR:",
          cloudinaryError
        );

        /*
          We do NOT immediately stop here.

          Sometimes the Cloudinary file
          might already be deleted but the
          MongoDB record still exists.
        */
      }
    }


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