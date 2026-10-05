import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "../../../../lib/mongodb";
import Classroom from "../../../../models/Classroom";
import User from "../../../../models/User";
import redis from "@/lib/redis";
import { authOptions } from "../../../../lib/auth";

const CACHE_KEY = "public:classrooms";
const CACHE_TTL = 60;

// =========================================================
// Generate classroom code
// =========================================================

function generateCode() {
  return (
    "CLS-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}

// =========================================================
// CREATE CLASSROOM
// =========================================================

export async function POST(request) {
  try {
    // -----------------------------------------------------
    // 1. Connect MongoDB
    // -----------------------------------------------------

    await connectDB();

    // -----------------------------------------------------
    // 2. Get session
    // -----------------------------------------------------

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------------------------
    // 3. Find user
    // -----------------------------------------------------

    const user = await User.findById(
      session.user.id
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------------------
    // 4. Get request body
    // -----------------------------------------------------

    const {
      name,
      description,
      privacy,
    } = await request.json();

    // -----------------------------------------------------
    // 5. Validate name
    // -----------------------------------------------------

    if (!name?.trim()) {
      return NextResponse.json(
        {
          message:
            "Classroom name is required",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------------------
    // 6. Validate privacy
    // -----------------------------------------------------

    if (
      !["public", "private"].includes(
        privacy
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid classroom privacy",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------------------
    // 7. Generate code for private classroom
    // -----------------------------------------------------

    let code;

    if (privacy === "private") {
      code = generateCode();

      while (
        await Classroom.exists({ code })
      ) {
        code = generateCode();
      }
    }

    // -----------------------------------------------------
    // 8. Create classroom in MongoDB
    // -----------------------------------------------------

    const classroom =
      await Classroom.create({
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

    // =====================================================
    // 9. STORE PUBLIC CLASSROOM IN REDIS
    // =====================================================

    if (privacy === "public") {
      console.log(
        "⚡ Updating Redis cache..."
      );

      // Get existing Redis cache
      const cached =
        await redis.get(CACHE_KEY);

      let classrooms = [];

      if (cached) {
        classrooms =
          typeof cached === "string"
            ? JSON.parse(cached)
            : cached;
      }

      // ---------------------------------------------------
      // Create object in SAME format as GET API
      // ---------------------------------------------------

      const publicClassroom = {
        _id: classroom._id.toString(),

        name: classroom.name,

        description:
          classroom.description,

        privacy: classroom.privacy,

        members:
          classroom.members.map((id) =>
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

      classrooms =
        classrooms.filter(
          (item) =>
            String(item._id) !==
            String(publicClassroom._id)
        );

   
      classrooms.unshift(
        publicClassroom
      );

      await redis.set(
        CACHE_KEY,
        JSON.stringify(classrooms),
        {
          EX: CACHE_TTL,
        }
      );

     
    }

 
    return NextResponse.json(
      {
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
        message:
          "Failed to create classroom",
      },
      {
        status: 500,
      }
    );
  }
}