// ─── Onboarding ──────────────────────────────────────────────────────────────

export type AssignmentType =
  | 'Essay'
  | 'Report'
  | 'Case Study'
  | 'Business Analysis';

export interface OnboardingData {
  assignmentType: AssignmentType;
  wordCountTarget: number;
  dueDate: string; // ISO date string
}

// ─── Rubric & Draft ───────────────────────────────────────────────────────────

export interface UploadedContent {
  source: 'file' | 'paste';
  text: string;
  fileName?: string;
}

// ─── Feedback Report ──────────────────────────────────────────────────────────

export type GradeBand = 'Fail' | 'Pass' | 'Credit' | 'Distinction' | 'HD';

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // percentage, e.g. 25
  currentBand: GradeBand;
  confidenceLevel: number; // 0–100
  diagnosis: string; // one-line "what's missing"
  markLoss?: string; // coral callout text — only present if criterion is weak
  suggestions: string[]; // actionable improvement tips
}

export interface FeedbackReport {
  overallScore: number; // 0–100
  criteria: RubricCriterion[];
  generatedAt: string; // ISO timestamp
}

// ─── Session State ────────────────────────────────────────────────────────────

export interface SessionState {
  onboarding: OnboardingData | null;
  rubric: UploadedContent | null;
  draft: UploadedContent | null;
  consentGiven: boolean;
  report: FeedbackReport | null;
}

// ─── Navigation State (passed via React Router location.state) ────────────────

export interface ProcessingLocationState {
  onboarding: OnboardingData;
  rubric: UploadedContent;
  draft: UploadedContent;
}

export interface ReportLocationState {
  report: FeedbackReport;
  onboarding: OnboardingData;
}
