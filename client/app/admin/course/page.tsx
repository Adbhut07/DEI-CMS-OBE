// // 'use client'

// // import { useState } from 'react'
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table"
// // import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'
// // import AddEditCourseModal from './add-edit-course-modal'
// // import Link from 'next/link'

// // // Sample data structure
// // interface Course {
// //   id: string
// //   name: string
// //   semesters: { id: string; name: string }[]
// // }

// // const sampleCourses: Course[] = [
// //   { 
// //     id: '1', 
// //     name: 'Introduction to Computer Science',
// //     semesters: [
// //       { id: '1', name: 'Semester 1' },
// //       { id: '2', name: 'Semester 2' }
// //     ]
// //   },
// //   { 
// //     id: '2', 
// //     name: 'Data Structures and Algorithms',
// //     semesters: [
// //       { id: '3', name: 'Semester 1' },
// //       { id: '4', name: 'Semester 2' }
// //     ]
// //   },
// // ]

// // export default function CourseManagement() {
// //   const [courses, setCourses] = useState<Course[]>(sampleCourses)
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
// //   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

// //   const filteredCourses = courses.filter(course =>
// //     course.name.toLowerCase().includes(searchTerm.toLowerCase())
// //   )

// //   const handleAddCourse = (newCourse: any) => {
// //     // Here you would typically make an API call to save the course
// //     console.log('New course data:', newCourse)
// //     // For demonstration, we'll just add it to the local state
// //     setCourses([...courses, { ...newCourse, id: (courses.length + 1).toString() }])
// //   }

// //   const handleEditCourse = (course: Course) => {
// //     setSelectedCourse(course)
// //     setIsAddModalOpen(true)
// //   }

// //   const handleDeleteCourse = (id: string) => {
// //     if (window.confirm('Are you sure you want to delete this course?')) {
// //       setCourses(courses.filter(course => course.id !== id))
// //     }
// //   }

// //   return (
// //     <div className="container mx-auto p-4">
// //       <h1 className="text-3xl font-bold mb-6">Course Management</h1>
      
// //       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
// //         <div className="relative w-full sm:w-64">
// //           <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //           <Input
// //             type="text"
// //             placeholder="Search courses..."
// //             className="pl-8"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>
// //         <Button onClick={() => setIsAddModalOpen(true)}>
// //           <PlusCircle className="mr-2 h-4 w-4" /> Add Course
// //         </Button>
// //       </div>

// //       <div className="overflow-x-auto">
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>Course Name</TableHead>
// //               <TableHead>Semesters</TableHead>
// //               <TableHead>Actions</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {filteredCourses.map((course) => (
// //               <TableRow key={course.id}>
// //                 <TableCell>{course.name}</TableCell>
// //                 <TableCell>{course.semesters.length}</TableCell>
// //                 <TableCell>
// //                   <div className="flex space-x-2">
// //                     <Button
// //                       variant="outline"
// //                       size="sm"
// //                       onClick={() => handleEditCourse(course)}
// //                     >
// //                       <Edit className="h-4 w-4 mr-1" /> Edit
// //                     </Button>
// //                     <Link href={`/course-management/${course.id}/subjects`} passHref>
// //                       <Button variant="outline" size="sm">
// //                         Edit Subjects
// //                       </Button>
// //                     </Link>
// //                     <Link href={`/course-management/${course.id}/semesters`} passHref>
// //                       <Button variant="outline" size="sm">
// //                         Edit Semesters
// //                       </Button>
// //                     </Link>
// //                     <Button
// //                       variant="destructive"
// //                       size="sm"
// //                       onClick={() => handleDeleteCourse(course.id)}
// //                     >
// //                       <Trash2 className="h-4 w-4 mr-1" /> Delete
// //                     </Button>
// //                   </div>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </div>

// //       <AddEditCourseModal
// //         isOpen={isAddModalOpen}
// //         onClose={() => {
// //           setIsAddModalOpen(false)
// //           setSelectedCourse(null)
// //         }}
// //         onSave={handleAddCourse}
// //         course={selectedCourse}
// //       />
// //     </div>
// //   )
// // }

// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'
// import AddEditCourseModal from './add-edit-course-modal'
// import Link from 'next/link'
// import { useToast } from "@/components/ui/use-toast"

// interface Course {
//   id: string
//   name: string
//   semesters: { id: string; name: string }[]
// }

// export default function CourseManagement() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchCourses()
//   }, [])

//   const fetchCourses = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/courses')
//       if (!response.ok) throw new Error('Failed to fetch courses')
//       const data = await response.json()
//       setCourses(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch courses. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredCourses = courses.filter(course =>
//     course.name.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleAddCourse = async (newCourse: any) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/courses/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newCourse),
//       })
//       if (!response.ok) throw new Error('Failed to create course')
//       await fetchCourses()
//       setIsAddModalOpen(false)
//       toast({
//         title: "Success",
//         description: "Course created successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create course. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleEditCourse = (course: Course) => {
//     setSelectedCourse(course)
//     setIsAddModalOpen(true)
//   }

