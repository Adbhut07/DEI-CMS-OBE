"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  semesters: Semester[]
}

export default function ViewAssignedFacultyPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
    fetchFaculties()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/v1/courses/getAllCourses", {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch courses")
      const result = await response.json()
      if (result.success) {
        setCourses(result.data)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourseDetails = async (courseId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/courses/getCourse/${courseId}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch course details")
      const responseData = await response.json()
      setSelectedCourse(responseData.data)
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch faculties. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCourseChange = (courseId: string) => {
    fetchCourseDetails(Number(courseId))
  }

  const handleFacultyAssignment = async (semesterId: number, subjectId: number, facultyId: string) => {
    if (!selectedCourse) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/subjects/${selectedCourse.id}/assign-faculty`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterId,
          subjectId,
          facultyId: Number(facultyId),
        }),
      })
      if (!response.ok) throw new Error("Failed to assign faculty")
      await fetchCourseDetails(selectedCourse.id) // Refresh course details
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">View and Edit Assigned Faculty</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleCourseChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCourse && (
        <>
          <h2 className="text-2xl font-bold mb-4">Assigned Faculties for {selectedCourse.courseName}</h2>
          {selectedCourse.semesters.map((semester) => (
            <Card key={semester.id} className="mb-6">
              <CardHeader>
                <CardTitle>{semester.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assigned Faculty</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semester.subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.subjectName}</TableCell>
                        <TableCell>
                          {faculties.find((f) => f.id === subject.facultyId)?.name || "Not Assigned"}
                        </TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(value) => handleFacultyAssignment(semester.id, subject.id, value)}
                            defaultValue={subject.facultyId?.toString() || ""}
                          >
                            <SelectTrigger className="w-[200px]">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

