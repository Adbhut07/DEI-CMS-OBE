'use client'

import { useState } from 'react'
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
import { PlusCircle, Search } from 'lucide-react'
import { Course } from './types'
import AddEditCourseModal from './add-edit-course-modal'
import CourseDetailsDrawer from './course-details-drawer'

// Sample data
const sampleCourses: Course[] = [
  { id: '1', name: 'Introduction to Computer Science', code: 'CS101', faculty: 'Dr. John Doe', totalStudents: 50 },
  { id: '2', name: 'Data Structures and Algorithms', code: 'CS201', faculty: 'Prof. Jane Smith', totalStudents: 40 },
  { id: '3', name: 'Database Management Systems', code: 'CS301', faculty: 'Dr. Bob Johnson', totalStudents: 35 },
]

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(sampleCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, { ...newCourse, id: (courses.length + 1).toString() }])
  }

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(courses.map(course => course.id === updatedCourse.id ? updatedCourse : course))
  }

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id))
    }
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
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Assigned Faculty</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.faculty}</TableCell>
                <TableCell>{course.totalStudents}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course)
                        setIsDrawerOpen(true)
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course)
                        setIsEditModalOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCourse}
      />

      <AddEditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditCourse}
        course={selectedCourse}
      />

      <CourseDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        course={selectedCourse}
      />
    </div>
  )
}

