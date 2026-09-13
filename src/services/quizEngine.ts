import type {
  AppData,
  Question,
  QuestionStat,
  QuizConfig,
  OptionKey,
  Difficulty,
} from "../types";

// ============================================================
// QUIZ ENGINE
// Pure functions for: selecting questions for a quiz, scoring an
// answer, updating stats, spaced-review scheduling, and computing
// weak topics / subject-and-topic performance. Kept separate from
// UI and storage so quiz rules live in exactly one place.
// ============================================================

export function getStat(data: AppData, questionId: string): QuestionStat {
  return (
    data.stats[questionId] ?? {
      questionId,
      attempts: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastAttempted: null,
      nextReview: null,
      lastSelected: null,
      lastCorrect: null,
      bookmarked: false,
      correctStreak: 0,
    }
  );
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Filters the full question bank down to a subject/topic/difficulty scope.
export function scopeQuestions(
  data: AppData,
  subject?: string,
  topic?: string,
  difficulty?: Difficulty | "mixed"
): Question[] {
  return data.questions.filter((q) => {
    if (subject && q.subject !== subject) return false;
    if (topic && q.topic !== topic) return false;
    if (difficulty && difficulty !== "mixed" && q.difficulty !== difficulty) return false;
    return true;
  });
}

// Applies the "mode" filter (unattempted / incorrect / bookmarked / weak / random / all)
export function applyModeFilter(
  data: AppData,
  questions: Question[],
  mode: QuizConfig["mode"],
  weakThreshold: number
): Question[] {
  switch (mode) {
    case "unattempted":
      return questions.filter((q) => getStat(data, q.id).attempts === 0);
    case "incorrect":
      return questions.filter((q) => getStat(data, q.id).lastCorrect === false);
    case "bookmarked":
      return questions.filter((q) => getStat(data, q.id).bookmarked);
    case "weak": {
      const weakTopicIds = new Set(
        computeTopicPerformance(data, questions)
          .filter((t) => t.accuracy < weakThreshold && t.attempted > 0)
          .map((t) => t.topicId)
      );
      return questions.filter((q) => weakTopicIds.has(q.topic));
    }
    case "random":
    case "all":
    default:
      return questions;
  }
}

// Builds the final ordered question list for a new quiz session.
export function buildQuizQuestions(data: AppData, config: QuizConfig): Question[] {
  let pool = scopeQuestions(data, config.subject, config.topic, config.difficulty);
  pool = applyModeFilter(data, pool, config.mode, data.settings.weakTopicThreshold);

  if (config.order === "random" || config.mode === "random") {
    pool = shuffle(pool);
  }

  if (config.count !== "all") {
    pool = pool.slice(0, config.count);
  }
  return pool;
}

// Records a single answer: correctness, stats, spaced-review scheduling.
// Returns the updated AppData (does not mutate the input).
export function recordAnswer(
  data: AppData,
  question: Question,
  selected: OptionKey
): AppData {
  const stat = getStat(data, question.id);
  const correct = selected === question.correctAnswer;

  const correctStreak = correct ? stat.correctStreak + 1 : 0;
  const nextReview = computeNextReview(correctStreak, correct);

  const updatedStat: QuestionStat = {
    ...stat,
    attempts: stat.attempts + 1,
    correctCount: stat.correctCount + (correct ? 1 : 0),
    incorrectCount: stat.incorrectCount + (correct ? 0 : 1),
    lastAttempted: new Date().toISOString(),
    nextReview,
    lastSelected: selected,
    lastCorrect: correct,
    correctStreak,
  };

  const today = new Date().toISOString().slice(0, 10);
  const dailyProgress = {
    ...data.dailyProgress,
    [today]: (data.dailyProgress[today] ?? 0) + 1,
  };

  return {
    ...data,
    stats: { ...data.stats, [question.id]: updatedStat },
    dailyProgress,
  };
}

// Simple spaced-review algorithm (Section 16 of the spec):
// - incorrect (streak 0): review again soon (tomorrow)
// - correct once (streak 1): review in a few days
// - correct repeatedly: push the interval out further, capped at 30 days
function computeNextReview(streak: number, correct: boolean): string {
  const days = !correct ? 1 : Math.min(2 ** streak, 30); // 1,2,4,8,16,30,30...
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function toggleBookmark(data: AppData, questionId: string): AppData {
  const stat = getStat(data, questionId);
  return {
    ...data,
    stats: {
      ...data.stats,
      [questionId]: { ...stat, bookmarked: !stat.bookmarked },
    },
  };
}

// ------------------------------------------------------------
// PERFORMANCE / STATISTICS
// ------------------------------------------------------------
export interface TopicPerformance {
  subjectId: string;
  topicId: string;
  topicName: string;
  total: number;
  attempted: number;
  correct: number;
  accuracy: number; // 0-100, 0 if unattempted
}

export function computeTopicPerformance(
  data: AppData,
  scopeQ?: Question[]
): TopicPerformance[] {
  const questions = scopeQ ?? data.questions;
  const map = new Map<string, TopicPerformance>();

  for (const subject of data.subjects) {
    for (const topic of subject.topics) {
      map.set(topic.id, {
        subjectId: subject.id,
        topicId: topic.id,
        topicName: topic.name,
        total: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
      });
    }
  }

  for (const q of questions) {
    const entry = map.get(q.topic);
    if (!entry) continue;
    entry.total += 1;
    const stat = data.stats[q.id];
    if (stat && stat.attempts > 0) {
      entry.attempted += 1;
      if (stat.lastCorrect) entry.correct += 1;
    }
  }

  for (const entry of map.values()) {
    entry.accuracy = entry.attempted > 0 ? Math.round((entry.correct / entry.attempted) * 100) : 0;
  }

  return Array.from(map.values());
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  total: number;
  attempted: number;
  correct: number;
  accuracy: number;
  topicsCompleted: number; // topics where all questions attempted at least once
  totalTopics: number;
}

export function computeSubjectPerformance(data: AppData): SubjectPerformance[] {
  const topicPerf = computeTopicPerformance(data);
  return data.subjects.map((subject) => {
    const topics = topicPerf.filter((t) => t.subjectId === subject.id);
    const total = topics.reduce((sum, t) => sum + t.total, 0);
    const attempted = topics.reduce((sum, t) => sum + t.attempted, 0);
    const correct = topics.reduce((sum, t) => sum + t.correct, 0);
    const topicsCompleted = topics.filter((t) => t.total > 0 && t.attempted === t.total).length;
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      total,
      attempted,
      correct,
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      topicsCompleted,
      totalTopics: topics.length,
    };
  });
}

export interface OverallStats {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  remaining: number;
  topicsCompleted: number;
  totalTopics: number;
}

export function computeOverallStats(data: AppData): OverallStats {
  const subjPerf = computeSubjectPerformance(data);
  const totalQuestions = data.questions.length;
  const attempted = subjPerf.reduce((s, x) => s + x.attempted, 0);
  const correct = subjPerf.reduce((s, x) => s + x.correct, 0);
  const incorrect = attempted - correct;
  const topicsCompleted = subjPerf.reduce((s, x) => s + x.topicsCompleted, 0);
  const totalTopics = subjPerf.reduce((s, x) => s + x.totalTopics, 0);
  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    remaining: totalQuestions - attempted,
    topicsCompleted,
    totalTopics,
  };
}

