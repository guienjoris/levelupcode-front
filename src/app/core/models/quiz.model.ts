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
  selectedAnswerId: string;
}

export interface QuizSubmissionPayload {
  answers: QuizSubmissionAnswer[];
}

export interface QuestionCorrection {
  questionId: string;
  selectedAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation?: string;
  userAnswerId?: string; // alias
}

export type QuizQuestionResult = QuestionCorrection;

export interface QuizReward {
  isNewCompletion?: boolean;
  xpEarned: number;
  currentStreak?: number;
  longestStreak?: number;
  newStreak?: number;
}

export interface QuizSubmissionResult {
  quizId?: string;
  score: number;
  passed: boolean;
  totalQuestions?: number;
  correctCount?: number;
  corrections: QuestionCorrection[];
  reward?: QuizReward;
  // Aliases for retro-compatibility
  xpEarned?: number;
  currentStreak?: number;
  results?: QuestionCorrection[];
}
