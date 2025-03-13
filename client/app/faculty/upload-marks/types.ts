export interface Subject {
  id: number
  name: string
  code: string
}

export interface SubjectMapping {
  id: number
  subject: {
    id: number
    name: string
    code: string
  }
  course: {
    id: number
    name: string
  }
  batch: {
    id: number
    year: number
  }
  semester: number
}

export interface SelectedSubject {
  id: number
  name: string
  code: string
  courseId: number
  courseName: string
  batchId: number
  batchYear: number
  semester: number
  mappingId: number
}

export interface Exam {
  id: number
  examType: string
  subjectId: number
  createdAt: string
  updatedAt: string
  questions: Question[]
}

export interface Question {
  id: number
  questionText: string
  marksAllocated: number
  examId: number
  unitId: number
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: number
  name: string
  email: string
  rollNo: string
  marks?: Record<string, number>
}

export interface MarkEntry {
  questionId: number
  marksObtained: number
}

export interface StudentMarks {
  studentId: number
  marks: MarkEntry[]
}

export interface MarksUploadRequest {
  examId: number
  marks: StudentMarks[]
}

export interface MarksResponse {
  success: boolean
  data: {
    examId: number
    questions: {
      id: number
      text: string
    }[]
    students: Student[]
  }
}

export interface StudentsResponse {
  success: boolean
  message: string
  courseId: number
  courseName: string
  batchYear: number
  students: Student[]
}

