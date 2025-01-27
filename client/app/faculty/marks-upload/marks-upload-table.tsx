// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Loader2 } from "lucide-react"

// interface Student {
//   id: number
//   name: string
// }

// interface Question {
//   id: number
//   questionText: string
//   marksAllocated: number
// }

// interface Exam {
//   id: number
//   examType: string
//   questions: Question[]
// }

// interface MarksUploadTableProps {
//   subjectId: number
//   courseId: number
// }

// export function MarksUploadTable({ subjectId, courseId }: MarksUploadTableProps) {
//   const [students, setStudents] = useState<Student[]>([])
//   const [exams, setExams] = useState<Exam[]>([])
//   const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
//   const [marks, setMarks] = useState<{ [key: string]: number }>({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     fetchStudentsAndExams()
//   }, [subjectId, courseId])

//   const fetchStudentsAndExams = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [studentsResponse, examsResponse] = await Promise.all([
//         fetch(`http://localhost:8000/api/v1/enrollments/students/${subjectId}/${courseId}`),
//         fetch(`http://localhost:8000/api/v1/exams/getExamsOfSubject/${subjectId}`),
//       ])

//       if (!studentsResponse.ok || !examsResponse.ok) {
//         throw new Error("Failed to fetch data")
//       }

//       const studentsData = await studentsResponse.json()
//       const examsData = await examsResponse.json()

//       setStudents(studentsData.data)
//       setExams(examsData.data)
//     } catch (err) {
//       setError("Failed to load data. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleMarkChange = (studentId: number, questionId: number, value: string) => {
//     setMarks((prev) => ({
//       ...prev,
//       [`${studentId}-${questionId}`]: Number(value),
//     }))
//   }

//   const handleSubmit = async () => {
//     if (!selectedExam) return

//     setSubmitting(true)
//     setError(null)

//     const formattedMarks = students.map((student) => ({
//       studentId: student.id,
//       marks: selectedExam.questions.map((question) => ({
//         questionId: question.id,
//         marksObtained: marks[`${student.id}-${question.id}`] || 0,
//       })),
//     }))

//     try {
//       const response = await fetch("http://localhost:8000/api/v1/marks/upload", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           examId: selectedExam.id,
//           marks: formattedMarks,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to upload marks")
//       }

//       alert("Marks uploaded successfully!")
//     } catch (err) {
//       setError("Failed to upload marks. Please try again.")
//     } finally {
//       setSubmitting(false)
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
//     return <div className="text-red-500">{error}</div>
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <Select onValueChange={(value) => setSelectedExam(exams.find((exam) => exam.id === Number(value)) || null)}>
//           <SelectTrigger className="w-[200px]">
//             <SelectValue placeholder="Select an exam" />
//           </SelectTrigger>
//           <SelectContent>
//             {exams.map((exam) => (
//               <SelectItem key={exam.id} value={exam.id.toString()}>
//                 {exam.examType}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Button onClick={handleSubmit} disabled={!selectedExam || submitting}>
//           {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//           Upload Marks
//         </Button>
//       </div>

//       {selectedExam && (
//         <div className="border rounded-lg overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="sticky left-0 bg-white">Student Name</TableHead>
//                 {selectedExam.questions.map((question, index) => (
//                   <TableHead key={question.id} className="text-center">
//                     <div>Q{index + 1}</div>
//                     <div className="text-xs text-gray-500">({question.marksAllocated} marks)</div>
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {students.map((student) => (
//                 <TableRow key={student.id}>
//                   <TableCell className="sticky left-0 bg-white">{student.name}</TableCell>
//                   {selectedExam.questions.map((question) => (
//                     <TableCell key={question.id}>
//                       <Input
//                         type="number"
//                         min="0"
//                         max={question.marksAllocated}
//                         value={marks[`${student.id}-${question.id}`] || ""}
//                         onChange={(e) => handleMarkChange(student.id, question.id, e.target.value)}
//                         className="w-20 text-center"
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface Student {
  id: number
  name: string
}

interface Question {
  id: number
  questionText: string
  marksAllocated: number
}

interface Exam {
  id: number
  examType: string
  questions: Question[]
}

interface MarksUploadTableProps {
  subjectId: number
  courseId: number
}

export function MarksUploadTable({ subjectId, courseId }: MarksUploadTableProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [marks, setMarks] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchStudentsAndExams()
  }, [subjectId, courseId])

  const fetchStudentsAndExams = async () => {
    setLoading(true)
    setError(null)
    try {
      const [studentsResponse, examsResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/enrollments/students/${subjectId}/${courseId}`),
        fetch(`http://localhost:8000/api/v1/exams/getExamsOfSubject/${subjectId}`),
      ])

      if (!studentsResponse.ok || !examsResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const studentsData = await studentsResponse.json()
      const examsData = await examsResponse.json()

      setStudents(studentsData.data || [])
      setExams(examsData || [])
    } catch (err) {
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkChange = (studentId: number, questionId: number, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [`${studentId}-${questionId}`]: Number(value),
    }))
  }

  const handleSubmit = async () => {
    if (!selectedExam) return

    setSubmitting(true)
    setError(null)

    const formattedMarks = students.map((student) => ({
      studentId: student.id,
      marks: selectedExam.questions.map((question) => ({
        questionId: question.id,
        marksObtained: marks[`${student.id}-${question.id}`] || 0,
      })),
    }))

    try {
      const response = await fetch("http://localhost:8000/api/v1/marks/upload", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: selectedExam.id,
          marks: formattedMarks,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload marks")
      }

      alert("Marks uploaded successfully!")
    } catch (err) {
      setError("Failed to upload marks. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setSelectedExam(exams.find((exam) => exam.id === Number(value)) || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select an exam" />
          </SelectTrigger>
          <SelectContent>
            {exams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id.toString()}>
                {exam.examType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} disabled={!selectedExam || submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Upload Marks
        </Button>
      </div>

      {selectedExam && (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-white">Student Name</TableHead>
                {selectedExam.questions.map((question, index) => (
                  <TableHead key={question.id} className="text-center">
                    <div>Q{index + 1}</div>
                    <div className="text-xs text-gray-500">({question.marksAllocated} marks)</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="sticky left-0 bg-white">{student.name}</TableCell>
                  {selectedExam.questions.map((question) => (
                    <TableCell key={question.id}>
                      <Input
                        type="number"
                        min="0"
                        max={question.marksAllocated}
                        value={marks[`${student.id}-${question.id}`] || ""}
                        onChange={(e) => handleMarkChange(student.id, question.id, e.target.value)}
                        className="w-20 text-center"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}