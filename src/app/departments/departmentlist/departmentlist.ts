import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import type { Department } from '../department';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-departmentlist',
  templateUrl: './departmentlist.html',
  styleUrl: './departmentlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentList implements OnInit {
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentService);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.loading.set(true);
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load departments.');
        this.loading.set(false);
      },
    });
  }

  createDepartment() {
    void this.router.navigate(['/departments/new']);
  }

  viewDepartment(department: Department) {
    void this.router.navigate(['/departments', department.id]);
  }

  editDepartment(department: Department) {
    void this.router.navigate(['/departments', department.id, 'edit']);
  }

  deleteDepartment(department: Department) {
    const confirmed = confirm(`Delete ${department.name}?`);

    if (!confirmed) {
      return;
    }

    this.departmentService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.departments.update((items) => items.filter((item) => item.id !== department.id));
      },
      error: () => {
        this.error.set('Failed to delete the department.');
      },
    });
  }
}
