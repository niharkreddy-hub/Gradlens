import type { FeedbackReport } from '../lib/types';

/**
 * Mock feedback report used during the simulated AI processing step.
 * In a real implementation this would come from an API response.
 * All data is fabricated for demonstration purposes only.
 */
export const sampleFeedback: FeedbackReport = {
  overallScore: 76,
  generatedAt: new Date().toISOString(),
  criteria: [
    {
      id: 'critical-analysis',
      name: 'Critical Analysis & Argumentation',
      weight: 30,
      currentBand: 'Credit',
      confidenceLevel: 82,
      diagnosis:
        'Arguments are present but rely heavily on description rather than critical evaluation of competing perspectives.',
      markLoss:
        'Estimated –8 marks: Distinction requires explicit counter-argument engagement and synthesis beyond summary.',
      suggestions: [
        'Introduce at least two opposing viewpoints and explicitly rebut them using evidence.',
        'Move from "Author X says…" to "Author X argues… however this overlooks… because…"',
        'Add a synthesis paragraph that reconciles the tension between your two main sources.',
      ],
    },
    {
      id: 'academic-writing',
      name: 'Academic Writing & Expression',
      weight: 20,
      currentBand: 'Distinction',
      confidenceLevel: 91,
      diagnosis:
        'Writing is clear and mostly formal; minor colloquialisms in paragraphs 3 and 7 reduce academic register.',
      suggestions: [
        'Replace "a lot of" with "a significant proportion of" or cite a specific figure.',
        'Avoid second-person ("you should consider") in academic writing — use third-person or passive voice.',
      ],
    },
    {
      id: 'evidence-referencing',
      name: 'Evidence & Referencing',
      weight: 20,
      currentBand: 'Pass',
      confidenceLevel: 78,
      diagnosis:
        'Only 4 unique sources cited; rubric requires minimum 8 peer-reviewed sources for a passing grade.',
      markLoss:
        'Estimated –12 marks: Insufficient source diversity is the single largest risk to your final grade.',
      suggestions: [
        'Add at least 4 more peer-reviewed journal articles (published 2018–2024).',
        'Ensure every factual claim has an in-text citation — 3 unsupported claims identified.',
        'Check APA 7th edition formatting: page numbers required for direct quotes.',
      ],
    },
    {
      id: 'structure-coherence',
      name: 'Structure & Coherence',
      weight: 15,
      currentBand: 'Distinction',
      confidenceLevel: 88,
      diagnosis:
        'Logical flow is strong; introduction and conclusion are well-aligned. Minor gap in transition between sections 2 and 3.',
      suggestions: [
        'Add a one-sentence signpost at the end of Section 2 previewing Section 3.',
        'Consider a brief recap sentence at the start of the conclusion before your final argument.',
      ],
    },
    {
      id: 'business-application',
      name: 'Application to Business Context',
      weight: 15,
      currentBand: 'HD',
      confidenceLevel: 94,
      diagnosis:
        'Excellent real-world application with specific industry examples and quantified business impact.',
      suggestions: [
        'Strong work — consider adding one international comparison to broaden the business context further.',
      ],
    },
  ],
};

/**
 * Sample rubric text shown in the "Paste rubric text" tab on first visit.
 * Gives Maya a concrete example of what to paste.
 */
export const sampleRubricText = `BUS4012 — Business Analysis Report Rubric (100 marks)

CRITERION 1: Critical Analysis & Argumentation (30%)
HD (85–100): Demonstrates sophisticated critical analysis. Arguments are well-developed, nuanced, and supported by strong evidence. Competing perspectives are explicitly engaged and synthesised.
Distinction (75–84): Clear critical analysis with well-supported arguments. Some engagement with alternative perspectives.
Credit (65–74): Adequate analysis with mostly descriptive content. Limited engagement with competing views.
Pass (50–64): Basic analysis present but largely descriptive. Arguments lack depth or evidence.
Fail (<50): Minimal or no critical analysis. Assertions unsupported.

CRITERION 2: Academic Writing & Expression (20%)
HD (85–100): Consistently formal academic register. Precise, clear, and sophisticated expression throughout.
Distinction (75–84): Mostly formal register with minor lapses. Clear and well-structured sentences.
Credit (65–74): Generally appropriate register with some colloquialisms. Mostly clear expression.
Pass (50–64): Adequate expression but frequent informal language or unclear sentences.
Fail (<50): Poor expression that impedes understanding.

CRITERION 3: Evidence & Referencing (20%)
HD (85–100): 10+ peer-reviewed sources, all correctly cited in APA 7th. Every claim supported.
Distinction (75–84): 8–9 peer-reviewed sources, minor APA errors.
Credit (65–74): 6–7 sources, some APA inconsistencies.
Pass (50–64): Minimum 4 sources, notable APA errors.
Fail (<50): Fewer than 4 sources or significant referencing failures.

CRITERION 4: Structure & Coherence (15%)
HD (85–100): Seamless logical flow. Introduction, body, and conclusion are tightly integrated.
Distinction (75–84): Clear structure with effective transitions throughout.
Credit (65–74): Adequate structure; some transitions missing or abrupt.
Pass (50–64): Basic structure present but flow is disrupted in places.
Fail (<50): Poor or absent structure.

CRITERION 5: Application to Business Context (15%)
HD (85–100): Sophisticated real-world application with specific, quantified examples and industry insight.
Distinction (75–84): Good application with relevant examples.
Credit (65–74): Some application but examples are generic or surface-level.
Pass (50–64): Limited application; mostly theoretical.
Fail (<50): No meaningful connection to business context.`;
