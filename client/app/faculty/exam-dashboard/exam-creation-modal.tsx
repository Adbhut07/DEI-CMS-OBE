// "use client"

// import { useState, useEffect } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// interface SubjectDetail {
//   id: number
//   subjectName: string
//   subjectCode: string
//   units: {
//     id: number
//     unitNumber: number
//     description: string
//     subjectId: number
//     attainment: number
//     createdAt: string
//     updatedAt: string
//   }[]
//   courseMappings: {
//     id: number
//     courseId: number
//     subjectId: number
//     semester: number
//     facultyId: number
//     batchId: number
//     course: {
//       id: number
//       courseName: string
//     }
//     faculty: {
//       id: number
//       name: string
//       email: string
//       role: string
//     }
//   }[]
// }

// interface ExamForm {
//   examType: string
//   subjectId: number
//   questions: {
//     text: string
//     marksAllocated: number
//     unitId: number
//   }[]
// }

// interface SubjectProps {
//   id: number
//   name: string
//   code: string
//   semester: number
//   courseId: number
//   courseName: string
//   batchId: number
//   batchYear: number
// }

// interface ExamCreationModalProps {
//   isOpen: boolean
//   onClose: () => void
//   subject: SubjectProps
// }

// export function ExamCreationModal({ isOpen, onClose, subject }: ExamCreationModalProps) {
//   const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const { register, control, handleSubmit, reset, setValue } = useForm<ExamForm>({
//     defaultValues: {
//       examType: "",
//       subjectId: subject.id,
//       questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "questions",
//   })

//   useEffect(() => {
//     if (isOpen) {
//       fetchSubjectDetails(subject.id)
//       // Reset form with new subject ID when modal opens
//       reset({
//         examType: "",
//         subjectId: subject.id,
//         questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
//       })
//     }
//   }, [isOpen, subject.id, reset])

