import type { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨', mode: 'javascript' },
  { value: 'python', label: 'Python', icon: '🐍', mode: 'python' },
  { value: 'java', label: 'Java', icon: '☕', mode: 'java' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷', mode: 'typescript' },
  { value: 'cpp', label: 'C++', icon: '⚙️', mode: 'cpp' },
  { value: 'csharp', label: 'C#', icon: '💠', mode: 'csharp' },
  { value: 'go', label: 'Go', icon: '🐹', mode: 'go' },
  { value: 'php', label: 'PHP', icon: '🐘', mode: 'php' }
];