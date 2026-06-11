import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SessionFooter } from '../components/ui/SessionFooter';
import type { OnboardingData, UploadedContent } from '../lib/types';

interface ErrorLocationState {
  onboarding?: OnboardingData;
  rubric?: UploadedContent;
}

export function ErrorScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorLocationState | null;

  const handleRetryWithPaste = () => {
    // Navigate back to upload rubric, preserving onboarding state
    navigate('/upload-rubric', {
      state: { onboarding: state?.onboarding },
    });
  };

  const handleStartOver = () => {
    navigate('/login', { replace: true });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-navy flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-4">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
              <span className="text-navy font-bold text-sm">GL</span>
            </div>
            <span className="text-gray-light font-semibold text-lg tracking-tight">
              GradeLens
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              {/* Error icon */}
              <motion.div
                className="w-20 h-20 bg-coral/10 border-2 border-coral/30 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <AlertCircle size={32} className="text-coral" aria-hidden="true" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-light tracking-tight mb-3">
                We couldn't read your rubric
              </h1>
              <p className="text-sm text-gray-mid leading-relaxed">
                The file format wasn't recognised, or the document couldn't be parsed. This sometimes happens with scanned PDFs or protected files.
              </p>
            </motion.div>

            {/* Suggested fix */}
            <Card warning padding="md" className="mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-coral/10 rounded-xl shrink-0 mt-0.5">
                  <RefreshCw size={16} className="text-coral" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-light mb-1">
                    Try pasting the text instead
                  </p>
                  <p className="text-xs text-gray-mid leading-relaxed">
                    Copy the rubric text from your LMS (e.g., Canvas, Moodle) and paste it directly into the text field. This works reliably for all rubric formats.
                  </p>
                </div>
              </div>
            </Card>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleRetryWithPaste}
              >
                <RefreshCw size={16} />
                Retry — paste rubric text
              </Button>

              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={handleStartOver}
              >
                <ArrowLeft size={15} />
                Start a new session
              </Button>
            </div>

            {/* Help text */}
            <div className="mt-8 space-y-2">
              <p className="text-xs text-gray-dark text-center font-medium">
                Common causes of this error:
              </p>
              <ul className="space-y-1.5">
                {[
                  'Scanned PDF (image-only, no selectable text)',
                  'Password-protected or encrypted document',
                  'File corrupted or incomplete upload',
                  'Non-standard encoding in DOCX file',
                ].map((cause) => (
                  <li key={cause} className="flex items-start gap-2">
                    <span className="text-coral text-xs mt-0.5 shrink-0">·</span>
                    <span className="text-xs text-gray-dark">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <SessionFooter />
      </div>
    </PageTransition>
  );
}
