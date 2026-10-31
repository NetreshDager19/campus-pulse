"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SmartNoticeInput } from "@/components/smart-input/smart-notice-input";
import { PriorityNotices } from "@/components/dashboard/priority-notices";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { RecentAnnouncements } from "@/components/dashboard/recent-announcements";
import { WeeklySummaryModal } from "@/components/dashboard/weekly-summary-modal";
import { NoticeDetailModal } from "@/components/notices/notice-detail-modal";
import { NoticeEditModal } from "@/components/notices/notice-edit-modal";
import { DeleteDialog } from "@/components/notices/delete-dialog";
import { DashboardStats, NoticeItem } from "@/lib/types";
import { useToast } from "@/components/toast-provider";
import { Sparkles, CalendarDays, Search, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [weeklySummaryOpen, setWeeklySummaryOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load stats and notices from database
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, noticesRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/notices"),
      ]);

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        setStats(statsJson.data);
      }

      if (noticesRes.ok) {
        const noticesJson = await noticesRes.json();
        setNotices(noticesJson.data);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Mark Done / Toggle Complete
  const handleToggleComplete = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !current }),
      });
      if (res.ok) {
        success(!current ? "Marked Complete" : "Re-opened notice");
        refreshData();
      }
    } catch {
      error("Action failed", "Could not update notice status");
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingNotice) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${deletingNotice.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        success("Notice deleted", `"${deletingNotice.title}" has been removed.`);
        setDeletingNotice(null);
        refreshData();
      }
    } catch {
      error("Delete failed", "Could not remove notice");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenWeeklySummary={() => setWeeklySummaryOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenWeeklySummary={() => setWeeklySummaryOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim()) {
              router.push(`/notices?search=${encodeURIComponent(q)}`);
            }
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Hero Banner with Prominent "WHAT DO I NEED TO KNOW THIS WEEK?" CTA */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-card border border-purple-800/40">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-700/60 inline-block mb-3">
                  AI Campus Companion
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Stop missing deadlines in chaotic WhatsApp groups.
                </h1>
                <p className="text-xs sm:text-sm text-purple-200/90 mt-2 leading-relaxed">
                  Paste any college circular, syllabus update, or forwarded message below.
                  Campus Pulse organizes your schedule, prioritizes tasks, and keeps you ahead.
                </p>
              </div>

              {/* Prominent Button from Prompt: "WHAT DO I NEED TO KNOW THIS WEEK?" */}
              <button
                onClick={() => setWeeklySummaryOpen(true)}
                className="shrink-0 px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 shadow-xl shadow-purple-600/30 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group"
              >
                <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span>WHAT DO I NEED TO KNOW THIS WEEK?</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Background glowing gradients */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Dynamic Statistics Cards */}
          <StatsCards stats={stats} loading={loading} />

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("smart-notice-input");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>Add New Notice</span>
            </button>

            <Link
              href="/calendar"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 flex items-center gap-2 transition-colors"
            >
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>View Calendar</span>
            </Link>

            <Link
              href="/notices"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 flex items-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Search Notices</span>
            </Link>

            <button
              onClick={() => setWeeklySummaryOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 shadow-sm hover:bg-purple-100 flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Generate Weekly Summary</span>
            </button>
          </div>

          {/* Core Feature: Smart Notice Input */}
          <div id="smart-notice-input">
            <SmartNoticeInput onNoticeSaved={refreshData} />
          </div>

          {/* Today's Priority */}
          <PriorityNotices
            notices={notices}
            onSelectNotice={(n) => setSelectedNotice(n)}
            onToggleComplete={handleToggleComplete}
          />

          {/* 2-column layout: Upcoming Events & Recent Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingEvents
              notices={notices}
              onSelectNotice={(n) => setSelectedNotice(n)}
            />
            <RecentAnnouncements
              notices={notices}
              onSelectNotice={(n) => setSelectedNotice(n)}
              onViewAll={() => router.push("/notices")}
            />
          </div>
        </main>
      </div>

      {/* Weekly AI Summary Modal */}
      <WeeklySummaryModal
        isOpen={weeklySummaryOpen}
        onClose={() => setWeeklySummaryOpen(false)}
      />

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={Boolean(selectedNotice)}
        onClose={() => setSelectedNotice(null)}
      />

      {/* Notice Edit Modal */}
      <NoticeEditModal
        notice={editingNotice}
        isOpen={Boolean(editingNotice)}
        onClose={() => setEditingNotice(null)}
        onSaved={refreshData}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={Boolean(deletingNotice)}
        title={deletingNotice?.title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingNotice(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

