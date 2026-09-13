import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import type { Question, QuizMode } from "../types";
import { Card, Button, Badge, EmptyState } from "../components/ui";

interface Props {
  title: string;
  subtitle?: string;
  questions: Question[];
  practiceMode: QuizMode;
  emptyMessage: string;
}

export default function QuestionListPage({ title, subtitle, questions, practiceMode, emptyMessage }: Props) {
  const { data, addSession } = useApp();
  const navigate = useNavigate();

  function practiceAll() {
    if (questions.length === 0) return;
    const session = {
      id: `session-${Date.now()}`,
      startedAt: new Date().toISOString(),
      questionIds: questions.map((q) => q.id),
      attempts: [],
      mode: practiceMode,
      answerMode: data.settings.defaultAnswerMode,
      timerMode: data.settings.timerMode,
      customTimerSec: data.settings.customTimerSec,
    };
    addSession(session);
    navigate(`/quiz/${session.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {questions.length > 0 && <Button onClick={practiceAll}>Practice All ({questions.length})</Button>}
      </div>

      {questions.length === 0 ? (
        <EmptyState title="Nothing here yet" subtitle={emptyMessage} />
      ) : (
        <div className="space-y-2">
          {questions.map((q) => (
            <Card key={q.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{q.question}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.subjects.find((s) => s.id === q.subject)?.name} ·{" "}
                  {data.subjects.find((s) => s.id === q.subject)?.topics.find((t) => t.id === q.topic)?.name}
                </p>
              </div>
              <Badge>{q.difficulty}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
