
// API functions for marks management

export async function fetchAssignedSubjects() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/faculty/get-assigned-subjects`, { credentials: "include" })

  if (!response.ok) {
    throw new Error("Failed to fetch assigned subjects")
  }

  return response.json()
}

export async function fetchExamsBySubject(subjectId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/exams/getExamsBySubject/${subjectId}`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch exams")
  }

  return response.json()
}

export async function fetchStudentsByBatch(batchId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/enrollments/course/batch/${batchId}`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch students")
  }

  return response.json()
}

export async function fetchMarksByExam(examId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/marks/${examId}`, { credentials: "include" })

  if (!response.ok) {
    throw new Error("Failed to fetch marks")
  }

  return response.json()
}

export async function saveMarks(examId: number, marks: Record<string, Record<string, number | null> | number | null>) {
  // Check if this is a question-wise exam or a total-only exam
  const isQuestionWise = typeof Object.values(marks)[0] === 'object';
  
  let requestBody: any;
  
  if (isQuestionWise) {
    // Transform the marks data for question-wise exams (CT1, CT2, ESE, CA)
    requestBody = {
      examId,
      marks: Object.entries(marks).map(([studentId, questionMarks]) => {
        return {
          studentId: Number.parseInt(studentId),
          questionMarks: Object.entries(questionMarks as Record<string, number | null>).map(([questionId, marksObtained]) => {
            return {
              questionId: Number.parseInt(questionId),
              marksObtained: marksObtained === null ? 0 : marksObtained, // Convert null to 0 for API
            }
          }),
        }
      })
    };
  } else {
    // Transform the marks data for total-only exams (AA, ATT, DHA)
    requestBody = {
      examId,
      marks: Object.entries(marks).map(([studentId, marksObtained]) => {
        return {
          studentId: Number.parseInt(studentId),
          marksObtained: marksObtained === null ? 0 : marksObtained, // Convert null to 0 for API
        }
      })
    };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/marks/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to save marks")
  }

  return response.json()
}