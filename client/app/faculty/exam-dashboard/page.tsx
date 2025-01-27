"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"
import { ExamCreationModal } from "./exam-creation-modal"
import { ExamList } from "./exam-list"

interface Subject {
  id: number
  subjectName: string
  semesterId: number
  semester: {
    id: number
    name: string
  }
}

export default function ExamDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchAssignedSubjects()
  }, [])

  const fetchAssignedSubjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8000/api/v1/faculty/get-assigned-subjects", {
        credentials: "include", 
      })
      if (!response.ok) throw new Error("Failed to fetch assigned subjects")
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setSubjects(result.data)
      } else {
        throw new Error("Invalid data format for assigned subjects")
      }
    } catch (err) {
      setError("Failed to load assigned subjects. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Dashboard</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subject Selection</CardTitle>
          <Button onClick={() => setIsModalOpen(true)} disabled={!selectedSubject}>
            <Plus className="mr-2 h-4 w-4" /> Create Exam
          </Button>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedSubject(subjects.find((s) => s.id === Number(value)) || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : selectedSubject ? (
        <ExamList subjectId={selectedSubject.id} />
      ) : (
        <p className="text-center text-gray-500">Please select a subject to view exams.</p>
      )}

      {selectedSubject && (
        <ExamCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} subject={selectedSubject} />
      )}
    </div>
  )
}

