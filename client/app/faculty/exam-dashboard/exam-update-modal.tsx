// "use client"

// import { useState, useEffect } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// interface Question {
//   id?: number
//   text: string
//   marksAllocated: number
//   unitId: number
// }

// interface Exam {
//   id: number
//   examType: string
//   subjectId: number
//   semesterId: number
//   questions: Question[]
// }

// interface Unit {
//   id: number
//   unitNumber: number
//   description: string
// }

// interface ExamUpdateModalProps {
//   isOpen: boolean
//   onClose: () => void
//   exam: Exam
//   onUpdate: () => void
// }

// export function ExamUpdateModal({ isOpen, onClose, exam, onUpdate }: ExamUpdateModalProps) {
//   const [units, setUnits] = useState<Unit[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const { register, control, handleSubmit, reset, setValue } = useForm<Exam>({
//     defaultValues: {
//       ...exam,
//       questions: exam.questions.map((q) => ({
//         id: q.id,
//         text: q.questionText,
//         marksAllocated: q.marksAllocated,
//         unitId: q.unitId,
//       })),
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "questions",
//   })

//   useEffect(() => {
//     if (isOpen) {
//       fetchSubjectDetails(exam.subjectId)
//     }
//   }, [isOpen, exam.subjectId])

//   const fetchSubjectDetails = async (subjectId: number) => {
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/${subjectId}`)
//       if (!response.ok) throw new Error("Failed to fetch subject details")
//       const result = await response.json()
//       if (result.success && result.data) {
//         setUnits(result.data.units)
//       } else {
//         throw new Error("Invalid data format for subject details")
//       }
//     } catch (err) {
//       setError("Failed to load subject details. Please try again.")
//     }
//   }

//   const onSubmit = async (data: Exam) => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/exams/${exam.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })
//       if (!response.ok) throw new Error("Failed to update exam")
//       alert("Exam updated successfully!")
//       onUpdate()
//       onClose()
//     } catch (err) {
//       setError("Failed to update exam. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

// return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Update Exam</DialogTitle>
//         </DialogHeader>
//         {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="examType" className="text-right">
//                 Exam Type
//               </Label>
//               <Input id="examType" className="col-span-3" {...register("examType", { required: true })} />
//             </div>
//           </div>

//           <div className="space-y-4">
//             {fields.map((field, index) => (
//               <div key={field.id} className="space-y-2">
//                 <Label htmlFor={`questions.${index}.text`}>Question {index + 1}</Label>
//                 <Input id={`questions.${index}.text`} {...register(`questions.${index}.text`, { required: true })} />
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <Label htmlFor={`questions.${index}.marksAllocated`}>Marks</Label>
//                     <Input
//                       id={`questions.${index}.marksAllocated`}
//                       type="number"
//                       {...register(`questions.${index}.marksAllocated`, { required: true, valueAsNumber: true })}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor={`questions.${index}.unitId`}>Unit</Label>
//                     <Select
//                       onValueChange={(value) => {
//                         setValue(`questions.${index}.unitId`, parseInt(value, 10))
//                       }}
//                       value={field.unitId?.toString()}
//                       defaultValue={field.unitId?.toString()}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a unit" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {units.map((unit) => (
//                           <SelectItem key={unit.id} value={unit.id.toString()}>
//                             {unit.unitNumber} - {unit.description}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <Button type="button" variant="destructive" onClick={() => remove(index)}>
//                   Remove Question
//                 </Button>
//               </div>
//             ))}
//             <Button type="button" onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 })}>
//               Add Question
//             </Button>
//           </div>

//           <div className="mt-4 flex justify-end space-x-2">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update Exam"
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Question {
  id?: number
  text: string
  marksAllocated: number
  unitId: number
}

interface Exam {
  id: number
  examType: string
  subjectId: number
  semesterId?: number
  marksAllocated: number
  questions?: Question[]
}

interface Unit {
  id: number
  unitNumber: number
  description: string
}

interface ExamUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  exam: Exam
  onUpdate: () => void
}

// Define exam types arrays
const EXAM_TYPES_WITH_QUESTIONS = ["CT1", "CT2", "CA", "ESE"];
const INTERNAL_ASSESSMENT_TYPES = ["DHA", "AA", "ATT"];

export function ExamUpdateModal({ isOpen, onClose, exam, onUpdate }: ExamUpdateModalProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalMarks, setTotalMarks] = useState(0)

  // Determine if exam has questions based on exam type
  const hasQuestions = EXAM_TYPES_WITH_QUESTIONS.includes(exam.examType)

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<Exam>({
    defaultValues: {
      ...exam,
      marksAllocated: exam.marksAllocated || 0,
      questions: hasQuestions ? 
        (exam.questions?.map(q => ({
          id: q.id,
          text: q.questionText || q.text, // Handle both property names
          marksAllocated: q.marksAllocated,
          unitId: q.unitId,
        })) || []) : undefined,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // Watch all questions to calculate total marks
  const questions = watch("questions");
  const marksAllocated = watch("marksAllocated");
  
  useEffect(() => {
    if (hasQuestions && questions) {
      const sum = questions.reduce((total, q) => total + (q.marksAllocated || 0), 0);
      setTotalMarks(sum);
    }
  }, [questions, hasQuestions]);

  useEffect(() => {
    if (isOpen) {
      fetchSubjectDetails(exam.subjectId)
    }
  }, [isOpen, exam.subjectId])

  const fetchSubjectDetails = async (subjectId: number) => {
    try {
      const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/${subjectId}`)
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

  const onSubmit = async (data: Exam) => {
    setLoading(true)
    setError(null)
    
    try {
      // Prepare request payload based on exam type
      const payload = hasQuestions ? {
        examType: data.examType,
        subjectId: data.subjectId,
        marksAllocated: totalMarks, // Use calculated total
        questions: data.questions
      } : {
        examType: data.examType,
        subjectId: data.subjectId,
        marksAllocated: data.marksAllocated
      };

      const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/exams/${exam.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) throw new Error("Failed to update exam")
      
      alert("Exam updated successfully!")
      onUpdate()
      onClose()
    } catch (err) {
      setError("Failed to update exam. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Exam</DialogTitle>
        </DialogHeader>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examType" className="text-right">
                Exam Type
              </Label>
              <Input id="examType" className="col-span-3" {...register("examType", { required: true })} />
            </div>

            {!hasQuestions && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marksAllocated" className="text-right">
                  Marks Allocated
                </Label>
                <Input 
                  id="marksAllocated" 
                  type="number" 
                  className="col-span-3" 
                  {...register("marksAllocated", { required: !hasQuestions, valueAsNumber: true })} 
                />
              </div>
            )}
          </div>

          {hasQuestions && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Questions</h3>
                <div className="text-sm">Total Marks: {totalMarks}</div>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 border p-3 rounded-md">
                  <Label htmlFor={`questions.${index}.text`}>Question {index + 1}</Label>
                  <Input id={`questions.${index}.text`} {...register(`questions.${index}.text`, { required: true })} />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`questions.${index}.marksAllocated`}>Marks</Label>
                      <Input
                        id={`questions.${index}.marksAllocated`}
                        type="number"
                        {...register(`questions.${index}.marksAllocated`, { required: true, valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`questions.${index}.unitId`}>Unit</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue(`questions.${index}.unitId`, parseInt(value, 10))
                        }}
                        value={field.unitId?.toString()}
                        defaultValue={field.unitId?.toString()}
                      >
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
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => remove(index)}
                    className="mt-2"
                  >
                    Remove Question
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 })}
                className="w-full"
              >
                Add Question
              </Button>
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Exam"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}