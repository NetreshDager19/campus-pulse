export type NoticeCategory =
  | "Examination"
  | "Assignment"
  | "Workshop"
  | "Seminar"
  | "Cultural Event"
  | "Sports"
  | "Placement"
  | "Holiday"
  | "College Announcement"
  | "Other";

export type NoticePriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type NoticeStatus = "Upcoming" | "Due Today" | "Overdue" | "Completed" | "Expired";

export type SourceType = "WhatsApp" | "Email" | "Circular" | "Notice Board" | "Other";

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  originalText: string;
  category: NoticeCategory;
  priority: NoticePriority;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  registrationDeadline: string | null;
  submissionDeadline: string | null;
  status: NoticeStatus;
  isCompleted: boolean;
  sourceType: SourceType;
  missingInfo: string | null;
  instructions: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ExtractedNoticeData {
  title: string;
  description: string;
  category: NoticeCategory;
  priority: NoticePriority;
  eventDate: string | null; // ISO YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  registrationDeadline: string | null; // ISO YYYY-MM-DDTHH:mm:ss
  submissionDeadline: string | null; // ISO YYYY-MM-DDTHH:mm:ss
  sourceType: SourceType;
  missingInfo: string | null;
  instructions: string | null;
  ambiguousDateNotes?: string | null;
}

export interface DashboardStats {
  totalNotices: number;
  upcomingEvents: number;
  pendingDeadlines: number;
  urgentNotices: number;
  completedNotices: number;
  categoryBreakdown: Record<string, number>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "URGENT" | "DEADLINE" | "EVENT" | "SYSTEM";
  readStatus: boolean;
  scheduledAt: string;
  createdAt: string;
  userId: string;
  noticeId?: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  settings?: {
    theme: string;
    timezone: string;
    reminderPreferences: {
      urgentAlerts: boolean;
      deadlineAlerts: boolean;
      dailyDigest: boolean;
    };
  };
}

export interface AIWeeklySummaryResult {
  generatedAt: string;
  totalNoticesAnalyzed: number;
  importantThisWeek: Array<{
    title: string;
    reason: string;
    priority: NoticePriority;
  }>;
  upcomingEvents: Array<{
    title: string;
    date: string;
    time?: string | null;
    venue?: string | null;
    category: NoticeCategory;
  }>;
  deadlines: Array<{
    title: string;
    deadlineType: "Submission" | "Registration";
    deadlineDate: string;
    daysRemaining: number;
  }>;
  actionRequired: string[];
  conflictsOrWarnings: string[];
}

