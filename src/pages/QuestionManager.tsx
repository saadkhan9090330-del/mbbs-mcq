import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../store/AppContext";
import type { Question, Difficulty, QuestionType } from "../types";
import { Card, Button, Badge, EmptyState } from "../components/ui";
import QuestionEditor from "../components/QuestionEditor";
import { Pencil, Copy, Trash2, Plus, Upload } from "lucide-react";

export default function QuestionManager() {
  const { data, addQuestion, updateQuestion, deleteQuestion } = useApp();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
  const [typeFilter, setTypeFilter] = useState<QuestionType | "">("");
  const [editing, setEditing] = useState<Question | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  const subject = data.subjects.find((s) => s.id === subjectFilter);

  const filtered = useMemo(() => {
    return data.questions.filter((q) => {
      if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
      if (subjectFilter && q.subject !== subjectFilter) return false;
      if (topicFilter && q.topic !== topicFilter) return false;
      if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
      if (typeFilter && q.questionType !== typeFilter) return false;
      return true;
    });
  }, [data.questions, search, subjectFilter, topicFilter, difficultyFilter, typeFilter]);

  function duplicate(q: Question) {
    const copy: Question = { ...q, id: `${q.id}-copy-${Date.now()}`, createdAt: new Date().toISOString() };
    addQuestion(copy);
  }

  function handleSave(q: Question) {
    if (data.questions.some((existing) => existing.id === q.id)) {
      updateQuestion(q);
    } else {
      addQuestion(q);
    }
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Question Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{data.questions.length} questions in your bank</p>
        </div>
        <div className="flex gap-2">
          <Link to="/manager/import">
            <Button variant="secondary">
              <Upload className="h-4 w-4" /> Import
            </Button>
          </Link>
          <Button onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        </div>
      </div>

      <Card className="space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setTopicFilter("");
            }}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All subjects</option>
            {data.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            disabled={!subject}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All topics</option>
            {subject?.topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | "")}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as QuestionType | "")}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All types</option>
            <option value="single-best-answer">Single-best-answer</option>
            <option value="clinical-scenario">Clinical scenario</option>
            <option value="true-false">True/False</option>
            <option value="image-based">Image-based</option>
            <option value="extended-matching">Extended matching</option>
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No questions match your filters" />
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <Card key={q.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{q.question}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge>{data.subjects.find((s) => s.id === q.subject)?.name ?? q.subject}</Badge>
                  <Badge>{q.difficulty}</Badge>
                  <Badge>{q.questionType}</Badge>
                </div>
              </div>
              <button
                onClick={() => setEditing(q)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => duplicate(q)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(q)}
                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <QuestionEditor
          initial={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-sm space-y-4">
            <p className="font-semibold">Delete this question?</p>
            <p className="truncate text-sm text-slate-500">{deleteTarget.question}</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteQuestion(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
