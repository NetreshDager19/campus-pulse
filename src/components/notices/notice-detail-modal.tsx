"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { NoticeItem } from "@/lib/types";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-utils";
import { categoryStyles } from "./notice-card";

interface NoticeDetailModalProps {
  notice: NoticeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoticeDetailModal({
  notice,
  isOpen,
  onClose,
}: NoticeDetailModalProps) {
  if (!isOpen || !notice) return null;

  const catStyle =
    categoryStyles[notice.category] || categoryStyles["College Announcement"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-notice-title"
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden my-8 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border} ${catStyle.darkBg}`}
              >
                {notice.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {notice.priority} Priority
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Source: {notice.sourceType}
              </span>
            </div>
            <h2
              id="detail-notice-title"
              className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-tight"
            >
              {notice.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Key metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Event Date & Time</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>
                  {formatDisplayDate(notice.eventDate)}{" "}
                  {notice.startTime ? `• ${notice.startTime}` : ""}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Venue / Room</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{notice.venue || "Not specified"}</span>
              </div>
            </div>

            {notice.submissionDeadline && (
              <div className="space-y-1">
                <span className="text-rose-500 font-medium">Submission Deadline</span>
                <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formatDisplayDate(notice.submissionDeadline)}</span>
                </div>
              </div>
            )}

            {notice.registrationDeadline && (
              <div className="space-y-1">
                <span className="text-amber-500 font-medium">Registration Deadline</span>
                <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDisplayDate(notice.registrationDeadline)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Structured Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Structured Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {notice.description || "No description provided."}
            </p>
          </div>

          {/* Instructions */}
          {notice.instructions && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Important Instructions & Requirements
              </h3>
              <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs text-purple-950 dark:text-purple-200">
                {notice.instructions}
              </div>
            </div>
          )}

          {/* Missing info warning */}
          {notice.missingInfo && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Missing details: </span>
                {notice.missingInfo}
              </div>
            </div>
          )}

          {/* Original Pasted Notice Comparison */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Original Unstructured Notice (Comparison)</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {notice.originalText}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Recorded {formatDisplayDateTime(notice.createdAt)}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

