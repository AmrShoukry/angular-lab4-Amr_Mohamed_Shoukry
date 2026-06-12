import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { Department } from '../departments/department';
import type { Course, CourseFormValue } from './course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly baseUrl = `${API_BASE_URL}/courses`;
  private readonly http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  createCourse(payload: CourseFormValue): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, payload);
  }

  updateCourse(id: number, payload: CourseFormValue): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, payload);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCourseDepartments(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/${id}/departments`);
  }
}
