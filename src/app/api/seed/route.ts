import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const demoUser = await prisma.user.upsert({
      where: { email: "student@campuspulse.edu" },
      update: {},
      create: {
        id: "demo-user-1",
        name: "Alex Johnson",
        email: "student@campuspulse.edu",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
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
    });

    await prisma.notification.deleteMany({ where: { userId: demoUser.id } });
    await prisma.notice.deleteMany({ where: { userId: demoUser.id } });

    const demoNotices = [
      {
        title: "Python & Applied Generative AI Workshop",
        description:
          "Hands-on workshop covering Python 3.11, PyTorch, and Google Gemini APIs. Bring personal laptops with development environments ready.",
        originalText:
          "*URGENT NOTICE - DEPARTMENT OF COMPUTER SCIENCE* 🚀\nAll B.Tech 2nd & 3rd year students are hereby informed that the hands-on 'Python & Applied Generative AI Workshop' will be conducted on 15 November 2026 from 10:00 AM to 1:00 PM at Seminar Hall 2, Tech Block. Registration closes on 12 November 2026.",
        category: "Workshop",
        priority: "HIGH",
        eventDate: new Date("2026-11-15T10:00:00.000Z"),
        startTime: "10:00 AM",
        endTime: "01:00 PM",
        venue: "Seminar Hall 2, Tech Block",
        registrationDeadline: new Date("2026-11-12T17:00:00.000Z"),
        submissionDeadline: null,
        status: "Upcoming",
        isCompleted: false,
        sourceType: "WhatsApp",
        missingInfo: null,
        instructions: "Carry laptop with charger and Python pre-installed. College ID required.",
        userId: demoUser.id,
      },
      {
        title: "Advanced Mathematics Assignment #3",
        description:
          "Handwritten solutions on Laplace Transforms and Fourier Series to be submitted to Room 408 or uploaded to the LMS portal.",
        originalText:
          "Assignment #3 for Advanced Engineering Mathematics has been posted. Handwritten solutions must be submitted to Prof. Sharma's cabin (Room 408) or submitted as a single PDF on LMS no later than 12 November 2026, 11:59 PM.",
        category: "Assignment",
        priority: "URGENT",
        eventDate: null,
        startTime: null,
        endTime: null,
        venue: "Room 408 (Prof. Sharma's Cabin) / LMS",
        registrationDeadline: null,
        submissionDeadline: new Date("2026-11-12T23:59:00.000Z"),
        status: "Due Today",
        isCompleted: false,
        sourceType: "Email",
        missingInfo: null,
        instructions: "No plagiarism tolerated. 20% penalty per day for late submissions.",
        userId: demoUser.id,
      },
      {
        title: "Tarang 2026 - Annual Cultural Fest",
        description:
          "3-day flagship college cultural festival featuring Battle of the Bands, Fashion Show, Classical & Western Dance, and Celebrity DJ Night.",
        originalText:
          "🎉 TARANG 2026 – The Annual Inter-College Cultural Extravaganza! Dates: 20 November 2026 to 22 November 2026. Venue: Campus Main Amphitheatre & Ground. Audition registrations open until 14 November 2026 at SAC Desk.",
        category: "Cultural Event",
        priority: "MEDIUM",
        eventDate: new Date("2026-11-20T17:00:00.000Z"),
        startTime: "05:00 PM",
        endTime: "10:00 PM",
        venue: "Main Amphitheatre & Sports Ground",
        registrationDeadline: new Date("2026-11-14T18:00:00.000Z"),
        submissionDeadline: null,
        status: "Upcoming",
        isCompleted: false,
        sourceType: "WhatsApp",
        missingInfo: null,
        instructions: "Student ID card mandatory for gate entry. Outside guests allowed only with guest passes.",
        userId: demoUser.id,
      },
      {
        title: "B.Tech Mid-Semester Examination 2026",
        description:
          "Commencement of mid-semester theory and practical exams for all engineering departments. Hall tickets available for download on college portal.",
        originalText:
          "CIRCULAR / COE / 2026-27 / 104: B.Tech Mid-Semester Examinations will commence from 25 November 2026. Reporting time: 09:30 AM sharp in Examination Block B. Hall tickets mandatory.",
        category: "Examination",
        priority: "URGENT",
        eventDate: new Date("2026-11-25T09:30:00.000Z"),
        startTime: "09:30 AM",
        endTime: "12:30 PM",
        venue: "Examination Block B",
        registrationDeadline: null,
        submissionDeadline: null,
        status: "Upcoming",
        isCompleted: false,
        sourceType: "Circular",
        missingInfo: null,
        instructions: "No smartwatches, mobile phones or unauthorized materials allowed. Bring admit card.",
        userId: demoUser.id,
      },
      {
        title: "Technical Seminar: Distributed Systems at Scale",
        description:
          "Guest lecture by Principal Architect on resilient cloud microservices, Kubernetes orchestration, and event-driven architectures.",
        originalText:
          "Department of Computer Science hosts Tech Talk on 'Distributed Systems at Scale' on 18 November 2026 at 02:30 PM in Audi A. Open to all students.",
        category: "Seminar",
        priority: "MEDIUM",
        eventDate: new Date("2026-11-18T14:30:00.000Z"),
        startTime: "02:30 PM",
        endTime: "04:30 PM",
        venue: "Auditorium A, Main Admin Block",
        registrationDeadline: null,
        submissionDeadline: null,
        status: "Upcoming",
        isCompleted: false,
        sourceType: "Notice Board",
        missingInfo: null,
        instructions: "Seating is on first-come-first-served basis.",
        userId: demoUser.id,
      },
      {
        title: "Tech Innovations SDE Campus Placement Drive",
        description:
          "On-campus placement recruitment drive for 2027 graduating batch. SDE-1 roles with competitive compensation package.",
        originalText:
          "Placement Cell Notice: Campus recruitment drive for SDE roles by Tech Innovations Corp on 18 November 2026 at 09:00 AM in Central Auditorium. Eligibility: 65% / 7.0 CGPA. Submit resume via Google Form before 13 November 2026, 6:00 PM.",
        category: "Placement",
        priority: "HIGH",
        eventDate: new Date("2026-11-18T09:00:00.000Z"),
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        venue: "Central Auditorium",
        registrationDeadline: new Date("2026-11-13T18:00:00.000Z"),
        submissionDeadline: null,
        status: "Upcoming",
        isCompleted: false,
        sourceType: "Email",
        missingInfo: null,
        instructions: "Strict Western Formals. Bring 3 hard copies of resume and 2 passport size photographs.",
        userId: demoUser.id,
      },
    ];

    for (const item of demoNotices) {
      const created = await prisma.notice.create({ data: item });
      if (created.priority === "URGENT" || created.submissionDeadline) {
        await prisma.notification.create({
          data: {
            title: `Action Required: ${created.title}`,
            message: created.submissionDeadline
              ? `Deadline approaching for ${created.title}. Make sure to submit on time.`
              : `Important notice requires your attention: ${created.title}.`,
            type: created.submissionDeadline ? "DEADLINE" : "URGENT",
            readStatus: false,
            scheduledAt: new Date(),
            userId: demoUser.id,
            noticeId: created.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database successfully re-seeded with demo records!",
    });
  } catch (error: unknown) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed demo data" },
      { status: 500 }
    );
  }
}

