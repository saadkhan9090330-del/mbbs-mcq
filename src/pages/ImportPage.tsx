import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../store/AppContext";
import { Card, Button, Badge } from "../components/ui";
import { parseCsv, validateAndBuildQuestions, buildErrorReportCsv, SAMPLE_CSV_TEMPLATE } from "../utils/importUtils";
import type { ImportSummary } from "../utils/importUtils";
import type { Question } from "../types";
import { ChevronLeft, Download, FileUp } from "lucide-react";

export default function ImportPage() {
  const { data, bulkAddQuestions } = useApp();
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mbbs-mcq-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const existingIds = new Set(data.questions.map((q) => q.id));

      if (file.name.endsWith(".json")) {
        try {
          const parsed = JSON.parse(text);
          const arr: unknown[] = Array.isArray(parsed) ? parsed : parsed.questions ?? [];
          const rawRows = arr.map((item) => {
            const q = item as Record<string, unknown>;
            const flat: Record<string, string> = {
              id: String(q.id ?? ""),
              subject: String(q.subject ?? ""),
              topic: String(q.topic ?? ""),
              subtopic: String(q.subtopic ?? ""),
              question: String(q.question ?? ""),
              correctAnswer: String(q.correctAnswer ?? ""),
              explanation: String(q.explanation ?? ""),
              clinicalPearl: String(q.clinicalPearl ?? ""),
              difficulty: String(q.difficulty ?? ""),
              questionType: String(q.questionType ?? ""),
              source: String(q.source ?? ""),
              tags: Array.isArray(q.tags) ? (q.tags as string[]).join("|") : String(q.tags ?? ""),
            };
            const options = (q.options as { key: string; text: string }[]) ?? [];
            for (const opt of options) {
              flat[`option${opt.key}`] = opt.text;
            }
            return flat;
          });
          setSummary(validateAndBuildQuestions(rawRows, existingIds));
        } catch {
          setSummary({
            total: 0,
            valid: [],
            invalid: [{ row: 0, status: "invalid", reason: "File is not valid JSON", raw: {} }],
            duplicates: [],
          });
        }
      } else {
        const rows = parseCsv(text);
        setSummary(validateAndBuildQuestions(rows, existingIds));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function confirmImport() {
    if (!summary) return;
    const questions = summary.valid.map((r) => r.question).filter(Boolean) as Question[];
    if (questions.length > 0) bulkAddQuestions(questions);
    setSummary(null);
    setFileName(null);
  }

  function downloadErrorReport() {
    if (!summary) return;
    const csv = buildErrorReportCsv(summary);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-error-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/manager" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ChevronLeft className="h-4 w-4" /> Question Manager
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Import Questions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload a CSV or JSON file. Nothing is imported until you review the validation report and confirm.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <FileUp className="h-4 w-4" /> Choose CSV or JSON file
            <input type="file" accept=".csv,.json" className="hidden" onChange={handleFile} />
          </label>
          <Button variant="secondary" onClick={downloadTemplate}>
            <Download className="h-4 w-4" /> Download Sample CSV Template
          </Button>
        </div>
        {fileName && <p className="text-sm text-slate-500">Selected: {fileName}</p>}
        <p className="text-xs text-slate-400">
          Required columns: subject, topic, question, optionA, optionB, correctAnswer. Optional: id, subtopic, optionC,
          optionD, optionE, explanation, clinicalPearl, difficulty, questionType, source, tags.
        </p>
      </Card>

      {summary && (
        <Card className="space-y-4">
          <p className="font-semibold">Validation Report</p>
          <div className="flex flex-wrap gap-2">
            <Badge>{summary.total} detected</Badge>
            <Badge color="green">{summary.valid.length} valid</Badge>
            <Badge color="red">{summary.invalid.length} invalid</Badge>
            <Badge color="amber">{summary.duplicates.length} duplicate</Badge>
          </div>

          {(summary.invalid.length > 0 || summary.duplicates.length > 0) && (
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
              {[...summary.invalid, ...summary.duplicates].map((r, i) => (
                <p key={i} className="text-red-600 dark:text-red-400">
                  Row {r.row}: {r.reason}
                </p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={confirmImport} disabled={summary.valid.length === 0}>
              Import {summary.valid.length} Valid Question{summary.valid.length === 1 ? "" : "s"}
            </Button>
            {(summary.invalid.length > 0 || summary.duplicates.length > 0) && (
              <Button variant="secondary" onClick={downloadErrorReport}>
                Download Error Report
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
