export type ReportType = 'LESSON' | 'QUIZ';

export interface CreateReportDto {
  type: ReportType;
  targetId: string;
  comment: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
}

export interface AdminReport {
  id: string;
  type: ReportType;
  targetId: string;
  comment: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}
