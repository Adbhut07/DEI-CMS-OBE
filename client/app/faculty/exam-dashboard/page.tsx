"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"
import { ExamCreationModal } from "./exam-creation-modal"
import { ExamList } from "./exam-list"

interface AssignedSubject {
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

export default function ExamDashboard() {
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<AssignedSubject | null>(null)
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
      const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/faculty/get-assigned-subjects", {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch assigned subjects")
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setAssignedSubjects(result.data)
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
          <div className="space-y-4">
            <Select 
              onValueChange={(value) => {
                const selected = assignedSubjects.find((s) => s.id === Number(value)) || null;
                setSelectedSubject(selected);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {assignedSubjects.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.subject.name} ({item.subject.code}) - {item.course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedSubject && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="text-sm">
                  <span className="font-medium">Course:</span> {selectedSubject.course.name}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Batch:</span> {selectedSubject.batch.year}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Semester:</span> {selectedSubject.semester}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : selectedSubject ? (
        <ExamList subjectId={selectedSubject.subject.id} />
      ) : (
        <p className="text-center text-gray-500">Please select a subject to view exams.</p>
      )}

      {selectedSubject && (
        <ExamCreationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          subject={{
            id: selectedSubject.subject.id,
            name: selectedSubject.subject.name,
            code: selectedSubject.subject.code,
            semester: selectedSubject.semester,
            courseId: selectedSubject.course.id,
            courseName: selectedSubject.course.name,
            batchId: selectedSubject.batch.id,
            batchYear: selectedSubject.batch.year
          }} 
        />
      )}
    </div>
  )
}