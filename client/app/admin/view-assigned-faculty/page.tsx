// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/hooks/use-toast"

// interface Faculty {
//   id: number
//   name: string
// }

// interface Subject {
//   id: number
//   subjectName: string
//   facultyId: number | null
// }

// interface Semester {
//   id: number
//   name: string
//   subjects: Subject[]
// }

// interface Course {
//   id: number
//   courseName: string
//   semesters: Semester[]
// }

// export default function ViewAssignedFacultyPage() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
//   const [faculties, setFaculties] = useState<Faculty[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchCourses()
//     fetchFaculties()
//   }, [])

//   const fetchCourses = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/courses/getAllCourses", {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch courses")
//       const result = await response.json()
//       if (result.success) {
//         setCourses(result.data)
//       } else {
//         throw new Error("Unexpected response format")
//       }
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

//   const fetchCourseDetails = async (courseId: number) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/courses/getCourse/${courseId}`, {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch course details")
//       const responseData = await response.json()
//       setSelectedCourse(responseData.data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch course details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchFaculties = async () => {
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/users/getUserByRole/Faculty", {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch faculties")
//       const res = await response.json()
//       setFaculties(res.data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch faculties. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCourseChange = (courseId: string) => {
//     fetchCourseDetails(Number(courseId))
//   }

//   const handleFacultyAssignment = async (semesterId: number, subjectId: number, facultyId: string) => {
//     if (!selectedCourse) return

