import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuizDetail, QuizSubmissionPayload, QuizSubmissionResult } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getQuiz(id: string): Observable<QuizDetail> {
    return this.http.get<QuizDetail>(`${this.apiUrl}/quizzes/${id}`);
  }

  submitQuiz(id: string, payload: QuizSubmissionPayload): Observable<QuizSubmissionResult> {
    return this.http.post<QuizSubmissionResult>(`${this.apiUrl}/quizzes/${id}/submit`, payload);
  }
}
