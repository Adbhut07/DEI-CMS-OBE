"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SubjectDetail {
  id: number
  subjectName: string
  subjectCode: string
  units: {
    id: number
    unitNumber: number
    description: string
    subjectId: number
    attainment: number
    createdAt: string
    updatedAt: string
  }[]
  courseMappings: {
    id: number
    courseId: number
    subjectId: number
    semester: number
    facultyId: number
    batchId: number
    course: {
      id: number
      courseName: string
    }
    faculty: {
      id: number
      name: string
      email: string
      role: string
    }
  }[]
}

interface ExamForm {
  examType: string
  subjectId: number
  questions: {
    text: string
    marksAllocated: number
    unitId: number
  }[]
}

interface SubjectProps {
  id: number
  name: string
  code: string
  semester: number
  courseId: number
  courseName: string
  batchId: number
  batchYear: number
}

interface ExamCreationModalProps {
  isOpen: boolean
  onClose: () => void
  subject: SubjectProps
}

export function ExamCreationModal({ isOpen, onClose, subject }: ExamCreationModalProps) {
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, control, handleSubmit, reset, setValue } = useForm<ExamForm>({
    defaultValues: {
      examType: "",
      subjectId: subject.id,
      questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  useEffect(() => {
    if (isOpen) {
      fetchSubjectDetails(subject.id)
      // Reset form with new subject ID when modal opens
      reset({
        examType: "",
        subjectId: subject.id,
        questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
      })
    }
  }, [isOpen, subject.id, reset])

  const fetchSubjectDetails = async (subjectId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/subjects/${subjectId}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch subject details")
      const result = await response.json()
      if (result.success && result.data) {
        setSubjectDetail(result.data)
      } else {
        throw new Error("Invalid data format for subject details")
      }
    } catch (err) {
      setError("Failed to load subject details. Please try again.")
    }
  }

  const onSubmit = async (data: ExamForm) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8000/api/v1/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create exam")
      alert("Exam created successfully!")
      reset()
      onClose()
    } catch (err) {
      setError("Failed to create exam. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examType" className="text-right">
                Exam Type
              </Label>
              <Input
                id="examType"
                className="col-span-3"
                {...register("examType", { required: true })}
                placeholder="e.g., CT1, Final"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input 
                id="subject" 
                className="col-span-3" 
                disabled 
                value={`${subject.name} (${subject.code})`} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Input 
                id="course" 
                className="col-span-3" 
                disabled 
                value={subject.courseName} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Input 
                id="semester" 
                className="col-span-3" 
                disabled 
                value={`Semester ${subject.semester}`} 
              />
            </div>
            <Input 
              type="hidden" 
              {...register("subjectId", { required: true, valueAsNumber: true })} 
              value={subject.id}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Questions</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded space-y-3">
                <Label htmlFor={`questions.${index}.text`}>Question {index + 1}</Label>
                <Input
                  id={`questions.${index}.text`}
                  {...register(`questions.${index}.text`, { required: true })}
                  placeholder="Enter question text"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`questions.${index}.marksAllocated`}>Marks</Label>
                    <Input
                      id={`questions.${index}.marksAllocated`}
                      type="number"
                      {...register(`questions.${index}.marksAllocated`, { required: true, valueAsNumber: true })}
                      placeholder="Enter marks"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`questions.${index}.unitId`}>Unit</Label>
                    <Select onValueChange={(value) => setValue(`questions.${index}.unitId`, Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectDetail?.units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id.toString()}>
                            Unit {unit.unitNumber} - {unit.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => fields.length > 1 && remove(index)}
                  disabled={fields.length <= 1}
                  size="sm"
                >
                  Remove Question
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 })}>
              Add Question
            </Button>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Exam"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}