// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Save } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// interface MarksEntryTableProps {
//   examData: any
//   selectedSubject: any
// }

// export function MarksEntryTable({ examData, selectedSubject }: MarksEntryTableProps) {
//   const [students, setStudents] = useState<any[]>([])
//   const [marksData, setMarksData] = useState<Record<string, Record<string, number>>>({})
//   const [loading, setLoading] = useState(true)
//   const [savingMarks, setSavingMarks] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Create a memoized fetch function to avoid recreation on each render
//   const fetchData = useCallback(async () => {
//     console.log("fetchData called with:", { examData, selectedSubject })

//     try {
//       setLoading(true)
//       setError(null)

//       // Check if selectedSubject and batchId exist
//       if (!selectedSubject || !selectedSubject.batchId) {
//         console.error("Missing selectedSubject or batchId:", selectedSubject)
//         throw new Error("Missing batch information. Please select a subject again.")
//       }

//       // Check if examData exists
//       if (!examData || !examData.id) {
//         console.error("Missing examData or examId:", examData)
//         throw new Error("Missing exam information. Please select an exam again.")
//       }

//       console.log("Fetching students for batch:", selectedSubject.batchId)

//       // Fetch all students for the batch
//       const studentsResponse = await fetch(
//         `http://outcomemagic-backend.asdevx.com/api/v1/enrollments/course/batch/${selectedSubject.batchId}`,
//         { credentials: "include" },
//       )

//       if (!studentsResponse.ok) {
//         throw new Error(`Failed to fetch students: ${studentsResponse.status} ${studentsResponse.statusText}`)
//       }

//       const studentsData = await studentsResponse.json()
//       console.log("Students data:", studentsData)

//       if (!studentsData.success) {
//         throw new Error(studentsData.message || "Failed to fetch students")
//       }

//       // Store all enrolled students
//       const allStudents = studentsData.students || []
//       setStudents(allStudents)

//       // Initialize empty marks data for all students
//       const initialMarksData: Record<string, Record<string, number>> = {}
//       allStudents.forEach((student: any) => {
//         initialMarksData[student.id] = {}
//         examData.questions.forEach((question: any) => {
//           initialMarksData[student.id][question.id] = 0
//         })
//       })

//       // Try to fetch existing marks
//       console.log("Fetching marks for exam:", examData.id)
//       try {
//         const marksResponse = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/marks/${examData.id}`, {
//           credentials: "include",
//         })

//         console.log("Marks response status:", marksResponse.status)

//         if (marksResponse.ok) {
//           const marksData = await marksResponse.json()
//           console.log("Marks data:", marksData)

//           if (marksData.success) {
//             // Update marks data with existing marks
//             marksData.data.students.forEach((student: any) => {
//               if (initialMarksData[student.id]) {
//                 // Merge existing marks with initialized marks
//                 Object.entries(student.marks || {}).forEach(([questionId, mark]) => {
//                   initialMarksData[student.id][questionId] = mark as number
//                 })
//               }
//             })
//           }
//         } else {
//           console.log("No existing marks found or API returned non-200 status")
//         }
//       } catch (marksError) {
//         console.error("Error fetching marks (continuing with empty marks):", marksError)
//         // Continue with empty marks if there's an error fetching marks
//       }

//       // Set the final marks data
//       setMarksData(initialMarksData)
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       setError(`Failed to load students data: ${error instanceof Error ? error.message : "Unknown error"}`)
//     } finally {
//       setLoading(false)
//     }
//   }, [examData, selectedSubject])

//   // Fetch students and existing marks when component mounts or dependencies change
//   useEffect(() => {
//     console.log("MarksEntryTable useEffect triggered with:", { examData, selectedSubject })

//     if (examData && selectedSubject) {
//       fetchData()
//     }
//   }, [fetchData, examData, selectedSubject])

//   const handleMarksChange = (studentId: number, questionId: number, value: string) => {
//     const question = examData.questions.find((q: any) => q.id === questionId)
//     const maxMarks = question ? question.marksAllocated : 5
//     const numValue = value === "" ? 0 : Math.min(Math.max(0, Number.parseInt(value) || 0), maxMarks)

//     setMarksData((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [questionId]: numValue,
//       },
//     }))
//   }

//   const calculateTotal = (studentId: number) => {
//     if (!marksData[studentId]) return 0
//     return Object.entries(marksData[studentId]).reduce((sum, [questionId, mark]) => {
//       return sum + mark
//     }, 0)
//   }

//   const getTotalMaxMarks = () => {
//     return examData.questions.reduce((sum: number, q: any) => sum + q.marksAllocated, 0)
//   }

//   const handleSaveMarks = async () => {
//     setSavingMarks(true)
//     try {
//       // Format the data according to the required API structure
//       const formattedData = {
//         examId: examData.id,
//         marks: students.map((student) => {
//           const studentMarks = marksData[student.id] || {}

