"use client";

import React from "react";
import {
  FileText,
  CalendarCheck,
  AlertTriangle,
  Flame,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading = false }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="w-12 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-16 h-7 rounded bg-slate-200 dark:bg-slate-800 mb-1" />
            <div className="w-24 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Notices",
      count: stats.totalNotices,
      subtitle: `${stats.completedNotices} marked completed`,
      icon: FileText,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-900/40",
    },
    {
      title: "Upcoming Events",
      count: stats.upcomingEvents,
      subtitle: "In next 30 days",
      icon: CalendarCheck,
      color: "from-purple-600 to-indigo-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgLight: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-200 dark:border-purple-900/40",
    },
    {
      title: "Pending Deadlines",
      count: stats.pendingDeadlines,
      subtitle: "Submissions & cutoffs",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-900/40",
    },
    {
      title: "Urgent Notices",
      count: stats.urgentNotices,
      subtitle: "Requires immediate focus",
      icon: Flame,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-600 dark:text-rose-400",
      bgLight: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center ${card.bgLight} ${card.border} border`}
              >
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Live DB</span>
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {card.count}
            </div>

            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
              {card.title}
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {card.subtitle}
            </div>

            {/* Gradient accent line on bottom */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
          </div>
        );
      })}
    </div>
  );
}

