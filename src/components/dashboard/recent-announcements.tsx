"use client";

import React from "react";
import { FileText, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { NoticeItem } from "@/lib/types";
import { formatDisplayDate } from "@/lib/date-utils";

interface RecentAnnouncementsProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
  onViewAll: () => void;
}

export function RecentAnnouncements({
  notices,
  onSelectNotice,
  onViewAll,
}: RecentAnnouncementsProps) {
  const recent = [...notices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Announcements
            </h3>
            <p className="text-[11px] text-slate-400">
              Latest notices organized across all college channels
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>View All ({notices.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No notices recorded yet. Use the Smart Notice Input above!
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {recent.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNotice(n)}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Source: {n.sourceType}
                  </span>
                  {n.isCompleted && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                  {n.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {n.description || n.originalText}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {formatDisplayDate(n.createdAt)}
                </div>
                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  {n.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

