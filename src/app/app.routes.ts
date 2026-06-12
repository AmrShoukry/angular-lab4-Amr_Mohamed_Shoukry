import type { Routes } from '@angular/router';
import { Studentlist } from './students/studentlist/studentlist';
import { StudentDetails } from './students/student-details/student-details';
import { AddStudent } from './students/add-student/add-student';
import { StudentEdit } from './students/student-edit/student-edit';
import { DepartmentList } from './departments/departmentlist/departmentlist';
import { DepartmentDetails } from './departments/department-details/department-details';
import { AddDepartment } from './departments/add-department/add-department';
import { DepartmentEdit } from './departments/department-edit/department-edit';
import { CourseList } from './courses/courselist/courselist';
import { CourseDetails } from './courses/course-details/course-details';
import { AddCourse } from './courses/add-course/add-course';
import { CourseEdit } from './courses/course-edit/course-edit';

export const routes: Routes = [
  // Home + Students
  { path: 'home', component: Studentlist },
  { path: 'students', component: Studentlist },
  { path: 'students/new', component: AddStudent },
  { path: 'students/:id', component: StudentDetails },
  { path: 'students/:id/edit', component: StudentEdit },

  // Departments
  { path: 'departments', component: DepartmentList },
  { path: 'departments/new', component: AddDepartment },
  { path: 'departments/:id', component: DepartmentDetails },
  { path: 'departments/:id/edit', component: DepartmentEdit },

  // Courses
  { path: 'courses', component: CourseList },
  { path: 'courses/new', component: AddCourse },
  { path: 'courses/:id', component: CourseDetails },
  { path: 'courses/:id/edit', component: CourseEdit },

  // Other routes
  {
    path: 'products',
    loadComponent: () => import('./products/productlist/productlist').then((m) => m.Productlist),
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact/contact').then((m) => m.Contact),
  },
  { path: 'about', loadComponent: () => import('./about/about/about').then((m) => m.About) },

  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: '**', redirectTo: '/students' },
];
