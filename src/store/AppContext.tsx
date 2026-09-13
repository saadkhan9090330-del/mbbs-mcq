import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AppData, Question, OptionKey, AppSettings, QuizSession } from "../types";
import {
  loadData,
  saveData,
  resetAllData,
  resetProgressOnly,
  exportDataAsJson,
  importDataFromJson,
} from "../services/storage";
import { recordAnswer as engineRecordAnswer, toggleBookmark as engineToggleBookmark, getQuestionOfDay } from "../services/quizEngine";

interface AppContextValue {
  data: AppData;
  answerQuestion: (question: Question, selected: OptionKey) => void;
  bookmark: (questionId: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  addQuestion: (q: Question) => void;
  updateQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  bulkAddQuestions: (qs: Question[]) => void;
  addSession: (session: QuizSession) => void;
  updateSession: (session: QuizSession) => void;
  markQuestionOfDayAnswered: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
  resetProgress: () => void;
  resetEverything: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  // persist on every change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // ensure a "question of the day" is set for today
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setData((prev) => {
      if (prev.questionOfDay && prev.questionOfDay.date === today) return prev;
      const { question } = getQuestionOfDay(prev);
      if (!question) return prev;
      return { ...prev, questionOfDay: { date: today, questionId: question.id, answered: false } };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // apply theme class to <html> for Tailwind's darkMode: 'class'
  useEffect(() => {
    const root = document.documentElement;
    if (data.settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [data.settings.theme]);

  const answerQuestion = useCallback((question: Question, selected: OptionKey) => {
    setData((prev) => engineRecordAnswer(prev, question, selected));
  }, []);

  const bookmark = useCallback((questionId: string) => {
    setData((prev) => engineToggleBookmark(prev, questionId));
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...partial } }));
  }, []);

  const addQuestion = useCallback((q: Question) => {
    setData((prev) => ({ ...prev, questions: [...prev.questions, q] }));
  }, []);

  const updateQuestion = useCallback((q: Question) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((existing) => (existing.id === q.id ? q : existing)),
    }));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }, []);

  const bulkAddQuestions = useCallback((qs: Question[]) => {
    setData((prev) => ({ ...prev, questions: [...prev.questions, ...qs] }));
  }, []);

  const addSession = useCallback((session: QuizSession) => {
    setData((prev) => ({ ...prev, sessions: [...prev.sessions, session] }));
  }, []);

  const updateSession = useCallback((session: QuizSession) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === session.id ? session : s)),
    }));
  }, []);

  const markQuestionOfDayAnswered = useCallback(() => {
    setData((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      if (!prev.questionOfDay || prev.questionOfDay.date !== today) return prev;
      return { ...prev, questionOfDay: { ...prev.questionOfDay, answered: true } };
    });
  }, []);

  const exportJson = useCallback(() => exportDataAsJson(data), [data]);

  const importJson = useCallback((json: string) => {
    const imported = importDataFromJson(json);
    if (!imported) return false;
    setData(imported);
    return true;
  }, []);

  const resetProgress = useCallback(() => {
    setData((prev) => resetProgressOnly(prev));
  }, []);

  const resetEverything = useCallback(() => {
    setData(resetAllData());
  }, []);

  const value: AppContextValue = {
    data,
    answerQuestion,
    bookmark,
    updateSettings,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    bulkAddQuestions,
    addSession,
    updateSession,
    markQuestionOfDayAnswered,
    exportJson,
    importJson,
    resetProgress,
    resetEverything,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
