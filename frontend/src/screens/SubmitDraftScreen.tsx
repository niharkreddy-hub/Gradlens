import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileEdit, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { FileDropZone } from '../components/ui/FileDropZone';
import { Modal } from '../components/ui/Modal';
import { SessionFooter } from '../components/ui/SessionFooter';
import type { UploadedContent, OnboardingData } from '../lib/types';

interface SubmitDraftLocationState {
  onboarding: OnboardingData;
  rubric: UploadedContent;
}

// Step indicator
interface StepIndicatorProps {
  current: number;
  total: number;
}

function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            'h-1.5 rounded-full transition-all duration-300',
            i + 1 === current
              ? 'w-6 bg-teal'
              : i + 1 < current
              ? 'w-3 bg-teal/50'
              : 'w-3 bg-white/15',
          ].join(' ')}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function SubmitDraftScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SubmitDraftLocationState | null;

  // Guard: if no prior state, redirect to login
  if (!state?.onboarding || !state?.rubric) {
    navigate('/login', { replace: true });
    return null;
  }

  const [draft, setDraft] = useState<UploadedContent | null>(null);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);


  const handleGenerateClick = () => {
    if (!draft) return;
    if (!consentGiven) {
      // Open consent modal before proceeding
      setConsentModalOpen(true);
      return;
    }
    proceedToProcessing();
  };

  const handleConsentConfirm = () => {
    setConsentGiven(true);
    setConsentModalOpen(false);
    proceedToProcessing();
  };

  const proceedToProcessing = () => {
    navigate('/processing', {
      state: {
        onboarding: state.onboarding,
        rubric: state.rubric,
        draft,
      },
    });
  };

  // Simulate error path for demo purposes
  const handleSimulateError = () => {
    navigate('/error', {
      state: { onboarding: state.onboarding, rubric: state.rubric },
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-navy flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
                <span className="text-navy font-bold text-sm">GL</span>
              </div>
              <span className="text-gray-light font-semibold text-lg tracking-tight">
                GradeLens
              </span>
            </div>
            <StepIndicator current={3} total={3} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Page heading */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-2">
                Step 3 of 3
              </p>
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-teal/10 rounded-xl shrink-0 mt-0.5">
                  <FileEdit size={20} className="text-teal" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-light tracking-tight mb-1">
                    Submit your draft
                  </h1>
                  <p className="text-sm text-gray-mid">
                    GradeLens will map your draft against the rubric you uploaded.
                  </p>
                </div>
              </div>
            </div>

            {/* Rubric loaded confirmation */}
            <div className="flex items-center gap-2.5 bg-teal/5 border border-teal/20 rounded-xl p-3.5 mb-6">
              <ShieldCheck size={15} className="text-teal shrink-0" aria-hidden="true" />
              <p className="text-xs text-gray-mid">
                <span className="text-teal font-semibold">Rubric loaded</span> —{' '}
                {state.rubric.source === 'file'
                  ? state.rubric.fileName ?? 'uploaded file'
                  : 'pasted text'}{' '}
                ({state.rubric.text.length.toLocaleString()} characters)
              </p>
            </div>

            {/* File drop zone */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-light">
                  Your assignment draft
                </span>
                <span className="text-xs text-gray-dark">(current version — not your final submission)</span>
              </div>
              <FileDropZone
                label="draft"
                onContentReady={setDraft}
                onClear={() => {
                  setDraft(null);
                  setConsentGiven(false);
                }}
                currentContent={draft}
                pastePlaceholder="Paste your draft text here…"
              />
            </div>

            {/* Consent status */}
            {draft && !consentGiven && (
              <div className="flex items-start gap-2.5 bg-coral/5 border border-coral/20 rounded-xl p-4 mb-6">
                <Info size={15} className="text-coral shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-gray-mid">
                  <span className="text-coral font-semibold">One more step:</span>{' '}
                  Before generating feedback, you'll need to confirm how your data is handled. Click "Generate Feedback" to review.
                </p>
              </div>
            )}

            {/* Generate Feedback CTA */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!draft}
              onClick={handleGenerateClick}
            >
              {consentGiven ? 'Generate Feedback →' : 'Generate Feedback →'}
            </Button>

            {!draft && (
              <p className="text-xs text-gray-dark text-center mt-3">
                Upload or paste your draft above to continue
              </p>
            )}

            {/* Hidden simulate error link for demo */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSimulateError}
                className="text-xs text-gray-dark/50 hover:text-gray-dark transition-colors duration-200 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-teal rounded"
                aria-label="Simulate processing error (demo only)"
              >
                Simulate error state (demo)
              </button>
            </div>
          </div>
        </main>

        <SessionFooter />
      </div>

      {/* Consent Modal */}
      <Modal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
        title="Before we analyse your draft"
        confirmLabel="I understand — generate feedback"
        onConfirm={handleConsentConfirm}
        cancelLabel="Not yet"
        preventBackdropClose
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-mid leading-relaxed">
            GradeLens is about to process your draft against the rubric. Here's exactly what happens:
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-teal/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-teal text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-light">
                Your draft text is processed <span className="text-teal font-semibold">in this browser session only</span> — it is never sent to a server.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-teal/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-teal text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-light">
                No data is stored, logged, or used to train any AI model.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-teal/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-teal text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-light">
                You can delete all session data at any time using the "Delete this session" button on your report.
              </p>
            </li>
          </ul>

          <div className="flex items-start gap-2.5 bg-coral/5 border border-coral/15 rounded-xl p-3.5 mt-2">
            <AlertTriangle size={14} className="text-coral shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-gray-mid">
              <span className="text-coral font-semibold">Academic integrity reminder:</span>{' '}
              GradeLens helps you understand your rubric — it does not write your assignment. Always check your university's AI use policy before submitting.
            </p>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
