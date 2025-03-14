// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { FileText } from "lucide-react"
// import { SubjectSelector } from "@/components/marks-management/subject-selector"
// import { ExamSelector } from "@/components/marks-management/exam-selector"
// import { MarksEntryTable } from "@/components/marks-management/marks-entry-table"

// export default function MarksManagementPage() {
//   const [selectedSubject, setSelectedSubject] = useState<any>(null)
//   const [selectedExam, setSelectedExam] = useState<any>(null)

//   // Debug logging to check the data flow
//   useEffect(() => {
//     console.log("Selected Subject:", selectedSubject)
//   }, [selectedSubject])

//   useEffect(() => {
//     console.log("Selected Exam:", selectedExam)
//   }, [selectedExam])

//   // Handle subject selection
//   const handleSubjectSelect = (subject: any) => {
//     console.log("Subject selected:", subject)
//     setSelectedSubject(subject)
//     setSelectedExam(null) // Reset exam when subject changes
//   }

//   // Handle exam selection
//   const handleExamSelect = (exam: any) => {
//     console.log("Exam selected:", exam)
//     setSelectedExam(exam)
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <FileText className="h-8 w-8 text-primary" />
//           <h1 className="text-2xl font-bold">Student Marks Management</h1>
//         </div>
//         <div className="flex gap-4">
//           <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
//             <span>Import Students</span>
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
//             <span>Export Marks</span>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="md:col-span-1">
//           <CardContent className="p-4">
//             <h2 className="text-xl font-bold mb-1">Exam Selection</h2>
//             <p className="text-gray-500 text-sm mb-4">Choose an exam to input marks for</p>

//             <SubjectSelector onSubjectSelect={handleSubjectSelect} selectedSubject={selectedSubject} />

//             {selectedSubject && (
//               <ExamSelector
//                 subjectId={selectedSubject.id}
//                 onExamSelect={handleExamSelect}
//                 selectedExam={selectedExam}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {selectedExam && selectedSubject && (
//           <Card className="md:col-span-3">
//             <CardContent className="p-4">
//               <h2 className="text-xl font-bold mb-1">{selectedExam.examType} Marks Entry</h2>
//               <p className="text-gray-500 text-sm mb-4">Enter marks for each student and question</p>

//               <MarksEntryTable
//                 key={`${selectedSubject.id}-${selectedExam.id}`}
//                 examData={selectedExam}
//                 selectedSubject={selectedSubject}
//               />
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { SubjectSelector } from "@/components/marks-management/subject-selector"
import { ExamSelector } from "@/components/marks-management/exam-selector"
import { MarksEntryTable } from "@/components/marks-management/marks-entry-table"
import { Exam, SelectedSubject } from "./types"

export default function MarksManagementPage() {
  const [selectedSubject, setSelectedSubject] = useState<SelectedSubject | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  // Debug logging to check the data flow
  useEffect(() => {
    console.log("Selected Subject:", selectedSubject)
  }, [selectedSubject])

  useEffect(() => {
    console.log("Selected Exam:", selectedExam)
  }, [selectedExam])

  // Handle subject selection
  const handleSubjectSelect = (subject: SelectedSubject) => {
    console.log("Subject selected:", subject)
    setSelectedSubject(subject)
    setSelectedExam(null) // Reset exam when subject changes
  }

  // Handle exam selection
  const handleExamSelect = (exam: Exam) => {
    console.log("Exam selected:", exam)
    setSelectedExam(exam)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Student Marks Management</h1>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            <span>Import Students</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            <span>Export Marks</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-1">Exam Selection</h2>
            <p className="text-gray-500 text-sm mb-4">Choose an exam to input marks for</p>

            <SubjectSelector onSubjectSelect={handleSubjectSelect} selectedSubject={selectedSubject} />

            {selectedSubject && (
              <ExamSelector
                subjectId={selectedSubject.id}
                onExamSelect={handleExamSelect}
                selectedExam={selectedExam}
              />
            )}
          </CardContent>
        </Card>

        {selectedExam && selectedSubject && (
          <Card className="md:col-span-3">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-1">{selectedExam.examType} Marks Entry</h2>
              <p className="text-gray-500 text-sm mb-4">Enter marks for each student and question</p>

              <MarksEntryTable
                key={`${selectedSubject.id}-${selectedExam.id}`}
                examData={selectedExam}
                selectedSubject={selectedSubject}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}