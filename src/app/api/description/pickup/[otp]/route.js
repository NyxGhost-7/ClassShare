import { getClientIp } from "@/lib/client-ip";
import { hashValue } from "@/lib/handoff";
import { rateLimit } from "@/lib/rate-limit";
import { connectRedis } from "@/lib/redisclient";
import { MessageSquare } from "lucide-react";
import { NextResponse } from "next/server";

export async function POST(request,{params}){
    try {
    
    const {otp} = await params;
    // console.log(otp)
    const ip =  await getClientIp(request);

    const ratelimiter = await rateLimit(
        {key : `rl:handoff:create:${ip}`,
         limit : 5,
        windowSeconds : 60*5   }
    );
    if(!ratelimiter.allowed){
        return NextResponse.json({
            message : "Too many requests cool down 😎",
            success:false
        },{
            status:429,
            headers:{
                "Retry-After":String(ratelimiter.retryAfter),
            }
        })
    }

 

    if(typeof(otp)!=String && !/^\d{6}$/.test(otp)){
        return NextResponse.json({
            success:false,
            message:"Otp must be 6 digit"
        },{
            status:400
        })

    }

    const hashedotp = hashValue(otp);

    const redis = await connectRedis();

    const key = `handoff:${hashedotp}`

    const value = await redis.get(key);

    // console.log(hashedotp , key , value)
    if(!value){
        NextResponse.json({
            success:false,
            message:"Invalid otp" 
        },{
            status:404
        })
    }
    const description = JSON.parse(value);
    // console.log(otp)
   
    return NextResponse.json({
        success:true,
       text :  description.text
    },{
        status:200
    })
   


} catch (error) {
    console.log(error)
    console.error(error + " At discription on pickup ")
    return NextResponse.json({
        success:false,
        message:"failed to pickup "
    },{
        status:500
    })
}}