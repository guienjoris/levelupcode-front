import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserStats, LeaderboardResponse } from '../models/gamification.model';

@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMyStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/gamification/me/stats`);
  }

  getLeaderboard(page = 1, limit = 20): Observable<LeaderboardResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}/gamification/leaderboard`, { params });
  }
}
