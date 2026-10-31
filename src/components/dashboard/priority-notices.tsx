"use client";

import React from "react";
import { AlertCircle, Flame, Clock, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { NoticeItem } from "@/lib/types";
import { formatDisplayDate, getRelativeNoticeTime } from "@/lib/date-utils";

interface PriorityNoticesProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
  onToggleComplete: (id: string, current: boolean) => void;
}

export function PriorityNotices({
  notices,
  onSelectNotice,
  onToggleComplete,
}: PriorityNoticesProps) {
  // Filter for items requiring immediate attention:
  // priority === URGENT or status === Due Today or status === Overdue or priority === HIGH
  const priorityItems = notices
    .filter(
      (n) =>
        !n.isCompleted &&
        (n.priority === "URGENT" ||
          n.status === "Due Today" ||
          n.status === "Overdue" ||
          n.priority === "HIGH")
    )
    .slice(0, 4);

  if (priorityItems.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Today's Priority Focus
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No urgent notices or impending deadlines right now. Everything is under control! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Today's Priority Focus
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                {priorityItems.length} Action{priorityItems.length === 1 ? "" : "s"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Notices and deadlines requiring immediate student attention
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {priorityItems.map((n) => {
          const timing = getRelativeNoticeTime(
            n.submissionDeadline || n.eventDate || n.registrationDeadline
          );

          return (
            <div
              key={n.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      n.priority === "URGENT"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {n.priority}
                  </span>

                  <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      timing.isUrgent
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {timing.text}
                  </span>
                </div>

                <h4
                  onClick={() => onSelectNotice(n)}
                  className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-pointer truncate transition-colors"
                >
                  {n.title}
                </h4>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {n.eventDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDisplayDate(n.eventDate)} {n.startTime ? `• ${n.startTime}` : ""}
                    </span>
                  )}
                  {n.submissionDeadline && (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      Due: {formatDisplayDate(n.submissionDeadline)}
                    </span>
                  )}
                  {n.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {n.venue}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onToggleComplete(n.id, n.isCompleted)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>

                <button
                  onClick={() => onSelectNotice(n)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  aria-label="View details"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

