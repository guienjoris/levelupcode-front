import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LessonDetail, LessonCompletionResponse } from '../models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLesson(idOrSlug: string): Observable<LessonDetail> {
    return this.http.get<LessonDetail>(`${this.apiUrl}/lessons/${idOrSlug}`);
  }

  completeLesson(id: string): Observable<LessonCompletionResponse> {
    return this.http.post<LessonCompletionResponse>(`${this.apiUrl}/lessons/${id}/complete`, {});
  }
}
