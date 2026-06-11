import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Trash2, AlertTriangle, Info } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Tooltip } from '../components/ui/Tooltip';
import { SessionFooter } from '../components/ui/SessionFooter';
import { getBandMeta, getScoreLabel, formatDueDate } from '../lib/formatScore';
import type { FeedbackReport, OnboardingData, RubricCriterion } from '../lib/types';

interface FeedbackReportLocationState {
  report: FeedbackReport;
  onboarding: OnboardingData;
}

// ─── Typewriter Hook ─────────────────────────────────────────────────────────

function useTypewriter(text: string, speed: number, active: boolean): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);

  return displayed;
}

// ─── Circular Score Ring ──────────────────────────────────────────────────────

interface CircularScoreProps {
  score: number;
}

function CircularScore({ score }: CircularScoreProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const { label, colorClass } = getScoreLabel(score);

  // Animate stroke-dashoffset from full (no fill) to the score value
  const targetOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg
          width="144"
          height="144"
          viewBox="0 0 144 144"
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          {/* Animated score arc */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#3FD3C3"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>

        {/* Score text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-gray-light tabular-nums"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-mid">/100</span>
        </div>
      </div>

      <div className="text-center">
        <p className={['text-sm font-semibold', colorClass].join(' ')}>{label}</p>
        <p className="text-xs text-gray-mid mt-0.5">Overall readiness score</p>
      </div>
    </div>
  );
}

// ─── Rubric Criterion Card ────────────────────────────────────────────────────

interface RubricCriterionCardProps {
  criterion: RubricCriterion;
  index: number;
}

function RubricCriterionCard({ criterion, index }: RubricCriterionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const bandMeta = getBandMeta(criterion.currentBand);
  const isWeak = criterion.currentBand === 'Fail' || criterion.currentBand === 'Pass';
  const isHD = criterion.currentBand === 'HD';

  const diagnosisText = useTypewriter(criterion.diagnosis, 30, expanded);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      className="focus-within:ring-2 focus-within:ring-teal-400/40 transition-[box-shadow] duration-150 rounded-2xl"
    >
      <Card
        warning={isWeak}
        success={isHD}
        padding="md"
        className="transition-all duration-200"
      >
        {/* Card header — always visible */}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={`criterion-${criterion.id}-details`}
          className="w-full text-left focus-visible:outline-none rounded-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-sm font-semibold text-gray-light">
                  {criterion.name}
                </span>
                <span className="text-xs text-gray-dark">({criterion.weight}%)</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Band badge */}
                <span
                  className={[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                    bandMeta.bgClass,
                    bandMeta.colorClass,
                  ].join(' ')}
                >
                  {bandMeta.label}
                </span>

                {/* Confidence */}
                <Tooltip content={`AI confidence: ${criterion.confidenceLevel}% — based on rubric alignment`}>
                  <span className="text-xs text-gray-mid cursor-help">
                    {criterion.confidenceLevel}% confidence
                  </span>
                </Tooltip>
              </div>
            </div>

            {/* Expand/collapse icon */}
            <div className="text-gray-mid shrink-0 mt-0.5">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          {/* Diagnosis — typewriter when expanded, static when collapsed */}
          <p className="text-xs text-gray-mid mt-2 leading-relaxed">
            {diagnosisText}
          </p>
        </button>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              id={`criterion-${criterion.id}-details`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/8 space-y-4">
                {/* Confidence bar */}
                <ProgressBar
                  value={criterion.confidenceLevel}
                  label="AI confidence"
                  variant={isWeak ? 'coral' : isHD ? 'mint' : 'teal'}
                  showValue
                />

                {/* Mark loss callout */}
                {criterion.markLoss && (
                  <div className="flex items-start gap-2.5 bg-coral/8 border border-coral/25 rounded-xl p-3.5">
                    <AlertTriangle
                      size={14}
                      className="text-coral shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-xs text-coral leading-relaxed font-medium">
                      {criterion.markLoss}
                    </p>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <p className="text-xs font-semibold text-gray-mid uppercase tracking-wider mb-2">
                    How to improve
                  </p>
                  <ul className="space-y-2">
                    {criterion.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-teal text-xs mt-0.5 shrink-0">→</span>
                        <span className="text-xs text-gray-light leading-relaxed">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function FeedbackReportScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FeedbackReportLocationState | null;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Guard: if no report data, redirect to login
  if (!state?.report || !state?.onboarding) {
    navigate('/login', { replace: true });
    return null;
  }

  const { report, onboarding } = state;

  const handleDeleteSession = () => {
    // Clear all state and navigate to login
    navigate('/login', { replace: true });
  };

  const weakCriteria = report.criteria.filter(
    (c) => c.currentBand === 'Fail' || c.currentBand === 'Pass'
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-navy flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-4 border-b border-white/5">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
                <span className="text-navy font-bold text-sm">GL</span>
              </div>
              <span className="text-gray-light font-semibold text-lg tracking-tight">
                GradeLens
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-mid">{onboarding.assignmentType}</p>
              {onboarding.dueDate && (
                <p className="text-xs text-gray-dark">{formatDueDate(onboarding.dueDate)}</p>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Hero: Overall score */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card padding="lg" className="text-center">
                <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-6">
                  Your readiness report
                </p>

                <CircularScore score={report.overallScore} />

                {weakCriteria.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 flex items-center justify-center gap-2 text-xs text-coral"
                  >
                    <AlertTriangle size={13} aria-hidden="true" />
                    <span>
                      {weakCriteria.length} criterion{weakCriteria.length > 1 ? 'a' : ''} need
                      {weakCriteria.length === 1 ? 's' : ''} attention before submission
                    </span>
                  </motion.div>
                )}

                <p className="text-xs text-gray-dark mt-3">
                  Based on {report.criteria.length} rubric criteria •{' '}
                  {onboarding.wordCountTarget.toLocaleString()} word target
                </p>
              </Card>
            </motion.div>

            {/* Criteria breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold text-gray-light tracking-tight">
                  Criteria breakdown
                </h2>
                <Tooltip content="Click any criterion to see detailed feedback and improvement tips">
                  <Info size={14} className="text-gray-dark cursor-help" aria-label="Help: expand criteria for details" />
                </Tooltip>
              </div>

              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.075 } } }}
              >
                {report.criteria.map((criterion, index) => (
                  <RubricCriterionCard
                    key={criterion.id}
                    criterion={criterion}
                    index={index}
                  />
                ))}
              </motion.div>
            </div>

            {/* Ethics footer: Delete session */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card warning padding="md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-light mb-1">
                      Done with your report?
                    </p>
                    <p className="text-xs text-gray-mid leading-relaxed">
                      Delete this session to immediately clear your draft, rubric, and all feedback from memory. Nothing is stored — this is a courtesy action.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteModalOpen(true)}
                    className="shrink-0"
                    aria-label="Delete this session and all data"
                  >
                    <Trash2 size={14} />
                    Delete session
                  </Button>
                </div>
              </Card>
            </motion.div>

          </div>
        </main>

        <SessionFooter />
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete this session?"
        confirmLabel="Yes, delete everything"
        onConfirm={handleDeleteSession}
        cancelLabel="Keep my report"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-mid leading-relaxed">
            This will clear your draft, rubric, and all feedback from this session. You'll be returned to the login screen.
          </p>
          <div className="flex items-start gap-2.5 bg-teal/5 border border-teal/20 rounded-xl p-3.5">
            <Info size={14} className="text-teal shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-gray-mid">
              Since GradeLens never stores data permanently, this action is symbolic — your data was never at risk. This button exists to give you visible control.
            </p>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
