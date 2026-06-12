import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import type { Student } from '../student';
import { StudentService } from '../student-service';
import { DepartmentService } from '../../departments/department.service';
import type { Department } from '../../departments/department';

@Component({
  selector: 'app-student-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly studentService = inject(StudentService);
  private readonly departmentService = inject(DepartmentService);
  readonly student = signal<Student | null>(null);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: [18, [Validators.required, Validators.min(1)]],
    departmentId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.error.set('Invalid student id.');
      this.loading.set(false);
      return;
    }

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: () => {
        this.error.set('Failed to load departments.');
      },
    });

    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.student.set(student);
        this.form.patchValue({
          name: student.name,
          age: student.age,
          departmentId: student.departmentId ?? 0,
        });
      },
      error: () => {
        this.error.set('Failed to load the student.');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  back() {
    void this.router.navigate(['/students']);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const student = this.student();

    if (!student) {
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
      .editStudent(student.id, payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (updatedStudent) => {
          void this.router.navigate(['/students', updatedStudent.id]);
        },
        error: () => {
          this.error.set('Failed to update the student.');
        },
      });
  }
}
