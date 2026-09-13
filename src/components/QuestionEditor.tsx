import React, { useState } from "react";
import type { Question, OptionKey, Difficulty, QuestionType } from "../types";
import { Button, Card } from "./ui";
import QuestionCard from "./QuestionCard";
import { useApp } from "../store/AppContext";
import { X } from "lucide-react";

interface Props {
  initial?: Question;
  onClose: () => void;
  onSave: (q: Question) => void;
}

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D", "E"];

function blankQuestion(): Question {
  return {
    id: `q-${Date.now()}`,
    subject: "",
    topic: "",
    subtopic: "",
    questionType: "single-best-answer",
    question: "",
    options: [
      { key: "A", text: "" },
      { key: "B", text: "" },
      { key: "C", text: "" },
      { key: "D", text: "" },
    ],
    correctAnswer: "A",
    explanation: "",
    clinicalPearl: "",
    optionExplanations: {},
    difficulty: "moderate",
    source: "",
    tags: [],
    createdAt: new Date().toISOString(),
  };
}

export default function QuestionEditor({ initial, onClose, onSave }: Props) {
  const { data } = useApp();
  const [q, setQ] = useState<Question>(initial ? { ...initial } : blankQuestion());
  const [tagsInput, setTagsInput] = useState(q.tags.join(", "));
  const [preview, setPreview] = useState(false);

  const subject = data.subjects.find((s) => s.id === q.subject);

  function setOptionText(key: OptionKey, text: string) {
    setQ((prev) => ({
      ...prev,
      options: prev.options.some((o) => o.key === key)
        ? prev.options.map((o) => (o.key === key ? { ...o, text } : o))
        : [...prev.options, { key, text }],
    }));
  }

  function removeOption(key: OptionKey) {
    setQ((prev) => ({ ...prev, options: prev.options.filter((o) => o.key !== key) }));
  }

  function addOption() {
    const nextKey = OPTION_KEYS.find((k) => !q.options.some((o) => o.key === k));
    if (!nextKey) return;
    setQ((prev) => ({ ...prev, options: [...prev.options, { key: nextKey, text: "" }] }));
  }

  function setOptionExplanation(key: OptionKey, text: string) {
    setQ((prev) => ({ ...prev, optionExplanations: { ...prev.optionExplanations, [key]: text } }));
  }

  function handleSave() {
    const cleaned: Question = {
      ...q,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      options: q.options.filter((o) => o.text.trim() !== ""),
    };
    onSave(cleaned);
  }

  const isValid =
    q.subject && q.topic && q.question.trim() && q.options.filter((o) => o.text.trim()).length >= 2 && q.explanation.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <Card className="my-8 w-full max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{initial ? "Edit Question" : "Add Question"}</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setPreview((p) => !p)}>
              {preview ? "Back to Edit" : "Preview"}
            </Button>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {preview ? (
          <QuestionCard
            question={{ ...q, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) }}
            selected={q.correctAnswer}
            revealed
            onSelect={() => {}}
            bookmarked={false}
            onToggleBookmark={() => {}}
          />
        ) : (
          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1 scrollbar-thin">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Subject">
                <select
                  value={q.subject}
                  onChange={(e) => setQ((p) => ({ ...p, subject: e.target.value, topic: "" }))}
                  className="input"
                >
                  <option value="">Select subject</option>
                  {data.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Topic">
                <select
                  value={q.topic}
                  onChange={(e) => setQ((p) => ({ ...p, topic: e.target.value }))}
                  disabled={!subject}
                  className="input"
                >
                  <option value="">Select topic</option>
                  {subject?.topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Subtopic (optional)">
              <input
                value={q.subtopic ?? ""}
                onChange={(e) => setQ((p) => ({ ...p, subtopic: e.target.value }))}
                className="input"
              />
            </Field>

            <Field label="Question / clinical vignette">
              <textarea
                value={q.question}
                onChange={(e) => setQ((p) => ({ ...p, question: e.target.value }))}
                rows={3}
                className="input"
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Options</p>
              <div className="space-y-2">
                {OPTION_KEYS.map((key) => {
                  const opt = q.options.find((o) => o.key === key);
                  if (!opt) return null;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 text-sm font-semibold">{key}</span>
                      <input
                        value={opt.text}
                        onChange={(e) => setOptionText(key, e.target.value)}
                        className="input flex-1"
                        placeholder={`Option ${key}`}
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={q.correctAnswer === key}
                        onChange={() => setQ((p) => ({ ...p, correctAnswer: key }))}
                        title="Mark as correct"
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(key)} className="text-slate-400 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {q.options.length < 5 && (
                  <button onClick={addOption} className="text-sm font-medium text-brand-600 hover:underline">
                    + Add option
                  </button>
                )}
              </div>
            </div>

            <Field label="Explanation">
              <textarea
                value={q.explanation}
                onChange={(e) => setQ((p) => ({ ...p, explanation: e.target.value }))}
                rows={2}
                className="input"
              />
            </Field>

            <Field label="Clinical pearl (optional)">
              <textarea
                value={q.clinicalPearl ?? ""}
                onChange={(e) => setQ((p) => ({ ...p, clinicalPearl: e.target.value }))}
                rows={2}
                className="input"
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Why other options are wrong (optional)
              </p>
              <div className="space-y-2">
                {q.options
                  .filter((o) => o.key !== q.correctAnswer)
                  .map((o) => (
                    <div key={o.key} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 text-sm font-semibold">{o.key}</span>
                      <input
                        value={q.optionExplanations?.[o.key] ?? ""}
                        onChange={(e) => setOptionExplanation(o.key, e.target.value)}
                        className="input flex-1"
                        placeholder={`Why ${o.key} is wrong`}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Difficulty">
                <select
                  value={q.difficulty}
                  onChange={(e) => setQ((p) => ({ ...p, difficulty: e.target.value as Difficulty }))}
                  className="input"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                </select>
              </Field>
              <Field label="Question type">
                <select
                  value={q.questionType}
                  onChange={(e) => setQ((p) => ({ ...p, questionType: e.target.value as QuestionType }))}
                  className="input"
                >
                  <option value="single-best-answer">Single-best-answer</option>
                  <option value="clinical-scenario">Clinical scenario</option>
                  <option value="true-false">True/False</option>
                  <option value="image-based">Image-based</option>
                  <option value="extended-matching">Extended matching</option>
                </select>
              </Field>
            </div>

            <Field label="Source / reference (leave blank if unknown - never fabricate)">
              <input
                value={q.source ?? ""}
                onChange={(e) => setQ((p) => ({ ...p, source: e.target.value }))}
                className="input"
              />
            </Field>

            <Field label="Tags (comma-separated)">
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="input" />
            </Field>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Question
          </Button>
        </div>
      </Card>
      <style>{`.input { width: 100%; border-radius: 0.5rem; border: 1px solid rgb(203 213 225); padding: 0.5rem 0.75rem; font-size: 0.875rem; background: white; }
      .dark .input { border-color: rgb(51 65 85); background: rgb(30 41 59); color: white; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  );
}
