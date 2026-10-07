import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import User from "../../../../models/User";
import redis from "@/lib/redis";

const CACHE_KEY = "public:classrooms";

export async function GET() {
  try {
    await connectDB();

    const redisIds = await redis.smembers(CACHE_KEY);

    console.log("📦 Redis IDs:", redisIds);

    let classrooms;

    if (redisIds?.length > 0) {
      console.log("⚡ REDIS HIT");

      classrooms = await Classroom.find({
        _id: { $in: redisIds },
        privacy: "public",
      })
        .populate("host", "name image")
        .sort({ createdAt: -1 })
        .lean();
    } else {
      console.log("🐢 REDIS MISS");

      classrooms = await Classroom.find({
        privacy: "public",
      })
        .populate("host", "name image")
        .sort({ createdAt: -1 })
        .lean();

      if (classrooms.length > 0) {
        const classroomIds = classrooms.map((classroom) =>
          classroom._id.toString()
        );

        await redis.sadd(CACHE_KEY, ...classroomIds);

        console.log("✅ Cached IDs:", classroomIds);
      }
    }

    return NextResponse.json({
      success: true,
      classrooms,
      source: redisIds?.length > 0 ? "redis" : "mongodb",
    });
  } catch (error) {
    console.error("❌ GET PUBLIC CLASSROOMS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch public classrooms",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}