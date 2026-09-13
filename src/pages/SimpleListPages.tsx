import React, { useState } from "react";
import { useApp } from "../store/AppContext";
import { getBookmarkedQuestions, getIncorrectQuestions, getDueForReview, getQuestionOfDay } from "../services/quizEngine";
import QuestionListPage from "./QuestionListPage";
import QuestionCard from "../components/QuestionCard";
import { Card } from "../components/ui";
import type { OptionKey } from "../types";

export function BookmarksPage() {
  const { data } = useApp();
  return (
    <QuestionListPage
      title="Bookmarked Questions"
      subtitle="Questions you've saved for later review"
      questions={getBookmarkedQuestions(data)}
      practiceMode="bookmarked"
      emptyMessage="Bookmark questions while practicing to build a personal revision list."
    />
  );
}

export function IncorrectPage() {
  const { data } = useApp();
  return (
    <QuestionListPage
      title="Incorrect Questions"
      subtitle="Questions you most recently got wrong"
      questions={getIncorrectQuestions(data)}
      practiceMode="incorrect"
      emptyMessage="Questions you answer incorrectly will show up here automatically."
    />
  );
}

export function DueForReviewPage() {
  const { data } = useApp();
  return (
    <QuestionListPage
      title="Due for Review"
      subtitle="Spaced-review questions scheduled for today or earlier"
      questions={getDueForReview(data)}
      practiceMode="all"
      emptyMessage="Nothing is due right now - keep practicing and questions will appear here on their review schedule."
    />
  );
}

export function QuestionOfDayPage() {
  const { data, answerQuestion, bookmark, markQuestionOfDayAnswered } = useApp();
  const { question, answered } = getQuestionOfDay(data);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [revealed, setRevealed] = useState(answered);

  if (!question) {
    return <Card>No question available today.</Card>;
  }

  const stat = data.stats[question.id];

  function handleSelect(key: OptionKey) {
    if (revealed || !question) return;
    setSelected(key);
    answerQuestion(question, key);
    markQuestionOfDayAnswered();
    setRevealed(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Question of the Day</h1>
      <QuestionCard
        question={question}
        selected={selected ?? (answered ? stat?.lastSelected ?? null : null)}
        revealed={revealed}
        onSelect={handleSelect}
        bookmarked={stat?.bookmarked ?? false}
        onToggleBookmark={() => bookmark(question.id)}
      />
    </div>
  );
}
