import { Injectable, signal, inject } from '@angular/core';
import type { Student, StudentForm } from './student';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  students = signal<Student[]>([]);
  selectedStudent = signal<Student | null>(null);
  private baseUrl = 'http://localhost:3000/api/students/';
  private http = inject(HttpClient);

  getStudents() {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getSelectedStudent() {
    return this.selectedStudent;
  }

  getStudentById(id: number) {
    return this.http.get<Student>(`${this.baseUrl}${id}`);
  }

  addStudent(student: StudentForm) {
    return this.http.post<StudentForm>(this.baseUrl, student);
  }

  editStudent(updatedStudent: Student) {
    return this.http.put<Student>(`${this.baseUrl}${updatedStudent.id}`, updatedStudent);
  }

  selectStudent(student: Student) {
    return this.selectedStudent.set(student);
  }

  deleteStudent(student: Student) {
    return this.http.delete(`${this.baseUrl}${student.id}`);
  }
}
