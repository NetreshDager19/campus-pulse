import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNoticeSchema } from "@/lib/validations";
import { calculateNoticeStatus, safeParseDate } from "@/lib/date-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

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

    const where: any = {
      userId: user.id,
    };

    if (category && category !== "All") {
      where.category = category;
    }

    if (priority && priority !== "All") {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { venue: { contains: search } },
        { originalText: { contains: search } },
        { category: { contains: search } },
      ];
    }

    // Build orderBy
    let orderBy: any = {};
    if (sortBy === "eventDate") {
      orderBy = { eventDate: sortOrder };
    } else if (sortBy === "priority") {
      orderBy = { priority: sortOrder };
    } else {
      orderBy = { createdAt: sortOrder };
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy,
    });

    // Recompute dynamic status for each notice based on actual time
    const updatedNotices = notices.map((n) => {
      const dynamicStatus = calculateNoticeStatus({
        isCompleted: n.isCompleted,
        eventDate: n.eventDate,
        submissionDeadline: n.submissionDeadline,
        registrationDeadline: n.registrationDeadline,
      });

      return {
        ...n,
        status: dynamicStatus,
        eventDate: n.eventDate ? n.eventDate.toISOString() : null,
        registrationDeadline: n.registrationDeadline ? n.registrationDeadline.toISOString() : null,
        submissionDeadline: n.submissionDeadline ? n.submissionDeadline.toISOString() : null,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      };
    });

    // Filter by dynamic status if requested
    const filteredByStatus = status && status !== "All"
      ? updatedNotices.filter((n) => n.status.toLowerCase() === status.toLowerCase())
      : updatedNotices;

    return NextResponse.json({
      success: true,
      data: filteredByStatus,
      total: filteredByStatus.length,
    });
  } catch (error: unknown) {
    console.error("GET /api/notices error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch notices.",
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createNoticeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

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

    const data = parsed.data;

    const eventDate = safeParseDate(data.eventDate);
    const registrationDeadline = safeParseDate(data.registrationDeadline);
    const submissionDeadline = safeParseDate(data.submissionDeadline);

    const initialStatus = calculateNoticeStatus({
      isCompleted: false,
      eventDate,
      registrationDeadline,
      submissionDeadline,
    });

    const newNotice = await prisma.notice.create({
      data: {
        title: data.title,
        description: data.description,
        originalText: data.originalText,
        category: data.category,
        priority: data.priority,
        eventDate,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        venue: data.venue || null,
        registrationDeadline,
        submissionDeadline,
        status: initialStatus,
        isCompleted: false,
        sourceType: data.sourceType,
        missingInfo: data.missingInfo || null,
        instructions: data.instructions || null,
        userId: user.id,
      },
    });

    // Automatically generate in-app notification if URGENT or has deadline
    if (data.priority === "URGENT" || submissionDeadline || registrationDeadline) {
      await prisma.notification.create({
        data: {
          title: `New ${data.priority} Notice: ${data.title}`,
          message: submissionDeadline
            ? `Submission deadline set for ${data.submissionDeadline}.`
            : `Important notice added: ${data.title}`,
          type: submissionDeadline || registrationDeadline ? "DEADLINE" : "URGENT",
          readStatus: false,
          scheduledAt: new Date(),
          userId: user.id,
          noticeId: newNotice.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newNotice,
          eventDate: newNotice.eventDate ? newNotice.eventDate.toISOString() : null,
          registrationDeadline: newNotice.registrationDeadline
            ? newNotice.registrationDeadline.toISOString()
            : null,
          submissionDeadline: newNotice.submissionDeadline
            ? newNotice.submissionDeadline.toISOString()
            : null,
          createdAt: newNotice.createdAt.toISOString(),
          updatedAt: newNotice.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/notices error:", error);
    return NextResponse.json(
      {
        error: "Failed to create notice.",
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