//   const handleUpdateCourse = async (updatedCourse: any) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch(`http://localhost:3000/api/v1/courses/${updatedCourse.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedCourse),
//       })
//       if (!response.ok) throw new Error('Failed to update course')
//       await fetchCourses()
//       setIsAddModalOpen(false)
//       toast({
//         title: "Success",
//         description: "Course updated successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update course. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteCourse = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this course?')) {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`http://localhost:3000/api/v1/courses/${id}`, {
//           method: 'DELETE',
//         })
//         if (!response.ok) throw new Error('Failed to delete course')
//         await fetchCourses()
//         toast({
//           title: "Success",
//           description: "Course deleted successfully.",
//         })
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to delete course. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Course Management</h1>
      
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search courses..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <Button onClick={() => setIsAddModalOpen(true)} disabled={isLoading}>
//           <PlusCircle className="mr-2 h-4 w-4" /> Add Course
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Course Name</TableHead>
//                 <TableHead>Semesters</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredCourses.map((course) => (
//                 <TableRow key={course.id}>
//                   <TableCell>{course.name}</TableCell>
//                   <TableCell>{course.semesters.length}</TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEditCourse(course)}
//                       >
//                         <Edit className="h-4 w-4 mr-1" /> Edit
//                       </Button>
//                       <Link href={`/course-management/${course.id}/subjects`} passHref>
//                         <Button variant="outline" size="sm">
//                           Edit Subjects
//                         </Button>
//                       </Link>
//                       <Link href={`/course-management/${course.id}/semesters`} passHref>
//                         <Button variant="outline" size="sm">
//                           Edit Semesters
//                         </Button>
//                       </Link>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleDeleteCourse(course.id)}
//                       >
//                         <Trash2 className="h-4 w-4 mr-1" /> Delete
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       <AddEditCourseModal
//         isOpen={isAddModalOpen}
//         onClose={() => {
//           setIsAddModalOpen(false)
//           setSelectedCourse(null)
//         }}
//         onSave={selectedCourse ? handleUpdateCourse : handleAddCourse}
//         course={selectedCourse}
//       />
//     </div>
//   )
// }

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
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'
import AddEditCourseModal from './add-edit-course-modal'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Unit {
    id?: number;
    unitNumber: number;
    description: string;
  }
  
  interface Subject {
    id?: number;
    subjectName: string;
    units?: Unit[];
  }
  
  interface Semester {
    id?: number;
    name: string;
    subjects?: Subject[];
  }
  
  interface Course {
    id: number;
    courseName: string;
    semesters: Semester[];
    createdById?: number;
  }

export default function CourseManagement() {
    const [courses, setCourses] = useState<Course[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
  

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

const handleAddCourse = async (newCourse: any) => {
    setIsLoading(true)
    try {
        // Verify and convert unitNumber to number if it's a string
        const verifiedCourse = {
            ...newCourse,
            semesters: newCourse.semesters.map((semester: Semester) => ({
                ...semester,
                subjects: semester.subjects?.map((subject: Subject) => ({
                    ...subject,
                    units: subject.units?.map((unit: Unit) => ({
                        ...unit,
                        unitNumber: typeof unit.unitNumber === 'string' 
                            ? parseInt(unit.unitNumber) 
                            : unit.unitNumber,
                    })),
                })),
            })),
        }

        console.log("creating course ....", verifiedCourse);
        const response = await fetch('http://localhost:8000/api/v1/courses/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifiedCourse),
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to create course')
        }
        await fetchCourses()
        setIsAddModalOpen(false)
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
    // Clone the course to avoid direct state modification
    setSelectedCourse({
      ...course,
      semesters: course.semesters.map(semester => ({
        ...semester,
        subjects: semester.subjects?.map(subject => ({
          ...subject,
          units: subject.units?.map(unit => ({
            ...unit
          }))
        }))
      }))
    })
    setIsAddModalOpen(true)
  }

  const handleUpdateCourse = async (updatedCourse: any) => {
    setIsLoading(true)
    try {
        const updatePayload = {
            courseName: updatedCourse.courseName,
            semesters: updatedCourse.semesters.map((semester: Semester) => ({
              id: semester.id, // Include semester ID for existing semesters
              name: semester.name,
              subjects: semester.subjects?.map(subject => ({
                id: subject.id, // Include subject ID for existing subjects
                subjectName: subject.subjectName,
                units: subject.units?.map(unit => ({
                  id: unit.id, // Include unit ID for existing units
                  unitNumber: typeof unit.unitNumber === 'string' 
                    ? parseInt(unit.unitNumber) 
                    : unit.unitNumber,
                  description: unit.description
                }))
              }))
            }))
          };
      
          console.log('Sending update payload:', JSON.stringify(updatePayload, null, 2));
      const response = await fetch(`http://localhost:8000/api/v1/courses/update/${updatedCourse.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update error:', errorData);
        throw new Error(errorData.message || 'Failed to update course')
      }
      await fetchCourses()
      setIsAddModalOpen(false)
      setSelectedCourse(null)
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
        <Button onClick={() => setIsAddModalOpen(true)} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Semesters</TableHead>
                <TableHead>Total Subjects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.semesters.length}</TableCell>
                  <TableCell>
                    {course.semesters.reduce((total, semester) => total + (semester.subjects?.length || 0), 0)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Link href={`/admin/course/${course.id}/subjects`} passHref>
                        <Button variant="outline" size="sm">
                          Edit Subjects
                        </Button>
                      </Link>
                      <Link href={`/admin/course/${course.id}/semesters`} passHref>
                        <Button variant="outline" size="sm">
                          Edit Semesters
                        </Button>
                      </Link>
                      <Link href={`/admin/course/${course.id}/assign-faculty`} passHref>
                        <Button variant="outline" size="sm">
                          Assign Faculty
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddEditCourseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSelectedCourse(null)
        }}
        onSave={selectedCourse ? handleUpdateCourse : handleAddCourse}
        course={selectedCourse}
      />
    </div>
  )
}

