"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import EnrollmentModal from "./enrollment-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Course {
  id: string
  name: string
}

interface Enrollment {
  id: number
  studentId: number
  courseId: number
  semesterId: number
  createdAt: string
  student: {
    id: number
    name: string
    email: string
  }
  course: {
    id: number
    courseName: string
  }
  semester: {
    id: number
    name: string
  }
}

export default function EnrollmentManager({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/enrollments/course/${courseId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setEnrollments(result.data)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      setError("Failed to fetch enrollments. Please try again.")
      setEnrollments([])
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/enrollments/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setEnrollments(enrollments.filter((e) => e.id.toString() !== id))
    } catch (error) {
      setError("Failed to delete enrollment. Please try again.")
    }
  }

  const handleEdit = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingEnrollment(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEnrollment(null)
  }

  const handleModalSubmit = async (data: any) => {
    try {
      const formattedData = {
        studentId: Number(data.studentId),
        courseId: Number(data.courseId),
        semesterId: Number(data.semesterId),
      }
      let response
      if (editingEnrollment) {
        response = await fetch(`http://localhost:8000/api/v1/enrollments/${editingEnrollment.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        })
      } else {
        response = await fetch("http://localhost:8000/api/v1/enrollments/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.data) {
        const updatedEnrollment = result.data
        if (editingEnrollment) {
          setEnrollments(enrollments.map((e) => (e.id === updatedEnrollment.id ? updatedEnrollment : e)))
        } else {
          setEnrollments([...enrollments, updatedEnrollment])
        }
        handleModalClose()
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      console.error("Error in handleModalSubmit:", error)
      setError(
        `Failed to ${editingEnrollment ? "update" : "create"} enrollment. ${error instanceof Error ? error.message : "Please try again."}`,
      )
    }
  }

  if (courses.length === 0) {
    return (
      <Alert>
        <AlertDescription>No courses available. Please add courses before managing enrollments.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Select onValueChange={handleCourseChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCreate}>
          <UserPlus className="mr-2 h-4 w-4" />
          New Enrollment
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedCourse && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No enrollments found for this course.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.student.name}</TableCell>
                  <TableCell>{enrollment.semester.name}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(enrollment)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(enrollment.id.toString())}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        enrollment={editingEnrollment}
        courses={courses}
      />
    </div>
  )
}

