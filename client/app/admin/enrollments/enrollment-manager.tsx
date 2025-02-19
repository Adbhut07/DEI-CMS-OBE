// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Pencil, Trash2, UserPlus } from "lucide-react"
// import EnrollmentModal from "./enrollment-modal"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// interface Course {
//   id: string
//   name: string
// }

// interface Enrollment {
//   id: number
//   studentId: number
//   courseId: number
//   semesterId: number
//   createdAt: string
//   student: {
//     id: number
//     name: string
//     email: string
//   }
//   course: {
//     id: number
//     courseName: string
//   }
//   semester: {
//     id: number
//     name: string
//   }
// }

// export default function EnrollmentManager({ courses }: { courses: Course[] }) {
//   const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const handleCourseChange = async (courseId: string) => {
//     setSelectedCourse(courseId)
//     setError(null)
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/enrollments/course/${courseId}`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       const result = await response.json()
//       if (result.success && Array.isArray(result.data)) {
//         setEnrollments(result.data)
//       } else {
//         throw new Error("Unexpected response format")
//       }
//     } catch (error) {
//       setError("Failed to fetch enrollments. Please try again.")
//       setEnrollments([])
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/enrollments/${id}`, {
//         method: "DELETE",
//       })
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       setEnrollments(enrollments.filter((e) => e.id.toString() !== id))
//     } catch (error) {
//       setError("Failed to delete enrollment. Please try again.")
//     }
//   }

//   const handleEdit = (enrollment: Enrollment) => {
//     setEditingEnrollment(enrollment)
//     setIsModalOpen(true)
//   }

//   const handleCreate = () => {
//     setEditingEnrollment(null)
//     setIsModalOpen(true)
//   }

//   const handleModalClose = () => {
//     setIsModalOpen(false)
//     setEditingEnrollment(null)
//   }

//   const handleModalSubmit = async (data: any) => {
//     try {
//       const formattedData = {
//         studentId: Number(data.studentId),
//         courseId: Number(data.courseId),
//         semesterId: Number(data.semesterId),
//       }
//       let response
//       if (editingEnrollment) {
//         response = await fetch(`http://localhost:8000/api/v1/enrollments/${editingEnrollment.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formattedData),
//         })
//       } else {
//         response = await fetch("http://localhost:8000/api/v1/enrollments/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formattedData),
//         })
//       }

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       if (result.success && result.data) {
//         const updatedEnrollment = result.data
//         if (editingEnrollment) {
//           setEnrollments(enrollments.map((e) => (e.id === updatedEnrollment.id ? updatedEnrollment : e)))
//         } else {
//           setEnrollments([...enrollments, updatedEnrollment])
//         }
//         handleModalClose()
//       } else {
//         throw new Error("Unexpected response format")
//       }
//     } catch (error) {
//       console.error("Error in handleModalSubmit:", error)
//       setError(
//         `Failed to ${editingEnrollment ? "update" : "create"} enrollment. ${error instanceof Error ? error.message : "Please try again."}`,
//       )
//     }
//   }

//   if (courses.length === 0) {
//     return (
//       <Alert>
//         <AlertDescription>No courses available. Please add courses before managing enrollments.</AlertDescription>
//       </Alert>
//     )
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <Select onValueChange={handleCourseChange}>
//           <SelectTrigger className="w-[300px]">
//             <SelectValue placeholder="Select a course" />
//           </SelectTrigger>
//           <SelectContent>
//             {courses.map((course) => (
//               <SelectItem key={course.id} value={course.id}>
//                 {course.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Button onClick={handleCreate}>
//           <UserPlus className="mr-2 h-4 w-4" />
//           New Enrollment
//         </Button>
//       </div>

//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {selectedCourse && (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Student Name</TableHead>
//               <TableHead>Semester</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {enrollments.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={3} className="text-center">
//                   No enrollments found for this course.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               enrollments.map((enrollment) => (
//                 <TableRow key={enrollment.id}>
//                   <TableCell>{enrollment.student.name}</TableCell>
//                   <TableCell>{enrollment.semester.name}</TableCell>
//                   <TableCell>
//                     <Button variant="ghost" size="icon" onClick={() => handleEdit(enrollment)}>
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="icon" onClick={() => handleDelete(enrollment.id.toString())}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       )}

//       <EnrollmentModal
//         isOpen={isModalOpen}
//         onClose={handleModalClose}
//         onSubmit={handleModalSubmit}
//         enrollment={editingEnrollment}
//         courses={courses}
//       />
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Switch } from "@/components/ui/switch"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { toast } from "@/hooks/use-toast"

// interface Course {
//   id: string
//   name: string
// }

// interface Batch {
//   id: number
//   batchYear: number
//   courseId: number
// }

// interface Enrollment {
//   id: number
//   studentId: number
//   batchId: number
//   rollNo: string
//   isActive: boolean
//   createdAt: string
//   student: {
//     id: number
//     name: string
//     email: string
//     rollNo: string
//   }
// }

// export default function EnrollmentManager({ courses }: { courses: Course[] }) {
//   const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
//   const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
//   const [batches, setBatches] = useState<Batch[]>([])
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([])
//   const [error, setError] = useState<string | null>(null)

