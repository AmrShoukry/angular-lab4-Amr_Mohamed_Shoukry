import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import type { Student, StudentGrade } from '../student';
import { StudentService } from '../student-service';
import { DepartmentService } from '../../departments/department.service';
import type { Department } from '../../departments/department';
import { CourseService } from '../../courses/course.service';
import type { Course } from '../../courses/course';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly studentService = inject(StudentService);
  private readonly departmentService = inject(DepartmentService);
  private readonly courseService = inject(CourseService);
  readonly student = signal<Student | null>(null);
  readonly grades = signal<StudentGrade[]>([]);
  readonly courses = signal<Course[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(true);
  readonly assigningGrade = signal(false);
  readonly error = signal<string | null>(null);
  readonly gradeError = signal<string | null>(null);
  readonly departmentById = computed(() => new Map(this.departments().map((department) => [department.id, department])));
  readonly courseById = computed(() => new Map(this.courses().map((course) => [course.id, course])));

  readonly gradeForm = this.formBuilder.group({
    courseId: [0, [Validators.required, Validators.min(1)]],
    grade: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.error.set('Invalid student id.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      student: this.studentService.getStudentById(id),
      departments: this.departmentService.getDepartments(),
      courses: this.courseService.getCourses(),
      grades: this.studentService.getStudentGrades(id),
    }).subscribe({
      next: ({ student, departments, courses, grades }) => {
        this.student.set(student);
        this.departments.set(departments);
        this.courses.set(courses);
        this.grades.set(grades);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load student details.');
        this.loading.set(false);
      },
    });
  }

  departmentName(student: Student | null) {
    if (!student) {
      return 'Not assigned';
    }

    return this.departmentById().get(student.departmentId ?? -1)?.name ?? 'Not assigned';
  }

  courseName(courseId: number) {
    return this.courseById().get(courseId)?.name ?? `Course #${courseId}`;
  }

  trackByCourseId(_: number, course: Course) {
    return course.id;
  }

  trackByGradeCourseId(_: number, item: StudentGrade) {
    return item.courseId;
  }

  assignGrade() {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    const student = this.student();

    if (!student) {
      return;
    }

    this.assigningGrade.set(true);
    this.gradeError.set(null);

    const rawValue = this.gradeForm.getRawValue();
    const payload = {
      courseId: Number(rawValue.courseId),
      grade: Number(rawValue.grade),
    };

    this.studentService
      .addStudentGrade(student.id, payload)
      .pipe(finalize(() => this.assigningGrade.set(false)))
      .subscribe({
        next: () => {
          const existingIndex = this.grades().findIndex((item) => item.courseId === payload.courseId);

          if (existingIndex >= 0) {
            this.grades.update((items) => items.map((item) => (item.courseId === payload.courseId ? payload : item)));
          } else {
            this.grades.update((items) => [...items, payload]);
          }

          this.gradeForm.patchValue({ grade: 0 });
        },
        error: () => {
          this.gradeError.set('Failed to assign grade.');
        },
      });
  }

  back() {
    void this.router.navigate(['/students']);
  }

  edit() {
    const student = this.student();

    if (!student) {
      return;
    }

    void this.router.navigate(['/students', student.id, 'edit']);
  }

  delete() {
    const student = this.student();

    if (!student) {
      return;
    }

    const confirmed = confirm(`Delete ${student.name}?`);

    if (!confirmed) {
      return;
    }

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        void this.router.navigate(['/students']);
      },
      error: () => {
        this.error.set('Failed to delete the student.');
      },
    });
  }
}
