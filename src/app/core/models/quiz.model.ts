import { Difficulty } from './lesson.model';

export interface QuizAnswerOption {
  id: string;
  text: string;
  orderIndex?: number;
}

export interface QuizQuestion {
  id: string;
  title: string;
  codeSnippet?: string;
  orderIndex: number;
  answers: QuizAnswerOption[];
}

export interface QuizDetail {
  id: string;
  title: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
}

export interface QuizSubmissionAnswer {
  questionId: string;
  answerId: string;
}

export interface QuizSubmissionPayload {
  answers: QuizSubmissionAnswer[];
}

export interface QuizQuestionResult {
  questionId: string;
  userAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmissionResult {
  score: number;
  passed: boolean;
  xpEarned: number;
  currentStreak: number;
  results: QuizQuestionResult[];
}
