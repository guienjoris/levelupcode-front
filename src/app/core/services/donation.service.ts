import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supporter, UserDonationStatus } from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getSupporters(limit = 20): Observable<Supporter[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Supporter[]>(`${this.apiUrl}/donations/supporters`, { params });
  }

  getMyDonations(): Observable<UserDonationStatus> {
    return this.http.get<UserDonationStatus>(`${this.apiUrl}/donations/me`);
  }
}
