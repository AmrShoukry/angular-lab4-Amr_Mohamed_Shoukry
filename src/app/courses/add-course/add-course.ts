import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-add-course',
  imports: [ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCourse {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    credits: [3, [Validators.required, Validators.min(1)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.courseService
      .createCourse(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (course) => {
          void this.router.navigate(['/courses', course.id]);
        },
        error: () => {
          this.error.set('Failed to create the course.');
        },
      });
  }
}