//   const handleCourseChange = async (courseId: string) => {
//     setSelectedCourse(courseId)
//     setSelectedBatch(null)
//     setEnrollments([])
//     setError(null)
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/batch/course/${courseId}`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       const result = await response.json()
//       if (result.success && Array.isArray(result.data)) {
//         setBatches(result.data)
//       } else {
//         throw new Error("Unexpected response format")
//       }
//     } catch (error) {
//       setError("Failed to fetch batches. Please try again.")
//       setBatches([])
//     }
//   }

//   const handleBatchChange = async (batchId: string) => {
//     setSelectedBatch(batchId)
//     setError(null)
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/enrollments/batch/${batchId}`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       const result = await response.json()
//       if (result.success && Array.isArray(result.data)) {
//         setEnrollments(result.data)
//       } else {
//         throw new Error("Unexpected response format")
//       }
//     } catch (error) {
//       setError("Failed to fetch enrollments. Please try again.")
//       setEnrollments([])
//     }
//   }

//   const handleStatusChange = async (enrollmentId: number, newStatus: boolean) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/enrollments/${enrollmentId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isActive: newStatus }),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       if (result.success) {
//         setEnrollments(enrollments.map(enrollment => 
//           enrollment.id === enrollmentId ? { ...enrollment, isActive: newStatus } : enrollment
//         ))
//         toast({
//           title: "Status Updated",
//           description: `Enrollment status has been ${newStatus ? 'activated' : 'deactivated'}.`,
//         })
//       } else {
//         throw new Error("Failed to update enrollment status")
//       }
//     } catch (error) {
//       console.error("Error updating enrollment status:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update enrollment status. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   if (courses.length === 0) {
//     return (
//       <Alert>
//         <AlertDescription>No courses available. Please add courses before managing enrollments.</AlertDescription>
//       </Alert>
//     )
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div className="space-x-4">
//           <Select onValueChange={handleCourseChange}>
//             <SelectTrigger className="w-[300px]">
//               <SelectValue placeholder="Select a course" />
//             </SelectTrigger>
//             <SelectContent>
//               {courses.map((course) => (
//                 <SelectItem key={course.id} value={course.id}>
//                   {course.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {selectedCourse && (
//             <Select onValueChange={handleBatchChange} disabled={!selectedCourse}>
//               <SelectTrigger className="w-[300px]">
//                 <SelectValue placeholder="Select a batch" />
//               </SelectTrigger>
//               <SelectContent>
//                 {batches.map((batch) => (
//                   <SelectItem key={batch.id} value={batch.id.toString()}>
//                     {`Batch ${batch.batchYear}`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </div>

//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {selectedBatch && (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Roll No</TableHead>
//               <TableHead>Student Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {enrollments.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center">
//                   No enrollments found for this batch.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               enrollments.map((enrollment) => (
//                 <TableRow key={enrollment.id}>
//                   <TableCell>{enrollment.rollNo}</TableCell>
//                   <TableCell>{enrollment.student.name}</TableCell>
//                   <TableCell>{enrollment.student.email}</TableCell>
//                   <TableCell>{enrollment.isActive ? "Active" : "Inactive"}</TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={enrollment.isActive}
//                       onCheckedChange={(checked) => handleStatusChange(enrollment.id, checked)}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import CreateEnrollmentModal from "./create-enrollment-modal"

interface Course {
  id: string
  name: string
}

interface Batch {
  id: number
  batchYear: number
  courseId: number
}

interface Enrollment {
  id: number
  studentId: number
  batchId: number
  rollNo: string
  isActive: boolean
  createdAt: string
  student?: {
    id: number
    name: string
    email: string
    rollNo: string
  }
}

export default function EnrollmentManager({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [batches, setBatches] = useState<Batch[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId)
    setSelectedBatch(null)
    setEnrollments([])
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/batch/course/${courseId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setBatches(result.data)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      setError("Failed to fetch batches. Please try again.")
      setBatches([])
    }
  }

  const handleBatchChange = async (batchId: string) => {
    setSelectedBatch(batchId)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/enrollments/batch/${batchId}`)
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

  const handleStatusChange = async (enrollmentId: number, newStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/enrollments/${enrollmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        setEnrollments(
          enrollments.map((enrollment) =>
            enrollment.id === enrollmentId ? { ...enrollment, isActive: newStatus } : enrollment,
          ),
        )
        toast({
          title: "Status Updated",
          description: `Enrollment status has been ${newStatus ? "activated" : "deactivated"}.`,
        })
      } else {
        throw new Error("Failed to update enrollment status")
      }
    } catch (error) {
      console.error("Error updating enrollment status:", error)
      toast({
        title: "Error",
        description: "Failed to update enrollment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateEnrollment = async (studentId: number, rollNo: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/enrollments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          batchId: Number(selectedBatch),
          rollNo,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        // Fetch the updated list of enrollments instead of adding the new one directly
        await handleBatchChange(selectedBatch!)
        toast({
          title: "Enrollment Created",
          description: "New enrollment has been successfully created.",
        })
        setIsCreateModalOpen(false)
      } else {
        throw new Error("Failed to create enrollment")
      }
    } catch (error) {
      console.error("Error creating enrollment:", error)
      toast({
        title: "Error",
        description: "Failed to create enrollment. Please try again.",
        variant: "destructive",
      })
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
        <div className="space-x-4">
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
          {selectedCourse && (
            <Select onValueChange={handleBatchChange} disabled={!selectedCourse}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {`Batch ${batch.batchYear}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {selectedBatch && <Button onClick={() => setIsCreateModalOpen(true)}>Create Enrollment</Button>}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedBatch && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No enrollments found for this batch.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.rollNo || "N/A"}</TableCell>
                  <TableCell>{enrollment.student?.name || "Unknown"}</TableCell>
                  <TableCell>{enrollment.student?.email || "N/A"}</TableCell>
                  <TableCell>{enrollment.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={enrollment.isActive}
                      onCheckedChange={(checked) => handleStatusChange(enrollment.id, checked)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <CreateEnrollmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEnrollment}
        batchId={selectedBatch}
      />
    </div>
  )
}











