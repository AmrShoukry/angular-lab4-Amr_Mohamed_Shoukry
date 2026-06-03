import { Component, inject, input } from '@angular/core';
import type { Student } from '../student';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-student-details',
  imports: [],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails {
  studentService = inject(StudentService);
  student = this.studentService.getSelectedStudent();
}
