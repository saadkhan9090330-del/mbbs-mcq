# MBBS MCQ Practice Platform

A personal, fully functional MCQ practice website for MBBS study — built with React, TypeScript, Vite, and Tailwind CSS. Your data (progress, bookmarks, stats) is saved in your browser automatically, so nothing is lost when you refresh or close the tab.

This README assumes **zero programming experience**. Follow it top to bottom.

---

## 1. What you need to install first (one-time setup)

You need **Node.js** on your computer. This is the only thing required to run the project.

1. Go to https://nodejs.org
2. Download the **LTS** version (the button that says "Recommended for most users")
3. Run the installer, clicking "Next" through all the default options
4. Restart your computer after installing (recommended)

To check it worked, open a terminal (on Windows: search for "Command Prompt" or "PowerShell"; on Mac: search for "Terminal") and type:

```
node -v
```

You should see something like `v20.11.0`. If you see an error, the installation didn't work — reinstall Node.js.

---

## 2. Running the website on your computer

1. Unzip the project folder you downloaded somewhere easy to find, e.g. your Desktop.
2. Open a terminal.
3. Navigate into the folder. If you unzipped it to your Desktop and the folder is called `mbbs-mcq`, type:
   ```
   cd Desktop/mbbs-mcq
   ```
4. Install the project's dependencies (only needed once, or after you change something):
   ```
   npm install
   ```
   This downloads all the code libraries the project needs. It can take a minute or two.
5. Start the website:
   ```
   npm run dev
   ```
6. You'll see a message like:
   ```
   ➜  Local:   http://localhost:5173/
   ```
   Open that link in your browser (Chrome, Firefox, Edge — any modern browser works). The website is now running.
7. To stop the website, go back to the terminal and press `Ctrl + C`.

**Every time you want to use the app again**, just repeat steps 3 and 5 (you don't need to run `npm install` again unless you change the project's dependencies).

---

## 3. How to use the website

- **Dashboard** — your home screen with overall stats, today's goal, and quick links.
- **Subjects** — browse all 7 MBBS subjects (Medicine, Surgery, ENT, Ophthalmology, Gynecology, Obstetrics, Community Medicine), each with its own topics.
- Click a topic → choose how many questions, what mode (all/unattempted/incorrect/bookmarked/weak/random), difficulty, answer mode, order, and timer → **Start Practice**.
- Answer questions, see instant feedback (or end-of-quiz review, depending on your chosen mode), and view detailed explanations, clinical pearls, and why wrong options are wrong.
- At the end, see your score, accuracy, time taken, and a full question-by-question review.
- **Weak Topics**, **Incorrect Questions**, **Bookmarks**, and **Due for Review** all update automatically as you practice.
- **Statistics** shows your accuracy by subject, topic, and difficulty, plus your best/weakest areas.

---

## 4. How to add questions manually

1. Go to **Question Manager** in the sidebar (or bottom nav on mobile).
2. Click **Add Question**.
3. Fill in the subject, topic, question text, options (2–5 of them), mark the correct one, write an explanation, and optionally add a clinical pearl, "why other options are wrong" notes, difficulty, and tags.
4. Use the **Preview** button to see exactly how it will look to you as a learner.
5. Click **Save Question**.

You can also **Edit**, **Duplicate**, or **Delete** any question from the Question Manager list, and filter/search to find specific ones.

**Important note on medical accuracy:** the app will never invent a textbook reference for you. Leave the "Source" field blank unless you know exactly where a question came from.

---

## 5. How to import questions in bulk (CSV or JSON)

This is the fastest way to add hundreds of questions.

1. Go to **Question Manager → Import**.
2. Click **Download Sample CSV Template** to see the exact column format expected.
3. Fill in your own spreadsheet (Excel, Google Sheets, etc.) using those columns, then export/save it as a `.csv` file. (JSON is also supported — see `src/types/index.ts` for the `Question` shape.)
4. Click **Choose CSV or JSON file** and select your file.
5. The app will show you a **validation report**: how many questions were detected, how many are valid, invalid, or duplicates — with a reason for every problem row.
6. Nothing is imported until you click **Import N Valid Questions**. Invalid rows are never imported silently.
7. If there are errors, click **Download Error Report** to get a CSV listing every problem row and why it failed, so you can fix your spreadsheet and re-upload.

Required columns: `subject, topic, question, optionA, optionB, correctAnswer`
Optional columns: `id, subtopic, optionC, optionD, optionE, explanation, clinicalPearl, difficulty, questionType, source, tags`

**Subject and topic IDs**: these must match the internal IDs used by the app (e.g. `medicine`, `medicine__cardiology`). Open `src/data/subjects.ts` to see the full list, or just look at an existing question's subject/topic value in an exported backup (Settings → Export My Data) as a reference.

---

## 6. How to export / backup your data

Go to **Settings → Export My Data**. This downloads a single JSON file containing everything: your questions, progress, bookmarks, statistics, and settings.

