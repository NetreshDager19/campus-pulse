import { NextRequest, NextResponse } from "next/server";
import { aiExtractInputSchema } from "@/lib/validations";
import { extractNoticeWithGemini } from "@/lib/gemini";

// In-memory rate limiter: max 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return true;
  }
  if (record.count >= 30) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "localhost";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before analyzing again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = aiExtractInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    const { text, sourceType } = parsed.data;

    // Call Gemini extraction
    const result = await extractNoticeWithGemini(text, sourceType);

    return NextResponse.json({
      success: true,
      data: result.data,
      isMockFallback: result.isMockFallback,
      message: result.message,
    });
  } catch (error: unknown) {
    console.error("AI Extraction Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to extract notice information.",
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

