// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"
// import { ExamUpdateModal } from "./exam-update-modal"

// interface Unit {
//   id: number
//   unitNumber: number
//   description: string
//   subjectId: number
//   attainment: number
//   createdAt: string
//   updatedAt: string
// }

// interface Question {
//   id: number
//   questionText: string
//   marksAllocated: number
//   examId: number
//   unitId: number
//   createdAt: string
//   updatedAt: string
//   unit: Unit
//   marks: any[]
// }

// interface Batch {
//   id: number
//   batchYear: number
//   courseId: number
//   createdAt: string
//   updatedAt: string
// }

// interface Course {
//   id: number
//   courseName: string
//   createdById: number
//   createdAt: string
//   updatedAt: string
// }

// interface CourseMapping {
//   id: number
//   courseId: number
//   subjectId: number
//   semester: number
//   facultyId: number
//   batchId: number
//   course: Course
//   batch: Batch
// }

// interface Subject {
//   id: number
//   subjectName: string
//   subjectCode: string
//   createdAt: string
//   updatedAt: string
//   courseMappings: CourseMapping[]
// }

// interface Exam {
//   id: number
//   examType: string
//   subjectId: number
//   createdAt: string
//   updatedAt: string
//   subject: Subject
//   questions: Question[]
//   marks: any[]
// }

// interface ApiResponse {
//   success: boolean
//   data: Exam[]
// }

// interface ExamListProps {
//   subjectId: number
// }

// export function ExamList({ subjectId }: ExamListProps) {
//   const [exams, setExams] = useState<Exam[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

//   useEffect(() => {
//     fetchExams()
//   }, [subjectId]) // Added back subjectId dependency

//   const fetchExams = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/exams/subject/${subjectId}`)
//       if (!response.ok) throw new Error("Failed to fetch exams")
//       const data: ApiResponse = await response.json()
      
//       if (data.success) {
//         setExams(data.data)
//       } else {
//         throw new Error("API returned unsuccessful status")
//       }
//     } catch (err) {
//       setError("Failed to load exams. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpdateExam = (exam: Exam) => {
//     setSelectedExam(exam)
//     setIsUpdateModalOpen(true)
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
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Exams</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="divide-y divide-gray-200">
//             {exams.map((exam) => {
//               // Get course and batch info from first course mapping if available
//               const courseMapping = exam.subject.courseMappings[0];
//               const courseName = courseMapping?.course?.courseName || "No Course";
//               const batchYear = courseMapping?.batch?.batchYear || "N/A";
//               const semester = courseMapping?.semester || "N/A";
              
//               return (
//                 <li key={exam.id} className="py-4">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-lg font-medium text-gray-900">{exam.examType}</p>
//                         <p className="text-sm text-gray-500">
//                           {exam.subject.subjectName} ({exam.subject.subjectCode}) | {courseName} - Semester {semester} | Batch {batchYear}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Created: {new Date(exam.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <Button onClick={() => handleUpdateExam(exam)}>Update</Button>
//                     </div>
                    
//                     <div className="ml-4">
//                       <p className="text-sm font-medium text-gray-700 mb-2">Questions:</p>
//                       <ul className="list-disc pl-4 space-y-2">
//                         {exam.questions.map((question) => (
//                           <li key={question.id} className="text-sm text-gray-600">
//                             <div>
//                               <span>{question.questionText} ({question.marksAllocated} marks)</span>
//                               <p className="text-xs text-gray-500 mt-1">Unit {question.unit.unitNumber}: {question.unit.description}</p>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </li>
//               )
//             })}
//           </ul>
//         </CardContent>
//       </Card>
//       {selectedExam && (
//         <ExamUpdateModal
//           isOpen={isUpdateModalOpen}
//           onClose={() => setIsUpdateModalOpen(false)}
//           exam={selectedExam}
//           onUpdate={fetchExams}
//         />
//       )}
//     </>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ExamUpdateModal } from "./exam-update-modal"

interface Unit {
  id: number
  unitNumber: number
  description: string
  subjectId: number
  attainment: number
  createdAt: string
  updatedAt: string
}

interface Question {
  id: number
  questionText: string
  marksAllocated: number
  examId: number
  unitId: number
  createdAt: string
  updatedAt: string
  unit: Unit
  marks: any[]
}

interface Batch {
  id: number
  batchYear: number
  courseId: number
  createdAt: string
  updatedAt: string
}

interface Course {
  id: number
  courseName: string
  createdById: number
  createdAt: string
  updatedAt: string
}

interface CourseMapping {
  id: number
  courseId: number
  subjectId: number
  semester: number
  facultyId: number
  batchId: number
  course: Course
  batch: Batch
}

interface Subject {
  id: number
  subjectName: string
  subjectCode: string
  createdAt: string
  updatedAt: string
  courseMappings: CourseMapping[]
}

interface Exam {
  id: number
  examType: string
  subjectId: number
  marksAllocated: number
  createdAt: string
  updatedAt: string
  subject: Subject
  questions: Question[]
  marks: any[]
}

interface ApiResponse {
  success: boolean
  data: Exam[]
}

interface ExamListProps {
  subjectId: number
}

// Define exam types arrays
const EXAM_TYPES_WITH_QUESTIONS = ["CT1", "CT2", "CA", "ESE"];
const INTERNAL_ASSESSMENT_TYPES = ["DHA", "AA", "ATT"];

export function ExamList({ subjectId }: ExamListProps) {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  useEffect(() => {
    fetchExams()
  }, [subjectId])

  const fetchExams = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/exams/subject/${subjectId}`)
      if (!response.ok) throw new Error("Failed to fetch exams")
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setExams(data.data)
      } else {
        throw new Error("API returned unsuccessful status")
      }
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

  const isInternalAssessment = (examType: string) => {
    return INTERNAL_ASSESSMENT_TYPES.includes(examType);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {exams.map((exam) => {
              // Get course and batch info from first course mapping if available
              const courseMapping = exam.subject.courseMappings[0];
              const courseName = courseMapping?.course?.courseName || "No Course";
              const batchYear = courseMapping?.batch?.batchYear || "N/A";
              const semester = courseMapping?.semester || "N/A";
              
              return (
                <li key={exam.id} className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{exam.examType}</p>
                        <p className="text-sm text-gray-500">
                          {exam.subject.subjectName} ({exam.subject.subjectCode}) | {courseName} - Semester {semester} | Batch {batchYear}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(exam.createdAt).toLocaleDateString()} | Total Marks: {exam.marksAllocated}
                        </p>
                      </div>
                      <Button onClick={() => handleUpdateExam(exam)}>Update</Button>
                    </div>
                    
                    {isInternalAssessment(exam.examType) ? (
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Internal Assessment - {exam.marksAllocated} marks</p>
                        <p className="text-xs text-gray-500 mt-1">
                          This is an internal assessment exam with no individual questions.
                        </p>
                      </div>
                    ) : (
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Questions:</p>
                        {exam.questions.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-2">
                            {exam.questions.map((question) => (
                              <li key={question.id} className="text-sm text-gray-600">
                                <div>
                                  <span>{question.questionText} ({question.marksAllocated} marks)</span>
                                  <p className="text-xs text-gray-500 mt-1">Unit {question.unit.unitNumber}: {question.unit.description}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No questions have been added to this exam yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
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