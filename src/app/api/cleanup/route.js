import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";
import Resource from "../../../models/Resource";
import cloudinary from "../../../lib/cloudinary";

export async function GET(request) {
  try {
    await connectDB();

    // Find resources that have expired
    const expiredResources = await Resource.find({
      expiresAt: {
        $lte: new Date(),
      },
    });

    for (const resource of expiredResources) {
      try {
        // Extract Cloudinary public ID from URL
        const url = resource.url;

        const parts = url.split("/upload/");

        if (parts.length > 1) {
          let publicId = parts[1];

          // Remove transformations/version
          publicId = publicId.replace(
            /^v\d+\//,
            ""
          );

          // Remove file extension
          publicId = publicId.replace(
            /\.[^/.]+$/,
            ""
          );

          await cloudinary.uploader.destroy(
            publicId,
            {
              resource_type: "raw",
            }
          );
        }
      } catch (error) {
        console.error(
          "Cloudinary deletion error:",
          error
        );
      }

      // Delete MongoDB record
      await Resource.findByIdAndDelete(
        resource._id
      );
    }

    return NextResponse.json({
      success: true,
      deleted: expiredResources.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Cleanup failed",
      },
      {
        status: 500,
      }
    );
  }
}