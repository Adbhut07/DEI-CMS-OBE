// API functions for marks management

export async function fetchAssignedSubjects() {
    const response = await fetch("http://localhost:8000/api/v1/faculty/get-assigned-subjects", { credentials: "include" })
  
    if (!response.ok) {
      throw new Error("Failed to fetch assigned subjects")
    }
  
    return response.json()
  }
  
  export async function fetchExamsBySubject(subjectId: number) {
    const response = await fetch(`http://localhost:8000/api/v1/exams/getExamsBySubject/${subjectId}`, {
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to fetch exams")
    }
  
    return response.json()
  }
  
  export async function fetchStudentsByBatch(batchId: number) {
    const response = await fetch(`http://localhost:8000/api/v1/enrollments/course/batch/${batchId}`, {
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to fetch students")
    }
  
    return response.json()
  }
  
  export async function fetchMarksByExam(examId: number) {
    const response = await fetch(`http://localhost:8000/api/v1/marks/${examId}`, { credentials: "include" })
  
    if (!response.ok) {
      throw new Error("Failed to fetch marks")
    }
  
    return response.json()
  }
  
  export async function saveMarks(examId: number, marks: Record<string, Record<string, number | null>>) {
    // Transform the marks data to match the expected API format
    const formattedMarks = Object.entries(marks).map(([studentId, questionMarks]) => {
      return {
        studentId: Number.parseInt(studentId),
        marks: Object.entries(questionMarks).map(([questionId, marksObtained]) => {
          return {
            questionId: Number.parseInt(questionId),
            marksObtained: marksObtained === null ? 0 : marksObtained, // Convert null to 0 for API
          }
        }),
      }
    })
  
    const response = await fetch(`http://localhost:8000/api/v1/marks/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        examId,
        marks: formattedMarks,
      }),
    })
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to save marks")
    }
  
    return response.json()
  }
  
  