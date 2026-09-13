import React from "react";
import { useApp } from "../store/AppContext";
import { computeOverallStats, computeSubjectPerformance, computeTopicPerformance } from "../services/quizEngine";
import { Card, ProgressBar } from "../components/ui";
import type { Difficulty } from "../types";

export default function Statistics() {
  const { data } = useApp();
  const overall = computeOverallStats(data);
  const subjectPerf = computeSubjectPerformance(data).filter((s) => s.attempted > 0);
  const topicPerf = computeTopicPerformance(data).filter((t) => t.attempted > 0);

  const bestSubject = [...subjectPerf].sort((a, b) => b.accuracy - a.accuracy)[0];
  const weakestSubject = [...subjectPerf].sort((a, b) => a.accuracy - b.accuracy)[0];
  const bestTopic = [...topicPerf].sort((a, b) => b.accuracy - a.accuracy)[0];
  const weakestTopic = [...topicPerf].sort((a, b) => a.accuracy - b.accuracy)[0];

  const difficulties: Difficulty[] = ["easy", "moderate", "difficult"];
  const difficultyPerf = difficulties.map((d) => {
    const qs = data.questions.filter((q) => q.difficulty === d);
    const attempted = qs.filter((q) => data.stats[q.id]?.attempts);
    const correct = attempted.filter((q) => data.stats[q.id]?.lastCorrect);
    return {
      difficulty: d,
      total: qs.length,
      attempted: attempted.length,
      accuracy: attempted.length > 0 ? Math.round((correct.length / attempted.length) * 100) : 0,
    };
  });

  const daysWithActivity = Object.keys(data.dailyProgress).length;
  const totalAnswered = Object.values(data.dailyProgress).reduce((a, b) => a + b, 0);
  const avgPerDay = daysWithActivity > 0 ? Math.round(totalAnswered / daysWithActivity) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Overall Accuracy" value={`${overall.accuracy}%`} />
        <Metric label="Questions Attempted" value={overall.attempted} />
        <Metric label="Correct Answers" value={overall.correct} tone="green" />
        <Metric label="Incorrect Answers" value={overall.incorrect} tone="red" />
        <Metric label="Avg Questions/Day" value={avgPerDay} />
        <Metric label="Active Days" value={daysWithActivity} />
        <Metric label="Best Subject" value={bestSubject?.subjectName ?? "—"} />
        <Metric label="Weakest Subject" value={weakestSubject?.subjectName ?? "—"} />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase text-slate-400">Best Topic</p>
          <p className="mt-1 font-semibold">{bestTopic ? `${bestTopic.topicName} (${bestTopic.accuracy}%)` : "—"}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase text-slate-400">Weakest Topic</p>
          <p className="mt-1 font-semibold">{weakestTopic ? `${weakestTopic.topicName} (${weakestTopic.accuracy}%)` : "—"}</p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Subject-wise Performance</h2>
        <div className="space-y-2">
          {subjectPerf.length === 0 && <p className="text-sm text-slate-500">No attempts yet.</p>}
          {subjectPerf.map((s) => (
            <Card key={s.subjectId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{s.subjectName}</span>
                <span className="text-slate-500">
                  {s.correct}/{s.attempted} · {s.accuracy}%
                </span>
              </div>
              <ProgressBar value={s.accuracy} />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Topic-wise Performance</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {topicPerf.map((t) => (
            <Card key={t.topicId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{t.topicName}</span>
                <span className="text-slate-500">{t.accuracy}%</span>
              </div>
              <ProgressBar value={t.accuracy} />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Difficulty-wise Performance</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {difficultyPerf.map((d) => (
            <Card key={d.difficulty}>
              <p className="mb-1 text-sm font-medium capitalize">{d.difficulty}</p>
              <p className="mb-2 text-xs text-slate-500">
                {d.attempted}/{d.total} attempted
              </p>
              <ProgressBar value={d.accuracy} />
              <p className="mt-1 text-right text-xs text-slate-500">{d.accuracy}%</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "green" | "red" }) {
  const toneClass =
    tone === "green" ? "text-green-600 dark:text-green-400" : tone === "red" ? "text-red-600 dark:text-red-400" : "";
  return (
    <Card className="text-center">
      <p className={`text-lg font-bold ${toneClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </Card>
  );
}
