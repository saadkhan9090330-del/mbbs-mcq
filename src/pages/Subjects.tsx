import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { computeSubjectPerformance } from "../services/quizEngine";
import { Card, ProgressBar, Badge } from "../components/ui";

export default function Subjects() {
  const { data } = useApp();
  const perf = computeSubjectPerformance(data);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subjects</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Choose a subject to see its topics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {perf.map((s) => (
          <Link key={s.subjectId} to={`/subjects/${s.subjectId}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">{s.subjectName}</p>
                <Badge>{s.total} Qs</Badge>
              </div>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                {s.attempted} attempted · {s.accuracy}% accuracy · {s.topicsCompleted}/{s.totalTopics} topics done
              </p>
              <ProgressBar value={s.total > 0 ? (s.attempted / s.total) * 100 : 0} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
