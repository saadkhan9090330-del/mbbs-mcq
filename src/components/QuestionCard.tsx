import React from "react";
import type { Question, OptionKey } from "../types";
import { Bookmark, BookmarkCheck, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "./ui";

interface Props {
  question: Question;
  selected: OptionKey | null;
  revealed: boolean; // true once the user has answered (or quiz is in end-of-quiz review mode)
  onSelect: (key: OptionKey) => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

const difficultyColor: Record<string, "green" | "amber" | "red"> = {
  easy: "green",
  moderate: "amber",
  difficult: "red",
};

export default function QuestionCard({
  question,
  selected,
  revealed,
  onSelect,
  bookmarked,
  onToggleBookmark,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge color={difficultyColor[question.difficulty] ?? "slate"}>{question.difficulty}</Badge>
        {question.subtopic && <Badge>{question.subtopic}</Badge>}
        <button
          onClick={onToggleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
          aria-pressed={bookmarked}
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
        >
          {bookmarked ? <BookmarkCheck className="h-5 w-5 text-brand-600" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <p className="mb-5 text-base leading-relaxed text-slate-800 dark:text-slate-100 md:text-lg">
        {question.question}
      </p>

      <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
        {question.options.map((opt) => {
          const isSelected = selected === opt.key;
          const isCorrectOption = opt.key === question.correctAnswer;

          let stateClasses =
            "border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:border-brand-500 dark:hover:bg-brand-900/10";
          if (revealed) {
            if (isCorrectOption) {
              stateClasses =
                "border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-900/20";
            } else if (isSelected && !isCorrectOption) {
              stateClasses = "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20";
            } else {
              stateClasses = "border-slate-200 opacity-60 dark:border-slate-800";
            }
          } else if (isSelected) {
            stateClasses = "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20";
          }

          return (
            <button
              key={opt.key}
              role="radio"
              aria-checked={isSelected}
              disabled={revealed}
              onClick={() => !revealed && onSelect(opt.key)}
              className={`flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-colors md:text-base ${stateClasses} disabled:cursor-default`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold">
                {opt.key}
              </span>
              <span className="flex-1 leading-snug">{opt.text}</span>
              {revealed && isCorrectOption && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />}
              {revealed && isSelected && !isCorrectOption && (
                <XCircle className="h-5 w-5 shrink-0 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/50">
          <div
            className={`flex items-center gap-2 font-semibold ${
              selected === question.correctAnswer ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
            }`}
          >
            {selected === question.correctAnswer ? (
              <>
                <CheckCircle2 className="h-5 w-5" /> Correct!
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                {selected ? "Incorrect" : "Not answered"} — correct answer is {question.correctAnswer}
              </>
            )}
          </div>

          <div>
            <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Explanation</p>
            <p className="text-slate-600 dark:text-slate-300">{question.explanation}</p>
          </div>

          {question.clinicalPearl && (
            <div>
              <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Clinical Pearl</p>
              <p className="text-slate-600 dark:text-slate-300">{question.clinicalPearl}</p>
            </div>
          )}

          {question.optionExplanations && Object.keys(question.optionExplanations).length > 0 && (
            <div>
              <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Why other options are wrong</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {Object.entries(question.optionExplanations).map(([key, text]) => (
                  <li key={key}>
                    <span className="font-semibold">{key}:</span> {text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.source && (
            <p className="text-xs text-slate-400 dark:text-slate-500">Reference: {question.source}</p>
          )}
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {question.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
