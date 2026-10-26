import { Difficulty } from './lesson.model';
import { Tag } from './category.model';

export type { Difficulty };

// ==========================================
// CATEGORIES
// ==========================================
export interface CreateCategoryDto {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  orderIndex?: number;
  tagIds?: string[];
}

export interface UpdateCategoryDto {
  slug?: string;
  name?: string;
  description?: string;
  icon?: string;
  orderIndex?: number;
  tagIds?: string[];
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  orderIndex: number;
  tags?: Tag[];
  lessonsCount?: number;
  quizzesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// TAGS
// ==========================================
export interface CreateTagDto {
  slug: string;
  name: string;
  categoryIds?: string[];
}

export interface UpdateTagDto {
  slug?: string;
  name?: string;
  categoryIds?: string[];
}

export interface AdminTag {
  id: string;
  slug: string;
  name: string;
  categories?: { id: string; name: string; slug: string }[];
  categoriesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// LESSONS
// ==========================================
export interface CreateLessonDto {
  slug: string;
  title: string;
  description?: string;
  contentMarkdown: string;
  difficulty: Difficulty;
  orderIndex?: number;
  categoryId: string;
  isPublished?: boolean;
}

export interface UpdateLessonDto {
  slug?: string;
  title?: string;
  description?: string;
  contentMarkdown?: string;
  difficulty?: Difficulty;
  orderIndex?: number;
  categoryId?: string;
  isPublished?: boolean;
}

export interface AdminLesson {
  id: string;
  slug: string;
  title: string;
  description?: string;
  contentMarkdown?: string;
  difficulty: Difficulty;
  orderIndex: number;
  categoryId: string;
  categoryName?: string;
  category?: { id: string; name: string; slug?: string };
  isPublished?: boolean;
  hasQuiz?: boolean;
  quizId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// QUIZZES & QUESTIONS
// ==========================================
export interface CreateAdminAnswerDto {
  text: string;
  isCorrect: boolean;
  orderIndex?: number;
}

export interface CreateAdminQuestionDto {
  title: string;
  codeSnippet?: string;
  explanation?: string;
  orderIndex?: number;
  answers: CreateAdminAnswerDto[];
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  difficulty: Difficulty;
  categoryId: string;
  lessonId?: string;
  orderIndex?: number;
  isPublished?: boolean;
  questions: CreateAdminQuestionDto[];
}

export interface UpdateQuizDto {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  categoryId?: string;
  lessonId?: string;
  orderIndex?: number;
  isPublished?: boolean;
}

export interface AdminQuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  orderIndex?: number;
}

export interface AdminQuizQuestion {
  id: string;
  title: string;
  codeSnippet?: string;
  explanation?: string;
  orderIndex: number;
  answers: AdminQuizAnswer[];
}

export interface AdminQuiz {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  categoryId: string;
  categoryName?: string;
  category?: { id: string; name: string; slug?: string };
  lessonId?: string | null;
  lessonTitle?: string | null;
  lesson?: { id: string; title: string; slug?: string };
  orderIndex: number;
  isPublished?: boolean;
  questionsCount?: number;
  questions?: AdminQuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminQuizDetail extends AdminQuiz {
  questions: AdminQuizQuestion[];
}

// Utility function to slugify text
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\- ]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/\-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start
    .replace(/-+$/, ''); // trim - from end
}