export function getWeakTopics(data: AppData): TopicPerformance[] {
  return computeTopicPerformance(data)
    .filter((t) => t.attempted > 0 && t.accuracy < data.settings.weakTopicThreshold)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getDueForReview(data: AppData): Question[] {
  const now = new Date();
  return data.questions.filter((q) => {
    const stat = data.stats[q.id];
    if (!stat || !stat.nextReview) return false;
    return new Date(stat.nextReview) <= now;
  });
}

export function getIncorrectQuestions(data: AppData, subject?: string, topic?: string): Question[] {
  return data.questions.filter((q) => {
    const stat = data.stats[q.id];
    if (!stat || stat.lastCorrect !== false) return false;
    if (subject && q.subject !== subject) return false;
    if (topic && q.topic !== topic) return false;
    return true;
  });
}

export function getBookmarkedQuestions(data: AppData): Question[] {
  return data.questions.filter((q) => data.stats[q.id]?.bookmarked);
}

export function getQuestionOfDay(data: AppData): { question: Question | null; answered: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  if (data.questionOfDay && data.questionOfDay.date === today) {
    const q = data.questions.find((x) => x.id === data.questionOfDay!.questionId) ?? null;
    return { question: q, answered: data.questionOfDay.answered };
  }
  // Need a new question of the day - deterministic-ish pick based on date so it doesn't change on refresh
  if (data.questions.length === 0) return { question: null, answered: false };
  const seed = today.split("-").reduce((acc, part) => acc + parseInt(part, 10), 0);
  const idx = seed % data.questions.length;
  return { question: data.questions[idx], answered: false };
}