//   const fetchSubjectDetails = async (subjectId: number) => {
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/${subjectId}`, {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch subject details")
//       const result = await response.json()
//       if (result.success && result.data) {
//         setSubjectDetail(result.data)
//       } else {
//         throw new Error("Invalid data format for subject details")
//       }
//     } catch (err) {
//       setError("Failed to load subject details. Please try again.")
//     }
//   }

//   const onSubmit = async (data: ExamForm) => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/exams", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(data),
//       })
//       if (!response.ok) throw new Error("Failed to create exam")
//       alert("Exam created successfully!")
//       reset()
//       onClose()
//     } catch (err) {
//       setError("Failed to create exam. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New Exam</DialogTitle>
//         </DialogHeader>
//         {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="examType" className="text-right">
//                 Exam Type
//               </Label>
//               <Input
//                 id="examType"
//                 className="col-span-3"
//                 {...register("examType", { required: true })}
//                 placeholder="e.g., CT1, Final"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="subject" className="text-right">
//                 Subject
//               </Label>
//               <Input 
//                 id="subject" 
//                 className="col-span-3" 
//                 disabled 
//                 value={`${subject.name} (${subject.code})`} 
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="course" className="text-right">
//                 Course
//               </Label>
//               <Input 
//                 id="course" 
//                 className="col-span-3" 
//                 disabled 
//                 value={subject.courseName} 
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="semester" className="text-right">
//                 Semester
//               </Label>
//               <Input 
//                 id="semester" 
//                 className="col-span-3" 
//                 disabled 
//                 value={`Semester ${subject.semester}`} 
//               />
//             </div>
//             <Input 
//               type="hidden" 
//               {...register("subjectId", { required: true, valueAsNumber: true })} 
//               value={subject.id}
//             />
//           </div>

//           <div className="space-y-4">
//             <h3 className="font-medium text-lg">Questions</h3>
//             {fields.map((field, index) => (
//               <div key={field.id} className="p-3 border rounded space-y-3">
//                 <Label htmlFor={`questions.${index}.text`}>Question {index + 1}</Label>
//                 <Input
//                   id={`questions.${index}.text`}
//                   {...register(`questions.${index}.text`, { required: true })}
//                   placeholder="Enter question text"
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor={`questions.${index}.marksAllocated`}>Marks</Label>
//                     <Input
//                       id={`questions.${index}.marksAllocated`}
//                       type="number"
//                       {...register(`questions.${index}.marksAllocated`, { required: true, valueAsNumber: true })}
//                       placeholder="Enter marks"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor={`questions.${index}.unitId`}>Unit</Label>
//                     <Select onValueChange={(value) => setValue(`questions.${index}.unitId`, Number(value))}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a unit" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {subjectDetail?.units.map((unit) => (
//                           <SelectItem key={unit.id} value={unit.id.toString()}>
//                             Unit {unit.unitNumber} - {unit.description}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <Button 
//                   type="button" 
//                   variant="destructive" 
//                   onClick={() => fields.length > 1 && remove(index)}
//                   disabled={fields.length <= 1}
//                   size="sm"
//                 >
//                   Remove Question
//                 </Button>
//               </div>
//             ))}
//             <Button type="button" onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 })}>
//               Add Question
//             </Button>
//           </div>

//           <div className="mt-6 flex justify-end space-x-2">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Exam"
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// // Define exam types arrays to match your controller
// const EXAM_TYPES_WITH_QUESTIONS = ["CT1", "CT2", "CA", "ESE"];
// const INTERNAL_ASSESSMENT_TYPES = ["DHA", "AA", "ATT"];
// const ALL_EXAM_TYPES = [...EXAM_TYPES_WITH_QUESTIONS, ...INTERNAL_ASSESSMENT_TYPES];

// interface SubjectDetail {
//   id: number
//   subjectName: string
//   subjectCode: string
//   units: {
//     id: number
//     unitNumber: number
//     description: string
//     subjectId: number
//     attainment: number
//     createdAt: string
//     updatedAt: string
//   }[]
//   courseMappings: {
//     id: number
//     courseId: number
//     subjectId: number
//     semester: number
//     facultyId: number
//     batchId: number
//     course: {
//       id: number
//       courseName: string
//     }
//     faculty: {
//       id: number
//       name: string
//       email: string
//       role: string
//     }
//   }[]
// }

// // Modify the ExamForm to handle both types of exams
// interface ExamForm {
//   examType: string
//   subjectId: number
//   questions: 
//     | {
//         text: string
//         marksAllocated: number
//         unitId: number
//       }[]
//     | {
//         totalMarks: number
//       }
// }

// interface SubjectProps {
//   id: number
//   name: string
//   code: string
//   semester: number
//   courseId: number
//   courseName: string
//   batchId: number
//   batchYear: number
// }

// interface ExamCreationModalProps {
//   isOpen: boolean
//   onClose: () => void
//   subject: SubjectProps
// }

// export function ExamCreationModal({ isOpen, onClose, subject }: ExamCreationModalProps) {
//   const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedExamType, setSelectedExamType] = useState<string>("")
//   const [isInternalAssessment, setIsInternalAssessment] = useState<boolean>(false)

//   // Initialize form with default values
//   const { register, control, handleSubmit, reset, setValue, watch } = useForm<ExamForm>({
//     defaultValues: {
//       examType: "",
//       subjectId: subject.id,
//       questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "questions" as any, // Type assertion to handle the union type
//   })

//   const watchExamType = watch("examType")

//   // Effect to reset form when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       fetchSubjectDetails(subject.id)
//       // Reset form with new subject ID when modal opens
//       reset({
//         examType: "",
//         subjectId: subject.id,
//         questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
//       })
//       setSelectedExamType("")
//       setIsInternalAssessment(false)
//     }
//   }, [isOpen, subject.id, reset])

//   // Effect to handle exam type changes
//   useEffect(() => {
//     const examType = watchExamType;
    
//     if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
//       setIsInternalAssessment(true)
//       // Reset questions to totalMarks format for internal assessment
//       reset({
//         examType,
//         subjectId: subject.id,
//         questions: { totalMarks: 50 } // Default to 50 marks
//       }, { keepValues: true })
//     } else if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
//       setIsInternalAssessment(false)
//       // Reset questions to array format for regular exams
//       if (!Array.isArray(watch("questions"))) {
//         reset({
//           examType,
//           subjectId: subject.id,
//           questions: [{ text: "", marksAllocated: 0, unitId: 0 }]
//         }, { keepValues: true })
//       }
//     }
    
//     setSelectedExamType(examType)
//   }, [watchExamType, reset, subject.id, watch])

//   const fetchSubjectDetails = async (subjectId: number) => {
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/${subjectId}`, {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch subject details")
//       const result = await response.json()
//       if (result.success && result.data) {
//         setSubjectDetail(result.data)
//       } else {
//         throw new Error("Invalid data format for subject details")
//       }
//     } catch (err) {
//       setError("Failed to load subject details. Please try again.")
//     }
//   }

//   const onSubmit = async (data: ExamForm) => {
//     setLoading(true)
//     setError(null)
//     try {
//       // Ensure the request body matches the format expected by the controller
//       const requestBody = {
//         examType: data.examType,
//         subjectId: data.subjectId,
//         questions: isInternalAssessment 
//           ? { totalMarks: (data.questions as { totalMarks: number }).totalMarks }
//           : data.questions
//       }

//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/exams", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(requestBody),
//       })
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to create exam")
//       }
      
//       alert("Exam created successfully!")
//       reset()
//       onClose()
//     } catch (err: any) {
//       setError(err.message || "Failed to create exam. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New Exam</DialogTitle>
//         </DialogHeader>
//         {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="examType" className="text-right">
//                 Exam Type
//               </Label>
//               <div className="col-span-3">
//                 <Select 
//                   onValueChange={(value) => setValue("examType", value)}
//                   value={watchExamType}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select exam type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {ALL_EXAM_TYPES.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="subject" className="text-right">
//                 Subject
//               </Label>
//               <Input 
//                 id="subject" 
//                 className="col-span-3" 
//                 disabled 
//                 value={`${subject.name} (${subject.code})`} 
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="course" className="text-right">
//                 Course
//               </Label>
//               <Input 
//                 id="course" 
//                 className="col-span-3" 
//                 disabled 
//                 value={subject.courseName} 
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="semester" className="text-right">
//                 Semester
//               </Label>
//               <Input 
//                 id="semester" 
//                 className="col-span-3" 
//                 disabled 
//                 value={`Semester ${subject.semester}`} 
//               />
//             </div>
//             <Input 
//               type="hidden" 
//               {...register("subjectId", { required: true, valueAsNumber: true })} 
//               value={subject.id}
//             />
//           </div>

//           {selectedExamType && (
//             <div className="space-y-4">
//               {isInternalAssessment ? (
//                 // Internal assessment exam form (DHA, AA, ATT)
//                 <div className="p-3 border rounded space-y-3">
//                   <h3 className="font-medium text-lg">Internal Assessment</h3>
//                   <div>
//                     <Label htmlFor="totalMarks">Total Marks</Label>
//                     <Input
//                       id="totalMarks"
//                       type="number"
//                       {...register("questions.totalMarks" as any, { 
//                         required: true, 
//                         valueAsNumber: true,
//                         min: 1
//                       })}
//                       placeholder="Enter total marks"
//                     />
//                     <p className="text-sm text-gray-500 mt-1">
//                       Marks will be automatically distributed across all units of the subject.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 // Regular exam form (CT1, CT2, CA, ESE)
//                 <>
//                   <h3 className="font-medium text-lg">Questions</h3>
//                   {fields.map((field, index) => (
//                     <div key={field.id} className="p-3 border rounded space-y-3">
//                       <Label htmlFor={`questions.${index}.text`}>Question {index + 1}</Label>
//                       <Input
//                         id={`questions.${index}.text`}
//                         {...register(`questions.${index}.text` as any, { required: true })}
//                         placeholder="Enter question text"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor={`questions.${index}.marksAllocated`}>Marks</Label>
//                           <Input
//                             id={`questions.${index}.marksAllocated`}
//                             type="number"
//                             {...register(`questions.${index}.marksAllocated` as any, { 
//                               required: true, 
//                               valueAsNumber: true,
//                               min: 1
//                             })}
//                             placeholder="Enter marks"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor={`questions.${index}.unitId`}>Unit</Label>
//                           <Select 
//                             onValueChange={(value) => setValue(`questions.${index}.unitId` as any, Number(value))}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a unit" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {subjectDetail?.units.map((unit) => (
//                                 <SelectItem key={unit.id} value={unit.id.toString()}>
//                                   Unit {unit.unitNumber} - {unit.description}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                       <Button 
//                         type="button" 
//                         variant="destructive" 
//                         onClick={() => fields.length > 1 && remove(index)}
//                         disabled={fields.length <= 1}
//                         size="sm"
//                       >
//                         Remove Question
//                       </Button>
//                     </div>
//                   ))}
//                   <Button 
//                     type="button" 
//                     onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 } as any)}
//                   >
//                     Add Question
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}

