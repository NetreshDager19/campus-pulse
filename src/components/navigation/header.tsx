"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { format } from "date-fns";
import { NotificationItem } from "@/lib/types";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenWeeklySummary: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Header({
  onToggleMobileSidebar,
  onOpenWeeklySummary,
  searchQuery = "",
  onSearchChange,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  // Live date in Asia/Kolkata
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format with IST / Asia/Kolkata context
      const formatted = format(now, "EEE, d MMM yyyy • h:mm a");
      setCurrentDateStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
        setUnreadCount(0);
      }
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left side: Hamburger button + Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome back, Alex <span className="inline-block animate-wiggle">👋</span>
              </h1>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{currentDateStr || "Loading date..."}</span>
              <span className="hidden sm:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                IST
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices, exams, assignments, venues..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange && onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right side: Actions, AI Brief, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Weekly Summary CTA button */}
          <button
            onClick={onOpenWeeklySummary}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm shadow-purple-600/30 hover:shadow-md transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span>Weekly AI Brief</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === "light"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              aria-label="Switch to light mode"
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === "dark"
                  ? "bg-slate-900 text-purple-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              aria-label="Switch to dark mode"
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === "system"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              aria-label="Switch to system theme"
              title="System Theme"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <>
                <div
                  onClick={() => setNotifDropdownOpen(false)}
                  className="fixed inset-0 z-30"
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-40 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Campus Notifications
                      </div>
                      <div className="text-xs text-slate-400">
                        {unreadCount} unread alert{unreadCount === 1 ? "" : "s"}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 transition-colors ${
                            !n.readStatus
                              ? "bg-purple-50/50 dark:bg-purple-950/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                n.type === "URGENT"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                                  : n.type === "DEADLINE"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                                  : "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400"
                              }`}
                            >
                              {n.type}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {n.scheduledAt ? format(new Date(n.scheduledAt), "d MMM, h:mm a") : ""}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                            {n.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {n.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-500/20">
                AJ
              </div>
            </button>

            {profileOpen && (
              <>
                <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-40 p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-sm font-bold text-purple-700 dark:text-purple-300">
                      AJ
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        Alex Johnson
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        student@campuspulse.edu
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div>Roll No: 23BCS0412</div>
                    <div>Department: Computer Science</div>
                    <div>Semester: 5th (Odd 2026)</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

