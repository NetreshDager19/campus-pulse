"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";
import { WeeklySummaryModal } from "@/components/dashboard/weekly-summary-modal";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/toast-provider";
import {
  Settings,
  Bell,
  Globe,
  Sun,
  Moon,
  Laptop,
  Database,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Key,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { success, error, info } = useToast();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [weeklySummaryOpen, setWeeklySummaryOpen] = useState(false);

  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  const [savingSettings, setSavingSettings] = useState(false);
  const [reseeding, setReseeding] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.data?.settings) {
            setTimezone(json.data.settings.timezone || "Asia/Kolkata");
            const r = json.data.settings.reminderPreferences;
            if (r) {
              setUrgentAlerts(r.urgentAlerts ?? true);
              setDeadlineAlerts(r.deadlineAlerts ?? true);
              setDailyDigest(r.dailyDigest ?? true);
            }
          }
        }
      } catch {
        // use defaults
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          timezone,
          reminderPreferences: {
            urgentAlerts,
            deadlineAlerts,
            dailyDigest,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      success("Settings saved successfully!", "Your preferences have been updated.");
    } catch (err: unknown) {
      error("Save error", err instanceof Error ? err.message : "Network error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleResetSeedData = async () => {
    setReseeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (!res.ok) throw new Error("Failed to seed demo data");
      success(
        "Demo Data Reset Complete!",
        "Loaded 6 fresh demonstration notices (Workshop, Exams, Assignments, Cultural Fest, Placement)."
      );
    } catch (err: unknown) {
      error("Reset error", err instanceof Error ? err.message : "Failed to reset data");
    } finally {
      setReseeding(false);
    }
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
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Settings & Demo Controls
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configure timezones, in-app notification preferences, and hackathon test datasets
            </p>
          </div>

          {/* Hackathon Demonstration Controls Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-800/10 dark:from-purple-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-800/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Hackathon Live Demonstration Quick Reset
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instantly restore standard demo notices & deadlines for a flawless presentation
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Restores: Python Workshop, Mid-Sem Exam circular, Math Assignment deadline, Tarang Fest, Tech Seminar, SDE Placement drive.
              </div>

              <button
                onClick={handleResetSeedData}
                disabled={reseeding}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${reseeding ? "animate-spin" : ""}`} />
                <span>{reseeding ? "Resetting Database..." : "Reset & Seed Demo Data"}</span>
              </button>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Student Profile</span>
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center ring-4 ring-purple-100 dark:ring-purple-950">
                AJ
              </div>
              <div className="space-y-0.5">
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  Alex Johnson
                </div>
                <div className="text-xs text-slate-400">
                  student@campuspulse.edu • Roll: 23BCS0412
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  B.Tech Computer Science & Engineering (3rd Year)
                </div>
              </div>
            </div>
          </div>

          {/* Theme & Timezone */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface & Localization
            </h3>

            {/* Theme switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light Mode", icon: Sun },
                  { id: "dark", label: "Dark Mode", icon: Moon },
                  { id: "system", label: "System Sync", icon: Laptop },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 ring-1 ring-purple-600"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Timezone (Default: Asia/Kolkata)
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                All deadlines and relative calculations ("Due Today", "Overdue") compute accurately against this timezone.
              </p>
            </div>
          </div>

          {/* Reminder Preferences */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" />
              <span>In-App Reminder Preferences</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentAlerts}
                  onChange={(e) => setUrgentAlerts(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Urgent Campus Notices
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Show high-priority in-app alerts when examinations or urgent circulars are recorded.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deadlineAlerts}
                  onChange={(e) => setDeadlineAlerts(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Approaching Assignment Deadlines
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Notify when an assignment submission or workshop registration cutoff is within 48 hours.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Daily Morning Digest
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Aggregate today's lectures, venues, and reminders on the dashboard header.
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                {savingSettings ? "Saving Preferences..." : "Save Preferences"}
              </button>
            </div>
          </div>

          {/* AI Security & API Key Guidance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>AI Integration & Security Architecture</span>
            </h3>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Google Gemini API Key:</strong> Securely handled only via server-side Next.js route handlers (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-purple-600">/api/ai/extract</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-purple-600">/api/ai/weekly-summary</code>). Never exposed to browser bundle.
              </p>
              <p>
                <strong>Untrusted Input Sanitization:</strong> Pasted notices from WhatsApp/emails are treated strictly as untrusted raw strings and delimited with XML isolation tags to prevent prompt injection or instruction hijacking.
              </p>
              <p>
                <strong>Zod Output Validation:</strong> All AI outputs are validated against strict Zod schemas before being presented for student review.
              </p>
            </div>
          </div>
        </main>
      </div>

      <WeeklySummaryModal
        isOpen={weeklySummaryOpen}
        onClose={() => setWeeklySummaryOpen(false)}
      />
    </div>
  );
}

