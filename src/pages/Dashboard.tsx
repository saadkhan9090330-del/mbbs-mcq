import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { computeOverallStats, getQuestionOfDay, getDueForReview } from "../services/quizEngine";
import { Card, ProgressBar, Button, Badge } from "../components/ui";
import {
  BookOpen,
  Shuffle,
  TrendingDown,
  XCircle,
  Bookmark,
  BarChart3,
  Sparkles,
  Target,
  Clock,
} from "lucide-react";

const CARDS = [
  { to: "/subjects", label: "Subjects", icon: BookOpen, desc: "Browse by subject & topic" },
  { to: "/random", label: "Random MCQs", icon: Shuffle, desc: "Mixed practice" },
  { to: "/weak-topics", label: "Weak Topics", icon: TrendingDown, desc: "Focus your revision" },
  { to: "/incorrect", label: "Incorrect Questions", icon: XCircle, desc: "Fix your mistakes" },
  { to: "/bookmarks", label: "Bookmarked", icon: Bookmark, desc: "Your saved questions" },
  { to: "/statistics", label: "Statistics", icon: BarChart3, desc: "Track your progress" },
];

export default function Dashboard() {
  const { data, markQuestionOfDayAnswered } = useApp();
  const stats = computeOverallStats(data);
  const { question: qOfDay, answered: qOfDayAnswered } = getQuestionOfDay(data);
  const dueCount = getDueForReview(data).length;

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = data.dailyProgress[today] ?? 0;
  const goal = data.settings.dailyGoal;

  const lastSession = [...data.sessions].reverse().find((s) => !s.finishedAt);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">MBBS MCQ Practice</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Study the topic. Test yourself. Track your progress.
        </p>
      </div>

      {lastSession && (
        <Card className="flex items-center justify-between gap-4 border-brand-200 bg-brand-50/60 dark:border-brand-900 dark:bg-brand-900/10">
          <div>
            <p className="font-semibold text-brand-800 dark:text-brand-300">Continue where you left off</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lastSession.attempts.length} of {lastSession.questionIds.length} questions answered
            </p>
          </div>
          <Link to={`/quiz/${lastSession.id}`}>
            <Button>Continue</Button>
          </Link>
        </Card>
      )}

      {/* Overall stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatBox label="Attempted" value={stats.attempted} />
        <StatBox label="Correct" value={stats.correct} tone="green" />
        <StatBox label="Incorrect" value={stats.incorrect} tone="red" />
        <StatBox label="Accuracy" value={`${stats.accuracy}%`} />
        <StatBox label="Remaining" value={stats.remaining} />
        <StatBox label="Topics Done" value={`${stats.topicsCompleted}/${stats.totalTopics}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily goal */}
        <Card>
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-600" />
            <p className="font-semibold">Today's Goal</p>
          </div>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            {todayCount} / {goal} questions
          </p>
          <ProgressBar value={(todayCount / Math.max(goal, 1)) * 100} />
        </Card>

        {/* Question of the day */}
        <Card>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <p className="font-semibold">Question of the Day</p>
            {qOfDayAnswered && <Badge color="green">Answered</Badge>}
          </div>
          {qOfDay ? (
            <>
              <p className="mb-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{qOfDay.question}</p>
              <Link to={`/qotd`}>
                <Button
                  variant={qOfDayAnswered ? "secondary" : "primary"}
                  onClick={() => !qOfDayAnswered && markQuestionOfDayAnswered()}
                >
                  {qOfDayAnswered ? "Review" : "Answer now"}
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-sm text-slate-500">No questions available yet.</p>
          )}
        </Card>
      </div>

      {dueCount > 0 && (
        <Link to="/due-review">
          <Card className="flex items-center gap-3 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/10">
            <Clock className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {dueCount} question{dueCount === 1 ? "" : "s"} due for spaced review
            </p>
          </Card>
        </Link>
      )}

      {/* Quick links grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <c.icon className="mb-2 h-6 w-6 text-brand-600" />
              <p className="font-semibold">{c.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "green" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "text-green-600 dark:text-green-400"
      : tone === "red"
      ? "text-red-600 dark:text-red-400"
      : "text-slate-900 dark:text-slate-100";
  return (
    <Card className="text-center">
      <p className={`text-xl font-bold ${toneClass}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </Card>
  );
}