To restore it later (e.g. on a new computer, or after clearing your browser data), go to **Settings → Import My Data** and select that file.

**Do this regularly** — since your data lives in the browser's local storage, clearing your browser's site data, using a different browser, or using private/incognito mode will not show your saved progress.

---

## 7. How to deploy the website online (optional)

If you want to access this from your phone or anywhere, not just your own computer, you can deploy it for free:

1. Run `npm run build`. This creates a `dist` folder with the finished website.
2. Create a free account at https://vercel.com or https://netlify.com
3. Drag and drop the `dist` folder onto their dashboard (both support drag-and-drop deployment for static sites).
4. You'll get a public URL you can open from any device.

**Note:** because progress is stored in your browser's local storage, progress made on your phone and progress made on your laptop will NOT sync with each other automatically — each browser/device keeps its own copy. Use the Export/Import backup feature to move data between devices manually. See "connecting a real database" below for how this could be solved later.

---

## 8. How the quiz engine works (for your understanding)

All quiz logic lives in `src/services/quizEngine.ts`:

- **Question selection** (`buildQuizQuestions`): filters your question bank by subject/topic/difficulty, then by mode (all/unattempted/incorrect/bookmarked/weak/random), then shuffles and trims to your chosen count.
- **Answer scoring** (`recordAnswer`): checks correctness, updates that question's personal stats (attempt count, correct/incorrect streak), and schedules its next spaced-review date.
- **Spaced review**: a simple algorithm — get it wrong, review tomorrow; get it right, the interval doubles each consecutive correct answer (up to 30 days).
- **Weak topics**: any topic where your accuracy is below the threshold you set in Settings (default 70%), among topics you've attempted at least once.
- **Statistics**: subject-wise, topic-wise, and difficulty-wise accuracy are all derived live from your per-question stats — nothing is pre-calculated or stale.

---

## 9. Where your question data is stored

Everything — your question bank, progress, bookmarks, settings, and quiz history — is stored as a single JSON object in your browser's **localStorage**, under the key `mbbs-mcq-data-v1`. This is all handled by `src/services/storage.ts`, which is the *only* file that talks to localStorage directly.

This means:
- Your data persists across page refreshes and browser restarts.
- It does **not** sync across different browsers or devices automatically.
- If your browser's storage gets corrupted, the app safely resets to defaults rather than crashing (with a console warning).

---

## 10. How to later connect a real database

Because `storage.ts` is the single gateway to all data, upgrading from localStorage to a real backend (Supabase, Firebase, or your own PostgreSQL + API) only requires changing the *inside* of the functions in that one file — `loadData()`, `saveData()`, etc. — to make network requests instead of reading/writing localStorage. Nothing in the rest of the app (pages, components, quiz engine) needs to change, because everything else only calls those functions, never localStorage directly.

A natural next step would be:
1. Set up a free Supabase project (Postgres + instant REST/JS API).
2. Create tables mirroring the `AppData` shape in `src/types/index.ts`.
3. Replace the internals of `loadData`/`saveData` with Supabase client calls.
4. Add real user authentication (Supabase Auth) so multiple devices can sync to the same account.

---

## 11. How AI-generated MCQs could be added later

The `Question` type (`src/types/index.ts`) and the `questionType` field already support this without any restructuring. A future "Generate from notes/PDF" feature would:

1. Accept uploaded text/PDF content.
2. Send it to an AI API (e.g. the Anthropic API) with a prompt asking for MCQs in the exact `Question` JSON shape used here.
3. Parse the AI's JSON response and run it through the **same validation pipeline** already built for CSV/JSON import (`src/utils/importUtils.ts`), so AI-generated questions get the same duplicate/invalid checks as manually imported ones before they're added to your bank.

No paid AI API is wired up in this version — this is left as a clearly-scoped future addition, per your request.

---

## 12. Project structure

```
src/
  components/    Reusable UI (Layout, QuestionCard, QuestionEditor, ui primitives)
  pages/         One file per screen/route
  data/          Subject/topic structure + sample question bank
  types/         The single source of truth for all data shapes
  services/      storage.ts (persistence) and quizEngine.ts (all quiz logic/stats)
  store/         AppContext.tsx - the app-wide state, wraps storage + engine for pages to use
  utils/         importUtils.ts - CSV/JSON parsing & validation
```

Nothing is hard-coded inside components — question data, quiz logic, and statistics logic are each in their own layer, exactly as specified.

---

## 13. Troubleshooting

- **"npm: command not found"** → Node.js isn't installed correctly; revisit step 1.
- **Blank page in browser** → make sure the terminal still shows the dev server running; check for red error text in the terminal.
- **Lost all my data** → check if you have a backup JSON from Settings → Export. If not, the sample question bank and default subjects will reload automatically; your custom questions/progress cannot be recovered without a backup.
- **Port already in use** → close other terminals running `npm run dev`, or run `npm run dev -- --port 5174` to use a different port.
