"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ExamSelectorProps {
  subjectId: number
  onExamSelect: (exam: any) => void
  selectedExam: any
}

export function ExamSelector({ subjectId, onExamSelect, selectedExam }: ExamSelectorProps) {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/v1/exams/getExamsBySubject/${subjectId}`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch exams")
        }

        const data = await response.json()
        if (data.success) {
          setExams(data.data || [])
        } else {
          setError(data.message || "Failed to fetch exams")
        }
      } catch (error) {
        setError("Error fetching exams. Please try again.")
        console.error("Error fetching exams:", error)
      } finally {
        setLoading(false)
      }
    }

    if (subjectId) {
      fetchExams()
    }
  }, [subjectId])

  const handleExamChange = (value: string) => {
    const exam = exams.find((e) => e.id.toString() === value)
    if (exam) {
      onExamSelect(exam)
    }
  }

  if (loading) {
    return <div className="my-4">Loading exams...</div>
  }

  if (error) {
    return <div className="my-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Exam</label>
      <Select onValueChange={handleExamChange} value={selectedExam?.id?.toString()}>
        <SelectTrigger className="w-full mb-3 h-9">
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

      <Link href={'/faculty/exam-dashboard'}>
        <Button className="w-full mt-3 h-9 text-sm">Create New Exam</Button>
      </Link>
    </div>
  )
}

