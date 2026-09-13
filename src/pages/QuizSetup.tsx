import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { buildQuizQuestions } from "../services/quizEngine";
import { Card, Button } from "../components/ui";
import type { QuizConfig, QuizMode, Difficulty, AnswerMode, QuestionOrder, TimerMode } from "../types";

const COUNT_OPTIONS = [5, 10, 20, 30, 50, "all"] as const;
const MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: "all", label: "All questions" },
  { value: "unattempted", label: "Unattempted" },
  { value: "incorrect", label: "Incorrect questions" },
  { value: "bookmarked", label: "Bookmarked" },
  { value: "weak", label: "Weak questions" },
  { value: "random", label: "Random" },
];
const DIFFICULTY_OPTIONS: { value: Difficulty | "mixed"; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
];

function OptionRow<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              value === opt.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function QuizSetup() {
  const { subjectId, topicId } = useParams();
  const { data, addSession } = useApp();
  const navigate = useNavigate();

  const subject = subjectId ? data.subjects.find((s) => s.id === subjectId) : undefined;
  const topic = topicId ? subject?.topics.find((t) => t.id === topicId) : undefined;

  if (subjectId && !subject) return <Navigate to="/subjects" replace />;
  if (topicId && !topic) return <Navigate to={`/subjects/${subjectId}`} replace />;

  const [count, setCount] = useState<(typeof COUNT_OPTIONS)[number]>(data.settings.defaultQuestionCount as 10);
  const [mode, setMode] = useState<QuizMode>("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">(data.settings.defaultDifficulty);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(data.settings.defaultAnswerMode);
  const [order, setOrder] = useState<QuestionOrder>("sequential");
  const [timerMode, setTimerMode] = useState<TimerMode>(data.settings.timerMode);

  const config: QuizConfig = {
    subject: subject?.id,
    topic: topic?.id,
    count: count === "all" ? "all" : count,
    mode,
    difficulty,
    answerMode,
    order,
    timerMode,
    customTimerSec: data.settings.customTimerSec,
  };

  const previewCount = buildQuizQuestions(data, config).length;

  function startQuiz() {
    const questions = buildQuizQuestions(data, config);
    if (questions.length === 0) return;
    const session = {
      id: `session-${Date.now()}`,
      subject: subject?.id,
      topic: topic?.id,
      startedAt: new Date().toISOString(),
      questionIds: questions.map((q) => q.id),
      attempts: [],
      mode,
      answerMode,
      timerMode,
      customTimerSec: data.settings.customTimerSec,
    };
    addSession(session);
    navigate(`/quiz/${session.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Practice Setup</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {subject ? `${subject.name}${topic ? ` › ${topic.name}` : ""}` : "Random practice"}
        </p>
      </div>

      <Card className="space-y-5">
        <OptionRow
          label="Number of questions"
          options={COUNT_OPTIONS.map((c) => ({ value: c, label: c === "all" ? "All available" : String(c) }))}
          value={count}
          onChange={setCount}
        />
        <OptionRow label="Question mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <OptionRow label="Difficulty" options={DIFFICULTY_OPTIONS} value={difficulty} onChange={setDifficulty} />
        <OptionRow
          label="Answer mode"
          options={[
            { value: "immediate", label: "Immediate feedback" },
            { value: "end-of-quiz", label: "End of quiz" },
          ]}
          value={answerMode}
          onChange={setAnswerMode}
        />
        <OptionRow
          label="Question order"
          options={[
            { value: "sequential", label: "Sequential" },
            { value: "random", label: "Random" },
          ]}
          value={order}
          onChange={setOrder}
        />
        <OptionRow
          label="Timer"
          options={[
            { value: "none", label: "No timer" },
            { value: "per-question", label: "1 min/question" },
            { value: "custom", label: `Custom (${data.settings.customTimerSec}s)` },
          ]}
          value={timerMode}
          onChange={setTimerMode}
        />
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{previewCount} question(s) match this setup</p>
        <Button onClick={startQuiz} disabled={previewCount === 0}>
          Start Practice
        </Button>
      </div>
      {previewCount === 0 && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          No questions match these filters yet. Try a different mode or difficulty.
        </p>
      )}
    </div>
  );
}
