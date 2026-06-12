import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './department-edit.html',
  styleUrl: './department-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly departmentService = inject(DepartmentService);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly departmentId = signal<number | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.error.set('Invalid department id.');
      this.loading.set(false);
      return;
    }

    this.departmentId.set(id);

    this.departmentService.getDepartmentById(id).subscribe({
      next: (department) => {
        this.form.patchValue({ name: department.name });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load the department.');
        this.loading.set(false);
      },
    });
  }

  back() {
    void this.router.navigate(['/departments']);
  }

  submit() {
    if (this.form.invalid || this.departmentId() === null) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.departmentId();

    if (id === null) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.departmentService
      .updateDepartment(id, this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (department) => {
          void this.router.navigate(['/departments', department.id]);
        },
        error: () => {
          this.error.set('Failed to update the department.');
        },
      });
  }
}
