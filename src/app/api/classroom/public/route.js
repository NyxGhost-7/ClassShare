import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import redis from "@/lib/redis";

const CACHE_KEY = "public:classrooms";

export async function GET() {
  try {
    console.log("🔍 Checking Redis...");

    // ==========================================
    // 1. Get public classroom IDs from Redis
    // ==========================================

    const redisIds = await redis.smembers(CACHE_KEY);

    console.log("📦 Redis IDs:", redisIds);

    // ==========================================
    // 2. Connect MongoDB
    // ==========================================

    await connectDB();

    // ==========================================
    // 3. REDIS HIT
    // ==========================================

    if (redisIds?.length > 0) {
      console.log("⚡ REDIS HIT");

      const classrooms = await Classroom.find({
        _id: {
          $in: redisIds,
        },
        privacy: "public",
      })
        .populate("host", "name image")
        .sort({
          createdAt: -1,
        })
        .lean();

      console.log(
        `🏫 ${classrooms.length} public classrooms loaded`
      );

      return NextResponse.json({
        success: true,
        classrooms,
        source: "redis",
      });
    }

    // ==========================================
    // 4. REDIS MISS
    // ==========================================

    console.log("🐢 REDIS MISS");

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate("host", "name image")
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      `🍃 MongoDB returned ${classrooms.length} classrooms`
    );

    // ==========================================
    // 5. Store ONLY IDs in Redis SET
    // ==========================================

    if (classrooms.length > 0) {
      const classroomIds = classrooms.map(
        (classroom) => classroom._id.toString()
      );

      await redis.sadd(
        CACHE_KEY,
        ...classroomIds
      );

      console.log(
        "✅ Public classroom IDs stored in Redis:",
        classroomIds
      );
    }

    // ==========================================
    // 6. Response
    // ==========================================

    return NextResponse.json({
      success: true,
      classrooms,
      source: "mongodb",
    });

  } catch (error) {
    console.error(
      "❌ GET PUBLIC CLASSROOMS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
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