//     setIsLoading(true)
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/${selectedCourse.id}/assign-faculty`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           semesterId,
//           subjectId,
//           facultyId: Number(facultyId),
//         }),
//       })
//       if (!response.ok) throw new Error("Failed to assign faculty")
//       await fetchCourseDetails(selectedCourse.id) // Refresh course details
//       toast({
//         title: "Success",
//         description: "Faculty assigned successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to assign faculty. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) return <div className="text-center">Loading...</div>

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">View and Edit Assigned Faculty</h1>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Select Course</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Select onValueChange={handleCourseChange}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select a course" />
//             </SelectTrigger>
//             <SelectContent>
//               {courses.map((course) => (
//                 <SelectItem key={course.id} value={course.id.toString()}>
//                   {course.courseName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       {selectedCourse && (
//         <>
//           <h2 className="text-2xl font-bold mb-4">Assigned Faculties for {selectedCourse.courseName}</h2>
//           {selectedCourse.semesters.map((semester) => (
//             <Card key={semester.id} className="mb-6">
//               <CardHeader>
//                 <CardTitle>{semester.name}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Subject</TableHead>
//                       <TableHead>Assigned Faculty</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {semester.subjects.map((subject) => (
//                       <TableRow key={subject.id}>
//                         <TableCell>{subject.subjectName}</TableCell>
//                         <TableCell>
//                           {faculties.find((f) => f.id === subject.facultyId)?.name || "Not Assigned"}
//                         </TableCell>
//                         <TableCell>
//                           <Select
//                             onValueChange={(value) => handleFacultyAssignment(semester.id, subject.id, value)}
//                             defaultValue={subject.facultyId?.toString() || ""}
//                           >
//                             <SelectTrigger className="w-[200px]">
//                               <SelectValue placeholder="Select Faculty" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {faculties.map((faculty) => (
//                                 <SelectItem key={faculty.id} value={faculty.id.toString()}>
//                                   {faculty.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           ))}
//         </>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/hooks/use-toast"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// interface Faculty {
//   id: number
//   name: string
// }

// interface Subject {
//   id: number
//   subjectName: string
//   subjectCode: string
// }

// interface CourseSubject {
//   id: number
//   courseId: number
//   subjectId: number
//   semester: number
//   facultyId: number | null
//   batchId: number
//   subject?: Subject
// }

// interface Batch {
//   id: number
//   batchYear: number
//   courseId: number
//   createdAt: string
//   updatedAt: string
// }

// interface User {
//   id: number
//   name: string
//   email: string
//   role: string
// }

// interface Course {
//   id: number
//   courseName: string
//   createdById: number
//   createdAt: string
//   updatedAt: string
//   createdBy: User
//   subjects: CourseSubject[]
//   batches: Batch[]
// }

// export default function ViewAssignedFacultyPage() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
//   const [faculties, setFaculties] = useState<Faculty[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [allSubjects, setAllSubjects] = useState<{[key: number]: Subject}>({})
//   const [selectedBatch, setSelectedBatch] = useState<number | null>(null)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchCourses()
//     fetchFaculties()
//     fetchAllSubjects()
//   }, [])

//   const fetchCourses = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/courses/getAllCourses", {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch courses")
//       const result = await response.json()
//       if (result.success) {
//         setCourses(result.data)
//       } else {
//         throw new Error("Unexpected response format")
//       }
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

//   const fetchAllSubjects = async () => {
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/subjects/getAllSubjects", {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch subjects")
//       const result = await response.json()
//       if (result.success) {
//         // Create a map of subject ID to subject details
//         const subjectMap: {[key: number]: Subject} = {}
//         result.data.forEach((subject: Subject) => {
//           subjectMap[subject.id] = subject
//         })
//         setAllSubjects(subjectMap)
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch subjects. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const fetchCourseDetails = async (courseId: number) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/courses/getCourse/${courseId}`, {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch course details")
//       const responseData = await response.json()
//       const courseData = responseData.data
//       setSelectedCourse(courseData)
      
//       // Default to the first batch if available
//       if (courseData.batches && courseData.batches.length > 0) {
//         setSelectedBatch(courseData.batches[0].id)
//       } else {
//         setSelectedBatch(null)
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch course details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchFaculties = async () => {
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/users/getUserByRole/Faculty", {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch faculties")
//       const res = await response.json()
//       setFaculties(res.data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch faculties. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCourseChange = (courseId: string) => {
//     fetchCourseDetails(Number(courseId))
//   }

//   const handleBatchChange = (batchId: string) => {
//     setSelectedBatch(Number(batchId))
//   }

//   const handleFacultyAssignment = async (subjectId: number, facultyId: string) => {
//     if (!selectedCourse) return

//     setIsLoading(true)
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/assign-faculty`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           courseSubjectId: subjectId,
//           facultyId: Number(facultyId),
//         }),
//       })
//       if (!response.ok) throw new Error("Failed to assign faculty")
//       await fetchCourseDetails(selectedCourse.id) // Refresh course details
//       toast({
//         title: "Success",
//         description: "Faculty assigned successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to assign faculty. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Get unique semesters from subjects
//   const getUniqueSemesters = (subjects: CourseSubject[]): number[] => {
//     const semesterSet = new Set(subjects.map(subject => subject.semester))
//     return Array.from(semesterSet).sort((a, b) => a - b)
//   }

//   // Filter subjects by semester and batch
//   const getSubjectsBySemesterAndBatch = (semester: number, batchId: number | null): CourseSubject[] => {
//     if (!selectedCourse || !batchId) return []
    
//     return selectedCourse.subjects.filter(
//       subject => subject.semester === semester && subject.batchId === batchId
//     )
//   }

//   // Get subject name from allSubjects map
//   const getSubjectName = (subjectId: number): string => {
//     return allSubjects[subjectId]?.subjectName || `Subject ${subjectId}`
//   }

//   if (isLoading && !selectedCourse) return <div className="text-center py-10">Loading...</div>

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">View and Edit Assigned Faculty</h1>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Select Course</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Select onValueChange={handleCourseChange}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select a course" />
//             </SelectTrigger>
//             <SelectContent>
//               {courses.map((course) => (
//                 <SelectItem key={course.id} value={course.id.toString()}>
//                   {course.courseName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       {selectedCourse && (
//         <>
//           <h2 className="text-2xl font-bold mb-4">
//             Assigned Faculties for {selectedCourse.courseName}
//           </h2>

//           {selectedCourse.batches.length > 0 ? (
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle>Select Batch</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Select onValueChange={handleBatchChange} value={selectedBatch?.toString()}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select a batch" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {selectedCourse.batches.map((batch) => (
//                       <SelectItem key={batch.id} value={batch.id.toString()}>
//                         Batch {batch.batchYear}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card className="mb-6 bg-yellow-50">
//               <CardContent className="pt-6">
//                 <p className="text-yellow-800">No batches available for this course.</p>
//               </CardContent>
//             </Card>
//           )}

//           {selectedBatch && (
//             <div className="space-y-6">
//               <Tabs defaultValue={getUniqueSemesters(selectedCourse.subjects)[0]?.toString()}>
//                 <TabsList className="mb-4">
//                   {getUniqueSemesters(selectedCourse.subjects).map((semester) => (
//                     <TabsTrigger key={semester} value={semester.toString()}>
//                       Semester {semester}
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>

//                 {getUniqueSemesters(selectedCourse.subjects).map((semester) => (
//                   <TabsContent key={semester} value={semester.toString()}>
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Semester {semester}</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <Table>
//                           <TableHeader>
//                             <TableRow>
//                               <TableHead>Subject</TableHead>
//                               <TableHead>Assigned Faculty</TableHead>
//                               <TableHead>Action</TableHead>
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             {getSubjectsBySemesterAndBatch(semester, selectedBatch).length === 0 ? (
//                               <TableRow>
//                                 <TableCell colSpan={3} className="text-center text-muted-foreground">
//                                   No subjects found for this semester and batch.
//                                 </TableCell>
//                               </TableRow>
//                             ) : (
//                               getSubjectsBySemesterAndBatch(semester, selectedBatch).map((subject) => (
//                                 <TableRow key={subject.id}>
//                                   <TableCell>{getSubjectName(subject.subjectId)}</TableCell>
//                                   <TableCell>
//                                     {faculties.find((f) => f.id === subject.facultyId)?.name || "Not Assigned"}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Select
//                                       onValueChange={(value) => handleFacultyAssignment(subject.id, value)}
//                                       defaultValue={subject.facultyId?.toString() || ""}
//                                     >
//                                       <SelectTrigger className="w-[200px]">
//                                         <SelectValue placeholder="Select Faculty" />
//                                       </SelectTrigger>
//                                       <SelectContent>
//                                         {faculties.map((faculty) => (
//                                           <SelectItem key={faculty.id} value={faculty.id.toString()}>
//                                             {faculty.name}
//                                           </SelectItem>
//                                         ))}
//                                       </SelectContent>
//                                     </Select>
//                                   </TableCell>
//                                 </TableRow>
//                               ))
//                             )}
//                           </TableBody>
//                         </Table>
//                       </CardContent>
//                     </Card>
//                   </TabsContent>
//                 ))}
//               </Tabs>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Faculty {
  id: number
  name: string
}

interface Subject {
  id: number
  subjectName: string
  subjectCode: string
  createdAt: string
  updatedAt: string
}

interface Batch {
  id: number
  batchYear: number
  courseId: number
}

interface CourseSubject {
  id: number
  courseId: number
  subjectId: number
  semester: number
  facultyId: number | null
  batchId: number
  subject: Subject
  faculty: Faculty | null
  batch: Batch
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Course {
  id: number
  courseName: string
  createdById: number
  createdAt: string
  updatedAt: string
  createdBy: User
  batches: Batch[]
}

export default function ViewAssignedFacultyPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseSubjects, setCourseSubjects] = useState<CourseSubject[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
    fetchFaculties()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/courses/getAllCourses", {
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
      // Get course details
      const courseResponse = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/courses/getCourse/${courseId}`, {
        credentials: "include",
      })
      if (!courseResponse.ok) throw new Error("Failed to fetch course details")
      const courseData = await courseResponse.json()
      setSelectedCourse(courseData.data)
      
      // Get course subjects using the new API endpoint
      const subjectsResponse = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/course-subject-mapping/course/${courseId}/subjects`, {
        credentials: "include",
      })
      if (!subjectsResponse.ok) throw new Error("Failed to fetch course subjects")
      const subjectsData = await subjectsResponse.json()
      setCourseSubjects(subjectsData.data)
      
      // Default to the first batch if available
      if (courseData.data.batches && courseData.data.batches.length > 0) {
        setSelectedBatch(courseData.data.batches[0].id)
      } else {
        setSelectedBatch(null)
      }
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
      const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/users/getUserByRole/Faculty", {
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

  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(Number(batchId))
  }

  const handleFacultyAssignment = async (courseSubjectId: number, facultyId: string) => {
    if (!selectedCourse) return

    setIsLoading(true)
    try {
      // Use the new API endpoint for faculty assignment
      const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/course-subject-mapping/assign-faculty`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSubjectId: courseSubjectId,
          facultyId: Number(facultyId),
        }),
      })
      
      if (!response.ok) throw new Error("Failed to assign faculty")
      
      // Refresh course subjects after assignment
      fetchCourseDetails(selectedCourse.id)
      
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

  // Get unique semesters from course subjects
  const getUniqueSemesters = (): number[] => {
    const semesterSet = new Set(courseSubjects.map(subject => subject.semester))
    return Array.from(semesterSet).sort((a, b) => a - b)
  }

  // Filter subjects by semester and batch
  const getSubjectsBySemesterAndBatch = (semester: number, batchId: number | null): CourseSubject[] => {
    if (!batchId) return []
    
    return courseSubjects.filter(
      subject => subject.semester === semester && subject.batchId === batchId
    )
  }

  if (isLoading && !selectedCourse) return <div className="text-center py-10">Loading...</div>

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
          <h2 className="text-2xl font-bold mb-4">
            Assigned Faculties for {selectedCourse.courseName}
          </h2>

          {selectedCourse.batches.length > 0 ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Batch</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleBatchChange} value={selectedBatch?.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCourse.batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        Batch {batch.batchYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 bg-yellow-50">
              <CardContent className="pt-6">
                <p className="text-yellow-800">No batches available for this course.</p>
              </CardContent>
            </Card>
          )}

          {selectedBatch && courseSubjects.length > 0 && (
            <div className="space-y-6">
              <Tabs defaultValue={getUniqueSemesters()[0]?.toString()}>
                <TabsList className="mb-4">
                  {getUniqueSemesters().map((semester) => (
                    <TabsTrigger key={semester} value={semester.toString()}>
                      Semester {semester}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {getUniqueSemesters().map((semester) => (
                  <TabsContent key={semester} value={semester.toString()}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Semester {semester}</CardTitle>
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
                            {getSubjectsBySemesterAndBatch(semester, selectedBatch).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                  No subjects found for this semester and batch.
                                </TableCell>
                              </TableRow>
                            ) : (
                              getSubjectsBySemesterAndBatch(semester, selectedBatch).map((subject) => (
                                <TableRow key={subject.id}>
                                  <TableCell>{subject.subject.subjectName}</TableCell>
                                  <TableCell>
                                    {subject.faculty?.name || "Not Assigned"}
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      onValueChange={(value) => handleFacultyAssignment(subject.id, value)}
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
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </>
      )}
    </div>
  )
}