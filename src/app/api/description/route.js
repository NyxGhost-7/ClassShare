import { NextResponse } from "next/server";

import { connectRedis } from "@/lib/redisclient";
import {
  generateHandoffToken,
  generateOTP,
  hashValue,
} from "@/lib/handoff";

import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { HANDOFF_CONFIG } from "@/lib/handoff-config";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    console.log(ip)
    const limiter = await rateLimit({
      key: `rl:handoff:create:${ip}`,
      limit: HANDOFF_CONFIG.CREATE_LIMIT,
      windowSeconds: HANDOFF_CONFIG.CREATE_WINDOW_SECONDS,
    });
console.log(limiter)
    if (!limiter.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many  requests",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limiter.retryAfter),
          },
        }
      );
    }

    const body = await request.json();
    console.log(body)
    const text = body.text;
    const mode = body.mode;
    console.log(text , mode)

    if (typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Text must be a string",
        },
        { status: 400 }
      );
    }

    if (text.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Text cannot be empty",
        },
        { status: 400 }
      );
    }

    // Protect your infrastructure.
    // Adjust according to your application.
    if (text.length > 100_000) {
      return NextResponse.json(
        {
          success: false,
          message: "Text is too large",
        },
        { status: 413 }
      );
    }

    if (mode !== "none" && mode !== "otp") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid handoff mode",
        },
        { status: 400 }
      );
    }


  

    

    let otp = null;
    let otpHash = null;

    if (mode === "otp") {
      otp = generateOTP();
      otpHash = hashValue(otp);
    }

  
    const redis = await connectRedis();

    const handoff = {
      text,
      mode,

      otpHash,

      otpAttempts: 0,

      verified: mode === "none",

      createdAt: Date.now(),
    };

    await redis.set(
      `handoff:${otpHash}`,
      JSON.stringify(handoff),
      {
        EX: HANDOFF_CONFIG.TTL_SECONDS,
      }
    );
    if(mode=="none"){

     await redis.set(
      `Withoutotp${mode}`, JSON.stringify(handoff))
     const Drop = redis.get(`Withoutotp${mode}`)
      return NextResponse.json({
        success:true,
        Drop,
        mode
      },{status:200})
    }


    return NextResponse.json({
      success: true,

      mode,

        otp,

      expiresIn: HANDOFF_CONFIG.TTL_SECONDS,

     
      // return OTP 
      ...(mode === "otp"
        ? {
            otpRequired: true,
          }
        : {}),
    });
  } catch (error) {
    console.error("Create  error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create description",
      },
      { status: 500 }
    );
  }
}