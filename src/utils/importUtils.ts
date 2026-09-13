import type { Question, OptionKey, Difficulty, QuestionType } from "../types";

// ============================================================
// IMPORT UTILITIES
// Parses CSV/JSON question files and validates every row before
// anything is imported. Nothing is imported silently - every
// invalid row is reported with a reason.
// ============================================================

export interface ImportRowResult {
  row: number;
  status: "valid" | "invalid" | "duplicate";
  reason?: string;
  question?: Question;
  raw: Record<string, string>;
}

export interface ImportSummary {
  total: number;
  valid: ImportRowResult[];
  invalid: ImportRowResult[];
  duplicates: ImportRowResult[];
}

const REQUIRED_COLUMNS = ["subject", "topic", "question", "optionA", "optionB", "correctAnswer"];

// Minimal CSV parser supporting quoted fields with commas/newlines inside them.
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmptyRows = rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  if (nonEmptyRows.length === 0) return [];

  const headers = nonEmptyRows[0].map((h) => h.trim());
  return nonEmptyRows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (r[i] ?? "").trim();
    });
    return obj;
  });
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[|;,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

const VALID_DIFFICULTIES: Difficulty[] = ["easy", "moderate", "difficult"];
const VALID_TYPES: QuestionType[] = [
  "single-best-answer",
  "clinical-scenario",
  "true-false",
  "image-based",
  "extended-matching",
];

function rowToQuestion(raw: Record<string, string>): { question?: Question; error?: string } {
  for (const col of REQUIRED_COLUMNS) {
    if (!raw[col] || raw[col].trim() === "") {
      return { error: `Missing required field: ${col}` };
    }
  }

  const correctAnswer = raw.correctAnswer.trim().toUpperCase() as OptionKey;
  if (!["A", "B", "C", "D", "E"].includes(correctAnswer)) {
    return { error: `correctAnswer must be A, B, C, D, or E (got "${raw.correctAnswer}")` };
  }

  const options: { key: OptionKey; text: string }[] = [];
  (["A", "B", "C", "D", "E"] as OptionKey[]).forEach((key) => {
    const val = raw[`option${key}`];
    if (val && val.trim() !== "") options.push({ key, text: val.trim() });
  });

  if (options.length < 2) {
    return { error: "At least optionA and optionB are required" };
  }
  if (!options.some((o) => o.key === correctAnswer)) {
    return { error: `correctAnswer "${correctAnswer}" has no matching option column filled in` };
  }

  const difficulty = (raw.difficulty?.trim().toLowerCase() as Difficulty) || "moderate";
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return { error: `difficulty must be one of easy/moderate/difficult (got "${raw.difficulty}")` };
  }

  const questionType = (raw.questionType?.trim() as QuestionType) || "single-best-answer";
  if (!VALID_TYPES.includes(questionType)) {
    return { error: `questionType "${raw.questionType}" is not recognized` };
  }

  const id = raw.id?.trim() || `imported-${Math.random().toString(36).slice(2, 10)}`;

  const question: Question = {
    id,
    subject: raw.subject.trim(),
    topic: raw.topic.trim(),
    subtopic: raw.subtopic?.trim() || undefined,
    questionType,
    question: raw.question.trim(),
    options,
    correctAnswer,
    explanation: raw.explanation?.trim() || "",
    clinicalPearl: raw.clinicalPearl?.trim() || undefined,
    difficulty,
    source: raw.source?.trim() || undefined,
    tags: parseTags(raw.tags),
    createdAt: new Date().toISOString(),
  };

  return { question };
}

export function validateAndBuildQuestions(
  rawRows: Record<string, string>[],
  existingIds: Set<string>
): ImportSummary {
  const valid: ImportRowResult[] = [];
  const invalid: ImportRowResult[] = [];
  const duplicates: ImportRowResult[] = [];
  const seenInFile = new Set<string>();

  rawRows.forEach((raw, i) => {
    const rowNum = i + 2; // account for header row + 1-indexing
    const { question, error } = rowToQuestion(raw);

    if (error || !question) {
      invalid.push({ row: rowNum, status: "invalid", reason: error, raw });
      return;
    }

    if (existingIds.has(question.id) || seenInFile.has(question.id)) {
      duplicates.push({ row: rowNum, status: "duplicate", reason: `Duplicate id "${question.id}"`, raw, question });
      return;
    }

    seenInFile.add(question.id);
    valid.push({ row: rowNum, status: "valid", question, raw });
  });

  return { total: rawRows.length, valid, invalid, duplicates };
}

export function buildErrorReportCsv(summary: ImportSummary): string {
  const lines = ["row,status,reason"];
  [...summary.invalid, ...summary.duplicates].forEach((r) => {
    lines.push(`${r.row},${r.status},"${(r.reason ?? "").replace(/"/g, '""')}"`);
  });
  return lines.join("\n");
}

export const SAMPLE_CSV_TEMPLATE = `id,subject,topic,subtopic,question,optionA,optionB,optionC,optionD,optionE,correctAnswer,explanation,clinicalPearl,difficulty,questionType,source,tags
medicine-1001,medicine,medicine__cardiology,Arrhythmia,"A 70-year-old man has an irregularly irregular pulse on examination. Which arrhythmia is most likely?","Atrial fibrillation","Ventricular tachycardia","First-degree heart block","Sinus arrhythmia",,A,"Atrial fibrillation classically causes an irregularly irregular pulse due to chaotic atrial activity.","Look for an absent P wave and irregular R-R intervals on ECG.",easy,single-best-answer,,"ECG|arrhythmia"
`;
