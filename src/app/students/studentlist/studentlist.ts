import { Component, inject, OnInit, signal } from '@angular/core';
import type { Student } from '../student';
import { AddStudent } from '../add-student/add-student';
import { StudentDetails } from '../student-details/student-details';
import { StudentEdit } from '../student-edit/student-edit';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-studentlist',
  imports: [AddStudent, StudentDetails, StudentEdit],
  templateUrl: './studentlist.html',
  styleUrl: './studentlist.css',
})
export class Studentlist implements OnInit {
  studentService = inject(StudentService);
  students = this.studentService.students;
  selectedStudent = this.studentService.selectedStudent;

  ngOnInit() {
    this.studentService.getStudents().subscribe((students) => {
      this.studentService.students.set(students);
    });
  }

  selectStudent(student: Student) {
    this.studentService.selectStudent(student);
  }

  deleteStudent(student: Student) {
    this.studentService.deleteStudent(student).subscribe(() => {
      this.studentService.getStudents().subscribe((students) => {
        this.studentService.students.set(students);
      });
    });
  }
}
