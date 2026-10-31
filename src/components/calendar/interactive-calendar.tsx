"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Filter,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { NoticeItem, NoticeCategory } from "@/lib/types";
import { noticeCategories } from "@/lib/validations";
import { categoryStyles } from "../notices/notice-card";
import { formatDisplayDate, safeParseDate } from "@/lib/date-utils";

type CalendarView = "month" | "week" | "day" | "list";

interface InteractiveCalendarProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

export function InteractiveCalendar({
  notices,
  onSelectNotice,
}: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter notices by category
  const filteredNotices = notices.filter((n) => {
    if (selectedCategory !== "All" && n.category !== selectedCategory) return false;
    return true;
  });

  // Navigation handlers
  const handlePrev = () => {
    if (view === "month") setCurrentDate((d) => subMonths(d, 1));
    else if (view === "week") setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subDays(d, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate((d) => addMonths(d, 1));
    else if (view === "week") setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addDays(d, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Helper: get notices on a specific date
  const getNoticesOnDate = (date: Date) => {
    return filteredNotices.filter((n) => {
      const eDate = safeParseDate(n.eventDate);
      const sDate = safeParseDate(n.submissionDeadline);
      const rDate = safeParseDate(n.registrationDeadline);

      return (
        (eDate && isSameDay(eDate, date)) ||
        (sDate && isSameDay(sDate, date)) ||
        (rDate && isSameDay(rDate, date))
      );
    });
  };

  // Month View Days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Week View Days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card p-5 sm:p-7 space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        {/* Title & Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {format(currentDate, view === "day" ? "EEEE, d MMMM yyyy" : "MMMM yyyy")}
          </h2>
        </div>

        {/* View Switcher & Category Filter */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium cursor-pointer"
            >
              <option value="All">All Categories</option>
              {noticeCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {(["month", "week", "day", "list"] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  view === v
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MONTH VIEW */}
      {view === "month" && (
        <div>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((day) => {
              const dayNotices = getNoticesOnDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 rounded-2xl border flex flex-col justify-between transition-colors ${
                    isTodayDate
                      ? "border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 ring-1 ring-purple-500"
                      : isCurrentMonth
                      ? "border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/50"
                      : "border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/30 text-slate-300 dark:text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full ${
                        isTodayDate
                          ? "bg-purple-600 text-white shadow-sm"
                          : isCurrentMonth
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    {dayNotices.length > 0 && (
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-1.5 py-0.2 rounded-md">
                        {dayNotices.length}
                      </span>
                    )}
                  </div>

                  {/* Notice chips */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayNotices.slice(0, 2).map((n) => {
                      const cat = categoryStyles[n.category] || categoryStyles["Other"];
                      return (
                        <div
                          key={n.id}
                          onClick={() => onSelectNotice(n)}
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate cursor-pointer transition-transform hover:scale-[1.02] ${cat.bg} ${cat.text} ${cat.border} border`}
                          title={`${n.title} (${n.category})`}
                        >
                          {n.title}
                        </div>
                      );
                    })}
                    {dayNotices.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-400 px-1">
                        +{dayNotices.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {view === "week" && (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayNotices = getNoticesOnDate(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`p-3.5 rounded-2xl border min-h-[220px] flex flex-col ${
                  isTodayDate
                    ? "border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 ring-1 ring-purple-500"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                }`}
              >
                <div className="pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800 text-center">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={`text-sm font-extrabold mt-0.5 ${
                      isTodayDate
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {format(day, "d MMM")}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {dayNotices.length === 0 ? (
                    <div className="text-[11px] text-slate-400 text-center pt-8">
                      No events
                    </div>
                  ) : (
                    dayNotices.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onSelectNotice(n)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm hover:border-purple-400 cursor-pointer transition-all"
                      >
                        <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                          {n.category}
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">
                          {n.title}
                        </div>
                        {n.startTime && (
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {n.startTime}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {view === "day" && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Events Scheduled for {format(currentDate, "EEEE, d MMMM yyyy")}
          </h3>

          {getNoticesOnDate(currentDate).length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No campus notices, deadlines or events scheduled for this day.
            </div>
          ) : (
            <div className="space-y-3">
              {getNoticesOnDate(currentDate).map((n) => (
                <div
                  key={n.id}
                  onClick={() => onSelectNotice(n)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:border-purple-400 transition-all shadow-sm"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {n.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {n.startTime && (
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {n.startTime}
                      </div>
                    )}
                    {n.venue && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {n.venue}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIST / AGENDA VIEW */}
      {view === "list" && (
        <div className="space-y-3">
          {filteredNotices.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No calendar entries found.
            </div>
          ) : (
            filteredNotices.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotice(n)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-300 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                      {n.eventDate ? new Date(n.eventDate).toLocaleString("default", { month: "short" }) : "TBA"}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                      {n.eventDate ? new Date(n.eventDate).getDate() : "--"}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {n.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {n.priority}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {formatDisplayDate(n.eventDate || n.submissionDeadline)}
                  </div>
                  {n.venue && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {n.venue}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

