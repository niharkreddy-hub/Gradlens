import type { RubricCriterion, GradeBand } from './types';

/**
 * Calculates the weighted overall score from all rubric criteria.
 * Each criterion's band is converted to a numeric score, then weighted.
 */
export function calculateOverallScore(criteria: RubricCriterion[]): number {
  const bandToScore: Record<GradeBand, number> = {
    Fail: 40,
    Pass: 57,
    Credit: 70,
    Distinction: 80,
    HD: 92,
  };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = criteria.reduce((sum, c) => {
    return sum + bandToScore[c.currentBand] * c.weight;
  }, 0);

  return Math.round(weightedSum / totalWeight);
}

/**
 * Returns a human-readable label and color class for a given grade band.
 */
export function getBandMeta(band: GradeBand): {
  label: string;
  colorClass: string;
  bgClass: string;
} {
  const meta: Record<GradeBand, { label: string; colorClass: string; bgClass: string }> = {
    Fail: {
      label: 'Fail',
      colorClass: 'text-coral',
      bgClass: 'bg-coral/10 border-coral/30',
    },
    Pass: {
      label: 'Pass',
      colorClass: 'text-gray-mid',
      bgClass: 'bg-gray-dark/20 border-gray-dark/30',
    },
    Credit: {
      label: 'Credit',
      colorClass: 'text-teal',
      bgClass: 'bg-teal/10 border-teal/30',
    },
    Distinction: {
      label: 'Distinction',
      colorClass: 'text-teal',
      bgClass: 'bg-teal/15 border-teal/40',
    },
    HD: {
      label: 'High Distinction',
      colorClass: 'text-mint',
      bgClass: 'bg-mint/10 border-mint/30',
    },
  };
  return meta[band];
}

/**
 * Returns a score label and color for the overall readiness score.
 */
export function getScoreLabel(score: number): { label: string; colorClass: string } {
  if (score >= 85) return { label: 'HD Range', colorClass: 'text-mint' };
  if (score >= 75) return { label: 'Distinction Range', colorClass: 'text-teal' };
  if (score >= 65) return { label: 'Credit Range', colorClass: 'text-teal' };
  if (score >= 50) return { label: 'Pass Range', colorClass: 'text-gray-mid' };
  return { label: 'At Risk', colorClass: 'text-coral' };
}

/**
 * Formats a date string for display (e.g. "Due 15 May 2026").
 */
export function formatDueDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `Due ${date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
}
