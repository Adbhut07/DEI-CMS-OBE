'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2, Users } from 'lucide-react'
import AddEditCourseModal from './add-edit-course-modal'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Subject {
  id: number;
  subjectName: string;
  subjectCode: string;
}

interface CourseSubject {
  id: number;
  courseId: number;
  subjectId: number;
  semester: number;
  facultyId: number | null;
  batchId: number;
  subject: Subject;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Course {
  id: number;
  courseName: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  subjects: CourseSubject[];
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [newCourseName, setNewCourseName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  // New state for batch modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [batchYear, setBatchYear] = useState<number>(new Date().getFullYear() + 1)
  const [selectedCourseForBatch, setSelectedCourseForBatch] = useState<Course | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/courses/getAllCourses', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch courses')
      const result = await response.json()
      if (result.success) {
        setCourses(result.data)
      } else {
        throw new Error('Unexpected response format')
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

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      toast({
        title: "Error",
        description: "Course name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/courses/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseName: newCourseName }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create course')
      }
      await fetchCourses()
      setIsAddModalOpen(false)
      setNewCourseName('')
      toast({
        title: "Success",
        description: "Course created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setNewCourseName(course.courseName)
    setIsAddModalOpen(true)
  }

  const handleUpdateCourse = async () => {
    if (!selectedCourse || !newCourseName.trim()) {
      toast({
        title: "Error",
        description: "Course name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/courses/update/${selectedCourse.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseName: newCourseName }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update course')
      }
      
      await fetchCourses()
      setIsAddModalOpen(false)
      setSelectedCourse(null)
      setNewCourseName('')
      
      toast({
        title: "Success",
        description: "Course updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCourse = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/api/v1/courses/delete/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to delete course')
        }
        await fetchCourses()
        toast({
          title: "Success",
          description: "Course deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete course. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // New function to open the batch modal
  const handleAddBatch = (course: Course) => {
    setSelectedCourseForBatch(course)
    setBatchYear(new Date().getFullYear() + 1) // Default to next year
    setIsBatchModalOpen(true)
  }

  // New function to create a batch
  const handleCreateBatch = async () => {
    if (!selectedCourseForBatch) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/batch/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchYear: batchYear,
          courseId: selectedCourseForBatch.id
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create batch')
      }
      
      setIsBatchModalOpen(false)
      setSelectedCourseForBatch(null)
      
      toast({
        title: "Success",
        description: `Batch ${batchYear} created successfully for ${selectedCourseForBatch.courseName}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create batch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getUniqueSemesters = (course: Course) => {
    const semesters = new Set(course.subjects.map(subject => subject.semester));
    return Array.from(semesters).sort((a, b) => a - b);
  }

  // Count subjects per semester
  const countSubjectsBySemester = (course: Course, semester: number) => {
    return course.subjects.filter(subject => subject.semester === semester).length;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Course Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          setSelectedCourse(null)
          setNewCourseName('')
          setIsAddModalOpen(true)
        }} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      {isLoading && !courses.length ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Total Subjects</TableHead>
                <TableHead>Semesters</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No courses found</TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => {
                  const uniqueSemesters = getUniqueSemesters(course);
                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.courseName}</TableCell>
                      <TableCell>{course.createdBy?.name || 'Unknown'}</TableCell>
                      <TableCell>{course.subjects.length}</TableCell>
                      <TableCell>
                        {uniqueSemesters.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {uniqueSemesters.map(semester => (
                              <span key={semester} className="text-sm">
                                Semester {semester}: {countSubjectsBySemester(course, semester)} subjects
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No semesters</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Link href={`/admin/course/${course.id}/subjects`} passHref>
                            <Button variant="outline" size="sm">
                              Manage Subjects
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => handleAddBatch(course)}>
                            <Users className="h-4 w-4 mr-1" /> Add Batch
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Course Name</label>
              <Input
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Enter course name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsAddModalOpen(false)
                setSelectedCourse(null)
                setNewCourseName('')
              }}>
                Cancel
              </Button>
              <Button onClick={selectedCourse ? handleUpdateCourse : handleAddCourse} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Add New Batch for {selectedCourseForBatch?.courseName}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Batch Year</label>
              <Input
                type="number"
                value={batchYear}
                onChange={(e) => setBatchYear(parseInt(e.target.value))}
                placeholder="Enter batch year"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsBatchModalOpen(false)
                setSelectedCourseForBatch(null)
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateBatch} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Batch'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}