"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { NoticeCard } from "@/components/notices/notice-card";
import { NoticeDetailModal } from "@/components/notices/notice-detail-modal";
import { NoticeEditModal } from "@/components/notices/notice-edit-modal";
import { DeleteDialog } from "@/components/notices/delete-dialog";
import { WeeklySummaryModal } from "@/components/dashboard/weekly-summary-modal";
import { NoticeItem, NoticeCategory } from "@/lib/types";
import { noticeCategories, noticePriorities, noticeStatuses } from "@/lib/validations";
import { matchesDateFilter, safeParseDate } from "@/lib/date-utils";
import { useToast } from "@/components/toast-provider";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Sparkles,
  Plus,
  X,
  FileQuestion,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NoticesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const { success, error } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [weeklySummaryOpen, setWeeklySummaryOpen] = useState(false);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [priority, setPriority] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "this-week" | "this-month">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "eventDate" | "priority">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals state
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch notices
  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notices");
      if (res.ok) {
        const json = await res.json();
        setNotices(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // Client-side filtering & sorting for instant responsiveness
  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = n.title.toLowerCase().includes(q);
          const matchDesc = n.description?.toLowerCase().includes(q);
          const matchVenue = n.venue?.toLowerCase().includes(q);
          const matchOrig = n.originalText?.toLowerCase().includes(q);
          const matchCat = n.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchVenue && !matchOrig && !matchCat) {
            return false;
          }
        }

        // Category filter
        if (category !== "All" && n.category !== category) {
          return false;
        }

        // Status filter
        if (status !== "All") {
          if (n.status.toLowerCase() !== status.toLowerCase()) return false;
        }

        // Priority filter
        if (priority !== "All" && n.priority !== priority) {
          return false;
        }

        // Date filter
        if (dateFilter !== "all") {
          const targetDate = n.eventDate || n.submissionDeadline || n.registrationDeadline;
          if (!matchesDateFilter(targetDate, dateFilter)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "eventDate") {
          const timeA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
          const timeB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
          return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        } else if (sortBy === "priority") {
          const pOrder: Record<string, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          const pA = pOrder[a.priority] || 0;
          const pB = pOrder[b.priority] || 0;
          return sortOrder === "asc" ? pA - pB : pB - pA;
        } else {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        }
      });
  }, [notices, search, category, status, priority, dateFilter, sortBy, sortOrder]);

  const handleToggleComplete = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !current }),
      });
      if (res.ok) {
        success(!current ? "Marked Complete" : "Re-opened notice");
        fetchNotices();
      }
    } catch {
      error("Action failed", "Could not update notice status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingNotice) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${deletingNotice.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        success("Notice deleted", `"${deletingNotice.title}" was removed.`);
        setDeletingNotice(null);
        fetchNotices();
      }
    } catch {
      error("Delete failed", "Could not remove notice");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
    setPriority("All");
    setDateFilter("all");
  };

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
          searchQuery={search}
          onSearchChange={setSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Organized Notice Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Manage, search, filter and categorize all campus announcements
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/#smart-notice-input"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Notice via AI</span>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            {/* Top row: Search input + View switcher + Sorting */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Instant search by title, description, venue, keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="createdAt">Date Added</option>
                  <option value="eventDate">Event Date</option>
                  <option value="priority">Priority Level</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>

                {/* Grid / List toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-900 text-purple-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-900 text-purple-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1">
                Category:
              </span>
              {["All", ...noticeCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full shrink-0 font-medium transition-all ${
                    category === cat
                      ? "bg-purple-600 text-white shadow-sm font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status & Date Filters row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  Status:
                </span>
                {["All", "Upcoming", "Due Today", "Overdue", "Completed", "Expired"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatus(st)}
                    className={`text-xs px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                      status === st
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Date Filter selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  Date:
                </span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="all">Any Date</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                </select>

                {(search || category !== "All" || status !== "All" || priority !== "All" || dateFilter !== "all") && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-rose-500 hover:underline ml-2"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notices Grid or List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-6"
                />
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-20 text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                <FileQuestion className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching notices found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search keywords or resetting the category and status filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "space-y-4"
              }
            >
              {filteredNotices.map((n) => (
                <NoticeCard
                  key={n.id}
                  notice={n}
                  onEdit={(item) => setEditingNotice(item)}
                  onDelete={(id, title) => setDeletingNotice({ id, title })}
                  onToggleComplete={handleToggleComplete}
                  onViewDetails={(item) => setSelectedNotice(item)}
                />
              ))}
            </div>
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

      <NoticeEditModal
        notice={editingNotice}
        isOpen={Boolean(editingNotice)}
        onClose={() => setEditingNotice(null)}
        onSaved={fetchNotices}
      />

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

