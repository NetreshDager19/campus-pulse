"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ClipboardPaste,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  noticeCategories,
  noticePriorities,
  sourceTypes,
} from "@/lib/validations";
import { ExtractedNoticeData, SourceType } from "@/lib/types";
import { SAMPLE_NOTICES, SampleNotice } from "@/lib/sample-notices";
import { useToast } from "@/components/toast-provider";

interface SmartNoticeInputProps {
  onNoticeSaved?: () => void;
}

export function SmartNoticeInput({ onNoticeSaved }: SmartNoticeInputProps) {
  const { success, error, info } = useToast();
  const [inputText, setInputText] = useState<string>("");
  const [sourceType, setSourceType] = useState<SourceType>("WhatsApp");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractedNoticeData | null>(null);
  const [extractionNote, setExtractionNote] = useState<string | null>(null);
  const [isMockFallback, setIsMockFallback] = useState<boolean>(false);

  // Quick paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        info("Pasted from clipboard", "Click 'Analyze with AI' to extract structured fields.");
      }
    } catch {
      info("Clipboard access", "Please paste your message directly using Ctrl+V or Cmd+V.");
    }
  };

  // Clear text
  const handleClear = () => {
    setInputText("");
    setExtractedData(null);
    setExtractionNote(null);
  };

  // Load sample notice
  const handleLoadSample = (sample: SampleNotice) => {
    setInputText(sample.rawText);
    setExtractedData(null);
    setExtractionNote(null);
    info(`Loaded sample: ${sample.name}`, "Ready for AI analysis.");
  };

  // Analyze with AI
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      error("Empty notice", "Please paste or type a campus notice before analyzing.");
      return;
    }

    if (inputText.length > 10000) {
      error("Notice too long", "Notice text cannot exceed 10,000 characters.");
      return;
    }

    setIsAnalyzing(true);
    setExtractionNote(null);
    setExtractedData(null);

    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          sourceType,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || json.message || "Extraction failed");
      }

      setExtractedData(json.data);
      setIsMockFallback(json.isMockFallback || false);
      if (json.message) {
        setExtractionNote(json.message);
      }
      success("Information extracted!", "Review and confirm details before saving to your dashboard.");
    } catch (err: unknown) {
      console.error("AI Analysis error:", err);
      error("Extraction Failed", err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Confirm and Save
  const handleConfirmSave = async () => {
    if (!extractedData) return;

    if (!extractedData.title.trim()) {
      error("Title required", "Notice must have a title before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: extractedData.title,
          description: extractedData.description,
          originalText: inputText,
          category: extractedData.category,
          priority: extractedData.priority,
          eventDate: extractedData.eventDate,
          startTime: extractedData.startTime,
          endTime: extractedData.endTime,
          venue: extractedData.venue,
          registrationDeadline: extractedData.registrationDeadline,
          submissionDeadline: extractedData.submissionDeadline,
          sourceType: extractedData.sourceType || sourceType,
          missingInfo: extractedData.missingInfo,
          instructions: extractedData.instructions,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || "Failed to save notice");
      }

      success("Notice Saved!", `"${extractedData.title}" is now added to your dashboard and calendar.`);
      handleClear();
      if (onNoticeSaved) onNoticeSaved();
    } catch (err: unknown) {
      console.error("Save error:", err);
      error("Failed to save notice", err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card p-5 sm:p-7 transition-all">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Smart Notice AI Extractor
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Core Feature
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste raw unstructured WhatsApp forwards, emails or posters — AI extracts dates, venues, deadlines & priorities.
            </p>
          </div>
        </div>

        {/* Source selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Source:</span>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as SourceType)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium cursor-pointer"
          >
            {sourceTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Sample Notice Pills (For immediate Hackathon testing!) */}
      <div className="mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <span>Quick Demo Presets:</span>
          <span className="text-[10px] lowercase font-normal text-slate-400">
            (click to test instantly)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_NOTICES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 dark:bg-slate-800 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all font-medium flex items-center gap-1.5"
            >
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Text Area */}
      <div className="relative mb-3">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste raw college notice here... (e.g. 'All students are informed that the Python workshop will be conducted on 15 November 2026 at 10 AM in Seminar Hall 2. Registration closes on 12 November.')"
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all resize-y leading-relaxed"
        />

        {/* Floating actions: Clear and Paste */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {inputText && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Clear input"
              aria-label="Clear input text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handlePaste}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Paste from clipboard"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Bar: Character count + Analyze Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{inputText.length.toLocaleString()} / 10,000 characters</span>
          {inputText.length > 0 && (
            <span className="text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Untrusted input protected
            </span>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !inputText.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Analyze with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Fallback Note / Info */}
      {extractionNote && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>{extractionNote}</div>
        </div>
      )}

      {/* Editable Extraction Preview Card */}
      {extractedData && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Extracted Information Preview (Editable)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              {isMockFallback ? "Local Heuristic Engine" : "Gemini 1.5 Flash Verified"}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
            {/* Title field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notice Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={extractedData.title}
                onChange={(e) =>
                  setExtractedData({ ...extractedData, title: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Summary / Description
              </label>
              <textarea
                rows={2}
                value={extractedData.description}
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    description: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={extractedData.category}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {noticeCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={extractedData.priority}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      priority: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {noticePriorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Start Time, Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={extractedData.eventDate || ""}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      eventDate: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={extractedData.startTime || ""}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      startTime: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Seminar Hall 2"
                  value={extractedData.venue || ""}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      venue: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Deadlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 November 2026 or ISO"
                  value={extractedData.registrationDeadline || ""}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      registrationDeadline: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 November 2026, 11:59 PM"
                  value={extractedData.submissionDeadline || ""}
                  onChange={(e) =>
                    setExtractedData({
                      ...extractedData,
                      submissionDeadline: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Missing Info Warning */}
            {extractedData.missingInfo && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <span className="font-bold">Missing Details Detected: </span>
                  {extractedData.missingInfo}
                </div>
              </div>
            )}

            {/* Confirmation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setExtractedData(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel / Re-paste
              </button>

              <button
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Save to Campus Pulse</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

