"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Faculty {
  id: number
  name: string
}

interface Subject {
  id: number
  subjectName: string
  facultyId: number | null
}

interface Semester {
  id: number
  name: string
  subjects: Subject[]
}

interface Course {
    id: number
    courseName: string
    createdById: number
    createdAt: string
    updatedAt: string
    semesters: Semester[]
    createdBy: {
      id: number
      name: string
      email: string
      role: string
      // ... other properties
    }
    Enrollment: any[] // Update this type based on your actual enrollment structure
  }

export default function AssignFacultyPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourseDetails()
    fetchFaculties()
  }, [courseId])

  const fetchCourseDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/courses/getCourse/${courseId}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch course details")
        const responseData = await response.json()
      setCourse(responseData.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch course details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFaculties = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/getUserByRole/Faculty", {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch faculties")
      const res = await response.json()
      setFaculties(res.data)
      console.log(res.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch faculties. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(Number(semesterId))
    setSelectedSubjectId(null)
  }

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(Number(subjectId))
  }

  const handleFacultyAssignment = async (facultyId: string) => {
    if (!selectedSemesterId || !selectedSubjectId) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/subjects/${courseId}/assign-faculty`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterId: selectedSemesterId,
          subjectId: selectedSubjectId,
          facultyId: Number(facultyId),
        }),
      })
      if (!response.ok) throw new Error("Failed to assign faculty")
      await fetchCourseDetails() // Refresh course details
      toast({
        title: "Success",
        description: "Faculty assigned successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign faculty. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="text-center">Loading...</div>
  if (!course) return <div className="text-center">Course not found</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Assign Faculty to {course.courseName}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Semester and Subject</CardTitle>
          <CardDescription>Choose the semester and subject to assign a faculty member.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="semester" className="text-right">
                Semester:
              </label>
              <Select onValueChange={handleSemesterChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {course.semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id.toString()}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSemesterId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="subject" className="text-right">
                  Subject:
                </label>
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {course.semesters
                      .find((sem) => sem.id === selectedSemesterId)
                      ?.subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.subjectName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedSubjectId && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Faculty</CardTitle>
            <CardDescription>Select a faculty member to assign to the chosen subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleFacultyAssignment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id.toString()}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

