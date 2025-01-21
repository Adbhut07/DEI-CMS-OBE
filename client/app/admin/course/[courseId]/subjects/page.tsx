// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams } from 'next/navigation'
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
// import { PlusCircle, Edit, Trash2 } from 'lucide-react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Assume we have a list of faculty members
// const facultyMembers = [
//   { id: 1, name: 'Dr. John Doe' },
//   { id: 2, name: 'Prof. Jane Smith' },
//   { id: 3, name: 'Dr. Bob Johnson' },
// ]

// interface Subject {
//   id: string
//   name: string
//   facultyId: number
//   units: { unitNumber: number; description: string }[]
// }

// interface EditSubjectModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSave: (subject: Subject) => void
//   subject?: Subject
// }

// export default function SubjectsPage() {
//   const params = useParams()
//   const courseId = params.courseId as string
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

//   useEffect(() => {
//     // Fetch subjects for the course
//     // This is where you'd typically make an API call
//     setSubjects([
//       { id: '1', name: 'Programming Basics', facultyId: 1, units: [{ unitNumber: 1, description: 'Introduction to Programming' }] },
//       { id: '2', name: 'Data Structures', facultyId: 2, units: [{ unitNumber: 1, description: 'Arrays and Linked Lists' }] },
//     ])
//   }, [courseId])

//   const handleAddSubject = () => {
//     setSelectedSubject(null)
//     setIsModalOpen(true)
//   }

//   const handleEditSubject = (subject: Subject) => {
//     setSelectedSubject(subject)
//     setIsModalOpen(true)
//   }

//   const handleDeleteSubject = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this subject?')) {
//       setSubjects(subjects.filter(subject => subject.id !== id))
//     }
//   }

//   const handleSaveSubject = (updatedSubject: Subject) => {
//     if (selectedSubject) {
//       setSubjects(subjects.map(subject => subject.id === updatedSubject.id ? updatedSubject : subject))
//     } else {
//       setSubjects([...subjects, { ...updatedSubject, id: (subjects.length + 1).toString() }])
//     }
//     setIsModalOpen(false)
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Manage Subjects</h1>
      
//       <Button onClick={handleAddSubject} className="mb-4">
//         <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
//       </Button>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Subject Name</TableHead>
//             <TableHead>Faculty</TableHead>
//             <TableHead>Units</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {subjects.map((subject) => (
//             <TableRow key={subject.id}>
//               <TableCell>{subject.name}</TableCell>
//               <TableCell>{facultyMembers.find(f => f.id === subject.facultyId)?.name}</TableCell>
//               <TableCell>{subject.units.length}</TableCell>
//               <TableCell>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
//                     <Edit className="h-4 w-4 mr-1" /> Edit
//                   </Button>
//                   <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
//                     <Trash2 className="h-4 w-4 mr-1" /> Delete
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <EditSubjectModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSaveSubject}
//         subject={selectedSubject || undefined}
//       />
//     </div>
//   )
// }

// function EditSubjectModal({ isOpen, onClose, onSave, subject }: EditSubjectModalProps) {
//   const [formData, setFormData] = useState<Subject>({
//     id: '',
//     name: '',
//     facultyId: 0,
//     units: []
//   })

//   useEffect(() => {
//     if (subject) {
//       setFormData(subject)
//     } else {
//       setFormData({
//         id: '',
//         name: '',
//         facultyId: 0,
//         units: []
//       })
//     }
//   }, [subject])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleFacultyChange = (value: string) => {
//     setFormData(prev => ({ ...prev, facultyId: parseInt(value) }))
//   }

//   const handleAddUnit = () => {
//     setFormData(prev => ({
//       ...prev,
//       units: [...prev.units, { unitNumber: prev.units.length + 1, description: '' }]
//     }))
//   }

