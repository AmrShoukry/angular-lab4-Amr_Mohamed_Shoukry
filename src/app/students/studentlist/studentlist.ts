import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import type { Student } from '../student';
import { StudentService } from '../student-service';
import { DepartmentService } from '../../departments/department.service';
import type { Department } from '../../departments/department';

@Component({
  selector: 'app-studentlist',
  templateUrl: './studentlist.html',
  styleUrl: './studentlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Studentlist implements OnInit {
  private readonly router = inject(Router);
  private readonly studentService = inject(StudentService);
  private readonly departmentService = inject(DepartmentService);
  readonly students = signal<Student[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly departmentsById = computed(() => new Map(this.departments().map((department) => [department.id, department])));

  ngOnInit() {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students.set(students);
      },
      error: () => {
        this.error.set('Failed to load students.');
      },
      complete: () => {
        this.departmentService.getDepartments().subscribe({
          next: (departments) => {
            this.departments.set(departments);
          },
          error: () => {
            this.error.set('Failed to load departments.');
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      },
    });
  }

  deleteStudent(student: Student) {
    const confirmed = confirm(`Delete ${student.name}?`);

    if (!confirmed) {
      return;
    }

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.students.update((items) => items.filter((item) => item.id !== student.id));
      },
      error: () => {
        this.error.set('Failed to delete the student.');
      },
    });
  }

  createStudent() {
    void this.router.navigate(['/students/new']);
  }

  viewStudent(student: Student) {
    void this.router.navigate(['/students', student.id]);
  }

  editStudent(student: Student) {
    void this.router.navigate(['/students', student.id, 'edit']);
  }

  departmentName(student: Student) {
    return this.departmentsById().get(student.departmentId ?? -1)?.name ?? 'Not assigned';
  }
}
