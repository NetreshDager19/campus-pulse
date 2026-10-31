import { z } from "zod";

export const noticeCategories = [
  "Examination",
  "Assignment",
  "Workshop",
  "Seminar",
  "Cultural Event",
  "Sports",
  "Placement",
  "Holiday",
  "College Announcement",
  "Other",
] as const;

export const noticePriorities = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;

export const noticeStatuses = [
  "Upcoming",
  "Due Today",
  "Overdue",
  "Completed",
  "Expired",
] as const;

export const sourceTypes = [
  "WhatsApp",
  "Email",
  "Circular",
  "Notice Board",
  "Other",
] as const;

// Schema for input to AI Extraction
export const aiExtractInputSchema = z.object({
  text: z
    .string()
    .min(5, "Notice text must be at least 5 characters long.")
    .max(10000, "Notice text exceeds maximum allowed length of 10,000 characters.")
    .trim(),
  sourceType: z.enum(sourceTypes).default("WhatsApp"),
});

// Schema for raw Gemini structured extraction output
export const extractedNoticeSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title is too long")
    .default("Untitled Notice"),
  description: z.string().default(""),
  category: z.enum(noticeCategories).default("College Announcement"),
  priority: z.enum(noticePriorities).default("MEDIUM"),
  eventDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  startTime: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  endTime: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  venue: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  registrationDeadline: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  submissionDeadline: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  sourceType: z.enum(sourceTypes).default("WhatsApp"),
  missingInfo: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  instructions: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  ambiguousDateNotes: z.string().nullable().optional(),
});

// Schema for creating a notice in the database
export const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().default(""),
  originalText: z.string().min(1, "Original notice text is required"),
  category: z.enum(noticeCategories),
  priority: z.enum(noticePriorities),
  eventDate: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  registrationDeadline: z.string().nullable().optional(),
  submissionDeadline: z.string().nullable().optional(),
  sourceType: z.enum(sourceTypes).default("WhatsApp"),
  missingInfo: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
});

// Schema for updating an existing notice
export const updateNoticeSchema = createNoticeSchema.partial().extend({
  isCompleted: z.boolean().optional(),
  status: z.enum(noticeStatuses).optional(),
});

// Schema for User Settings
export const userSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  timezone: z.string().default("Asia/Kolkata"),
  reminderPreferences: z.object({
    urgentAlerts: z.boolean().default(true),
    deadlineAlerts: z.boolean().default(true),
    dailyDigest: z.boolean().default(true),
  }),
});

// Schema for AI Weekly Summary result
export const aiWeeklySummarySchema = z.object({
  importantThisWeek: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
      priority: z.enum(noticePriorities),
    })
  ),
  upcomingEvents: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      time: z.string().nullable().optional(),
      venue: z.string().nullable().optional(),
      category: z.enum(noticeCategories),
    })
  ),
  deadlines: z.array(
    z.object({
      title: z.string(),
      deadlineType: z.enum(["Submission", "Registration"]),
      deadlineDate: z.string(),
      daysRemaining: z.number(),
    })
  ),
  actionRequired: z.array(z.string()),
  conflictsOrWarnings: z.array(z.string()).default([]),
});