//           return {
//             studentId: student.id,
//             marks: Object.entries(studentMarks).map(([questionId, marksObtained]) => ({
//               questionId: Number.parseInt(questionId),
//               marksObtained,
//             })),
//           }
//         }),
//       }

//       console.log("Saving marks with data:", formattedData)

//       // Make the API call to save marks
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/marks/upload", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(formattedData),
//       })

//       const data = await response.json()

//       if (data.success) {
//         toast({
//           title: "Success",
//           description: "Marks saved successfully!",
//           variant: "default",
//         })
//       } else {
//         throw new Error(data.message || "Failed to save marks")
//       }
//     } catch (error) {
//       console.error("Error saving marks:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save marks. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSavingMarks(false)
//     }
//   }

//   if (loading) {
//     return <div className="py-8 text-center">Loading students and marks data...</div>
//   }

//   if (error) {
//     return <div className="py-8 text-center text-red-500">{error}</div>
//   }

//   if (students.length === 0) {
//     return <div className="py-8 text-center">No students found for this batch.</div>
//   }

//   return (
//     <div>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="border px-4 py-2 text-left">Roll No.</th>
//               <th className="border px-4 py-2 text-left">Student Name</th>
//               <th className="border px-4 py-2 text-center" colSpan={examData.questions.length}>
//                 {examData.examType}
//               </th>
//               <th className="border px-4 py-2 text-center">Total</th>
//             </tr>
//             <tr className="bg-gray-50">
//               <th className="border px-4 py-2"></th>
//               <th className="border px-4 py-2"></th>
//               {examData.questions.map((question: any, index: number) => (
//                 <th key={question.id} className="border px-4 py-2 text-center">
//                   Q{index + 1}
//                   <div className="text-xs text-gray-500">(Max: {question.marksAllocated})</div>
//                 </th>
//               ))}
//               <th className="border px-4 py-2 text-center">
//                 Score
//                 <div className="text-xs text-gray-500">(Max: {getTotalMaxMarks()})</div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student) => (
//               <tr key={student.id}>
//                 <td className="border px-4 py-2">{student.rollNo}</td>
//                 <td className="border px-4 py-2">{student.name}</td>
//                 {examData.questions.map((question: any) => (
//                   <td key={question.id} className="border px-4 py-2 text-center">
//                     <Input
//                       type="number"
//                       min="0"
//                       max={question.marksAllocated}
//                       value={marksData[student.id]?.[question.id] || ""}
//                       onChange={(e) => handleMarksChange(student.id, question.id, e.target.value)}
//                       className="w-16 h-8 text-center mx-auto"
//                     />
//                   </td>
//                 ))}
//                 <td className="border px-4 py-2 text-center font-medium text-red-500">
//                   {calculateTotal(student.id)} / {getTotalMaxMarks()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end mt-6">
//         <Button onClick={handleSaveMarks} disabled={savingMarks} className="bg-gray-900 hover:bg-gray-800">
//           <Save className="mr-2 h-4 w-4" />
//           {savingMarks ? "Saving..." : "Save Marks"}
//         </Button>
//       </div>
//     </div>
//   )
// }




"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Exam, SelectedSubject, Student, MarksUploadRequest } from "../../app/faculty/upload-marks/types"  // Import the types

interface MarksEntryTableProps {
  examData: Exam
  selectedSubject: SelectedSubject
}

