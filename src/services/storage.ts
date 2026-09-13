import type { AppData, AppSettings } from "../types";
import { DEFAULT_SUBJECTS } from "../data/subjects";
import { SAMPLE_QUESTIONS } from "../data/sampleQuestions";

// ============================================================
// STORAGE SERVICE
// This is the ONLY file that talks to localStorage directly.
// Everything else reads/writes AppData through the functions
// here. This makes it straightforward to later swap localStorage
// for a real backend (e.g. Supabase/Firebase/Postgres) - you
// would only need to change this file's internals, since the
// rest of the app just calls loadData()/saveData().
// ============================================================

const STORAGE_KEY = "mbbs-mcq-data-v1";
const CURRENT_VERSION = 1;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  defaultQuestionCount: 10,
  defaultDifficulty: "mixed",
  defaultAnswerMode: "immediate",
  timerMode: "none",
  customTimerSec: 60,
  dailyGoal: 20,
  weakTopicThreshold: 70,
};

function createFreshData(): AppData {
  return {
    version: CURRENT_VERSION,
    questions: SAMPLE_QUESTIONS,
    subjects: DEFAULT_SUBJECTS,
    stats: {},
    sessions: [],
    settings: { ...DEFAULT_SETTINGS },
    dailyProgress: {},
    questionOfDay: null,
  };
}

// Basic shape validation so a corrupted localStorage blob can never crash the app.
function isValidAppData(data: unknown): data is AppData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.questions) &&
    Array.isArray(d.subjects) &&
    typeof d.stats === "object" &&
    Array.isArray(d.sessions) &&
    typeof d.settings === "object"
  );
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = createFreshData();
      saveData(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw);
    if (!isValidAppData(parsed)) {
      console.warn("Corrupted MBBS MCQ data detected - resetting to defaults.");
      const fresh = createFreshData();
      saveData(fresh);
      return fresh;
    }
    // merge in defaults for any settings fields that might be missing after an update
    parsed.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
    if (!parsed.dailyProgress) parsed.dailyProgress = {};
    if (parsed.questionOfDay === undefined) parsed.questionOfDay = null;
    // If the user has no questions at all (e.g. very old export), keep sample bank
    if (!parsed.questions || parsed.questions.length === 0) {
      parsed.questions = SAMPLE_QUESTIONS;
    }
    if (!parsed.subjects || parsed.subjects.length === 0) {
      parsed.subjects = DEFAULT_SUBJECTS;
    }
    return parsed as AppData;
  } catch (err) {
    console.error("Failed to load app data, resetting to defaults:", err);
    const fresh = createFreshData();
    saveData(fresh);
    return fresh;
  }
}

export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error("Failed to save app data:", err);
    return false;
  }
}

export function resetAllData(): AppData {
  const fresh = createFreshData();
  saveData(fresh);
  return fresh;
}

// Reset only progress (stats/sessions/bookmarks/goals) but keep the question bank & subjects.
export function resetProgressOnly(current: AppData): AppData {
  const fresh: AppData = {
    ...current,
    stats: {},
    sessions: [],
    dailyProgress: {},
    questionOfDay: null,
  };
  saveData(fresh);
  return fresh;
}

export function exportDataAsJson(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importDataFromJson(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json);
    if (!isValidAppData(parsed)) return null;
    parsed.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
    if (!parsed.dailyProgress) parsed.dailyProgress = {};
    if (parsed.questionOfDay === undefined) parsed.questionOfDay = null;
    return parsed as AppData;
  } catch {
    return null;
  }
}
