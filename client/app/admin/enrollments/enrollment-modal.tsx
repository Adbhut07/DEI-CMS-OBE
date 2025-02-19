// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// interface EnrollmentModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSubmit: (data: any) => void
//   enrollment: any
//   courses: { id: string; name: string }[]
// }

// export default function EnrollmentModal({ isOpen, onClose, onSubmit, enrollment, courses }: EnrollmentModalProps) {
//   const [studentId, setStudentId] = useState("")
//   const [courseId, setCourseId] = useState("")
//   const [semesterId, setSemesterId] = useState("")

//   useEffect(() => {
//     if (enrollment) {
//       setStudentId(enrollment.studentId)
//       setCourseId(enrollment.courseId)
//       setSemesterId(enrollment.semesterId)
//     } else {
//       setStudentId("")
//       setCourseId("")
//       setSemesterId("")
//     }
//   }, [enrollment])

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSubmit({ studentId, courseId, semesterId })
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{enrollment ? "Edit Enrollment" : "Create Enrollment"}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="studentId">Student ID</Label>
//               <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
//             </div>
//             <div>
//               <Label htmlFor="courseId">Course</Label>
//               <Select value={courseId} onValueChange={setCourseId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a course" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {courses.map((course) => (
//                     <SelectItem key={course.id} value={course.id}>
//                       {course.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="semesterId">Semester ID</Label>
//               <Input id="semesterId" value={semesterId} onChange={(e) => setSemesterId(e.target.value)} required />
//             </div>
//           </div>
//           <DialogFooter className="mt-6">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">{enrollment ? "Update" : "Create"}</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  enrollment: any
  selectedBatch: string | null
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  onSubmit,
  enrollment,
  selectedBatch,
}: EnrollmentModalProps) {
  const [studentId, setStudentId] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (enrollment) {
      setStudentId(enrollment.studentId.toString())
      setIsActive(enrollment.isActive)
    } else {
      setStudentId("")
      setIsActive(true)
    }
  }, [enrollment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ studentId, isActive })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{enrollment ? "Edit Enrollment" : "Create Enrollment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            {selectedBatch && (
              <div>
                <Label>Selected Batch</Label>
                <Input value={selectedBatch} disabled />
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{enrollment ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

