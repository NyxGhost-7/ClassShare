
import { NextResponse } from "next/server";

import { after } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import redis from "@/lib/redis";

const CACHE_KEY = "public:classrooms";
const CACHE_TTL = 60;

// Escape special regex characters
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Get all public classrooms from MongoDB
async function getPublicClassrooms() {
  return Classroom.find({
    privacy: "public",
  })
    .populate("host", "name image")
    .sort({ createdAt: -1 })
    .lean();
}

// Get classroom from MongoDB by search
async function searchMongoDB(search) {
  await connectDB();

  if (!search) {
    return getPublicClassrooms();
  }

  const regex = new RegExp(escapeRegex(search), "i");

  return Classroom.find({
    privacy: "public",
    $or: [
      { name: regex },
      { code: regex },
      { _id: search.match(/^[a-f\d]{24}$/i) ? search : null },
    ],
  })
    .populate("host", "name image")
    .sort({ createdAt: -1 })
    .lean();
}

// Save classrooms in Redis
async function updateRedisCache(classrooms) {
  await redis.set(
    CACHE_KEY,
    JSON.stringify(classrooms),
    { ex: CACHE_TTL }
  );
}

// Read Redis cache
async function getRedisCache() {
  const data = await redis.get(CACHE_KEY);

  if (data === null || data === undefined) {
    return null;
  }

  return typeof data === "string"
    ? JSON.parse(data)
    : data;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    let cachedClassrooms = null;

    // STEP 1: Search Redis
    try {
      cachedClassrooms = await getRedisCache();
    } catch (error) {
      console.error("REDIS GET ERROR:", error);
    }

    if (cachedClassrooms !== null) {
      console.log("REDIS CACHE HIT");

      // STEP 2: Search inside Redis data
      const filteredClassrooms = search
        ? cachedClassrooms.filter((classroom) => {
            const value = search.toLowerCase();

            return (
              classroom.name?.toLowerCase().includes(value) ||
              classroom.code?.toLowerCase().includes(value) ||
              classroom._id?.toString() === search
            );
          })
        : cachedClassrooms;

      // If found in Redis, return immediately
      if (filteredClassrooms.length > 0 || !search) {
        return NextResponse.json({
          success: true,
          classrooms: filteredClassrooms,
          source: "redis",
        });
      }

      console.log("CLASSROOM NOT FOUND IN REDIS");
    } else {
      console.log("REDIS CACHE MISS");
    }

    // STEP 3: Search MongoDB if Redis misses
    console.log("SEARCHING MONGODB...");

    const classrooms = await searchMongoDB(search);

    // STEP 4: Update Redis cache
    // Only cache the complete public classroom list.
    if (!search) {
      try {
        await updateRedisCache(classrooms);
        console.log("REDIS CACHE UPDATED");
      } catch (error) {
        console.error("REDIS SET ERROR:", error);
      }
    } else if (classrooms.length > 0) {
      // Refresh the complete cache in background
      after(async () => {
        try {
          const allClassrooms = await getPublicClassrooms();
          await updateRedisCache(allClassrooms);
          console.log("REDIS CACHE REFRESHED");
        } catch (error) {
          console.error("BACKGROUND CACHE ERROR:", error);
        }
      });
    }

    // STEP 5: Return MongoDB result
    return NextResponse.json({
      success: true,
      classrooms,
      source: "mongodb",
    });

  } catch (error) {
    console.error("PUBLIC CLASSROOM API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch public classrooms",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
