import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import redis from "@/lib/redis";

const CACHE_KEY = "public:classrooms";

export async function GET() {
  try {
    // 1. Check Redis first
    const cachedClassrooms = await redis.get(CACHE_KEY);

    if (cachedClassrooms) {
      console.log("⚡ PUBLIC CLASSROOMS: Redis HIT");

      return NextResponse.json({
        classrooms: JSON.parse(cachedClassrooms),
        source: "redis",
      });
    }

    console.log("🐢 PUBLIC CLASSROOMS: Redis MISS");

    // 2. Redis miss → MongoDB
    await connectDB();

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate("host", "name image")
      .sort({
        createdAt: -1,
      })
      .lean();

    // 3. Store result in Redis
    await redis.set(
      CACHE_KEY,
      JSON.stringify(classrooms),
      {
        EX: 60, // cache for 60 seconds
      }
    );

    // 4. Return MongoDB result
    return NextResponse.json({
      classrooms,
      source: "mongodb",
    });
  } catch (error) {
    console.error("GET PUBLIC CLASSROOMS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch public classrooms",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}