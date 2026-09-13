import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { computeTopicPerformance, computeSubjectPerformance } from "../services/quizEngine";
import { Card, ProgressBar, Badge } from "../components/ui";
import { ChevronLeft } from "lucide-react";

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const { data } = useApp();
  const subject = data.subjects.find((s) => s.id === subjectId);

  if (!subject) return <Navigate to="/subjects" replace />;

  const subjectPerf = computeSubjectPerformance(data).find((s) => s.subjectId === subjectId);
  const topicPerf = computeTopicPerformance(data).filter((t) => t.subjectId === subjectId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ChevronLeft className="h-4 w-4" /> All subjects
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{subject.name}</h1>
        {subjectPerf && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subjectPerf.total} total questions · {subjectPerf.attempted} attempted · {subjectPerf.accuracy}% accuracy ·{" "}
            {subjectPerf.topicsCompleted}/{subjectPerf.totalTopics} topics completed
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topicPerf.map((t) => (
          <Link key={t.topicId} to={`/subjects/${subjectId}/topics/${t.topicId}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">{t.topicName}</p>
                <Badge>{t.total} Qs</Badge>
              </div>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                {t.attempted} attempted · {t.accuracy}% accuracy
              </p>
              <ProgressBar value={t.total > 0 ? (t.attempted / t.total) * 100 : 0} />
            </Card>
          </Link>
        ))}
        {topicPerf.length === 0 && (
          <p className="col-span-full text-sm text-slate-500">No topics found for this subject.</p>
        )}
      </div>
    </div>
  );
}
