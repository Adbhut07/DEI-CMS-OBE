"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Subject {
  id: number
  subjectName: string
  semester: {
    id: number
    name: string
    course: {
      id: number
      courseName: string
    }
  }
}

export default function UploadMarksPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/faculty/get-assigned-subjects", {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch assigned subjects")
        }
        const data = await response.json()
        if (data.success) {
          setSubjects(data.data)
        } else {
          throw new Error("Unexpected response format")
        }
      } catch (error) {
        console.error("Error fetching assigned subjects:", error)
        toast({
          title: "Error",
          description: "Failed to fetch assigned subjects. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignedSubjects()
  }, [toast])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Marks</h1>
      <Card>
        <CardHeader>
          <CardTitle>Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={setSelectedSubject} value={selectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.subjectName} - {subject.semester.course.courseName} ({subject.semester.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!selectedSubject}>Proceed to Upload</Button>
          </div>
        </CardContent>
      </Card>
      {selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle>
              Upload Marks for {subjects.find((s) => s.id.toString() === selectedSubject)?.subjectName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Mark upload functionality will be implemented here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

