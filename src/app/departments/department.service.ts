import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { Course } from '../courses/course';
import type { Student } from '../students/student';
import type { Department, DepartmentCourseAssignment, DepartmentFormValue } from './department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly baseUrl = `${API_BASE_URL}/departments`;
  private readonly assignUrl = `${API_BASE_URL}/assign-course`;
  private readonly http = inject(HttpClient);

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  createDepartment(payload: DepartmentFormValue): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, payload);
  }

  updateDepartment(id: number, payload: DepartmentFormValue): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/${id}`, payload);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getDepartmentStudents(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/${id}/students`);
  }

  getDepartmentCourses(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/${id}/courses`);
  }

  assignCourse(payload: DepartmentCourseAssignment): Observable<unknown> {
    return this.http.post(this.assignUrl, payload);
  }

  removeCourse(payload: DepartmentCourseAssignment): Observable<unknown> {
    return this.http.request('DELETE', this.assignUrl, { body: payload });
  }
}
