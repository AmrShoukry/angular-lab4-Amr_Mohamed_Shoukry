import { Component, inject, OnInit, output, signal } from '@angular/core';
import type { Student, StudentForm } from '../student';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-add-student',
  imports: [FormsModule],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
  name = signal('');
  age = signal(0);
  onAdd = output<Student>();
  studentService = inject(StudentService);
  addSubscription = null;

  add(studentForm: HTMLFormElement) {
    const student: StudentForm = {
      name: this.name(),
      age: this.age(),
    };
    this.studentService.addStudent(student).subscribe({
      next: (newStudent) => {
        this.studentService.getStudents().subscribe((students) => {
          this.studentService.students.set(students);
        });
      },
    });
    studentForm.reset();
  }
}
