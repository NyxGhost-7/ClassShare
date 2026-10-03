import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import redis from "@/lib/redis";

const CACHE_KEY = "public:classrooms";

export async function GET() {
  try {
    console.log("1️⃣ PUBLIC CLASSROOM API START");

    // Redis GET
    console.log("2️⃣ Checking Redis...");

    const cachedClassrooms = await redis.get(CACHE_KEY);

    console.log("3️⃣ Redis GET SUCCESS");

    if (cachedClassrooms) {
      console.log("⚡ REDIS HIT");

      return NextResponse.json({
        classrooms: cachedClassrooms,
        source: "redis",
      });
    }

    console.log("🐢 REDIS MISS");

    // MongoDB
    console.log("4️⃣ Connecting MongoDB...");

    await connectDB();

    console.log("5️⃣ MongoDB connected");

    const classrooms = await Classroom.find({
      privacy: "public",
    })
      .populate("host", "name image")
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      "6️⃣ MongoDB classrooms:",
      classrooms.length
    );

    // Redis SET
    console.log("7️Saving to Redis...");

    await redis.set(
      CACHE_KEY,
      JSON.stringify(classrooms),
      {
        EX: 60,
      }
    );

    console.log("8️ Redis SET SUCCESS");

    return NextResponse.json({
      classrooms,
      source: "mongodb",
    });
  } catch (error) {
    console.error(" GET PUBLIC CLASSROOMS ERROR:", error);

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