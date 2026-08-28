import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import Resource from "../../../../models/Resource";
import { authOptions } from "../../../../lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { classroomId } = params; // ✅ params is already an object

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }

    // Only the host can delete
    if (classroom.host.toString() !== session.user.id.toString()) {
      return NextResponse.json(
        { message: "Only the host can delete this classroom" },
        { status: 403 }
      );
    }

    // Find all resources linked to this classroom
    const resources = await Resource.find({ classroom: classroomId });

    // Delete each resource from Cloudinary
    for (const resource of resources) {
      if (resource.publicId) {
        try {
          await cloudinary.uploader.destroy(resource.publicId, {
            resource_type: resource.resourceType || "raw",
          });
        } catch (error) {
          console.error("CLOUDINARY DELETE ERROR:", error);
          // Continue deleting other resources even if one fails
        }
      }
    }

    // Remove all resource documents from DB
    await Resource.deleteMany({ classroom: classroomId });

    // Delete the classroom itself
    await Classroom.findByIdAndDelete(classroomId);

    return NextResponse.json({
      message: "Classroom and all resources deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CLASSROOM ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete classroom" },
      { status: 500 }
    );
  }
}