import React, { useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { Card, Button, Badge } from "../components/ui";
import QuestionCard from "../components/QuestionCard";
import { getStat } from "../services/quizEngine";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

export default function Results() {
  const { sessionId } = useParams();
  const { data, bookmark, addSession } = useApp();
  const navigate = useNavigate();
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const session = data.sessions.find((s) => s.id === sessionId);
  if (!session) return <Navigate to="/" replace />;

  const questions = session.questionIds
    .map((id) => data.questions.find((q) => q.id === id))
    .filter(Boolean) as typeof data.questions;

  const correct = session.attempts.filter((a) => a.correct).length;
  const incorrect = session.attempts.filter((a) => !a.correct && a.selected !== null).length;
  const unanswered = questions.length - session.attempts.length + session.attempts.filter((a) => a.selected === null).length;
  const accuracy = session.attempts.length > 0 ? Math.round((correct / session.attempts.length) * 100) : 0;
  const totalTimeSec = session.attempts.reduce((s, a) => s + a.timeTakenSec, 0);
  const minutes = Math.floor(totalTimeSec / 60);
  const seconds = totalTimeSec % 60;

  const subjectName = session.subject ? data.subjects.find((s) => s.id === session.subject)?.name : "Mixed";
  const topicName = session.topic
    ? data.subjects.find((s) => s.id === session.subject)?.topics.find((t) => t.id === session.topic)?.name
    : undefined;

  function retryIncorrect() {
    if (!session) return;
    const incorrectIds = session.attempts.filter((a) => !a.correct).map((a) => a.questionId);
    if (incorrectIds.length === 0) return;
    const newSession = {
      id: `session-${Date.now()}`,
      subject: session.subject,
      topic: session.topic,
      startedAt: new Date().toISOString(),
      questionIds: incorrectIds,
      attempts: [],
      mode: "incorrect" as const,
      answerMode: session.answerMode,
      timerMode: session.timerMode,
      customTimerSec: session.customTimerSec,
    };
    // add via context - but we need addSession; get from useApp
    addSession(newSession);
    navigate(`/quiz/${newSession.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quiz Results</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {subjectName}
          {topicName ? ` › ${topicName}` : ""}
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Score" value={`${correct}/${questions.length}`} />
          <Stat label="Accuracy" value={`${accuracy}%`} tone="brand" />
          <Stat label="Correct" value={correct} tone="green" />
          <Stat label="Incorrect" value={incorrect} tone="red" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Unanswered" value={unanswered} />
          <Stat label="Time" value={`${minutes}m ${seconds}s`} />
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={retryIncorrect} disabled={incorrect === 0}>
          Retry Incorrect Questions
        </Button>
        {session.topic && (
          <Link to={`/subjects/${session.subject}/topics/${session.topic}`}>
            <Button variant="secondary">Back to Topic</Button>
          </Link>
        )}
        <Link to="/">
          <Button variant="ghost">Return to Dashboard</Button>
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Question Review</h2>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const attempt = session.attempts.find((a) => a.questionId === q.id);
            const isOpen = openQuestionId === q.id;
            return (
              <div key={q.id}>
                <button
                  onClick={() => setOpenQuestionId(isOpen ? null : q.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
                >
                  {attempt?.correct ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                  ) : attempt?.selected ? (
                    <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                  ) : (
                    <MinusCircle className="h-5 w-5 shrink-0 text-slate-400" />
                  )}
                  <span className="flex-1 truncate">
                    Q{i + 1}. {q.question}
                  </span>
                  <Badge color={attempt?.correct ? "green" : attempt?.selected ? "red" : "slate"}>
                    {attempt?.correct ? "Correct" : attempt?.selected ? "Incorrect" : "Skipped"}
                  </Badge>
                </button>
                {isOpen && (
                  <div className="mt-2">
                    <QuestionCard
                      question={q}
                      selected={attempt?.selected ?? null}
                      revealed
                      onSelect={() => {}}
                      bookmarked={getStat(data, q.id).bookmarked}
                      onToggleBookmark={() => bookmark(q.id)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "green" | "red" | "brand" }) {
  const toneClass =
    tone === "green"
      ? "text-green-600 dark:text-green-400"
      : tone === "red"
      ? "text-red-600 dark:text-red-400"
      : tone === "brand"
      ? "text-brand-600 dark:text-brand-400"
      : "text-slate-900 dark:text-slate-100";
  return (
    <div>
      <p className={`text-xl font-bold ${toneClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
