
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import User from "../../../../models/User";
import redis from "@/lib/redis";
import { authOptions } from "../../../../lib/auth";

const CACHE_KEY = "public:classrooms";
const CACHE_TTL = 60;

function generateCode() {
  return (
    "CLS-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}

export async function POST(request) {
  try {
    await connectDB();

    // -----------------------------------------
    // 1. Authentication
    // -----------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------------
    // 2. Find user
    // -----------------------------------------

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // 3. Read request body
    // -----------------------------------------

    const {
      name,
      description,
      privacy,
    } = await request.json();

    // -----------------------------------------
    // 4. Validation
    // -----------------------------------------

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Classroom name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!["public", "private"].includes(privacy)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid classroom privacy",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // 5. Generate private classroom code
    // -----------------------------------------

    let code;

    if (privacy === "private") {
      code = generateCode();

      while (await Classroom.exists({ code })) {
        code = generateCode();
      }
    }

    // -----------------------------------------
    // 6. Create classroom in MongoDB
    // -----------------------------------------

    const classroom = await Classroom.create({
      name: name.trim(),

      description:
        description?.trim() || "",

      host: user._id,

      privacy,

      ...(code && { code }),

      members: [user._id],
    });

    console.log(
      "✅ Classroom created:",
      classroom._id.toString()
    );

    // -----------------------------------------
    // 7. Update Redis only for public classroom
    // -----------------------------------------

    if (classroom.privacy === "public") {
      try {
        console.log(
          "⚡ Updating public classroom cache..."
        );

        const cached = await redis.get(CACHE_KEY);

        let classrooms = [];

        // Redis may return string OR already parsed value
        if (cached) {
          if (typeof cached === "string") {
            try {
              classrooms = JSON.parse(cached);
            } catch (parseError) {
              console.warn(
                "⚠️ Invalid Redis cache. Resetting cache."
              );

              classrooms = [];
            }
          } else if (Array.isArray(cached)) {
            classrooms = cached;
          }
        }

        // -----------------------------------------
        // 8. Prepare classroom for public cache
        // -----------------------------------------

        const publicClassroom = {
          _id: classroom._id.toString(),

          name: classroom.name,

          description: classroom.description,

          privacy: classroom.privacy,

          members: classroom.members.map((id) =>
            id.toString()
          ),

          host: {
            _id: user._id.toString(),
            name: user.name,
            image: user.image || null,
          },

          createdAt: classroom.createdAt,
          updatedAt: classroom.updatedAt,
        };

        // -----------------------------------------
        // 9. Remove duplicate
        // -----------------------------------------

        classrooms = classrooms.filter(
          (item) =>
            String(item?._id) !==
            String(publicClassroom._id)
        );

        // -----------------------------------------
        // 10. Newest classroom first
        // -----------------------------------------

        classrooms.unshift(publicClassroom);

        // -----------------------------------------
        // 11. Save cache
        // -----------------------------------------

        await redis.set(
          CACHE_KEY,
          JSON.stringify(classrooms),
          {
            EX: CACHE_TTL,
          }
        );

        console.log(
          "✅ Public classroom cache updated"
        );
      } catch (redisError) {
        // -----------------------------------------
        // Redis failure should NOT fail classroom creation
        // -----------------------------------------

        console.error(
          "⚠️ Redis cache update failed:",
          redisError
        );
      }
    }

 
    return NextResponse.json(
      {
        success: true,

        message:
          "Classroom created successfully",

        classroom,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "❌ CREATE CLASSROOM ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to create classroom",

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
