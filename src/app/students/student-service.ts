import { Injectable, signal } from '@angular/core';
import type { Student } from './student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  students = signal<Student[]>([]);
  selectedStudent = signal<Student | null>(null);

  getStudents() {
    return this.students;
  }

  getSelectedStudent() {
    return this.selectedStudent;
  }

  getStudentById(id: number): Student | undefined {
    return this.students().find((student) => student.id === id);
  }

  addStudent(student: Student) {
    this.students.update((students) => [...students, student]);
  }

  editStudent(updatedStudent: Student) {
    const index = this.students().findIndex((s) => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students.update((students) => {
        students[index] = updatedStudent;
        return students;
      });
      this.selectedStudent.set(updatedStudent);
    }
  }

  selectStudent(student: Student) {
    this.selectedStudent.set(student);
  }
}
