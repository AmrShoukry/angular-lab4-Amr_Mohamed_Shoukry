import { Component, inject, input, output, signal } from '@angular/core';
import type { Student } from '../student';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-student-edit',
  imports: [FormsModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css',
})
export class StudentEdit {
  onEdit = output<Student>();
  name = signal('');
  age = signal(0);
  studentService = inject(StudentService);
  student = this.studentService.getSelectedStudent();

  ngOnInit() {
    const student = this.student();
    if (student) {
      this.name.set(student.name);
      this.age.set(student.age);
    }
  }

  edit(studentForm: HTMLFormElement) {
    const student = this.student();

    if (student) {
      const updatedStudent: Student = {
        ...student,
        name: this.name(),
        age: this.age(),
      };
      this.studentService.editStudent(updatedStudent);
    }
    studentForm.reset();
  }
}
