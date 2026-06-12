import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CourseService } from '../course.service';
import type { Course } from '../course';
import type { Department } from '../../departments/department';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  readonly course = signal<Course | null>(null);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.error.set('Invalid course id.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      course: this.courseService.getCourseById(id),
      departments: this.courseService.getCourseDepartments(id),
    }).subscribe({
      next: ({ course, departments }) => {
        this.course.set(course);
        this.departments.set(departments);
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

  edit() {
    const course = this.course();

    if (!course) {
      return;
    }

    void this.router.navigate(['/courses', course.id, 'edit']);
  }

  delete() {
    const course = this.course();

    if (!course) {
      return;
    }

    const confirmed = confirm(`Delete ${course.name}?`);

    if (!confirmed) {
      return;
    }

    this.courseService.deleteCourse(course.id).subscribe({
      next: () => {
        void this.router.navigate(['/courses']);
      },
      error: () => {
        this.error.set('Failed to delete the course.');
      },
    });
  }
}
