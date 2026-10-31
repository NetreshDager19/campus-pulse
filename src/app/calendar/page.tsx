"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { InteractiveCalendar } from "@/components/calendar/interactive-calendar";
import { NoticeDetailModal } from "@/components/notices/notice-detail-modal";
import { WeeklySummaryModal } from "@/components/dashboard/weekly-summary-modal";
import { NoticeItem } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [weeklySummaryOpen, setWeeklySummaryOpen] = useState(false);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notices");
      if (res.ok) {
        const json = await res.json();
        setNotices(json.data || []);
      }
    } catch (err) {
      console.error("Calendar fetch notices error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenWeeklySummary={() => setWeeklySummaryOpen(true)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenWeeklySummary={() => setWeeklySummaryOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Interactive Academic & Events Calendar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Visual timeline synchronized with your college notices, exams, and assignment deadlines
              </p>
            </div>

            <Link
              href="/#smart-notice-input"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event via AI</span>
            </Link>
          </div>

          {loading ? (
            <div className="h-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-8" />
          ) : (
            <InteractiveCalendar
              notices={notices}
              onSelectNotice={(n) => setSelectedNotice(n)}
            />
          )}
        </main>
      </div>

      <WeeklySummaryModal
        isOpen={weeklySummaryOpen}
        onClose={() => setWeeklySummaryOpen(false)}
      />

      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={Boolean(selectedNotice)}
        onClose={() => setSelectedNotice(null)}
      />
    </div>
  );
}

