import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userSettingsSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    let user = await prisma.user.findFirst({
      include: { settings: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "demo-user-1",
          name: "Alex Johnson",
          email: "student@campuspulse.edu",
          settings: {
            create: {
              theme: "system",
              timezone: "Asia/Kolkata",
              reminderPreferences: JSON.stringify({
                urgentAlerts: true,
                deadlineAlerts: true,
                dailyDigest: true,
              }),
            },
          },
        },
        include: { settings: true },
      });
    }

    let parsedReminders = { urgentAlerts: true, deadlineAlerts: true, dailyDigest: true };
    if (user.settings?.reminderPreferences) {
      try {
        parsedReminders = JSON.parse(user.settings.reminderPreferences);
      } catch {
        // use default
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        settings: {
          theme: user.settings?.theme || "system",
          timezone: user.settings?.timezone || "Asia/Kolkata",
          reminderPreferences: parsedReminders,
        },
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSettingsSchema.safeParse(body);

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { theme, timezone, reminderPreferences } = parsed.data;

    const updated = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        theme,
        timezone,
        reminderPreferences: JSON.stringify(reminderPreferences),
      },
      create: {
        userId: user.id,
        theme,
        timezone,
        reminderPreferences: JSON.stringify(reminderPreferences),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}

