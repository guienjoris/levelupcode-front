import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserStats, LeaderboardResponse, CategoryXpScore, TagXpScore, LeaderboardUser } from '../models/gamification.model';

@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMyStats(): Observable<UserStats> {
    return this.http.get<any>(`${this.apiUrl}/gamification/me/stats`).pipe(
      map((res) => {
        const xpByCategory: CategoryXpScore[] = res?.xpByCategory || res?.scoresByCategory || [];
        const xpByTag: TagXpScore[] = res?.xpByTag || res?.scoresByTag || [];
        const daysSinceRegistration = res?.daysSinceRegistration ?? res?.registrationDays ?? 1;

        return {
          userId: res?.userId,
          currentStreak: res?.currentStreak ?? 0,
          longestStreak: res?.longestStreak ?? 0,
          lastActiveDate: res?.lastActiveDate || null,
          totalXp: res?.totalXp ?? 0,
          isSupporter: !!res?.isSupporter,
          supporterSince: res?.supporterSince,
          daysSinceRegistration,
          registrationDays: daysSinceRegistration,
          completedLessonsCount: res?.completedLessonsCount ?? 0,
          completedQuizzesCount: res?.completedQuizzesCount ?? 0,
          xpByCategory,
          scoresByCategory: xpByCategory,
          xpByTag,
          scoresByTag: xpByTag,
        } as UserStats;
      })
    );
  }

  getLeaderboard(page = 1, limit = 20, sortBy: 'xp' | 'streak' = 'xp'): Observable<LeaderboardResponse> {
    const offset = (page - 1) * limit;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('sortBy', sortBy);

    return this.http.get<any>(`${this.apiUrl}/gamification/leaderboard`, { params }).pipe(
      map((res) => {
        const entries: LeaderboardUser[] = (res?.entries || res?.data || []).map((entry: any, index: number) => ({
          rank: entry.rank ?? offset + index + 1,
          userId: entry.userId,
          name: entry.name || 'Apprenant',
          avatarUrl: entry.avatarUrl,
          totalXp: entry.totalXp ?? 0,
          currentStreak: entry.currentStreak ?? 0,
          longestStreak: entry.longestStreak ?? 0,
          isSupporter: !!entry.isSupporter,
        }));
        const total = res?.total ?? res?.meta?.total ?? entries.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return {
          data: entries,
          meta: {
            total,
            page,
            totalPages,
          },
        };
      })
    );
  }
}
