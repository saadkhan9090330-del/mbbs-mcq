import React, { useRef, useState } from "react";
import { useApp } from "../store/AppContext";
import { Card, Button } from "../components/ui";
import type { AnswerMode, Difficulty, TimerMode } from "../types";

export default function SettingsPage() {
  const { data, updateSettings, exportJson, importJson, resetProgress, resetEverything } = useApp();
  const s = data.settings;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<"progress" | "everything" | null>(null);

  function handleExport() {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mbbs-mcq-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJson(String(reader.result));
      setMessage(ok ? "Backup imported successfully." : "That file doesn't look like a valid backup.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="space-y-4">
        <p className="font-semibold">Appearance</p>
        <div className="flex gap-2">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize ${
                s.theme === t ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <p className="font-semibold">Practice Defaults</p>
        <SettingRow label="Default question count">
          <select
            value={s.defaultQuestionCount}
            onChange={(e) => updateSettings({ defaultQuestionCount: Number(e.target.value) })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            {[5, 10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </SettingRow>
        <SettingRow label="Default difficulty">
          <select
            value={s.defaultDifficulty}
            onChange={(e) => updateSettings({ defaultDifficulty: e.target.value as Difficulty | "mixed" })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="mixed">Mixed</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
          </select>
        </SettingRow>
        <SettingRow label="Default answer mode">
          <select
            value={s.defaultAnswerMode}
            onChange={(e) => updateSettings({ defaultAnswerMode: e.target.value as AnswerMode })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="immediate">Immediate feedback</option>
            <option value="end-of-quiz">End of quiz</option>
          </select>
        </SettingRow>
        <SettingRow label="Timer preference">
          <select
            value={s.timerMode}
            onChange={(e) => updateSettings({ timerMode: e.target.value as TimerMode })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="none">No timer</option>
            <option value="per-question">1 min/question</option>
            <option value="custom">Custom</option>
          </select>
        </SettingRow>
        {s.timerMode === "custom" && (
          <SettingRow label="Custom timer (seconds)">
            <input
              type="number"
              min={10}
              value={s.customTimerSec}
              onChange={(e) => updateSettings({ customTimerSec: Number(e.target.value) })}
              className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </SettingRow>
        )}
        <SettingRow label="Daily question goal">
          <input
            type="number"
            min={1}
            value={s.dailyGoal}
            onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })}
            className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </SettingRow>
        <SettingRow label="Weak topic threshold (%)">
          <input
            type="number"
            min={1}
            max={99}
            value={s.weakTopicThreshold}
            onChange={(e) => updateSettings({ weakTopicThreshold: Number(e.target.value) })}
            className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </SettingRow>
      </Card>

      <Card className="space-y-4">
        <p className="font-semibold">Backup &amp; Data</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>
            Export My Data
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Import My Data
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        </div>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </Card>

      <Card className="space-y-4 border-red-200 dark:border-red-900">
        <p className="font-semibold text-red-700 dark:text-red-400">Danger Zone</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" onClick={() => setConfirmReset("progress")}>
            Reset Progress Only
          </Button>
          <Button variant="danger" onClick={() => setConfirmReset("everything")}>
            Reset Everything
          </Button>
        </div>
      </Card>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-sm space-y-4">
            <p className="font-semibold">Are you sure?</p>
            <p className="text-sm text-slate-500">
              {confirmReset === "progress"
                ? "This will erase all attempts, scores, bookmarks, and statistics, but keep your question bank."
                : "This will erase EVERYTHING including your custom questions and progress. This cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmReset(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirmReset === "progress") resetProgress();
                  else resetEverything();
                  setConfirmReset(null);
                }}
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
      {children}
    </div>
  );
}