export function MarksEntryTable({ examData, selectedSubject }: MarksEntryTableProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [marksData, setMarksData] = useState<Record<string, Record<string, number>>>({})
  const [loading, setLoading] = useState(true)
  const [savingMarks, setSavingMarks] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create a memoized fetch function to avoid recreation on each render
  const fetchData = useCallback(async () => {
    //console.log("fetchData called with:", { examData, selectedSubject })

    try {
      setLoading(true)
      setError(null)

      // Check if selectedSubject and batchId exist
      if (!selectedSubject || !selectedSubject.batchId) {
        console.error("Missing selectedSubject or batchId:", selectedSubject)
        throw new Error("Missing batch information. Please select a subject again.")
      }

      // Check if examData exists
      if (!examData || !examData.id) {
        console.error("Missing examData or examId:", examData)
        throw new Error("Missing exam information. Please select an exam again.")
      }

      //console.log("Fetching students for batch:", selectedSubject.batchId)

      // Fetch all students for the batch
      const studentsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/enrollments/course/batch/${selectedSubject.batchId}`,
        { credentials: "include" },
      )

      if (!studentsResponse.ok) {
        throw new Error(`Failed to fetch students: ${studentsResponse.status} ${studentsResponse.statusText}`)
      }

      const studentsData = await studentsResponse.json()
      //console.log("Students data:", studentsData)

      if (!studentsData.success) {
        throw new Error(studentsData.message || "Failed to fetch students")
      }

      // Store all enrolled students
      const allStudents = studentsData.students || []
      setStudents(allStudents)

      // Initialize empty marks data for all students
      const initialMarksData: Record<string, Record<string, number>> = {}
      allStudents.forEach((student: Student) => {
        initialMarksData[student.id] = {}
        examData.questions.forEach((question) => {
          initialMarksData[student.id][question.id] = 0
        })
      })

      // Try to fetch existing marks
      //console.log("Fetching marks for exam:", examData.id)
      try {
        const marksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/marks/${examData.id}`, {
          credentials: "include",
        })

//console.log("Marks response status:", marksResponse.status)

        if (marksResponse.ok) {
          const marksData = await marksResponse.json()
          //console.log("Marks data:", marksData)

          if (marksData.success) {
            // Update marks data with existing marks
            marksData.data.students.forEach((student: Student) => {
              if (initialMarksData[student.id]) {
                // Merge existing marks with initialized marks
                Object.entries(student.marks || {}).forEach(([questionId, mark]) => {
                  initialMarksData[student.id][questionId] = mark as number
                })
              }
            })
          }
        } else {
         // console.log("No existing marks found or API returned non-200 status")
        }
      } catch (marksError) {
        console.error("Error fetching marks (continuing with empty marks):", marksError)
        // Continue with empty marks if there's an error fetching marks
      }

      // Set the final marks data
      setMarksData(initialMarksData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(`Failed to load students data: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }, [examData, selectedSubject])

  // Fetch students and existing marks when component mounts or dependencies change
  useEffect(() => {
    //console.log("MarksEntryTable useEffect triggered with:", { examData, selectedSubject })

    if (examData && selectedSubject) {
      fetchData()
    }
  }, [fetchData, examData, selectedSubject])

  const handleMarksChange = (studentId: number, questionId: number, value: string) => {
    const question = examData.questions.find((q) => q.id === questionId)
    const maxMarks = question ? question.marksAllocated : 5
    const numValue = value === "" ? 0 : Math.min(Math.max(0, Number.parseInt(value) || 0), maxMarks)

    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [questionId]: numValue,
      },
    }))
  }

  const calculateTotal = (studentId: number) => {
    if (!marksData[studentId]) return 0
    return Object.entries(marksData[studentId]).reduce((sum, [, mark]) => {
      return sum + mark
    }, 0)
  }

  const getTotalMaxMarks = () => {
    return examData.questions.reduce((sum, q) => sum + q.marksAllocated, 0)
  }

  const handleSaveMarks = async () => {
    setSavingMarks(true)
    try {
      // Format the data according to the required API structure
      const formattedData: MarksUploadRequest = {
        examId: examData.id,
        marks: students.map((student) => {
          const studentMarks = marksData[student.id] || {}

          return {
            studentId: student.id,
            marks: Object.entries(studentMarks).map(([questionId, marksObtained]) => ({
              questionId: Number.parseInt(questionId),
              marksObtained,
            })),
          }
        }),
      }

      //console.log("Saving marks with data:", formattedData)

      // Make the API call to save marks
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/v1/marks/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Marks saved successfully!",
          variant: "default",
        })
      } else {
        throw new Error(data.message || "Failed to save marks")
      }
    } catch (error) {
      console.error("Error saving marks:", error)
      toast({
        title: "Error",
        description: "Failed to save marks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingMarks(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center">Loading students and marks data...</div>
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (students.length === 0) {
    return <div className="py-8 text-center">No students found for this batch.</div>
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-2 text-left">Roll No.</th>
              <th className="border px-4 py-2 text-left">Student Name</th>
              <th className="border px-4 py-2 text-center" colSpan={examData.questions.length}>
                {examData.examType}
              </th>
              <th className="border px-4 py-2 text-center">Total</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border px-4 py-2"></th>
              <th className="border px-4 py-2"></th>
              {examData.questions.map((question, index) => (
                <th key={question.id} className="border px-4 py-2 text-center">
                  Q{index + 1}
                  <div className="text-xs text-gray-500">(Max: {question.marksAllocated})</div>
                </th>
              ))}
              <th className="border px-4 py-2 text-center">
                Score
                <div className="text-xs text-gray-500">(Max: {getTotalMaxMarks()})</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.rollNo}</td>
                <td className="border px-4 py-2">{student.name}</td>
                {examData.questions.map((question) => (
                  <td key={question.id} className="border px-4 py-2 text-center">
                    <Input
                      type="number"
                      min="0"
                      max={question.marksAllocated}
                      value={marksData[student.id]?.[question.id] || ""}
                      onChange={(e) => handleMarksChange(student.id, question.id, e.target.value)}
                      className="w-16 h-8 text-center mx-auto"
                    />
                  </td>
                ))}
                <td className="border px-4 py-2 text-center font-medium text-red-500">
                  {calculateTotal(student.id)} / {getTotalMaxMarks()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveMarks} disabled={savingMarks} className="bg-gray-900 hover:bg-gray-800">
          <Save className="mr-2 h-4 w-4" />
          {savingMarks ? "Saving..." : "Save Marks"}
        </Button>
      </div>
    </div>
  )
}