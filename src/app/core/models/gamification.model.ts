export interface CategoryXpScore {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  xp: number;
}

export interface TagXpScore {
  tagId: string;
  tagName: string;
  tagSlug: string;
  xp: number;
}

export interface UserStats {
  userId?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string | null;
  totalXp: number;
  isSupporter: boolean;
  supporterSince?: string;
  daysSinceRegistration: number;
  registrationDays: number;
  completedLessonsCount: number;
  completedQuizzesCount: number;
  xpByCategory: CategoryXpScore[];
  xpByTag: TagXpScore[];
  scoresByCategory: CategoryXpScore[];
  scoresByTag: TagXpScore[];
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  totalXp: number;
  currentStreak: number;
  isSupporter: boolean;
}

export interface LeaderboardResponse {
  data: LeaderboardUser[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}
