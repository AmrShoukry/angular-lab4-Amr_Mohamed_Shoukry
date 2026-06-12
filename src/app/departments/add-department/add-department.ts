import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-add-department',
  imports: [ReactiveFormsModule],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDepartment {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentService);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.departmentService
      .createDepartment(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (department) => {
          void this.router.navigate(['/departments', department.id]);
        },
        error: () => {
          this.error.set('Failed to create the department.');
        },
      });
  }
}
