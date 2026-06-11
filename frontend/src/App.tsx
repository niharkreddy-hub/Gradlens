import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { UploadRubricScreen } from './screens/UploadRubricScreen';
import { SubmitDraftScreen } from './screens/SubmitDraftScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ErrorScreen } from './screens/ErrorScreen';

// FeedbackReportScreen is the heaviest screen — lazy loaded per spec
const FeedbackReportScreen = lazy(() =>
  import('./screens/FeedbackReportScreen').then((m) => ({
    default: m.FeedbackReportScreen,
  }))
);

/**
 * Minimal loading fallback shown while FeedbackReportScreen lazy-loads.
 * Should be near-instant in practice.
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-8 w-8 text-teal"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-gray-mid">Loading your report…</p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* User flow */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/upload-rubric" element={<UploadRubricScreen />} />
        <Route path="/submit-draft" element={<SubmitDraftScreen />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route
          path="/feedback"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FeedbackReportScreen />
            </Suspense>
          }
        />
        <Route path="/error" element={<ErrorScreen />} />

        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
