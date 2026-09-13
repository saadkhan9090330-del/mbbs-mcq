import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import QuestionCard from "../components/QuestionCard";
import { Button, ProgressBar } from "../components/ui";
import type { OptionKey, AttemptRecord, QuizSession } from "../types";
import { getStat } from "../services/quizEngine";
import { AlertTriangle } from "lucide-react";

// A harmless placeholder session used only to keep hook call order stable
// when the real session hasn't loaded yet (or doesn't exist). We never
// persist this - it just lets every hook below run unconditionally, which
// React's rules require.
const EMPTY_SESSION: QuizSession = {
  id: "__none__",
  startedAt: new Date().toISOString(),
  questionIds: [],
  attempts: [],
  mode: "all",
  answerMode: "immediate",
  timerMode: "none",
};

export default function Quiz() {
  const { sessionId } = useParams();
  const { data, answerQuestion, updateSession, bookmark } = useApp();
  const navigate = useNavigate();

  const realSession = data.sessions.find((s) => s.id === sessionId);
  const session = realSession ?? EMPTY_SESSION;

  const questions = useMemo(
    () => session.questionIds.map((id) => data.questions.find((q) => q.id === id)).filter(Boolean) as typeof data.questions,
    [session.questionIds, data.questions]
  );

  const [index, setIndex] = useState(session.attempts.length < questions.length ? session.attempts.length : 0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answeredThisQ, setAnsweredThisQ] = useState(false);
  const [attempts, setAttempts] = useState<AttemptRecord[]>(session.attempts);
  const [startTime, setStartTime] = useState(Date.now());
  const submittedRef = useRef(false);

  const totalTimerSec =
    session.timerMode === "per-question" ? 60 : session.timerMode === "custom" ? session.customTimerSec ?? 60 : null;
  const [secondsLeft, setSecondsLeft] = useState<number | null>(totalTimerSec);

  const current = questions[index];

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setAnsweredThisQ(false);
    setStartTime(Date.now());
    submittedRef.current = false;
    setSecondsLeft(totalTimerSec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function handleSubmit(finalSelection: OptionKey | null) {
    if (answeredThisQ || !current) return;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const correct = finalSelection === current.correctAnswer;

    const record: AttemptRecord = {
      questionId: current.id,
      selected: finalSelection,
      correct,
      timeTakenSec: timeTaken,
      answeredAt: new Date().toISOString(),
    };

    const newAttempts = [...attempts.filter((a) => a.questionId !== current.id), record];
    setAttempts(newAttempts);
    if (realSession) updateSession({ ...realSession, attempts: newAttempts });

    if (finalSelection) {
      answerQuestion(current, finalSelection);
    }

    setAnsweredThisQ(true);
    if (session.answerMode === "immediate") {
      setRevealed(true);
    }
  }

  // Countdown timer
  useEffect(() => {
    if (secondsLeft === null || answeredThisQ) return;
    if (secondsLeft <= 0) {
      if (!submittedRef.current) {
        submittedRef.current = true;
        handleSubmit(null);
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s !== null ? s - 1 : s)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, answeredThisQ]);

  if (!realSession) return <Navigate to="/" replace />;

  if (!current) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-lg font-semibold">This quiz has no questions.</p>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  function handleSelect(key: OptionKey) {
    if (answeredThisQ) return;
    setSelected(key);
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      finishQuiz(attempts);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function finishQuiz(finalAttempts: AttemptRecord[]) {
    updateSession({ ...session, attempts: finalAttempts, finishedAt: new Date().toISOString() });
    navigate(`/results/${session.id}`);
  }

  const stat = getStat(data, current.id);
  const progressPct = ((index + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {data.subjects.find((s) => s.id === current.subject)?.name} ›{" "}
          {data.subjects.find((s) => s.id === current.subject)?.topics.find((t) => t.id === current.topic)?.name}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-semibold">
            Question {index + 1} of {questions.length}
          </p>
          {secondsLeft !== null && !answeredThisQ && (
            <p
              className={`flex items-center gap-1 text-sm font-semibold ${
                secondsLeft <= 10 ? "text-red-600 animate-pulse" : "text-slate-500"
              }`}
            >
              {secondsLeft <= 10 && <AlertTriangle className="h-4 w-4" />}
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </p>
          )}
        </div>
        <ProgressBar value={progressPct} className="mt-2" />
      </div>

      <QuestionCard
        question={current}
        selected={selected}
        revealed={session.answerMode === "immediate" && revealed}
        onSelect={handleSelect}
        bookmarked={stat.bookmarked}
        onToggleBookmark={() => bookmark(current.id)}
      />
      {session.answerMode === "end-of-quiz" && answeredThisQ && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Answer recorded. You'll see correctness and explanations in the results review.
        </p>
      )}

      <div className="flex justify-end gap-3 pb-4">
        {!answeredThisQ ? (
          <Button onClick={() => handleSubmit(selected)} disabled={!selected}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>{index + 1 >= questions.length ? "Finish Quiz" : "Next Question"}</Button>
        )}
      </div>
    </div>
  );
}
