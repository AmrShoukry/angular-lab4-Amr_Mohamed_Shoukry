import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import type { OnInit as OnInitType } from '@angular/core';
import { Router } from '@angular/router';
import type { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-courselist',
  templateUrl: './courselist.html',
  styleUrl: './courselist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseList implements OnInitType {
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  readonly courses = signal<Course[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load courses.');
        this.loading.set(false);
      },
    });
  }

  createCourse() {
    void this.router.navigate(['/courses/new']);
  }

  viewCourse(course: Course) {
    void this.router.navigate(['/courses', course.id]);
  }

  editCourse(course: Course) {
    void this.router.navigate(['/courses', course.id, 'edit']);
  }

  deleteCourse(course: Course) {
    const confirmed = confirm(`Delete ${course.name}?`);

    if (!confirmed) {
      return;
    }

    this.courseService.deleteCourse(course.id).subscribe({
      next: () => {
        this.courses.update((items) => items.filter((item) => item.id !== course.id));
      },
      error: () => {
        this.error.set('Failed to delete the course.');
      },
    });
  }
}
