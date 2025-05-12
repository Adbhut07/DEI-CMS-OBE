"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Subject {
  id: number
  subjectName: string
  subjectCode: string
  createdAt: string
  updatedAt: string
}

interface Unit {
  id: number
  unitNumber: number
  description: string
  subjectId: number
  attainment: number
  createdAt: string
  updatedAt: string
  subject: {
    id: number
    subjectName: string
    subjectCode: string
    createdAt: string
    updatedAt: string
    courseMappings: any[]
  }
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [createSubjectOpen, setCreateSubjectOpen] = useState(false)
  const [createUnitsOpen, setCreateUnitsOpen] = useState(false)
  const [viewUnitsOpen, setViewUnitsOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  // Form states
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    subjectCode: "",
  })

  const [newUnits, setNewUnits] = useState([
    { unitNumber: 1, description: "", subjectId: 0 },
    { unitNumber: 2, description: "", subjectId: 0 },
    { unitNumber: 3, description: "", subjectId: 0 },
    { unitNumber: 4, description: "", subjectId: 0 },
    { unitNumber: 5, description: "", subjectId: 0 },
  ])

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/subjects/getAllSubjects", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch subjects")
      }
      const data = await response.json()
      setSubjects(data.data || [])
    } catch (err) {
      setError("Error fetching subjects")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch units for a specific subject
  const fetchUnits = async (subjectId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/v1/units/getAllUnits/${subjectId}`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch units")
      }
      const data = await response.json()
      setUnits(data.data || [])
    } catch (err) {
      setError("Error fetching units")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Create a new subject
  const createSubject = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/subjects/create", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      })

      if (!response.ok) {
        throw new Error("Failed to create subject")
      }

      const data = await response.json()
      setSubjects([...subjects, data.data])
      setCreateSubjectOpen(false)
      setNewSubject({ subjectName: "", subjectCode: "" })
      toast({
        title: "Success",
        description: "Subject created successfully",
      })
      fetchSubjects()
    } catch (err) {
      setError("Error creating subject")
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive",
      })
    }
  }

  // Create units for a subject
  const createUnits = async () => {
    if (!selectedSubject) return

    try {
      // Filter out any empty units
      const unitsToCreate = newUnits.filter((unit) => unit.description.trim() !== "")

      if (unitsToCreate.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one unit",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("http://localhost:8000/api/v1/units/bulkCreate", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unitsToCreate),
      })

      if (!response.ok) {
        throw new Error("Failed to create units")
      }

      setCreateUnitsOpen(false)
      resetUnitForm()
      toast({
        title: "Success",
        description: "Units created successfully",
      })
    } catch (err) {
      setError("Error creating units")
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to create units",
        variant: "destructive",
      })
    }
  }

  // Handle opening the create units dialog
  const handleOpenCreateUnits = (subject: Subject) => {
    setSelectedSubject(subject)
    // Initialize unit numbers and subject ID
    setNewUnits(
      newUnits.map((unit, index) => ({
        ...unit,
        unitNumber: index + 1,
        subjectId: subject.id,
        description: "",
      })),
    )
    setCreateUnitsOpen(true)
  }

  // Handle opening the view units dialog
  const handleOpenViewUnits = async (subject: Subject) => {
    setSelectedSubject(subject)
    await fetchUnits(subject.id)
    setViewUnitsOpen(true)
  }

  // Reset the unit form
  const resetUnitForm = () => {
    setNewUnits([
      { unitNumber: 1, description: "", subjectId: 0 },
      { unitNumber: 2, description: "", subjectId: 0 },
      { unitNumber: 3, description: "", subjectId: 0 },
      { unitNumber: 4, description: "", subjectId: 0 },
      { unitNumber: 5, description: "", subjectId: 0 },
    ])
  }

  // Handle unit description change
  const handleUnitChange = (index: number, description: string) => {
    const updatedUnits = [...newUnits]
    updatedUnits[index] = { ...updatedUnits[index], description }
    setNewUnits(updatedUnits)
  }

  // Load subjects on component mount
  useEffect(() => {
    fetchSubjects()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects Dashboard</h1>
        <Button onClick={() => setCreateSubjectOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {loading && <p>Loading...</p>}

      {!loading && subjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No subjects found. Create your first subject!</p>
        </div>
      )}

      {subjects.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Subject Code</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.id}</TableCell>
                <TableCell>{subject.subjectName}</TableCell>
                <TableCell>{subject.subjectCode}</TableCell>
                <TableCell>{new Date(subject.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenViewUnits(subject)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Units
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenCreateUnits(subject)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Units
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create Subject Dialog */}
      <Dialog open={createSubjectOpen} onOpenChange={setCreateSubjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
            <DialogDescription>Add a new subject to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectName" className="text-right">
                Subject Name
              </Label>
              <Input
                id="subjectName"
                value={newSubject.subjectName}
                onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectCode" className="text-right">
                Subject Code
              </Label>
              <Input
                id="subjectCode"
                value={newSubject.subjectCode}
                onChange={(e) => setNewSubject({ ...newSubject, subjectCode: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateSubjectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createSubject}>Create Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Units Dialog */}
      <Dialog open={createUnitsOpen} onOpenChange={setCreateUnitsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Units for {selectedSubject?.subjectName}</DialogTitle>
            <DialogDescription>Add units for this subject. You can add up to 5 units.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {newUnits.map((unit, index) => (
              <div key={index} className="grid grid-cols-5 items-center gap-4">
                <Label className="text-right">Unit {unit.unitNumber}</Label>
                <Textarea
                  value={unit.description}
                  onChange={(e) => handleUnitChange(index, e.target.value)}
                  placeholder="Unit description"
                  className="col-span-4"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUnitsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createUnits}>Create Units</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Units Dialog */}
      <Dialog open={viewUnitsOpen} onOpenChange={setViewUnitsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Units for {selectedSubject?.subjectName}</DialogTitle>
            <DialogDescription>View all units for this subject.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {units.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No units found for this subject.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>{unit.unitNumber}</TableCell>
                      <TableCell>{unit.description}</TableCell>
                      <TableCell>{new Date(unit.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewUnitsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

