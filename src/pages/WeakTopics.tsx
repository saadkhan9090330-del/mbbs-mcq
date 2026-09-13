import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { getWeakTopics } from "../services/quizEngine";
import { Card, ProgressBar, Button, EmptyState } from "../components/ui";

export default function WeakTopics() {
  const { data, addSession } = useApp();
  const navigate = useNavigate();
  const weak = getWeakTopics(data);

  function practiceTopic(subjectId: string, topicId: string) {
    const questions = data.questions.filter((q) => q.topic === topicId);
    if (questions.length === 0) return;
    const session = {
      id: `session-${Date.now()}`,
      subject: subjectId,
      topic: topicId,
      startedAt: new Date().toISOString(),
      questionIds: questions.map((q) => q.id),
      attempts: [],
      mode: "weak" as const,
      answerMode: data.settings.defaultAnswerMode,
      timerMode: data.settings.timerMode,
      customTimerSec: data.settings.customTimerSec,
    };
    addSession(session);
    navigate(`/quiz/${session.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Weak Topics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Topics with accuracy below {data.settings.weakTopicThreshold}% (adjustable in Settings)
        </p>
      </div>

      {weak.length === 0 ? (
        <EmptyState
          title="No weak topics detected"
          subtitle="Attempt more questions across topics to see where you need the most work."
        />
      ) : (
        <div className="space-y-3">
          {weak.map((t) => {
            const subject = data.subjects.find((s) => s.id === t.subjectId);
            return (
              <Card key={t.topicId} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{t.topicName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{subject?.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={t.accuracy} className="w-40" />
                    <span className="text-sm font-semibold text-red-600">{t.accuracy}%</span>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => practiceTopic(t.subjectId, t.topicId)}>
                  Practice
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
