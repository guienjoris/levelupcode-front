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
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  isSupporter: boolean;
  supporterSince?: string;
  registrationDays: number;
  completedLessonsCount: number;
  completedQuizzesCount: number;
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
