import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  AdminLesson,
  CreateLessonDto,
  UpdateLessonDto,
  AdminQuiz,
  AdminQuizDetail,
  CreateQuizDto,
  UpdateQuizDto,
  CreateAdminQuestionDto,
  AdminQuizQuestion,
  AdminTag,
  CreateTagDto,
  UpdateTagDto,
} from '../models/admin.model';
import { AdminReport } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories(): Observable<AdminCategory[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/categories`)
      .pipe(map((res) => (Array.isArray(res) ? res : res?.data || [])));
  }

  getCategory(id: string): Observable<AdminCategory> {
    return this.http.get<AdminCategory>(`${this.apiUrl}/admin/categories/${id}`);
  }

  createCategory(dto: CreateCategoryDto): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(`${this.apiUrl}/admin/categories`, dto);
  }

  updateCategory(id: string, dto: UpdateCategoryDto): Observable<AdminCategory> {
    return this.http.patch<AdminCategory>(`${this.apiUrl}/admin/categories/${id}`, dto);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/categories/${id}`);
  }

  addTagToCategory(categoryId: string, tagId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/admin/categories/${categoryId}/tags/${tagId}`,
      {}
    );
  }

  removeTagFromCategory(categoryId: string, tagId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/admin/categories/${categoryId}/tags/${tagId}`
    );
  }

  // ==========================================
  // LESSONS
  // ==========================================
  getLessons(filters?: { categoryId?: string; isPublished?: boolean }): Observable<AdminLesson[]> {
    let params = new HttpParams();
    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }
    if (filters?.isPublished !== undefined) {
      params = params.set('isPublished', filters.isPublished.toString());
    }

    return this.http
      .get<any>(`${this.apiUrl}/admin/lessons`, { params })
      .pipe(map((res) => (Array.isArray(res) ? res : res?.data || [])));
  }

  getLesson(id: string): Observable<AdminLesson> {
    return this.http.get<AdminLesson>(`${this.apiUrl}/admin/lessons/${id}`);
  }

  createLesson(dto: CreateLessonDto): Observable<AdminLesson> {
    return this.http.post<AdminLesson>(`${this.apiUrl}/admin/lessons`, dto);
  }

  updateLesson(id: string, dto: UpdateLessonDto): Observable<AdminLesson> {
    return this.http.patch<AdminLesson>(`${this.apiUrl}/admin/lessons/${id}`, dto);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/lessons/${id}`);
  }

  // ==========================================
  // QUIZZES
  // ==========================================
  getQuizzes(filters?: { categoryId?: string; isPublished?: boolean }): Observable<AdminQuiz[]> {
    let params = new HttpParams();
    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }
    if (filters?.isPublished !== undefined) {
      params = params.set('isPublished', filters.isPublished.toString());
    }

    return this.http
      .get<any>(`${this.apiUrl}/admin/quizzes`, { params })
      .pipe(map((res) => (Array.isArray(res) ? res : res?.data || [])));
  }

  getQuiz(id: string): Observable<AdminQuizDetail> {
    return this.http.get<AdminQuizDetail>(`${this.apiUrl}/admin/quizzes/${id}`);
  }

  createQuiz(dto: CreateQuizDto): Observable<AdminQuiz> {
    return this.http.post<AdminQuiz>(`${this.apiUrl}/admin/quizzes`, dto);
  }

  updateQuiz(id: string, dto: UpdateQuizDto): Observable<AdminQuiz> {
    return this.http.patch<AdminQuiz>(`${this.apiUrl}/admin/quizzes/${id}`, dto);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/quizzes/${id}`);
  }

  addQuizQuestion(quizId: string, question: CreateAdminQuestionDto): Observable<AdminQuizQuestion> {
    return this.http.post<AdminQuizQuestion>(
      `${this.apiUrl}/admin/quizzes/${quizId}/questions`,
      question
    );
  }

  deleteQuizQuestion(questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/quizzes/questions/${questionId}`);
  }

  // ==========================================
  // TAGS
  // ==========================================
  getTags(filters?: { categoryId?: string }): Observable<AdminTag[]> {
    let params = new HttpParams();
    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    return this.http
      .get<any>(`${this.apiUrl}/admin/tags`, { params })
      .pipe(map((res) => (Array.isArray(res) ? res : res?.data || [])));
  }

  getTag(id: string): Observable<AdminTag> {
    return this.http.get<AdminTag>(`${this.apiUrl}/admin/tags/${id}`);
  }

  createTag(dto: CreateTagDto): Observable<AdminTag> {
    return this.http.post<AdminTag>(`${this.apiUrl}/admin/tags`, dto);
  }

  updateTag(id: string, dto: UpdateTagDto): Observable<AdminTag> {
    return this.http.patch<AdminTag>(`${this.apiUrl}/admin/tags/${id}`, dto);
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/tags/${id}`);
  }

  // ==========================================
  // REPORTS
  // ==========================================
  getReports(): Observable<AdminReport[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/reports`)
      .pipe(map((res) => (Array.isArray(res) ? res : res?.data || [])));
  }

  updateReportStatus(reportId: string, status: 'RESOLVED' | 'DISMISSED' | 'PENDING'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/reports/${reportId}`, { status });
  }

  deleteReport(reportId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/reports/${reportId}`);
  }

  // ==========================================
  // DONATIONS
  // ==========================================
  getDonations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/donations`);
  }
}
