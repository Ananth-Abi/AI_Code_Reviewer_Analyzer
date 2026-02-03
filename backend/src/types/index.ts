export interface ReviewRequest {
  code: string;
  language: string;
  sessionId: string;
}

export interface ReviewResults {
  overallScore: number;
  issues: Issue[];
  suggestions: Suggestion[];
  security: SecurityIssue[];
  bestPractices: BestPractice[];
  summary: string;
}

export interface Issue {
  severity: 'high' | 'medium' | 'low';
  line: number | null;
  issue: string;
  suggestion: string;
}

export interface Suggestion {
  category: 'performance' | 'readability' | 'maintainability';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  vulnerability: string;
  recommendation: string;
}

export interface BestPractice {
  practice: string;
  current: string;
  recommended: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}