//           <div className="mt-6 flex justify-end space-x-2">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               disabled={loading || !selectedExamType}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Exam"
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
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Define exam types arrays to match your controller
const EXAM_TYPES_WITH_QUESTIONS = ["CT1", "CT2", "CA", "ESE"];
const INTERNAL_ASSESSMENT_TYPES = ["DHA", "AA", "ATT"];
const ALL_EXAM_TYPES = [...EXAM_TYPES_WITH_QUESTIONS, ...INTERNAL_ASSESSMENT_TYPES];

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

// Updated exam form interface
interface ExamForm {
  examType: string
  subjectId: number
  marksAllocated: number
  questions?: {
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
  const [selectedExamType, setSelectedExamType] = useState<string>("")
  const [isInternalAssessment, setIsInternalAssessment] = useState<boolean>(false)
  const [questions, setQuestions] = useState<{ text: string; marksAllocated: number; unitId: number }[]>([
    { text: "", marksAllocated: 0, unitId: 0 }
  ])

  // Initialize form with default values
  const { register, handleSubmit, reset, setValue, watch } = useForm<ExamForm>({
    defaultValues: {
      examType: "",
      subjectId: subject.id,
      marksAllocated: 40,
    },
  })

  const watchExamType = watch("examType")

  // Effect to reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSubjectDetails(subject.id)
      // Reset form with new subject ID when modal opens
      reset({
        examType: "",
        subjectId: subject.id,
        marksAllocated: 40,
      })
      setQuestions([{ text: "", marksAllocated: 0, unitId: 0 }])
      setSelectedExamType("")
      setIsInternalAssessment(false)
    }
  }, [isOpen, subject.id, reset])

  // Effect to handle exam type changes
  useEffect(() => {
    const examType = watchExamType;
    
    if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
      setIsInternalAssessment(true)
    } else if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
      setIsInternalAssessment(false)
    }
    
    setSelectedExamType(examType)
  }, [watchExamType])

  const fetchSubjectDetails = async (subjectId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/subjects/${subjectId}`, {
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

  const addQuestion = () => {
    setQuestions([...questions, { text: "", marksAllocated: 0, unitId: 0 }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions]
      newQuestions.splice(index, 1)
      setQuestions(newQuestions)
    }
  }

  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions]
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: field === 'unitId' || field === 'marksAllocated' ? Number(value) : value
    }
    setQuestions(newQuestions)
  }

  const onSubmit = async (data: ExamForm) => {
    setLoading(true)
    setError(null)
    try {
      // Prepare request body based on exam type
      const requestBody: any = {
        examType: data.examType,
        subjectId: data.subjectId,
        marksAllocated: data.marksAllocated
      }

      // Only add questions for exam types that require them
      if (!isInternalAssessment) {
        // Validate questions before sending
        const validQuestions = questions.filter(q => 
          q.text.trim() !== "" && q.marksAllocated > 0 && q.unitId > 0
        )
        
        if (validQuestions.length === 0) {
          throw new Error("Please add at least one valid question with text, marks, and unit.")
        }
        
        requestBody.questions = validQuestions
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create exam")
      }
      
      alert("Exam created successfully!")
      reset()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to create exam. Please try again.")
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
              <div className="col-span-3">
                <Select 
                  onValueChange={(value) => setValue("examType", value)}
                  value={watchExamType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marksAllocated" className="text-right">
                Total Marks
              </Label>
              <Input 
                id="marksAllocated" 
                className="col-span-3"
                type="number"
                {...register("marksAllocated", { required: true, valueAsNumber: true, min: 1 })}
                placeholder="Enter total marks for the exam"
              />
            </div>
            <Input 
              type="hidden" 
              {...register("subjectId", { required: true, valueAsNumber: true })} 
              value={subject.id}
            />
          </div>

          {selectedExamType && !isInternalAssessment && (
            <div className="space-y-4 mt-4">
              <h3 className="font-medium text-lg">Questions</h3>
              {questions.map((question, index) => (
                <div key={index} className="p-3 border rounded space-y-3">
                  <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                  <Input
                    id={`question-${index}`}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    placeholder="Enter question text"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`marks-${index}`}>Marks</Label>
                      <Input
                        id={`marks-${index}`}
                        type="number"
                        value={question.marksAllocated}
                        onChange={(e) => handleQuestionChange(index, 'marksAllocated', e.target.value)}
                        placeholder="Enter marks"
                        min={1}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`unit-${index}`}>Unit</Label>
                      <Select 
                        value={question.unitId > 0 ? question.unitId.toString() : undefined}
                        onValueChange={(value) => handleQuestionChange(index, 'unitId', value)}
                      >
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
                    onClick={() => removeQuestion(index)}
                    disabled={questions.length <= 1}
                    size="sm"
                  >
                    Remove Question
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </div>
          )}

          {selectedExamType && isInternalAssessment && (
            <div className="p-3 border rounded my-4">
              <p className="text-sm text-gray-500">
                For {selectedExamType}, the total marks will be used for the entire assessment. 
                No individual questions are required.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedExamType}
            >
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