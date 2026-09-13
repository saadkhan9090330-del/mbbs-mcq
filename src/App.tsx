import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import QuizSetup from "./pages/QuizSetup";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import RandomPractice from "./pages/RandomPractice";
import WeakTopics from "./pages/WeakTopics";
import Statistics from "./pages/Statistics";
import QuestionManager from "./pages/QuestionManager";
import ImportPage from "./pages/ImportPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import { BookmarksPage, IncorrectPage, DueForReviewPage, QuestionOfDayPage } from "./pages/SimpleListPages";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
            <Route path="/subjects/:subjectId/topics/:topicId" element={<QuizSetup />} />
            <Route path="/quiz/:sessionId" element={<Quiz />} />
            <Route path="/results/:sessionId" element={<Results />} />
            <Route path="/random" element={<RandomPractice />} />
            <Route path="/weak-topics" element={<WeakTopics />} />
            <Route path="/incorrect" element={<IncorrectPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/due-review" element={<DueForReviewPage />} />
            <Route path="/qotd" element={<QuestionOfDayPage />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/manager" element={<QuestionManager />} />
            <Route path="/manager/import" element={<ImportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
