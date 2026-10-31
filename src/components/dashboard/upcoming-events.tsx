"use client";

import React from "react";
import { Calendar, Clock, MapPin, ChevronRight, Sparkles } from "lucide-react";
import { NoticeItem } from "@/lib/types";
import { formatDisplayDate, safeParseDate } from "@/lib/date-utils";

interface UpcomingEventsProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

export function UpcomingEvents({ notices, onSelectNotice }: UpcomingEventsProps) {
  const now = new Date();

  // Filter events with a valid eventDate in the future, sorted chronologically
  const upcoming = notices
    .filter((n) => {
      if (n.isCompleted) return false;
      const d = safeParseDate(n.eventDate);
      return d !== null && d >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.eventDate!).getTime();
      const dateB = new Date(b.eventDate!).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming College Events
            </h3>
            <p className="text-[11px] text-slate-400">
              Chronological schedule of workshops, fests, exams & seminars
            </p>
          </div>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No upcoming events scheduled. Add a notice using Smart Notice AI!
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNotice(n)}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              {/* Date Box */}
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/60 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] uppercase font-extrabold text-purple-600 dark:text-purple-400">
                  {n.eventDate ? new Date(n.eventDate).toLocaleString("default", { month: "short" }) : "TBA"}
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  {n.eventDate ? new Date(n.eventDate).getDate() : "--"}
                </span>
              </div>

              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>
                  {n.startTime && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.startTime}
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                  {n.title}
                </h4>

                {n.venue && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{n.venue}</span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

