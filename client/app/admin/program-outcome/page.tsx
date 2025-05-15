"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Pencil, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { ProgramOutcomeDialog } from "./program-outcome-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: number
  courseName: string
  createdById: number
  createdAt: string
  updatedAt: string
  createdBy: {
    id: number
    name: string
    email: string
    role: string
  }
  subjects: any[]
}

interface Batch {
  id: number
  batchYear: number
  courseId: number
  createdAt: string
  updatedAt: string
}

interface POAttainment {
  id: number
  poId: number
  batchId: number
  attainment: number
  createdAt: string
  updatedAt: string
}

interface ProgramOutcome {
  id: number
  courseId: number
  batchId: number
  description: string
  attainment: number
  createdAt: string
  updatedAt: string
  course: {
    id: number
    courseName: string
    createdById: number
    createdAt: string
    updatedAt: string
  }
  batch: {
    id: number
    batchYear: number
    courseId: number
    createdAt: string
    updatedAt: string
  }
  poAttainments: POAttainment[]
}

export default function ProgramOutcomesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<ProgramOutcome | null>(null)
  const [isLoading, setIsLoading] = useState({
    courses: true,
    programOutcomes: false,
    batches: false,
    action: false,
  })
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses()
  }, [])

  // Fetch program outcomes when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchProgramOutcomes(Number.parseInt(selectedCourse))
      fetchBatches(Number.parseInt(selectedCourse))
    } else {
      setProgramOutcomes([])
      setBatches([])
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    setIsLoading((prev) => ({ ...prev, courses: true }))
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/courses/getAllCourses`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setCourses(data.data)
      } else {
        setError("Failed to fetch courses")
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError("Failed to fetch courses. Please try again later.")
    } finally {
      setIsLoading((prev) => ({ ...prev, courses: false }))
    }
  }

  const fetchProgramOutcomes = async (courseId: number) => {
    setIsLoading((prev) => ({ ...prev, programOutcomes: true }))
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/program-outcomes/course/${courseId}`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setProgramOutcomes(data.data)
      } else {
        setError("Failed to fetch program outcomes")
      }
    } catch (error) {
      console.error("Error fetching program outcomes:", error)
      setError("Failed to fetch program outcomes. Please try again later.")
    } finally {
      setIsLoading((prev) => ({ ...prev, programOutcomes: false }))
    }
  }

  const fetchBatches = async (courseId: number) => {
    setIsLoading((prev) => ({ ...prev, batches: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/batch/course/${courseId}`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setBatches(data.data)
      } else {
        console.error("Failed to fetch batches")
      }
    } catch (error) {
      console.error("Error fetching batches:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, batches: false }))
    }
  }

  const handleCreateProgramOutcome = async (data: { batchId: number; description: string }) => {
    if (!selectedCourse) return

    setIsLoading((prev) => ({ ...prev, action: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/program-outcomes/create`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: Number.parseInt(selectedCourse),
          batchId: data.batchId,
          description: data.description,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: "Program outcome created successfully",
        })
        fetchProgramOutcomes(Number.parseInt(selectedCourse))
        setIsCreateDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to create program outcome",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating program outcome:", error)
      toast({
        title: "Error",
        description: "Failed to create program outcome",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleUpdateProgramOutcome = async (data: { batchId: number; description: string }) => {
    if (!selectedOutcome) return

    setIsLoading((prev) => ({ ...prev, action: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/program-outcomes/${selectedOutcome.id}`, {
        credentials: "include", 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: Number.parseInt(selectedCourse),
          batchId: data.batchId,
          description: data.description,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: "Program outcome updated successfully",
        })
        fetchProgramOutcomes(Number.parseInt(selectedCourse))
        setIsEditDialogOpen(false)
        setSelectedOutcome(null)
      } else {
        toast({
          title: "Error",
          description: "Failed to update program outcome",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating program outcome:", error)
      toast({
        title: "Error",
        description: "Failed to update program outcome",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleDeleteProgramOutcome = async () => {
    if (!selectedOutcome) return

    setIsLoading((prev) => ({ ...prev, action: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/program-outcomes/${selectedOutcome.id}`, {
        credentials: "include",
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: "Program outcome deleted successfully",
        })
        fetchProgramOutcomes(Number.parseInt(selectedCourse))
        setIsDeleteDialogOpen(false)
        setSelectedOutcome(null)
      } else {
        toast({
          title: "Error",
          description: "Failed to delete program outcome",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting program outcome:", error)
      toast({
        title: "Error",
        description: "Failed to delete program outcome",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }))
    }
  }

  // Helper function to get attainment value from poAttainments array
  const getAttainmentValue = (outcome: ProgramOutcome): number | string => {
    if (!outcome.poAttainments || outcome.poAttainments.length === 0) {
      return "N/A";
    }
    
    return outcome.poAttainments[0].attainment;
  }
  
  // Helper function to determine badge color based on attainment value
  const getAttainmentBadgeVariant = (attainment: number | string): "default" | "secondary" | "destructive" => {
    if (attainment === "N/A") return "secondary";
    
    const numAttainment = Number(attainment);
    if (numAttainment >= 1.5) return "default"; // Good (green)
    if (numAttainment >= 0.5) return "secondary"; // Medium (gray)
    return "destructive"; // Poor (red)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Program Outcomes Management</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
          <CardDescription>Choose a course to view and manage its program outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading.courses ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full md:w-[400px]">
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
          )}
        </CardContent>
      </Card>

      {selectedCourse && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Program Outcomes</CardTitle>
              <CardDescription>Manage program outcomes for the selected course</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} disabled={isLoading.batches || batches.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Program Outcome
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading.programOutcomes ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : programOutcomes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Batch Year</TableHead>
                    <TableHead>Attainment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programOutcomes.map((outcome) => {
                    const attainmentValue = getAttainmentValue(outcome);
                    const badgeVariant = getAttainmentBadgeVariant(attainmentValue);
                    
                    return (
                      <TableRow key={outcome.id}>
                        <TableCell>{outcome.id}</TableCell>
                        <TableCell className="max-w-md">{outcome.description}</TableCell>
                        <TableCell>{outcome.batch.batchYear}</TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant}>
                            {typeof attainmentValue === "number" ? attainmentValue.toFixed(1) : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedOutcome(outcome)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedOutcome(outcome)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No program outcomes found for this course. Create one to get started.
              </div>
            )}
          </CardContent>
          
          {programOutcomes.length > 0 && (
            <div className="px-6 pb-4 flex gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-6 w-6"></Badge>
                <span className="text-sm">Good (≥ 1.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-6 w-6"></Badge>
                <span className="text-sm">Moderate (0.5 - 1.4)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="h-6 w-6"></Badge>
                <span className="text-sm">Poor (&lt; 0.5)</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Create Dialog */}
      <ProgramOutcomeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create Program Outcome"
        description="Add a new program outcome for the selected course"
        batches={batches}
        isLoading={isLoading.action}
        onSubmit={handleCreateProgramOutcome}
      />

      {/* Edit Dialog */}
      <ProgramOutcomeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Program Outcome"
        description="Update the program outcome details"
        batches={batches}
        isLoading={isLoading.action}
        onSubmit={handleUpdateProgramOutcome}
        defaultValues={
          selectedOutcome
            ? {
                batchId: selectedOutcome.batchId,
                description: selectedOutcome.description,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Program Outcome"
        description="Are you sure you want to delete this program outcome? This action cannot be undone."
        isLoading={isLoading.action}
        onConfirm={handleDeleteProgramOutcome}
      />
    </div>
  )
}