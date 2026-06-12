import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { SessionFooter } from '../components/ui/SessionFooter';
import type { OnboardingData, UploadedContent } from '../lib/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface ProcessingLocationState {
  onboarding: OnboardingData;
  rubric: UploadedContent;
  draft: UploadedContent;
}

interface ProcessingStep {
  id: string;
  label: string;
  durationMs: number;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { id: 'read-rubric', label: 'Reading rubric criteria…', durationMs: 750 },
  { id: 'map-draft', label: 'Mapping draft against criteria…', durationMs: 750 },
  { id: 'calculate', label: 'Calculating mark forecast…', durationMs: 750 },
  { id: 'generate', label: 'Generating recommendations…', durationMs: 750 },
];

export function ProcessingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ProcessingLocationState | null;

  if (!state?.onboarding || !state?.rubric || !state?.draft) {
    navigate('/login', { replace: true });
    return null;
  }

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    let stepIndex = 0;

    const advanceSteps = () => {
      if (stepIndex < PROCESSING_STEPS.length) {
        const step = PROCESSING_STEPS[stepIndex];
      setCurrentStepIndex(stepIndex);
        setTimeout(() => {
          setCompletedSteps((prev) => new Set([...prev, step.id]));
          stepIndex += 1;
          advanceSteps();
        }, 750);
      }
    };
    advanceSteps();

    fetch(`${API_URL}/api/analyse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@gradelens.app',
        onboarding: state.onboarding,
        rubric_text: state.rubric.text,
        draft_text: state.draft.text,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((report) => {
        setTimeout(() => {
          navigate('/feedback', {
            state: { report, onboarding: state.onboarding },
            replace: true,
          });
        }, 3200);
      })
      .catch(() => {
        navigate('/error', { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-navy flex flex-col">
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

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            <motion.div
              className="w-20 h-20 bg-teal/10 border-2 border-teal/30 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{
                scale: [1, 1.05, 1],
                borderColor: [
                  'rgba(63,211,195,0.3)',
                  'rgba(63,211,195,0.7)',
                  'rgba(63,211,195,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-teal font-bold text-2xl">GL</span>
            </motion.div>

            <h1 className="text-xl font-bold text-gray-light tracking-tight mb-2">
              Analysing your draft
            </h1>
            <p className="text-sm text-gray-mid mb-10">
              GradeLens is mapping your work against the rubric criteria.
            </p>

            <div
              aria-live="polite"
              aria-label="Processing status"
              className="space-y-3 text-left"
            >
              {PROCESSING_STEPS.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                const isActive = index === currentStepIndex && !isCompleted;
                const isPending = index > currentStepIndex;

                return (
                  <AnimatePresence key={step.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3.5"
                    >
                      <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <CheckCircle size={18} className="text-teal" aria-hidden="true" />
                          </motion.div>
                        ) : isActive ? (
                          <Loader2
                            size={18}
                            className="text-teal animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white/15"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <span
                        className={[
                          'text-sm font-medium transition-colors duration-300',
                          isCompleted
                            ? 'text-teal'
                            : isActive
                            ? 'text-gray-light'
                            : 'text-gray-dark',
                        ].join(' ')}
                      >
                        {step.label}
                      </span>
                      {isCompleted && (
                        <span className="sr-only">{step.label} complete.</span>
                      )}
                      {isActive && (
                        <span className="sr-only">{step.label} in progress.</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                );
              })}
            </div>

            <p className="text-xs text-gray-dark mt-8 leading-relaxed">
              These steps are shown intentionally — GradeLens is not a black box.
              <br />
              You can see exactly what the AI is doing with your work.
            </p>
          </div>
        </main>

        <SessionFooter />
      </div>
    </PageTransition>
  );
}