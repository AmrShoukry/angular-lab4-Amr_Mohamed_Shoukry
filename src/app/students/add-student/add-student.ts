import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DepartmentService } from '../../departments/department.service';
import type { Department } from '../../departments/department';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-add-student',
  imports: [ReactiveFormsModule],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStudent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly studentService = inject(StudentService);
  private readonly departmentService = inject(DepartmentService);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: [18, [Validators.required, Validators.min(1)]],
    departmentId: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.departmentService
      .getDepartments()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (departments) => {
          this.departments.set(departments);
        },
        error: () => {
          this.error.set('Failed to load departments.');
        },
      });
  }

  add() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const rawValue = this.form.getRawValue();
    const payload = {
      ...rawValue,
      departmentId: Number(rawValue.departmentId),
    };

    this.studentService
      .addStudent(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
      next: (newStudent) => {
        void this.router.navigate(['/students', newStudent.id]);
      },
      error: () => {
        this.error.set('Failed to create the student.');
      },
    });
  }
}
