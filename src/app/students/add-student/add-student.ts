import { Component, inject, output, signal } from '@angular/core';
import type { Student } from '../student';
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

  add(studentForm: HTMLFormElement) {
    const student: Student = {
      id: Date.now(),
      name: this.name(),
      age: this.age(),
    };
    this.studentService.addStudent(student);
    studentForm.reset();
  }
}
