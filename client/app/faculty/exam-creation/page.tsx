// "use client"

// import { useState, useEffect } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"

// interface Subject {
//   id: number
//   subjectName: string
//   semesterId: number
//   semester: {
//     id: number
//     name: string
//   }
// }

// interface Unit {
//   id: number
//   unitNumber: number
//   description: string
// }

// interface ExamForm {
//   examType: string
//   subjectId: number
//   semesterId: number
//   questions: {
//     text: string
//     marksAllocated: number
//     unitId: number
//   }[]
// }

// export default function ExamCreationPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [units, setUnits] = useState<Unit[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const { register, control, handleSubmit, watch, setValue } = useForm<ExamForm>({
//     defaultValues: {
//       questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "questions",
//   })

//   const selectedSubjectId = watch("subjectId")

//   useEffect(() => {
//     fetchAssignedSubjects()
//   }, [])

//   useEffect(() => {
//     if (selectedSubjectId) {
//       fetchSubjectDetails(selectedSubjectId)
//     }
//   }, [selectedSubjectId])

//   const fetchAssignedSubjects = async () => {
//     try {
//       const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/faculty/get-assigned-subjects", {
//         credentials: "include",
//       })
//       if (!response.ok) throw new Error("Failed to fetch assigned subjects")
//       const result = await response.json()
//       if (result.success && Array.isArray(result.data)) {
//         setSubjects(result.data)
//       } else {
//         throw new Error("Invalid data format for assigned subjects")
//       }
//     } catch (err) {
//       setError("Failed to load assigned subjects. Please try again.")
//     }
//   }

//   const fetchSubjectDetails = async (subjectId: number) => {
//     try {
//       const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/subjects/getSubject/${subjectId}`)
//       if (!response.ok) throw new Error("Failed to fetch subject details")
//       const result = await response.json()
//       if (result.success && result.data) {
//         setUnits(result.data.units)
//         // Automatically set the semesterId based on the selected subject
//         setValue("semesterId", result.data.semesterId)
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
//         body: JSON.stringify(data),
//       })
//       if (!response.ok) throw new Error("Failed to create exam")
//       alert("Exam created successfully!")
//     } catch (err) {
//       setError("Failed to create exam. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create New Exam</h1>
//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Card className="mb-4">
//           <CardHeader>
//             <CardTitle>Exam Details</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="subjectId">Subject</Label>
//                 <Select
//                   onValueChange={(value) => {
//                     setValue("subjectId", Number(value))
//                     const selectedSubject = subjects.find((s) => s.id === Number(value))
//                     if (selectedSubject) {
//                       setValue("semesterId", selectedSubject.semesterId)
//                     }
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a subject" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {subjects.map((subject) => (
//                       <SelectItem key={subject.id} value={subject.id.toString()}>
//                         {subject.subjectName}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="examType">Exam Type</Label>
//                 <Input id="examType" {...register("examType", { required: true })} placeholder="e.g., CT1, Final" />
//               </div>
//               <div>
//                 <Label htmlFor="semesterId">Semester</Label>
//                 <Input
//                   id="semesterId"
//                   disabled
//                   value={subjects.find((s) => s.id === Number(selectedSubjectId))?.semester.name || ""}
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Questions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {fields.map((field, index) => (
//               <div key={field.id} className="mb-4 p-4 border rounded">
//                 <div className="mb-2">
//                   <Label htmlFor={`questions.${index}.text`}>Question Text</Label>
//                   <Input
//                     id={`questions.${index}.text`}
//                     {...register(`questions.${index}.text`, { required: true })}
//                     placeholder="Enter question text"
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
//                   <div>
//                     <Label htmlFor={`questions.${index}.marksAllocated`}>Marks Allocated</Label>
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
//           </CardContent>
//         </Card>

//         <Button type="submit" className="mt-4" disabled={loading}>
//           {loading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Creating Exam...
//             </>
//           ) : (
//             "Create Exam"
//           )}
//         </Button>
//       </form>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AssignedSubject {
  id: number
  subject: {
    id: number
    name: string
    code: string
  }
  course: {
    id: number
    name: string
  }
  batch: {
    id: number
    year: number
  }
  semester: number
}

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
    course: {
      id: number
      courseName: string
    }
  }[]
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

export default function ExamCreationPage() {
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>([])
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, control, handleSubmit, watch, setValue } = useForm<ExamForm>({
    defaultValues: {
      questions: [{ text: "", marksAllocated: 0, unitId: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const selectedSubjectId = watch("subjectId")

  useEffect(() => {
    fetchAssignedSubjects()
  }, [])

  useEffect(() => {
    if (selectedSubjectId) {
      fetchSubjectDetails(selectedSubjectId)
    }
  }, [selectedSubjectId])

  const fetchAssignedSubjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/faculty/get-assigned-subjects`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch assigned subjects")
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setAssignedSubjects(result.data)
        //console.log("assigned subjects",result.data)
      } else {
        throw new Error("Invalid data format for assigned subjects")
      }
    } catch (err) {
      setError("Failed to load assigned subjects. Please try again.")
    }
  }

  const fetchSubjectDetails = async (subjectId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/subjects/${subjectId}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch subject details")
      const result = await response.json()
      if (result.success && result.data) {
        setSubjectDetail(result.data)
        
        // Find the semester for the selected subject
        const assignedSubject = assignedSubjects.find(
          (item) => item.subject.id === subjectId
        )
        
        if (assignedSubject) {
          setValue("semesterId", assignedSubject.semester)
        }
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create exam")
      alert("Exam created successfully!")
    } catch (err) {
      setError("Failed to create exam. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Exam</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subjectId">Subject</Label>
                <Select
                  onValueChange={(value) => {
                    const subjectId = Number(value)
                    setValue("subjectId", subjectId)
                    
                    // Find the semester for the selected subject
                    const assignedSubject = assignedSubjects.find(
                      (item) => item.subject.id === subjectId
                    )
                    
                    if (assignedSubject) {
                      setValue("semesterId", assignedSubject.semester)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedSubjects.map((item) => (
                      <SelectItem key={item.id} value={item.subject.id.toString()}>
                        {item.subject.name} ({item.subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Input id="examType" {...register("examType", { required: true })} placeholder="e.g., CT1, Final" />
              </div>
              <div>
                <Label htmlFor="semesterId">Semester</Label>
                <Input
                  id="semesterId"
                  disabled
                  value={
                    selectedSubjectId
                      ? `Semester ${assignedSubjects.find((item) => item.subject.id === selectedSubjectId)?.semester || ""}`
                      : ""
                  }
                />
                <Input
                  type="hidden"
                  {...register("semesterId", { required: true, valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  disabled
                  value={
                    selectedSubjectId
                      ? assignedSubjects.find((item) => item.subject.id === selectedSubjectId)?.course.name || ""
                      : ""
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border rounded">
                <div className="mb-2">
                  <Label htmlFor={`questions.${index}.text`}>Question Text</Label>
                  <Input
                    id={`questions.${index}.text`}
                    {...register(`questions.${index}.text`, { required: true })}
                    placeholder="Enter question text"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label htmlFor={`questions.${index}.marksAllocated`}>Marks Allocated</Label>
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
                >
                  Remove Question
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ text: "", marksAllocated: 0, unitId: 0 })}>
              Add Question
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Exam...
            </>
          ) : (
            "Create Exam"
          )}
        </Button>
      </form>
    </div>
  )
}