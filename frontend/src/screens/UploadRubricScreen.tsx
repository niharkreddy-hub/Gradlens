import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Info } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { FileDropZone } from '../components/ui/FileDropZone';
import { SessionFooter } from '../components/ui/SessionFooter';
import { Tooltip } from '../components/ui/Tooltip';
import { sampleRubricText } from '../data/sampleFeedback';
import type { UploadedContent, OnboardingData } from '../lib/types';

interface UploadRubricLocationState {
  onboarding: OnboardingData;
}

// Step indicator (shared pattern across upload screens)
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

export function UploadRubricScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as UploadRubricLocationState | null;

  // Guard: if no onboarding data, redirect to login
  if (!state?.onboarding) {
    navigate('/login', { replace: true });
    return null;
  }

  const [rubric, setRubric] = useState<UploadedContent | null>(null);

  const handleNext = () => {
    if (!rubric) return;
    navigate('/submit-draft', {
      state: { onboarding: state.onboarding, rubric },
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
            <StepIndicator current={2} total={3} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Page heading */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-2">
                Step 2 of 3
              </p>
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-teal/10 rounded-xl shrink-0 mt-0.5">
                  <BookOpen size={20} className="text-teal" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-light tracking-tight mb-1">
                    Upload your marking rubric
                  </h1>
                  <p className="text-sm text-gray-mid">
                    GradeLens reads the rubric first — just like your assessor does.
                  </p>
                </div>
              </div>
            </div>

            {/* Why rubric first? info callout */}
            <div className="flex items-start gap-2.5 bg-teal/5 border border-teal/20 rounded-xl p-4 mb-6">
              <Info size={15} className="text-teal shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-gray-mid leading-relaxed">
                <span className="text-teal font-semibold">Why rubric first?</span>{' '}
                Human assessors read the rubric before marking. GradeLens mirrors this — it maps your draft against the criteria, not the other way around. This is a deliberate product choice.
              </p>
            </div>

            {/* File drop zone */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-light">
                  Rubric document
                </span>
                <Tooltip content="Paste the rubric text from your LMS or upload the PDF/DOCX">
                  <Info size={13} className="text-gray-dark cursor-help" aria-label="Help: rubric format" />
                </Tooltip>
              </div>
              <FileDropZone
                label="rubric"
                onContentReady={setRubric}
                onClear={() => setRubric(null)}
                currentContent={rubric}
                pastePlaceholder="Paste your rubric text here — criteria, bands, and mark allocations…"
                sampleText={sampleRubricText}
              />
            </div>

            {/* Sample rubric hint */}
            {!rubric && (
              <p className="text-xs text-gray-dark text-center mb-6">
                Not sure what to paste?{' '}
                <span className="text-teal">
                  Switch to "Paste text" — a sample rubric is pre-loaded for you.
                </span>
              </p>
            )}

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!rubric}
              onClick={handleNext}
            >
              Next: Submit your draft →
            </Button>

            {rubric && (
              <p className="text-xs text-gray-dark text-center mt-3">
                ✓ Rubric loaded — {rubric.text.length.toLocaleString()} characters
              </p>
            )}
          </div>
        </main>

        <SessionFooter />
      </div>
    </PageTransition>
  );
}
