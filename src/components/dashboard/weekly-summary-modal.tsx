"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckSquare,
  Clock,
  RefreshCw,
  X,
  MapPin,
  Flame,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { AIWeeklySummaryResult } from "@/lib/types";
import { formatDisplayDate } from "@/lib/date-utils";

interface WeeklySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeeklySummaryModal({ isOpen, onClose }: WeeklySummaryModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<AIWeeklySummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/weekly-summary");
      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }
      const json = await res.json();
      setSummary(json.data);
    } catch (err: unknown) {
      console.error("Weekly summary fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-title"
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95"
      >
        {/* Header with gradient */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 text-white overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-yellow-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-200">
                  Campus Life Intelligence
                </span>
                <h2
                  id="summary-title"
                  className="text-lg sm:text-xl font-extrabold tracking-tight text-white"
                >
                  What Do I Need To Know This Week?
                </h2>
                <p className="text-xs text-purple-200/90 mt-0.5">
                  Synthesized from your actual database records by Google Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchSummary}
                disabled={loading}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
                title="Regenerate summary"
                aria-label="Regenerate summary"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[70vh] overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-purple-600 dark:text-purple-400 animate-spin" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Reading Saved Campus Notices...
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Gemini is analyzing deadlines, exam schedules, and activities
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs">
              {error}
            </div>
          ) : summary ? (
            <>
              {/* Notice Count Analyzed */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span>
                  Analyzed <strong>{summary.totalNoticesAnalyzed}</strong> campus records
                </span>
                <span>Generated at {new Date(summary.generatedAt).toLocaleTimeString()}</span>
              </div>

              {/* 1. IMPORTANT THIS WEEK */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Important This Week
                  </h3>
                </div>

                {summary.importantThisWeek.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-400">
                    No urgent or high priority alerts flagged for this week.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {summary.importantThisWeek.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                            {item.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. UPCOMING EVENTS */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Upcoming College Events
                  </h3>
                </div>

                {summary.upcomingEvents.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-400">
                    No upcoming events found on your calendar for this week.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {summary.upcomingEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {evt.title}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              {evt.category}
                            </span>
                            {evt.venue && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {evt.venue}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                            {formatDisplayDate(evt.date)}
                          </div>
                          {evt.time && (
                            <div className="text-[10px] text-slate-400">
                              {evt.time}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. DEADLINES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Important Deadlines
                  </h3>
                </div>

                {summary.deadlines.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-400">
                    No approaching assignment submissions or registration cutoffs!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {summary.deadlines.map((dl, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                            {dl.deadlineType} Deadline
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                            {dl.title}
                          </h4>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            Due: {formatDisplayDate(dl.deadlineDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. ACTION REQUIRED */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Action Required Checklist
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-2">
                  {summary.actionRequired.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. CONFLICTS & WARNINGS */}
              {summary.conflictsOrWarnings && summary.conflictsOrWarnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Incomplete Info / Notices Requiring Clarification</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                    {summary.conflictsOrWarnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-colors"
          >
            Close Briefing
          </button>
        </div>
      </div>
    </div>
  );
}

