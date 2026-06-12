import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './course-edit.html',
  styleUrl: './course-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly courseService = inject(CourseService);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly courseId = signal<number | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    credits: [3, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.error.set('Invalid course id.');
      this.loading.set(false);
      return;
    }

    this.courseId.set(id);

    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.form.patchValue({
          name: course.name,
          credits: course.credits,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load the course.');
        this.loading.set(false);
      },
    });
  }

  back() {
    void this.router.navigate(['/courses']);
  }

  submit() {
    const id = this.courseId();

    if (this.form.invalid || id === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.courseService
      .updateCourse(id, this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (course) => {
          void this.router.navigate(['/courses', course.id]);
        },
        error: () => {
          this.error.set('Failed to update the course.');
        },
      });
  }
}
