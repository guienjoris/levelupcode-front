export type Difficulty = 'NOVICE' | 'INTERMEDIAIRE' | 'SENIOR';

export interface LessonListItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  orderIndex: number;
  isCompleted: boolean;
  categoryId?: string;
  categoryName?: string;
  hasQuiz?: boolean;
  category?: {
    id?: string;
    name?: string;
    slug?: string;
  };
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  description?: string;
  contentMarkdown: string;
  difficulty: Difficulty;
  isCompleted: boolean;
  orderIndex: number;
  categoryId?: string;
  categoryName?: string;
  category?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  hasQuiz?: boolean;
  quizId?: string | null;
  quiz?: {
    id: string;
    title?: string;
  };
}

export interface LessonCompletionResponse {
  isNewCompletion?: boolean;
  success?: boolean;
  message?: string;
  xpEarned: number;
  currentStreak?: number;
  newStreak?: number;
  longestStreak?: number;
}
