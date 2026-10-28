import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import KundliPage from '@/pages/KundliPage';
import AstrologerPage from '@/pages/AstrologerPage';
import PredictionsPage from '@/pages/PredictionsPage';
import CompatibilityPage from '@/pages/CompatibilityPage';
import PanchangPage from '@/pages/PanchangPage';
import MuhuratPage from '@/pages/MuhuratPage';
import DoshaPage from '@/pages/DoshaPage';
import RemediesPage from '@/pages/RemediesPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import AuthPage from '@/pages/AuthPage';
import AppShell from '@/components/layout/AppShell';
import GlobalReportButton from '@/components/feedback/GlobalReportButton';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page matching the Reference Image */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication & Onboarding Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/onboarding" element={<AuthPage />} />
        <Route path="/verify" element={<AuthPage />} />

        {/* Core Vyom Application Workspace */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />

          {/* Birth Chart & Kundli */}
          <Route path="/kundli" element={<KundliPage />} />
          <Route path="/birth-chart" element={<KundliPage />} />
          <Route path="/app/chart/:chartId" element={<KundliPage />} />

          {/* AI Astrologer Consultation Workspace */}
          <Route path="/astrologer" element={<AstrologerPage />} />
          <Route path="/app/astrologer" element={<Navigate to="/astrologer" replace />} />

          {/* Daily Predictions & Transits */}
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/app/predictions" element={<Navigate to="/predictions" replace />} />

          {/* Relationship Compatibility (Kundli Milan) */}
          <Route path="/compatibility" element={<CompatibilityPage />} />
          <Route path="/app/compatibility" element={<Navigate to="/compatibility" replace />} />

          {/* Daily Panchang */}
          <Route path="/panchang" element={<PanchangPage />} />
          <Route path="/app/panchang" element={<Navigate to="/panchang" replace />} />

          {/* Auspicious Timings (Muhurat) */}
          <Route path="/muhurat" element={<MuhuratPage />} />
          <Route path="/app/muhurat" element={<Navigate to="/muhurat" replace />} />

          {/* Dosha & Karmic Insights */}
          <Route path="/dosha" element={<DoshaPage />} />
          <Route path="/app/dosha" element={<Navigate to="/dosha" replace />} />

          {/* Remedies (Upaya) */}
          <Route path="/remedies" element={<RemediesPage />} />
          <Route path="/app/remedies" element={<Navigate to="/remedies" replace />} />

          {/* Reports & Document Library */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/app/reports" element={<Navigate to="/reports" replace />} />
          <Route path="/app/charts" element={<Navigate to="/reports" replace />} />
          <Route path="/app/insights" element={<Navigate to="/reports" replace />} />
          <Route path="/app/library" element={<Navigate to="/reports" replace />} />

          {/* User Profile & Ephemeris Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<SettingsPage />} />
          <Route path="/app/settings" element={<Navigate to="/settings" replace />} />
          <Route path="/help" element={<Navigate to="/settings" replace />} />
          <Route path="/app/help" element={<Navigate to="/settings" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalReportButton />
    </BrowserRouter>
  );
}
