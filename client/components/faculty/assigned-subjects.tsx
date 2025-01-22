"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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

export function AssignedSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
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
    return <div>Loading assigned subjects...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <p>No subjects assigned yet.</p>
        ) : (
          <div className="divide-y">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium">{subject.subjectName}</h3>
                  <p className="text-sm text-gray-500">
                    {subject.semester.course.courseName} - {subject.semester.name}
                  </p>
                </div>
                <Link href={`/faculty/upload-marks/${subject.id}`} passHref>
                  <Button variant="outline">Upload Marks</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

