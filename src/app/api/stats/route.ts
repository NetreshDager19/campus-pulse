import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DashboardStats } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
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

    const notices = await prisma.notice.findMany({
      where: { userId: user.id },
    });

    const now = new Date();

    let totalNotices = notices.length;
    let upcomingEvents = 0;
    let pendingDeadlines = 0;
    let urgentNotices = 0;
    let completedNotices = 0;
    const categoryBreakdown: Record<string, number> = {};

    for (const n of notices) {
      // Category count
      categoryBreakdown[n.category] = (categoryBreakdown[n.category] || 0) + 1;

      if (n.isCompleted) {
        completedNotices++;
        continue; // Do not count completed towards pending/urgent
      }

      if (n.priority === "URGENT") {
        urgentNotices++;
      }

      if (n.eventDate && n.eventDate >= now) {
        upcomingEvents++;
      }

      if (
        (n.submissionDeadline && n.submissionDeadline >= now) ||
        (n.registrationDeadline && n.registrationDeadline >= now)
      ) {
        pendingDeadlines++;
      }
    }

    const stats: DashboardStats = {
      totalNotices,
      upcomingEvents,
      pendingDeadlines,
      urgentNotices,
      completedNotices,
      categoryBreakdown,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: unknown) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

