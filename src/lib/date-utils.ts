import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  differenceInDays,
  differenceInCalendarDays,
  isValid,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { NoticeStatus } from "./types";

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * Safely parse any date string or Date object
 */
export function safeParseDate(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isValid(val) ? val : null;
  try {
    const parsed = new Date(val);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Format a date nicely: e.g. "15 Nov 2026"
 */
export function formatDisplayDate(val: string | Date | null | undefined): string {
  const date = safeParseDate(val);
  if (!date) return "Not specified";
  return format(date, "d MMM yyyy");
}

/**
 * Format a full datetime: e.g. "15 Nov 2026, 10:00 AM"
 */
export function formatDisplayDateTime(val: string | Date | null | undefined): string {
  const date = safeParseDate(val);
  if (!date) return "Not specified";
  return format(date, "d MMM yyyy, h:mm a");
}

/**
 * Calculate dynamic status for a notice based on real dates
 */
export function calculateNoticeStatus(notice: {
  isCompleted?: boolean;
  eventDate?: string | Date | null;
  submissionDeadline?: string | Date | null;
  registrationDeadline?: string | Date | null;
}): NoticeStatus {
  if (notice.isCompleted) {
    return "Completed";
  }

  const now = new Date();
  const subDeadline = safeParseDate(notice.submissionDeadline);
  const regDeadline = safeParseDate(notice.registrationDeadline);
  const eventDate = safeParseDate(notice.eventDate);

  // If there is an active submission deadline
  if (subDeadline) {
    if (isToday(subDeadline)) return "Due Today";
    if (isPast(subDeadline)) return "Overdue";
  }

  // If there is an active event date
  if (eventDate) {
    if (isToday(eventDate)) return "Due Today";
    if (isFuture(eventDate)) return "Upcoming";
    if (isPast(eventDate)) return "Expired";
  }

  // If there is only registration deadline
  if (regDeadline) {
    if (isToday(regDeadline)) return "Due Today";
    if (isPast(regDeadline)) return "Expired";
    if (isFuture(regDeadline)) return "Upcoming";
  }

  // Without any valid date, do not classify as Upcoming
  return "Upcoming";
}

/**
 * Get human readable relative time or countdown
 */
export function getRelativeNoticeTime(val: string | Date | null | undefined): {
  text: string;
  isUrgent: boolean;
  isPast: boolean;
} {
  const date = safeParseDate(val);
  if (!date) {
    return { text: "No date set", isUrgent: false, isPast: false };
  }

  const now = new Date();
  const diffDays = differenceInCalendarDays(date, now);

  if (isToday(date)) {
    return { text: "Today", isUrgent: true, isPast: false };
  }
  if (isTomorrow(date)) {
    return { text: "Tomorrow", isUrgent: true, isPast: false };
  }
  if (diffDays > 0) {
    return {
      text: `In ${diffDays} day${diffDays === 1 ? "" : "s"}`,
      isUrgent: diffDays <= 2,
      isPast: false,
    };
  }
  const absDays = Math.abs(diffDays);
  return {
    text: `${absDays} day${absDays === 1 ? "" : "s"} ago`,
    isUrgent: false,
    isPast: true,
  };
}

/**
 * Check if a date falls in given range filter
 */
export function matchesDateFilter(
  dateVal: string | Date | null | undefined,
  filter: "all" | "today" | "tomorrow" | "this-week" | "this-month" | "custom",
  customStart?: Date | null,
  customEnd?: Date | null
): boolean {
  if (filter === "all") return true;
  const date = safeParseDate(dateVal);
  if (!date) return false;

  const now = new Date();

  switch (filter) {
    case "today":
      return isToday(date);
    case "tomorrow":
      return isTomorrow(date);
    case "this-week": {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return isWithinInterval(date, { start, end });
    }
    case "this-month": {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      return isWithinInterval(date, { start, end });
    }
    case "custom": {
      if (!customStart || !customEnd) return true;
      return isWithinInterval(date, { start: customStart, end: customEnd });
    }
    default:
      return true;
  }
}

