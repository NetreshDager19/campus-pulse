import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateWeeklySummary } from "@/lib/gemini";
import { NoticeItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    // Ensure default demo user exists
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "demo-user-1",
          name: "Alex Johnson",
          email: "student@campuspulse.edu",
        },
      });
    }

    // Fetch actual saved notices for the user
    const dbNotices = await prisma.notice.findMany({
      where: { userId: user.id },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    // Map to NoticeItem type
    const notices: NoticeItem[] = dbNotices.map((n) => ({
      ...n,
      eventDate: n.eventDate ? n.eventDate.toISOString() : null,
      registrationDeadline: n.registrationDeadline ? n.registrationDeadline.toISOString() : null,
      submissionDeadline: n.submissionDeadline ? n.submissionDeadline.toISOString() : null,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      category: n.category as any,
      priority: n.priority as any,
      status: n.status as any,
      sourceType: n.sourceType as any,
    }));

    const summary = await generateWeeklySummary(notices);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: unknown) {
    console.error("Weekly Summary API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate weekly campus summary.",
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

