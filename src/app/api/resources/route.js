import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Classroom from "@/models/Classroom";
import Resource from "@/models/Resources";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const classroomId =
      searchParams.get("classroomId");

    if (!classroomId) {
      return NextResponse.json(
        {
          message: "Classroom ID is required",
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

    const resources = await Resource.find({
      classroomId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      classroom,
      resources,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch resources",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const {
      title,
      description,
      type,
      url,
      classroomId,
    } = await request.json();

    if (
      !title ||
      !type ||
      !url ||
      !classroomId
    ) {
      return NextResponse.json(
        {
          message: "Required fields are missing",
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

    const resource = await Resource.create({
      title,
      description,
      type,
      url,
      classroomId,
    });

    return NextResponse.json({
      resource,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to add resource",
      },
      {
        status: 500,
      }
    );
  }
}