import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateNoticeSchema } from "@/lib/validations";
import { calculateNoticeStatus, safeParseDate } from "@/lib/date-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: params.id },
    });

    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const dynamicStatus = calculateNoticeStatus({
      isCompleted: notice.isCompleted,
      eventDate: notice.eventDate,
      submissionDeadline: notice.submissionDeadline,
      registrationDeadline: notice.registrationDeadline,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...notice,
        status: dynamicStatus,
        eventDate: notice.eventDate ? notice.eventDate.toISOString() : null,
        registrationDeadline: notice.registrationDeadline
          ? notice.registrationDeadline.toISOString()
          : null,
        submissionDeadline: notice.submissionDeadline
          ? notice.submissionDeadline.toISOString()
          : null,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/notices/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notice details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = updateNoticeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    const existing = await prisma.notice.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
    if (parsed.data.priority !== undefined) updateData.priority = parsed.data.priority;
    if (parsed.data.venue !== undefined) updateData.venue = parsed.data.venue;
    if (parsed.data.startTime !== undefined) updateData.startTime = parsed.data.startTime;
    if (parsed.data.endTime !== undefined) updateData.endTime = parsed.data.endTime;
    if (parsed.data.instructions !== undefined) updateData.instructions = parsed.data.instructions;
    if (parsed.data.missingInfo !== undefined) updateData.missingInfo = parsed.data.missingInfo;

    if (parsed.data.eventDate !== undefined) {
      updateData.eventDate = safeParseDate(parsed.data.eventDate);
    }
    if (parsed.data.registrationDeadline !== undefined) {
      updateData.registrationDeadline = safeParseDate(parsed.data.registrationDeadline);
    }
    if (parsed.data.submissionDeadline !== undefined) {
      updateData.submissionDeadline = safeParseDate(parsed.data.submissionDeadline);
    }
    if (parsed.data.isCompleted !== undefined) {
      updateData.isCompleted = parsed.data.isCompleted;
    }

    // Recalculate dynamic status
    const newStatus = calculateNoticeStatus({
      isCompleted: updateData.isCompleted ?? existing.isCompleted,
      eventDate: updateData.eventDate !== undefined ? updateData.eventDate : existing.eventDate,
      submissionDeadline:
        updateData.submissionDeadline !== undefined
          ? updateData.submissionDeadline
          : existing.submissionDeadline,
      registrationDeadline:
        updateData.registrationDeadline !== undefined
          ? updateData.registrationDeadline
          : existing.registrationDeadline,
    });

    updateData.status = newStatus;

    const updated = await prisma.notice.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        eventDate: updated.eventDate ? updated.eventDate.toISOString() : null,
        registrationDeadline: updated.registrationDeadline
          ? updated.registrationDeadline.toISOString()
          : null,
        submissionDeadline: updated.submissionDeadline
          ? updated.submissionDeadline.toISOString()
          : null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("PATCH /api/notices/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update notice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.notice.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    await prisma.notice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/notices/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}

