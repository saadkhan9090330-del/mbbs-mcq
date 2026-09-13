import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { Card, Badge, EmptyState } from "../components/ui";

export default function SearchPage() {
  const { data } = useApp();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const subjectMatches = useMemo(
    () => (q ? data.subjects.filter((s) => s.name.toLowerCase().includes(q)) : []),
    [q, data.subjects]
  );

  const topicMatches = useMemo(() => {
    if (!q) return [];
    const results: { subjectId: string; subjectName: string; topicId: string; topicName: string; count: number }[] = [];
    for (const s of data.subjects) {
      for (const t of s.topics) {
        if (t.name.toLowerCase().includes(q)) {
          const count = data.questions.filter((qq) => qq.topic === t.id).length;
          results.push({ subjectId: s.id, subjectName: s.name, topicId: t.id, topicName: t.name, count });
        }
      }
    }
    return results;
  }, [q, data.subjects, data.questions]);

  const questionMatches = useMemo(() => {
    if (!q) return [];
    return data.questions.filter(
      (qq) =>
        qq.question.toLowerCase().includes(q) ||
        qq.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (qq.subtopic ?? "").toLowerCase().includes(q)
    );
  }, [q, data.questions]);

  const hasResults = subjectMatches.length + topicMatches.length + questionMatches.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Search</h1>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions, subjects, topics, tags..."
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
      />

      {q && !hasResults && <EmptyState title="No results" subtitle="Try a different search term." />}

      {topicMatches.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase text-slate-400">Topics</h2>
          <div className="space-y-2">
            {topicMatches.map((t) => (
              <Link key={t.topicId} to={`/subjects/${t.subjectId}/topics/${t.topicId}`}>
                <Card className="flex items-center justify-between hover:shadow-md">
                  <div>
                    <p className="font-medium">{t.topicName}</p>
                    <p className="text-xs text-slate-500">{t.subjectName}</p>
                  </div>
                  <Badge>{t.count} questions</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {subjectMatches.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase text-slate-400">Subjects</h2>
          <div className="space-y-2">
            {subjectMatches.map((s) => (
              <Link key={s.id} to={`/subjects/${s.id}`}>
                <Card className="hover:shadow-md">
                  <p className="font-medium">{s.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {questionMatches.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase text-slate-400">Questions</h2>
          <div className="space-y-2">
            {questionMatches.slice(0, 30).map((qq) => (
              <Link key={qq.id} to={`/subjects/${qq.subject}/topics/${qq.topic}`}>
                <Card className="hover:shadow-md">
                  <p className="truncate text-sm">{qq.question}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {qq.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
