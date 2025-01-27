"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Subject {
  id: number
  subjectName: string
  semesterId: number
  semester: {
    id: number
    name: string
  }
}

interface Unit {
  id: number
  unitNumber: number
  description: string
}

interface ExamForm {
  examType: string
  subjectId: number
  semesterId: number
  questions: {
    text: string
    marksAllocated: number
    unitId: number
  }[]
}

interface ExamCreationModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject
}

export function ExamCreationModal({ isOpen, onClose, subject }: ExamCreationModalProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, control, handleSubmit, reset, setValue } = useForm<ExamForm>({
    defaultValues: {
      examType: "",
      subjectId: subject.id,
      semesterId: subject.semesterId,
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
    }
  }, [isOpen, subject.id])

  const fetchSubjectDetails = async (subjectId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/subjects/getSubject/${subjectId}`)
      if (!response.ok) throw new Error("Failed to fetch subject details")
      const result = await response.json()
      if (result.success && result.data) {
        setUnits(result.data.units)
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Input id="semester" className="col-span-3" disabled value={subject.semester.name} />
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`questions.${index}.text`}>Question {index + 1}</Label>
                <Input
                  id={`questions.${index}.text`}
                  {...register(`questions.${index}.text`, { required: true })}
                  placeholder="Enter question text"
                />
                <div className="grid grid-cols-2 gap-2">
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
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id.toString()}>
                            {unit.unitNumber} - {unit.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  Remove Question
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 })}>
              Add Question
            </Button>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
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

