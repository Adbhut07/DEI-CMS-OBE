"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Subject {
  id: number
  subjectName: string
  semesterId: number
  semester: {
    id: number
    name: string
    courseId: number
    course: {
      id: number
      courseName: string
    }
  }
}

interface SubjectSelectionProps {
  onSubjectSelect: (subject: { id: number; courseId: number }) => void
}

export function SubjectSelection({ onSubjectSelect }: SubjectSelectionProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<{ id: number; courseId: number } | null>(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/faculty/get-assigned-subjects", {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch subjects")
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setSubjects(data.data)
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err) {
      setError("Failed to load subjects. Please try again.")
    } finally {
      setLoading(false)
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
    <Card>
      <CardHeader>
        <CardTitle>Select a Subject</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            onValueChange={(value) => {
              const subject = subjects.find((s) => s.id === Number(value))
              if (subject) {
                setSelectedSubject({ id: subject.id, courseId: subject.semester.courseId })
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.subjectName} - {subject.semester.course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => selectedSubject && onSubjectSelect(selectedSubject)} disabled={!selectedSubject}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

