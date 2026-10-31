"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BellRing,
  CalendarDays,
  Sparkles,
  Settings,
  Flame,
  FileText,
  X,
  Compass,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenWeeklySummary?: () => void;
}

export function Sidebar({
  mobileOpen = false,
  onCloseMobile,
  onOpenWeeklySummary,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      name: "All Notices",
      href: "/notices",
      icon: FileText,
      active: pathname === "/notices",
    },
    {
      name: "Interactive Calendar",
      href: "/calendar",
      icon: CalendarDays,
      active: pathname === "/calendar",
    },
    {
      name: "Weekly AI Brief",
      href: "#",
      icon: Sparkles,
      active: false,
      isAction: true,
      onClick: () => {
        if (onOpenWeeklySummary) onOpenWeeklySummary();
        if (onCloseMobile) onCloseMobile();
      },
    },
    {
      name: "Settings & Demo",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CAMPUS<span className="text-purple-600 dark:text-purple-400">PULSE</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                AI Campus Companion
              </div>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60"
                >
                  <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                  <span className="flex-1 text-left font-semibold">{item.name}</span>
                  <span className="text-[10px] uppercase font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-md">
                    AI
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    item.active
                      ? "text-white"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* AI & Hackathon Badge */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-purple-600/10 dark:from-purple-950/50 dark:to-slate-800/50 border border-purple-200/60 dark:border-purple-800/40">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Gemini 1.5 Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Smart Structured Parsing & Weekly Life Synthesis enabled.
          </p>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700 flex items-center justify-center font-bold text-sm text-purple-700 dark:text-purple-300">
            AJ
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
              Alex Johnson
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              B.Tech Computer Science
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

