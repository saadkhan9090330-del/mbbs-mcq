import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { Card, Button } from "../components/ui";

export default function RandomPractice() {
  const { data, addSession } = useApp();
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [count, setCount] = useState(20);

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function start() {
    let pool = data.questions;
    if (selectedSubjects.length > 0) {
      pool = pool.filter((q) => selectedSubjects.includes(q.subject));
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    if (shuffled.length === 0) return;
    const session = {
      id: `session-${Date.now()}`,
      startedAt: new Date().toISOString(),
      questionIds: shuffled.map((q) => q.id),
      attempts: [],
      mode: "random" as const,
      answerMode: data.settings.defaultAnswerMode,
      timerMode: data.settings.timerMode,
      customTimerSec: data.settings.customTimerSec,
    };
    addSession(session);
    navigate(`/quiz/${session.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Random Practice</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mixed questions across subjects and difficulty levels.
        </p>
      </div>

      <Card className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold">Subjects (leave empty for all)</p>
          <div className="flex flex-wrap gap-2">
            {data.subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSubject(s.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                  selectedSubjects.includes(s.id)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Number of questions</p>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 30, 50].map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                  count === c
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Button onClick={start}>Start Random Practice</Button>
    </div>
  );
}
