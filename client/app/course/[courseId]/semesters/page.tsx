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

// interface Semester {
//   id: string
//   name: string
// }

// interface EditSemesterModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSave: (semester: Semester) => void
//   semester?: Semester
// }

// export default function SemestersPage() {
//   const params = useParams()
//   const courseId = params.courseId as string
//   const [semesters, setSemesters] = useState<Semester[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)

//   useEffect(() => {
//     // Fetch semesters for the course
//     // This is where you'd typically make an API call
//     setSemesters([
//       { id: '1', name: 'Semester 1' },
//       { id: '2', name: 'Semester 2' },
//     ])
//   }, [courseId])

//   const handleAddSemester = () => {
//     setSelectedSemester(null)
//     setIsModalOpen(true)
//   }

//   const handleEditSemester = (semester: Semester) => {
//     setSelectedSemester(semester)
//     setIsModalOpen(true)
//   }

//   const handleDeleteSemester = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       setSemesters(semesters.filter(semester => semester.id !== id))
//     }
//   }

//   const handleSaveSemester = (updatedSemester: Semester) => {
//     if (selectedSemester) {
//       setSemesters(semesters.map(semester => semester.id === updatedSemester.id ? updatedSemester : semester))
//     } else {
//       setSemesters([...semesters, { ...updatedSemester, id: (semesters.length + 1).toString() }])
//     }
//     setIsModalOpen(false)
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Manage Semesters</h1>
      
//       <Button onClick={handleAddSemester} className="mb-4">
//         <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
//       </Button>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Semester Name</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {semesters.map((semester) => (
//             <TableRow key={semester.id}>
//               <TableCell>{semester.name}</TableCell>
//               <TableCell>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" size="sm" onClick={() => handleEditSemester(semester)}>
//                     <Edit className="h-4 w-4 mr-1" /> Edit
//                   </Button>
//                   <Button variant="destructive" size="sm" onClick={() => handleDeleteSemester(semester.id)}>
//                     <Trash2 className="h-4 w-4 mr-1" /> Delete
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <EditSemesterModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSaveSemester}
//         semester={selectedSemester || undefined}
//       />
//     </div>
//   )
// }

// function EditSemesterModal({ isOpen, onClose, onSave, semester }: EditSemesterModalProps) {
//   const [formData, setFormData] = useState<Semester>({
//     id: '',
//     name: ''
//   })

//   useEffect(() => {
//     if (semester) {
//       setFormData(semester)
//     } else {
//       setFormData({
//         id: '',
//         name: ''
//       })
//     }
//   }, [semester])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSave(formData)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{semester ? 'Edit Semester' : 'Add New Semester'}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="name">Semester Name</label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Save Semester</Button>
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
import { useToast } from '@/hooks/use-toast'

interface Semester {
  id: string
  name: string
}

interface EditSemesterModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (semester: Semester) => void
  semester?: Semester
}

export default function SemestersPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSemesters()
  }, [courseId])

  const fetchSemesters = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/v1/courses/${courseId}/semesters`)
      if (!response.ok) throw new Error('Failed to fetch semesters')
      const data = await response.json()
      setSemesters(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch semesters. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSemester = () => {
    setSelectedSemester(null)
    setIsModalOpen(true)
  }

  const handleEditSemester = (semester: Semester) => {
    setSelectedSemester(semester)
    setIsModalOpen(true)
  }

  const handleDeleteSemester = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/api/v1/courses/${courseId}/semesters/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete semester')
        await fetchSemesters()
        toast({
          title: "Success",
          description: "Semester deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete semester. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSaveSemester = async (updatedSemester: Semester) => {
    setIsLoading(true)
    try {
      const url = selectedSemester
        ? `http://localhost:3000/api/v1/courses/${courseId}/semesters/${selectedSemester.id}`
        : `http://localhost:3000/api/v1/courses/${courseId}/semesters`
      const method = selectedSemester ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSemester),
      })
      if (!response.ok) throw new Error('Failed to save semester')
      await fetchSemesters()
      setIsModalOpen(false)
      toast({
        title: "Success",
        description: `Semester ${selectedSemester ? 'updated' : 'added'} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedSemester ? 'update' : 'add'} semester. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Semesters</h1>
      
      <Button onClick={handleAddSemester} className="mb-4" disabled={isLoading}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
      </Button>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semester Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.map((semester) => (
              <TableRow key={semester.id}>
                <TableCell>{semester.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditSemester(semester)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSemester(semester.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EditSemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSemester}
        semester={selectedSemester || undefined}
      />
    </div>
  )
}

function EditSemesterModal({ isOpen, onClose, onSave, semester }: EditSemesterModalProps) {
  const [formData, setFormData] = useState<Semester>({
    id: '',
    name: ''
  })

  useEffect(() => {
    if (semester) {
      setFormData(semester)
    } else {
      setFormData({
        id: '',
        name: ''
      })
    }
  }, [semester])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{semester ? 'Edit Semester' : 'Add New Semester'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Semester Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Semester</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