//   const handleUnitChange = (index: number, field: 'unitNumber' | 'description', value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       units: prev.units.map((unit, i) => 
//         i === index ? { ...unit, [field]: field === 'unitNumber' ? parseInt(value) : value } : unit
//       )
//     }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSave(formData)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{subject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="name">Subject Name</label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="faculty">Faculty</label>
//               <Select
//                 value={formData.facultyId.toString()}
//                 onValueChange={handleFacultyChange}
//               >
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select faculty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {facultyMembers.map((faculty) => (
//                     <SelectItem key={faculty.id} value={faculty.id.toString()}>
//                       {faculty.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <h4 className="mb-2">Units</h4>
//               {formData.units.map((unit, index) => (
//                 <div key={index} className="flex gap-2 mb-2">
//                   <Input
//                     type="number"
//                     value={unit.unitNumber}
//                     onChange={(e) => handleUnitChange(index, 'unitNumber', e.target.value)}
//                     placeholder="Unit Number"
//                     className="w-20"
//                   />
//                   <Input
//                     value={unit.description}
//                     onChange={(e) => handleUnitChange(index, 'description', e.target.value)}
//                     placeholder="Unit Description"
//                     className="flex-grow"
//                   />
//                 </div>
//               ))}
//               <Button type="button" onClick={handleAddUnit} variant="outline" size="sm">
//                 <PlusCircle className="h-4 w-4 mr-2" /> Add Unit
//               </Button>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Save Subject</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

// Assume we have a list of faculty members
const facultyMembers = [
  { id: 1, name: 'Dr. John Doe' },
  { id: 2, name: 'Prof. Jane Smith' },
  { id: 3, name: 'Dr. Bob Johnson' },
]

interface Subject {
  id: string
  name: string
  facultyId: number
  units: { unitNumber: number; description: string }[]
}

interface EditSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (subject: Subject) => void
  subject?: Subject
}

export default function SubjectsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubjects()
  }, [courseId])

  const fetchSubjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/v1/courses/${courseId}/subjects`)
      if (!response.ok) throw new Error('Failed to fetch subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubject = () => {
    setSelectedSubject(null)
    setIsModalOpen(true)
  }

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsModalOpen(true)
  }

  const handleDeleteSubject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/api/v1/courses/${courseId}/subjects/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete subject')
        await fetchSubjects()
        toast({
          title: "Success",
          description: "Subject deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete subject. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSaveSubject = async (updatedSubject: Subject) => {
    setIsLoading(true)
    try {
      const url = selectedSubject
        ? `http://localhost:3000/api/v1/courses/${courseId}/subjects/${selectedSubject.id}`
        : `http://localhost:3000/api/v1/courses/${courseId}/subjects`
      const method = selectedSubject ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubject),
      })
      if (!response.ok) throw new Error('Failed to save subject')
      await fetchSubjects()
      setIsModalOpen(false)
      toast({
        title: "Success",
        description: `Subject ${selectedSubject ? 'updated' : 'added'} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedSubject ? 'update' : 'add'} subject. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Subjects</h1>
      
      <Button onClick={handleAddSubject} className="mb-4" disabled={isLoading}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
      </Button>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{facultyMembers.find(f => f.id === subject.facultyId)?.name}</TableCell>
                <TableCell>{subject.units.length}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EditSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSubject}
        subject={selectedSubject || undefined}
      />
    </div>
  )
}

function EditSubjectModal({ isOpen, onClose, onSave, subject }: EditSubjectModalProps) {
  const [formData, setFormData] = useState<Subject>({
    id: '',
    name: '',
    facultyId: 0,
    units: []
  })

  useEffect(() => {
    if (subject) {
      setFormData(subject)
    } else {
      setFormData({
        id: '',
        name: '',
        facultyId: 0,
        units: []
      })
    }
  }, [subject])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFacultyChange = (value: string) => {
    setFormData(prev => ({ ...prev, facultyId: parseInt(value) }))
  }

  const handleAddUnit = () => {
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, { unitNumber: prev.units.length + 1, description: '' }]
    }))
  }

  const handleUnitChange = (index: number, field: 'unitNumber' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.map((unit, i) => 
        i === index ? { ...unit, [field]: field === 'unitNumber' ? parseInt(value) : value } : unit
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Subject Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="faculty">Faculty</label>
              <Select
                value={formData.facultyId.toString()}
                onValueChange={handleFacultyChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {facultyMembers.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id.toString()}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h4 className="mb-2">Units</h4>
              {formData.units.map((unit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="number"
                    value={unit.unitNumber}
                    onChange={(e) => handleUnitChange(index, 'unitNumber', e.target.value)}
                    placeholder="Unit Number"
                    className="w-20"
                  />
                  <Input
                    value={unit.description}
                    onChange={(e) => handleUnitChange(index, 'description', e.target.value)}
                    placeholder="Unit Description"
                    className="flex-grow"
                  />
                </div>
              ))}
              <Button type="button" onClick={handleAddUnit} variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Unit
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

