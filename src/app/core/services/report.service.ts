import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateReportDto, ReportResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createReport(dto: CreateReportDto): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(`${this.apiUrl}/reports`, dto);
  }
}
