import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { DepartmentService } from '../department.service';
import type { Department } from '../department';
import type { Course } from '../../courses/course';
import type { Student } from '../../students/student';
import { CourseService } from '../../courses/course.service';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentService);
  private readonly courseService = inject(CourseService);
  readonly department = signal<Department | null>(null);
  readonly students = signal<Student[]>([]);
  readonly allCourses = signal<Course[]>([]);
  readonly assignedCourses = signal<Course[]>([]);
  readonly selectedCourseIds = signal<number[]>([]);
  readonly loading = signal(true);
  readonly savingAssignments = signal(false);
  readonly error = signal<string | null>(null);
  readonly assignedCourseIdSet = computed(() => new Set(this.selectedCourseIds()));

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.error.set('Invalid department id.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      department: this.departmentService.getDepartmentById(id),
      students: this.departmentService.getDepartmentStudents(id),
      assignedCourses: this.departmentService.getDepartmentCourses(id),
      allCourses: this.courseService.getCourses(),
    }).subscribe({
      next: ({ department, students, assignedCourses, allCourses }) => {
        this.department.set(department);
        this.students.set(students);
        this.assignedCourses.set(assignedCourses);
        this.allCourses.set(allCourses);
        this.selectedCourseIds.set(assignedCourses.map((course) => course.id));
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

  edit() {
    const department = this.department();

    if (!department) {
      return;
    }

    void this.router.navigate(['/departments', department.id, 'edit']);
  }

  delete() {
    const department = this.department();

    if (!department) {
      return;
    }

    const confirmed = confirm(`Delete ${department.name}?`);

    if (!confirmed) {
      return;
    }

    this.departmentService.deleteDepartment(department.id).subscribe({
      next: () => {
        void this.router.navigate(['/departments']);
      },
      error: () => {
        this.error.set('Failed to delete the department.');
      },
    });
  }

  toggleCourse(courseId: number, checked: boolean) {
    this.selectedCourseIds.update((current) => {
      if (checked) {
        return current.includes(courseId) ? current : [...current, courseId];
      }

      return current.filter((id) => id !== courseId);
    });
  }

  isCourseSelected(courseId: number) {
    return this.assignedCourseIdSet().has(courseId);
  }

  saveAssignments() {
    const department = this.department();

    if (!department) {
      return;
    }

    const selectedIds = this.selectedCourseIds();
    const assignedIds = this.assignedCourses().map((course) => course.id);
    const addTasks = selectedIds
      .filter((courseId) => !assignedIds.includes(courseId))
      .map((courseId) => this.departmentService.assignCourse({ departmentId: department.id, courseId }));
    const removeTasks = assignedIds
      .filter((courseId) => !selectedIds.includes(courseId))
      .map((courseId) => this.departmentService.removeCourse({ departmentId: department.id, courseId }));

    if (addTasks.length === 0 && removeTasks.length === 0) {
      return;
    }

    this.savingAssignments.set(true);
    this.error.set(null);

    forkJoin([...addTasks, ...removeTasks].length > 0 ? [...addTasks, ...removeTasks] : [of(null)]).subscribe({
      next: () => {
        this.assignedCourses.set(this.allCourses().filter((course) => selectedIds.includes(course.id)));
        this.savingAssignments.set(false);
      },
      error: () => {
        this.error.set('Failed to update course assignments.');
        this.savingAssignments.set(false);
      },
    });
  }
}
