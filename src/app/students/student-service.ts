import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { Student, StudentFormValue, StudentGrade } from './student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly baseUrl = `${API_BASE_URL}/students`;
  private http = inject(HttpClient);

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  addStudent(student: StudentFormValue): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  editStudent(id: number, updatedStudent: StudentFormValue): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, updatedStudent);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getStudentGrades(id: number): Observable<StudentGrade[]> {
    return this.http
      .get<StudentGrade[] | { value?: StudentGrade[] }>(`${this.baseUrl}/${id}/grades`)
      .pipe(map((response) => (Array.isArray(response) ? response : (response.value ?? []))));
  }

  addStudentGrade(id: number, grade: { courseId: number; grade: number }): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/${id}/grades`, grade);
  }
}
