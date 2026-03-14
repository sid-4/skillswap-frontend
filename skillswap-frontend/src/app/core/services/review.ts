import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createReview(jobId: number | string, data: Review): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/reviews`, data);
  }

  getReviewsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews/user/${userId}`);
  }
}