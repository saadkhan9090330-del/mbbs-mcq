// ============================================================
// CORE DATA MODEL
// This file defines the shape of every piece of data in the app.
// Nothing else (UI, storage, quiz logic) should invent its own
// shapes — everything imports from here.
// ============================================================

export type Difficulty = "easy" | "moderate" | "difficult";

export type QuestionType =
  | "single-best-answer"
  | "clinical-scenario"
  | "true-false"
  | "image-based" // reserved for future use, editor supports it, engine treats like single-best-answer
  | "extended-matching"; // reserved for future use

export type OptionKey = "A" | "B" | "C" | "D" | "E";

export interface QuestionOption {
  key: OptionKey;
  text: string;
}

// A single MCQ. This is the atomic unit of the whole app.
export interface Question {
  id: string; // unique, stable id e.g. "cardio-0007"
  subject: string; // must match a Subject.id
  topic: string; // must match a Topic.id within that subject
  subtopic?: string;
  questionType: QuestionType;
  question: string; // supports the clinical vignette text
  options: QuestionOption[]; // 4-5 options
  correctAnswer: OptionKey;
  explanation: string;
  clinicalPearl?: string;
  optionExplanations?: Partial<Record<OptionKey, string>>; // why each wrong option is wrong
  difficulty: Difficulty;
  source?: string; // never fabricated - left blank if unknown
  tags: string[];
  image?: string; // reserved for image-based questions (data URL or path)
  createdAt: string; // ISO date
}

export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

// ------------------------------------------------------------
// PER-QUESTION PERFORMANCE / SPACED REVIEW RECORD
// One of these exists per question the user has ever attempted.
// ------------------------------------------------------------
export interface QuestionStat {
  questionId: string;
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempted: string | null; // ISO date
  nextReview: string | null; // ISO date, used by "Due for Review"
  lastSelected: OptionKey | null;
  lastCorrect: boolean | null;
  bookmarked: boolean;
  // simple streak used to space out review intervals
  correctStreak: number;
}

// A single logged answer event (used for quiz history / review screen)
export interface AttemptRecord {
  questionId: string;
  selected: OptionKey | null; // null = unanswered when time ran out
  correct: boolean;
  timeTakenSec: number;
  answeredAt: string; // ISO date
}

// A completed (or in-progress) quiz session
export interface QuizSession {
  id: string;
  subject?: string; // undefined = mixed/random across subjects
  topic?: string;
  startedAt: string;
  finishedAt?: string;
  questionIds: string[]; // the ordered set of questions in this quiz
  attempts: AttemptRecord[]; // parallel log, may be shorter than questionIds while in progress
  mode: QuizMode;
  answerMode: AnswerMode;
  timerMode: TimerMode;
  customTimerSec?: number;
}

export type QuizMode =
  | "all"
  | "unattempted"
  | "incorrect"
  | "bookmarked"
  | "weak"
  | "random";

export type AnswerMode = "immediate" | "end-of-quiz";
export type TimerMode = "none" | "per-question" | "custom";
export type QuestionOrder = "sequential" | "random";

export interface QuizConfig {
  subject?: string;
  topic?: string;
  count: number | "all";
  mode: QuizMode;
  difficulty: Difficulty | "mixed";
  answerMode: AnswerMode;
  order: QuestionOrder;
  timerMode: TimerMode;
  customTimerSec?: number;
}

// ------------------------------------------------------------
// APP-WIDE SETTINGS
// ------------------------------------------------------------
export interface AppSettings {
  theme: "light" | "dark";
  defaultQuestionCount: number;
  defaultDifficulty: Difficulty | "mixed";
  defaultAnswerMode: AnswerMode;
  timerMode: TimerMode;
  customTimerSec: number;
  dailyGoal: number;
  weakTopicThreshold: number; // percent, e.g. 70
}

// The single object persisted to storage
export interface AppData {
  version: number;
  questions: Question[];
  subjects: Subject[];
  stats: Record<string, QuestionStat>; // keyed by questionId
  sessions: QuizSession[];
  settings: AppSettings;
  dailyProgress: Record<string, number>; // date string -> questions answered that day
  questionOfDay: { date: string; questionId: string; answered: boolean } | null;
}
