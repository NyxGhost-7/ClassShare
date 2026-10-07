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


    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

 
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


    const {
      name,
      description,
      privacy,
    } = await request.json();

  
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


    let code;

    if (privacy === "private") {
      code = generateCode();

      while (
        await Classroom.exists({ code })
      ) {
        code = generateCode();
      }
    }



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

 
    if (privacy === "public") {
      console.log(
        "⚡ Updating public classroom cache..."
      );

      const cached =
        await redis.get(CACHE_KEY);

      let classrooms = [];

      if (cached) {
        classrooms =
          typeof cached === "string"
            ? JSON.parse(cached)
            : cached;
      }

  
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

      console.log(
        "New public classroom added to Redis"
      );
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