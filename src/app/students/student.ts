export interface Student {
  id: number;
  name: string;
  age: number;
  departmentId: number | null;
}

export interface StudentFormValue {
  name: string;
  age: number;
  departmentId: number;
}

export interface StudentGrade {
  courseId: number;
  grade: number;
}

export interface StudentGradeFormValue {
  courseId: number;
  grade: number;
}
