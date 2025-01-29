// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2 } from "lucide-react"

// interface Question {
//   id: number
//   questionText: string
//   marksAllocated: number
//   unitId: number
// }

// interface Course {
//   id: number
//   courseName: string
// }

// interface Semester {
//   id: number
//   name: string
//   course: Course
// }

// interface Subject {
//   id: number
//   subjectName: string
// }

// interface Exam {
//   id: number
//   examType: string
//   createdAt: string
//   semester: Semester
//   subject: Subject
//   questions: Question[]
// }

// interface ExamListProps {
//   subjectId: number
// }

// export function ExamList({ subjectId }: ExamListProps) {
//   const [exams, setExams] = useState<Exam[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchExams()
//   }, [subjectId]) // Added back subjectId dependency

//   const fetchExams = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/exams/getExamsOfSubject/${subjectId}`)
//       if (!response.ok) throw new Error("Failed to fetch exams")
//       const data = await response.json()
//       setExams(data)
//     } catch (err) {
//       setError("Failed to load exams. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (error) {
//     return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
//   }

//   if (exams.length === 0) {
//     return <p className="text-center text-gray-500">No exams found for this subject.</p>
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Exams</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ul className="divide-y divide-gray-200">
//           {exams.map((exam) => (
//             <li key={exam.id} className="py-4">
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium text-gray-900">{exam.examType}</p>
//                     <p className="text-sm text-gray-500">
//                       {exam.subject.subjectName} | {exam.semester.course.courseName} - {exam.semester.name}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Created: {new Date(exam.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-700 mb-2">Questions:</p>
//                   <ul className="list-disc pl-4 space-y-2">
//                     {exam.questions.map((question) => (
//                       <li key={question.id} className="text-sm text-gray-600">
//                         {question.questionText} ({question.marksAllocated} marks)
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ExamUpdateModal } from "./exam-update-modal"

interface Question {
  id: number
  questionText: string
  marksAllocated: number
  unitId: number
}

interface Course {
  id: number
  courseName: string
}

interface Semester {
  id: number
  name: string
  course: Course
}

interface Subject {
  id: number
  subjectName: string
}

interface Exam {
  id: number
  examType: string
  createdAt: string
  semester: Semester
  subject: Subject
  questions: Question[]
}

interface ExamListProps {
  subjectId: number
}

export function ExamList({ subjectId }: ExamListProps) {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  useEffect(() => {
    fetchExams()
  }, []) 

  const fetchExams = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/exams/getExamsOfSubject/${subjectId}`)
      if (!response.ok) throw new Error("Failed to fetch exams")
      const data = await response.json()
      setExams(data)
    } catch (err) {
      setError("Failed to load exams. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExam = (exam: Exam) => {
    setSelectedExam(exam)
    setIsUpdateModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  if (exams.length === 0) {
    return <p className="text-center text-gray-500">No exams found for this subject.</p>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {exams.map((exam) => (
              <li key={exam.id} className="py-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-gray-900">{exam.examType}</p>
                      <p className="text-sm text-gray-500">
                        {exam.subject.subjectName} | {exam.semester.course.courseName} - {exam.semester.name}
                      </p>
                      <p className="text-sm text-gray-500">Created: {new Date(exam.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button onClick={() => handleUpdateExam(exam)}>Update</Button>
                  </div>

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Questions:</p>
                    <ul className="list-disc pl-4 space-y-2">
                      {exam.questions.map((question) => (
                        <li key={question.id} className="text-sm text-gray-600">
                          {question.questionText} ({question.marksAllocated} marks)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {selectedExam && (
        <ExamUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          exam={selectedExam}
          onUpdate={fetchExams}
        />
      )}
    </>
  )
}

