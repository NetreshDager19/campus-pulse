"use client";

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Edit2,
  Trash2,
  AlertCircle,
  ExternalLink,
  Flame,
  FileText,
} from "lucide-react";
import { NoticeItem, NoticeCategory, NoticePriority, NoticeStatus } from "@/lib/types";
import { formatDisplayDate, getRelativeNoticeTime } from "@/lib/date-utils";

interface NoticeCardProps {
  notice: NoticeItem;
  onEdit: (notice: NoticeItem) => void;
  onDelete: (id: string, title: string) => void;
  onToggleComplete: (id: string, current: boolean) => void;
  onViewDetails: (notice: NoticeItem) => void;
}

// Category color mappings
export const categoryStyles: Record<
  NoticeCategory,
  { bg: string; text: string; border: string; darkBg: string }
> = {
  Examination: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    darkBg: "dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  },
  Assignment: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    darkBg: "dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  Workshop: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    darkBg: "dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
  Seminar: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    darkBg: "dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
  },
  "Cultural Event": {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    darkBg: "dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800",
  },
  Sports: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    darkBg: "dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  Placement: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    darkBg: "dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  Holiday: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    darkBg: "dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
  },
  "College Announcement": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    darkBg: "dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
  Other: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    darkBg: "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  },
};

export function NoticeCard({
  notice,
  onEdit,
  onDelete,
  onToggleComplete,
  onViewDetails,
}: NoticeCardProps) {
  const catStyle =
    categoryStyles[notice.category] || categoryStyles["College Announcement"];
  const timing = getRelativeNoticeTime(
    notice.submissionDeadline || notice.eventDate || notice.registrationDeadline
  );

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 p-5 sm:p-6 shadow-card hover:shadow-lg flex flex-col justify-between group relative overflow-hidden ${
        notice.isCompleted
          ? "border-emerald-300/60 dark:border-emerald-900/40 opacity-80 bg-emerald-50/20 dark:bg-emerald-950/10"
          : notice.priority === "URGENT"
          ? "border-rose-200 dark:border-rose-900/60 hover:border-rose-300"
          : "border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border} ${catStyle.darkBg}`}
            >
              {notice.category}
            </span>

            {/* Priority */}
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                notice.priority === "URGENT"
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  : notice.priority === "HIGH"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {notice.priority === "URGENT" && <Flame className="w-3 h-3 text-rose-500" />}
              {notice.priority}
            </span>

            {/* Source badge */}
            <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
              {notice.sourceType}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              notice.isCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                : notice.status === "Due Today"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 animate-pulse"
                : notice.status === "Overdue"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300"
            }`}
          >
            {notice.status}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(notice)}
          className={`text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-pointer transition-colors leading-snug line-clamp-2 ${
            notice.isCompleted ? "line-through text-slate-500 dark:text-slate-400" : ""
          }`}
        >
          {notice.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
          {notice.description || notice.originalText}
        </p>

        {/* Metadata Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          {notice.eventDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDisplayDate(notice.eventDate)}
              </span>
              {notice.startTime && (
                <span className="text-slate-400">({notice.startTime})</span>
              )}
            </div>
          )}

          {notice.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="truncate">{notice.venue}</span>
            </div>
          )}

          {notice.submissionDeadline && (
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Submission Due: {formatDisplayDate(notice.submissionDeadline)}</span>
            </div>
          )}

          {notice.registrationDeadline && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Reg. Deadline: {formatDisplayDate(notice.registrationDeadline)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleComplete(notice.id, notice.isCompleted)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            notice.isCompleted
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300"
          }`}
          aria-label={notice.isCompleted ? "Mark notice as pending" : "Mark notice as completed"}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{notice.isCompleted ? "Completed" : "Mark Done"}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(notice)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View original notice & full instructions"
            aria-label="View original notice and full instructions"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(notice)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit notice"
            aria-label="Edit notice"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(notice.id, notice.title)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete notice"
            aria-label="Delete notice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

