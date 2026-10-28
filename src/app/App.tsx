import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Layout } from '../shared/components/Layout';
import { HomePage } from '../features/sessions/HomePage';
import { ChecklistPage } from '../features/checklist/ChecklistPage';
import { FinalReviewPage } from '../features/final-review/FinalReviewPage';
import { CompletePage } from '../features/sessions/CompletePage';
import { HistoryPage } from '../features/sessions/HistoryPage';
import { SettingsPage } from '../features/settings/SettingsPage';

export default function App() {
  return <AppProvider><BrowserRouter><Layout><Routes>
    <Route path="/" element={<HomePage />} /><Route path="/check" element={<ChecklistPage />} />
    <Route path="/final" element={<FinalReviewPage />} /><Route path="/complete/:id" element={<CompletePage />} />
    <Route path="/history" element={<HistoryPage />} /><Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Layout></BrowserRouter></AppProvider>;
}
