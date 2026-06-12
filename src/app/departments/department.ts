export interface Department {
  id: number;
  name: string;
}

export interface DepartmentFormValue {
  name: string;
}

export interface DepartmentCourseAssignment {
  departmentId: number;
  courseId: number;
}
