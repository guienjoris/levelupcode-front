export type Difficulty = 'NOVICE' | 'INTERMEDIAIRE' | 'SENIOR';

export interface LessonListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  orderIndex: number;
  isCompleted: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  contentMarkdown: string;
  difficulty: Difficulty;
  isCompleted: boolean;
  orderIndex: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  quiz?: {
    id: string;
    title: string;
  };
}

export interface LessonCompletionResponse {
  success: boolean;
  message: string;
  xpEarned: number;
  newStreak: number;
}
