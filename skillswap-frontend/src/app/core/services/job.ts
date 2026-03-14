import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchJobs(filters: any = {}): Observable<Job[]> {
    return this.http.post<Job[]>(`${this.apiUrl}/jobs/search`, filters);
  }

  createJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, data);
  }

  getJobById(id: number | string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  getMyPostings(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/my-postings`);
  }

  updateJob(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/jobs/${id}`, data);
  }

  completeJob(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/jobs/${id}/complete`, {});
  }
}