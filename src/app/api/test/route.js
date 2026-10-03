import  redis  from "@/lib/redis";

export async function GET() {
  await redis.set("message", "Hello Redis!");

  const message = await redis.get("message");

  return Response.json({
    message,
  });
}