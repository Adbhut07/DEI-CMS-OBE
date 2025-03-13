"use client"

import { useEffect, useState } from "react"
import { Card, CardContent} from "@/components/ui/card"
import { MarksEntryTable } from "@/components/marks-management/marks-entry-table"
import { ExamSelector } from "@/components/marks-management/exam-selector"
import { SubjectSelector } from "@/components/marks-management/subject-selector"
import { FileText } from "lucide-react"

interface SubjectData {
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

interface DashboardStats {
  totalAssignedSubjects: number
  pendingMarkUploads: number
  upcomingDeadlines: number
}

export default function MarksManagementPage() {
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [examData, setExamData] = useState<any>(null)

  // Reset exam selection when subject changes
  useEffect(() => {
    setSelectedExam(null)
    setExamData(null)
  }, [selectedSubject])

  // Fetch exam data when an exam is selected
  useEffect(() => {
    if (selectedExam) {
      // We already have the exam data from the ExamSelector component
      setExamData(selectedExam)
    }
  }, [selectedExam])

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

            <SubjectSelector onSubjectSelect={setSelectedSubject} selectedSubject={selectedSubject} />

            {selectedSubject && (
              <ExamSelector subjectId={selectedSubject.id} onExamSelect={setSelectedExam} selectedExam={selectedExam} />
            )}
          </CardContent>
        </Card>

        {selectedExam && examData && (
          <Card className="md:col-span-3">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-1">{selectedExam.examType} Marks Entry</h2>
              <p className="text-gray-500 text-sm mb-4">Enter marks for each student and question</p>

              <MarksEntryTable examData={examData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


