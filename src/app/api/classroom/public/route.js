
import { NextResponse, after } from "next/server";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import redis from "@/lib/redis";

const CACHE_KEY = "public:classrooms";
const CACHE_TTL = 60;

// Fetch latest public classrooms from MongoDB
async function getPublicClassrooms() {
  return await Classroom.find({
    privacy: "public",
  })
    .populate("host", "name image")
    .sort({ createdAt: -1 })
    .lean();
}

// Store classrooms in Redis
async function updateRedisCache(classrooms) {
  await redis.set(
    CACHE_KEY,
    JSON.stringify(classrooms),
    {
      ex: CACHE_TTL,
    }
  );
}

export async function GET() {
  try {

    let cachedClassrooms = null;

    try {
      const cachedData = await redis.get(CACHE_KEY);

      if (cachedData !== null && cachedData !== undefined) {
        cachedClassrooms =
          typeof cachedData === "string"
            ? JSON.parse(cachedData)
            : cachedData;
      }
    } catch (redisError) {
      console.error("Redis GET ERROR:", redisError);
    }

 
    if (cachedClassrooms !== null) {
      console.log("Redis Cache HIT");

      // Background revalidation
      // Current response will NOT wait for MongoDB.

      after(async () => {
        try {
          await connectDB();

          const latestClassrooms =
            await getPublicClassrooms();

          // Compare Redis and MongoDB lengths
          if (
            latestClassrooms.length !==
            cachedClassrooms.length
          ) {
            console.log(
              "Classroom count changed. Updating Redis..."
            );

            await updateRedisCache(latestClassrooms);

            console.log("Redis Cache Updated");
          } else {
            console.log(
              "Redis Cache is up to date"
            );
          }

        } catch (error) {
          console.error(
            "BACKGROUND CACHE REVALIDATION ERROR:",
            error
          );
        }
      });

      // Immediately return OLD cached data
      return NextResponse.json({
        success: true,
        classrooms: cachedClassrooms,
        source: "redis",
      });
    }

    console.log("Redis Cache MISS");

    await connectDB();

    const classrooms = await getPublicClassrooms();

    // Store fresh MongoDB data in Redis
    try {
      await updateRedisCache(classrooms);

      console.log("Redis Cache Created");
    } catch (redisError) {
      console.error(
        "Redis CACHE SET ERROR:",
        redisError
      );
    }

  
    return NextResponse.json({
      success: true,
      classrooms,
      source: "mongodb",
    });

  } catch (error) {
    console.error(
      "GET PUBLIC CLASSROOMS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch public classrooms",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}
