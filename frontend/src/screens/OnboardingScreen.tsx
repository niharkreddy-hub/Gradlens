import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, FileText, Target } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SessionFooter } from '../components/ui/SessionFooter';
import type { AssignmentType, OnboardingData } from '../lib/types';

const ASSIGNMENT_TYPES: AssignmentType[] = [
  'Essay',
  'Report',
  'Case Study',
  'Business Analysis',
];

// Step indicator component
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

export function OnboardingScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Preserve any state passed from previous screens
  const locationState = location.state as Record<string, unknown> | null;

  const [form, setForm] = useState<OnboardingData>({
    assignmentType: 'Business Analysis',
    wordCountTarget: 2000,
    dueDate: '',
  });

  const isValid = form.dueDate !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/upload-rubric', {
      state: { ...locationState, onboarding: form },
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
            <StepIndicator current={1} total={3} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-2">
                Step 1 of 3
              </p>
              <h1 className="text-2xl font-bold text-gray-light tracking-tight mb-2">
                What are you working on?
              </h1>
              <p className="text-sm text-gray-mid">
                This helps GradeLens calibrate its feedback to your assignment context.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Assignment type */}
              <Card padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal/10 rounded-xl">
                    <FileText size={16} className="text-teal" aria-hidden="true" />
                  </div>
                  <label
                    htmlFor="assignment-type"
                    className="text-sm font-semibold text-gray-light"
                  >
                    Assignment type
                  </label>
                </div>
                <select
                  id="assignment-type"
                  value={form.assignmentType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      assignmentType: e.target.value as AssignmentType,
                    }))
                  }
                  className="w-full bg-surface-raised border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-light focus-visible:outline-2 focus-visible:outline-teal transition-colors duration-200 cursor-pointer"
                >
                  {ASSIGNMENT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-surface-raised">
                      {type}
                    </option>
                  ))}
                </select>
              </Card>

              {/* Word count target */}
              <Card padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal/10 rounded-xl">
                    <Target size={16} className="text-teal" aria-hidden="true" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <label
                      htmlFor="word-count"
                      className="text-sm font-semibold text-gray-light"
                    >
                      Word count target
                    </label>
                    <span className="text-sm font-bold text-teal tabular-nums">
                      {form.wordCountTarget.toLocaleString()} words
                    </span>
                  </div>
                </div>
                <input
                  id="word-count"
                  type="range"
                  min={500}
                  max={5000}
                  step={100}
                  value={form.wordCountTarget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, wordCountTarget: Number(e.target.value) }))
                  }
                  aria-valuemin={500}
                  aria-valuemax={5000}
                  aria-valuenow={form.wordCountTarget}
                  aria-valuetext={`${form.wordCountTarget} words`}
                  className="w-full accent-teal cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-dark">500</span>
                  <span className="text-xs text-gray-dark">5,000</span>
                </div>
              </Card>

              {/* Due date */}
              <Card padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal/10 rounded-xl">
                    <Calendar size={16} className="text-teal" aria-hidden="true" />
                  </div>
                  <label
                    htmlFor="due-date"
                    className="text-sm font-semibold text-gray-light"
                  >
                    Due date
                  </label>
                </div>
                <input
                  id="due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-surface-raised border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-light focus-visible:outline-2 focus-visible:outline-teal transition-colors duration-200 cursor-pointer [color-scheme:dark]"
                />
                {!form.dueDate && (
                  <p className="text-xs text-gray-dark mt-2">
                    Helps GradeLens prioritise the most impactful feedback for your timeline.
                  </p>
                )}
              </Card>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!isValid}
              >
                Next: Upload your rubric →
              </Button>
            </form>
          </div>
        </main>

        <SessionFooter />
      </div>
    </PageTransition>
  );
}
