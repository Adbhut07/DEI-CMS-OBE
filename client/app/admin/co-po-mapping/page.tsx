// "use client"

// import { useState, useEffect } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2 } from "lucide-react"

// interface Course {
//   id: number
//   courseName: string
// }

// interface ProgramOutcome {
//   id: number
//   courseId: number
//   description: string
//   poAttainments: {
//     id: number
//     poId: number
//     attainment: number
//   }[]
// }

// interface CourseOutcome {
//   id: number
//   unitNumber: number
//   description: string
//   subjectId: number
//   attainment: number
//   subject: {
//     id: number
//     subjectName: string
//     subjectCode: string
//   }
// }

// interface MappingCell {
//   coId: number
//   poId: number
//   weightage: number
// }

// // New interface for the API response
// interface MappingData {
//   programOutcome: {
//     id: number
//     description: string
//     batch: {
//       id: number
//       batchYear: number
//     }
//   }
//   courseOutcome: {
//     id: number
//     unitNumber: number
//     description: string
//     subject: {
//       id: number
//       name: string
//       code: string
//     }
//   }
//   weightage: number
// }

// export default function COPOMapping() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
//   const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([])
//   const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcome[]>([])
//   const [loading, setLoading] = useState(true)
//   const [loadingData, setLoadingData] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [mapping, setMapping] = useState<MappingCell[]>([])
//   const [existingMappings, setExistingMappings] = useState<MappingData[]>([])

//   useEffect(() => {
//     fetchCourses()
//   }, [])

//   useEffect(() => {
//     if (selectedCourseId) {
//       fetchProgramOutcomes(selectedCourseId)
//       fetchCourseOutcomes(selectedCourseId)
//       fetchExistingMappings(selectedCourseId)
//     }
//   }, [selectedCourseId])

//   useEffect(() => {
//     if (courseOutcomes.length > 0 && programOutcomes.length > 0 && existingMappings.length > 0) {
//       initializeMappingFromExisting()
//     } else if (courseOutcomes.length > 0 && programOutcomes.length > 0) {
//       initializeMapping()
//     }
//   }, [courseOutcomes, programOutcomes, existingMappings])

//   const fetchCourses = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("http://localhost:8000/api/v1/courses/getAllCourses", {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setCourses(data.data)
//       } else {
//         setError("Failed to fetch courses")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchProgramOutcomes = async (courseId: number) => {
//     try {
//       setLoadingData(true)
//       const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/course/${courseId}`, {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setProgramOutcomes(data.data)
//       } else {
//         setError("Failed to fetch program outcomes")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   const fetchCourseOutcomes = async (courseId: number) => {
//     try {
//       setLoadingData(true)
//       const response = await fetch(`http://localhost:8000/api/v1/units/course/${courseId}`, {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setCourseOutcomes(data.data)
//       } else {
//         setError("Failed to fetch course outcomes")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   // New function to fetch existing CO-PO mappings
//   const fetchExistingMappings = async (courseId: number) => {
//     try {
//       setLoadingData(true)
//       const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/co-po-mappings/course/${courseId}`, {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setExistingMappings(data.data)
//       } else {
//         setError("Failed to fetch existing mappings")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   const initializeMapping = () => {
//     const initialMapping: MappingCell[] = []

//     courseOutcomes.forEach((co) => {
//       programOutcomes.forEach((po) => {
//         initialMapping.push({
//           coId: co.id,
//           poId: po.id,
//           weightage: 0,
//         })
//       })
//     })

//     setMapping(initialMapping)
//   }

//   // New function to initialize mapping from existing data
//   const initializeMappingFromExisting = () => {
//     const initialMapping: MappingCell[] = []

//     // First create a base mapping with all zeros
//     courseOutcomes.forEach((co) => {
//       programOutcomes.forEach((po) => {
//         initialMapping.push({
//           coId: co.id,
//           poId: po.id,
//           weightage: 0,
//         })
//       })
//     })

//     // Then update with existing values
//     existingMappings.forEach((mapping) => {
//       const index = initialMapping.findIndex(
//         (item) => item.coId === mapping.courseOutcome.id && item.poId === mapping.programOutcome.id
//       )
//       if (index !== -1) {
//         initialMapping[index].weightage = mapping.weightage
//       }
//     })

//     setMapping(initialMapping)
//   }

//   const handleCourseChange = (courseId: string) => {
//     setSelectedCourseId(Number.parseInt(courseId))
//   }

//   const handleWeightageChange = (coId: number, poId: number, value: string) => {
//     const newMapping = mapping.map((item) => {
//       if (item.coId === coId && item.poId === poId) {
//         return { ...item, weightage: Number.parseFloat(value) }
//       }
//       return item
//     })

//     setMapping(newMapping)
//   }

//   const getWeightageValue = (coId: number, poId: number): number => {
//     const cell = mapping.find((item) => item.coId === coId && item.poId === poId)
//     return cell ? cell.weightage : 0
//   }

//   const handleSave = async () => {
//     try {
//       setLoadingData(true)
//       // In a real implementation, you'd send the mapping data to your backend
      
//       // Example payload format - adjust according to your API requirements
//       const payload = mapping.map(item => ({
//         courseOutcomeId: item.coId,
//         programOutcomeId: item.poId,
//         weightage: item.weightage
//       }))
      
//       // Send to backend - endpoint needs to be implemented according to your API
//       const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/co-po-mappings/course/${selectedCourseId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ mappings: payload })
//       })
      
//       const data = await response.json()
      
//       if (data.success) {
//         alert("Mapping saved successfully!")
//       } else {
//         setError("Failed to save mapping")
//         alert("Failed to save mapping")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//       alert("Error saving mapping")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading courses...</span>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-red-500">{error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold mb-6">Course Outcome - Program Outcome Mapping</h1>

//       <div className="grid gap-6 mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Select Course</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div>
//               <label className="block text-sm font-medium mb-1">Course</label>
//               <Select onValueChange={handleCourseChange}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select a course" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {courses.map((course) => (
//                     <SelectItem key={course.id} value={course.id.toString()}>
//                       {course.courseName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {loadingData && (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin" />
//           <span className="ml-2">Loading data...</span>
//         </div>
//       )}

//       {selectedCourseId && !loadingData && programOutcomes.length > 0 && courseOutcomes.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>CO-PO Mapping Matrix</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="border p-2 bg-gray-100">CO / PO</th>
//                     {programOutcomes.map((po, index) => (
//                       <th key={po.id} className="border p-2 bg-gray-100 text-center" title={po.description}>
//                         PO{index + 1}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {courseOutcomes.map((co) => (
//                     <tr key={co.id}>
//                       <td className="border p-2 font-medium">
//                         CO{co.unitNumber}: {co.description}
//                       </td>
//                       {programOutcomes.map((po) => (
//                         <td key={po.id} className="border p-2 text-center">
//                           <Select
//                             value={getWeightageValue(co.id, po.id).toString()}
//                             onValueChange={(value) => handleWeightageChange(co.id, po.id, value)}
//                           >
//                             <SelectTrigger className="w-20 mx-auto">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((value) => (
//                                 <SelectItem key={value} value={value.toString()}>
//                                   {value}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <Button onClick={handleSave} disabled={loadingData}>
//                 {loadingData ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Mapping"
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2 } from "lucide-react"

// interface Course {
//   id: number
//   courseName: string
// }

// interface ProgramOutcome {
//   id: number
//   courseId: number
//   description: string
//   poAttainments: {
//     id: number
//     poId: number
//     attainment: number
//   }[]
// }

// interface CourseOutcome {
//   id: number
//   unitNumber: number
//   description: string
//   subjectId: number
//   attainment: number
//   subject: {
//     id: number
//     subjectName: string
//     subjectCode: string
//   }
// }

// interface MappingCell {
//   coId: number
//   poId: number
//   weightage: number
// }

// interface MappingData {
//   programOutcome: {
//     id: number
//     description: string
//     batch: {
//       id: number
//       batchYear: number
//     }
//   }
//   courseOutcome: {
//     id: number
//     unitNumber: number
//     description: string
//     subject: {
//       id: number
//       name: string
//       code: string
//     }
//   }
//   weightage: number
// }

// export default function COPOMapping() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
//   const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([])
//   const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcome[]>([])
//   const [loading, setLoading] = useState(true)
//   const [loadingData, setLoadingData] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [mapping, setMapping] = useState<MappingCell[]>([])
//   const [existingMappings, setExistingMappings] = useState<MappingData[]>([])

//   useEffect(() => {
//     fetchCourses()
//   }, [])

//   useEffect(() => {
//     if (selectedCourseId) {
//       fetchProgramOutcomes(selectedCourseId)
//       fetchCourseOutcomes(selectedCourseId)
//       fetchExistingMappings(selectedCourseId)
//     }
//   }, [selectedCourseId])

//   useEffect(() => {
//     if (courseOutcomes.length > 0 && programOutcomes.length > 0) {
//       if (existingMappings.length > 0) {
//         initializeMappingFromExisting()
//       } else {
//         initializeMapping()
//       }
//     }
//   }, [courseOutcomes, programOutcomes, existingMappings])

//   const fetchCourses = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("http://localhost:8000/api/v1/courses/getAllCourses", {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setCourses(data.data)
//       } else {
//         setError("Failed to fetch courses")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchProgramOutcomes = async (courseId: number) => {
//     try {
//       setLoadingData(true)
//       const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/course/${courseId}`, {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setProgramOutcomes(data.data)
//       } else {
//         setError("Failed to fetch program outcomes")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   const fetchCourseOutcomes = async (courseId: number) => {
//     try {
//       setLoadingData(true)
//       const response = await fetch(`http://localhost:8000/api/v1/units/course/${courseId}`, {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setCourseOutcomes(data.data)
//       } else {
//         setError("Failed to fetch course outcomes")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   const fetchExistingMappings = async (courseId: number) => {
//     try {
//       setLoadingData(true)
//       const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/co-po-mappings/course/${courseId}`, {
//         credentials: "include",
//       })
//       const data = await response.json()

//       if (data.success) {
//         setExistingMappings(data.data)
//       } else {
//         console.log("No mappings found or error")
//         setExistingMappings([])
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//       setExistingMappings([])
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   const initializeMapping = () => {
//     const initialMapping: MappingCell[] = []

//     courseOutcomes.forEach((co) => {
//       programOutcomes.forEach((po) => {
//         initialMapping.push({
//           coId: co.id,
//           poId: po.id,
//           weightage: 0,
//         })
//       })
//     })

//     setMapping(initialMapping)
//   }

//   const initializeMappingFromExisting = () => {
//     // Create a complete grid of all CO-PO combinations with default weightage 0
//     const initialMapping: MappingCell[] = []
    
//     courseOutcomes.forEach((co) => {
//       programOutcomes.forEach((po) => {
//         initialMapping.push({
//           coId: co.id,
//           poId: po.id,
//           weightage: 0,
//         })
//       })
//     })
    
    
//     // Apply existing mappings from API, including those with weightage 0
//     for (const mappingData of existingMappings) {
//       const coId = mappingData.courseOutcome.id
//       const poId = mappingData.programOutcome.id
//       const weightage = mappingData.weightage
            
//       const index = initialMapping.findIndex(
//         (item) => item.coId === coId && item.poId === poId
//       )
      
//       if (index !== -1) {
//         // Always update, even for zero weightage
//         initialMapping[index].weightage = weightage
//       } else {
//         console.log(`No matching cell found for CO=${coId}, PO=${poId}`)
//       }
//     }
    
//     setMapping(initialMapping)
//   }

//   const handleCourseChange = (courseId: string) => {
//     setSelectedCourseId(Number.parseInt(courseId))
//   }

//   const handleWeightageChange = (coId: number, poId: number, value: string) => {
//     const newMapping = mapping.map((item) => {
//       if (item.coId === coId && item.poId === poId) {
//         return { ...item, weightage: Number.parseFloat(value) }
//       }
//       return item
//     })

//     setMapping(newMapping)
//   }

//   const getWeightageValue = (coId: number, poId: number): number => {
//     const cell = mapping.find((item) => item.coId === coId && item.poId === poId)
//     return cell ? cell.weightage : 0
//   }

//   const handleSave = async () => {
//     try {
//       setLoadingData(true)
      
//       // Format the mapping data for the API
//       const payload = mapping.map(item => ({
//         courseOutcomeId: item.coId,
//         programOutcomeId: item.poId,
//         weightage: item.weightage
//       }))
            
//       const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/co-po-mappings/course/${selectedCourseId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ mappings: payload })
//       })
      
//       const data = await response.json()
      
//       if (data.success) {
//         alert("Mapping saved successfully!")
//       } else {
//         setError("Failed to save mapping")
//         alert("Failed to save mapping")
//       }
//     } catch (err) {
//       setError("Error connecting to the server")
//       console.error(err)
//       alert("Error saving mapping")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading courses...</span>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-red-500">{error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold mb-6">Course Outcome - Program Outcome Mapping</h1>

//       <div className="grid gap-6 mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Select Course</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div>
//               <label className="block text-sm font-medium mb-1">Course</label>
//               <Select onValueChange={handleCourseChange}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select a course" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {courses.map((course) => (
//                     <SelectItem key={course.id} value={course.id.toString()}>
//                       {course.courseName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {loadingData && (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin" />
//           <span className="ml-2">Loading data...</span>
//         </div>
//       )}

//       {selectedCourseId && !loadingData && programOutcomes.length > 0 && courseOutcomes.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>CO-PO Mapping Matrix</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="border p-2 bg-gray-100">CO / PO</th>
//                     {programOutcomes.map((po, index) => (
//                       <th key={po.id} className="border p-2 bg-gray-100 text-center" title={po.description}>
//                         PO{index + 1}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {courseOutcomes.map((co) => (
//                     <tr key={co.id}>
//                       <td className="border p-2 font-medium">
//                         CO{co.unitNumber}: {co.description}
//                       </td>
//                       {programOutcomes.map((po) => (
//                         <td key={po.id} className="border p-2 text-center">
//                           <Select
//                             value={getWeightageValue(co.id, po.id).toString()}
//                             onValueChange={(value) => handleWeightageChange(co.id, po.id, value)}
//                           >
//                             <SelectTrigger className="w-20 mx-auto">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((value) => (
//                                 <SelectItem key={value} value={value.toString()}>
//                                   {value}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <Button onClick={handleSave} disabled={loadingData}>
//                 {loadingData ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Mapping"
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Course {
  id: number
  courseName: string
}

interface Batch {
  id: number
  batchYear: number
  courseId: number
}

interface ProgramOutcome {
  id: number
  courseId: number
  description: string
  poAttainments: {
    id: number
    poId: number
    attainment: number
  }[]
}

interface CourseOutcome {
  id: number
  unitNumber: number
  description: string
  subjectId: number
  attainment: number
  subject: {
    id: number
    subjectName: string
    subjectCode: string
  }
}

interface MappingCell {
  coId: number
  poId: number
  weightage: number
}

interface MappingData {
  programOutcome: {
    id: number
    description: string
    batch: {
      id: number
      batchYear: number
    }
  }
  courseOutcome: {
    id: number
    unitNumber: number
    description: string
    subject: {
      id: number
      name: string
      code: string
    }
  }
  weightage: number
}

export default function COPOMapping() {
  const [courses, setCourses] = useState<Course[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null)
  const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([])
  const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcome[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [loadingBatches, setLoadingBatches] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapping, setMapping] = useState<MappingCell[]>([])
  const [existingMappings, setExistingMappings] = useState<MappingData[]>([])

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      fetchBatches(selectedCourseId)
      setBatches([])
      setSelectedBatchId(null)
      setProgramOutcomes([])
      setCourseOutcomes([])
      setExistingMappings([])
    }
  }, [selectedCourseId])

  useEffect(() => {
    if (selectedCourseId && selectedBatchId) {
      fetchProgramOutcomes(selectedCourseId)
      fetchCourseOutcomes(selectedCourseId)
      fetchExistingMappings(selectedCourseId, selectedBatchId)
    }
  }, [selectedCourseId, selectedBatchId])

  useEffect(() => {
    if (courseOutcomes.length > 0 && programOutcomes.length > 0) {
      if (existingMappings.length > 0) {
        initializeMappingFromExisting()
      } else {
        initializeMapping()
      }
    }
  }, [courseOutcomes, programOutcomes, existingMappings])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/courses/getAllCourses", {
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setCourses(data.data)
      } else {
        setError("Failed to fetch courses")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBatches = async (courseId: number) => {
    try {
      setLoadingBatches(true)
      const response = await fetch(`http://localhost:8000/api/v1/batch/course/${courseId}`, {
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setBatches(data.data)
      } else {
        setError("Failed to fetch batches")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setLoadingBatches(false)
    }
  }

  const fetchProgramOutcomes = async (courseId: number) => {
    try {
      setLoadingData(true)
      const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/course/${courseId}`, {
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setProgramOutcomes(data.data)
      } else {
        setError("Failed to fetch program outcomes")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchCourseOutcomes = async (courseId: number) => {
    try {
      setLoadingData(true)
      const response = await fetch(`http://localhost:8000/api/v1/units/course/${courseId}`, {
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setCourseOutcomes(data.data)
      } else {
        setError("Failed to fetch course outcomes")
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchExistingMappings = async (courseId: number, batchId: number) => {
    try {
      setLoadingData(true)
      const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/co-po-mappings/course/${courseId}?batchId=${batchId}`, {
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setExistingMappings(data.data)
      } else {
        console.log("No mappings found or error")
        setExistingMappings([])
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
      setExistingMappings([])
    } finally {
      setLoadingData(false)
    }
  }

  const initializeMapping = () => {
    const initialMapping: MappingCell[] = []

    courseOutcomes.forEach((co) => {
      programOutcomes.forEach((po) => {
        initialMapping.push({
          coId: co.id,
          poId: po.id,
          weightage: 0,
        })
      })
    })

    setMapping(initialMapping)
  }

  const initializeMappingFromExisting = () => {
    // Create a complete grid of all CO-PO combinations with default weightage 0
    const initialMapping: MappingCell[] = []
    
    courseOutcomes.forEach((co) => {
      programOutcomes.forEach((po) => {
        initialMapping.push({
          coId: co.id,
          poId: po.id,
          weightage: 0,
        })
      })
    })
    
    
    // Apply existing mappings from API, including those with weightage 0
    for (const mappingData of existingMappings) {
      const coId = mappingData.courseOutcome.id
      const poId = mappingData.programOutcome.id
      const weightage = mappingData.weightage
            
      const index = initialMapping.findIndex(
        (item) => item.coId === coId && item.poId === poId
      )
      
      if (index !== -1) {
        // Always update, even for zero weightage
        initialMapping[index].weightage = weightage
      } else {
        console.log(`No matching cell found for CO=${coId}, PO=${poId}`)
      }
    }
    
    setMapping(initialMapping)
  }

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(Number.parseInt(courseId))
  }

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(Number.parseInt(batchId))
  }

  const handleWeightageChange = (coId: number, poId: number, value: string) => {
    const newMapping = mapping.map((item) => {
      if (item.coId === coId && item.poId === poId) {
        return { ...item, weightage: Number.parseFloat(value) }
      }
      return item
    })

    setMapping(newMapping)
  }

  const getWeightageValue = (coId: number, poId: number): number => {
    const cell = mapping.find((item) => item.coId === coId && item.poId === poId)
    return cell ? cell.weightage : 0
  }

  const handleSave = async () => {
    if (!selectedBatchId) {
      alert("Please select a batch first")
      return
    }
    
    try {
      setLoadingData(true)
      
      // Format the mapping data for the API and convert weightage to string
      const payload = mapping.map(item => ({
        coId: item.coId,
        poId: item.poId,
        weightage: item.weightage.toString() // Convert number to string
      }))
            
      const response = await fetch(`http://localhost:8000/api/v1/program-outcomes/co-po-mappings/course/${selectedCourseId}?batchId=${selectedBatchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ mappings: payload })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert("Mapping saved successfully!")
      } else {
        setError(data.message || "Failed to save mapping")
        console.error("API Error:", data)
        alert(`Failed to save mapping: ${data.message || "Unknown error"}`)
      }
    } catch (err) {
      setError("Error connecting to the server")
      console.error(err)
      alert("Error saving mapping")
    } finally {
      setLoadingData(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading courses...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Course Outcome - Program Outcome Mapping</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Course and Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <Select onValueChange={handleCourseChange}>
                  <SelectTrigger className="w-full">
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
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Batch</label>
                <Select onValueChange={handleBatchChange} disabled={!selectedCourseId || loadingBatches}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingBatches ? "Loading batches..." : "Select a batch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batchYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingBatches && (
                  <div className="mt-2 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Loading batches...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loadingData && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading data...</span>
        </div>
      )}

      {selectedCourseId && selectedBatchId && !loadingData && programOutcomes.length > 0 && courseOutcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>CO-PO Mapping Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100">CO / PO</th>
                    {programOutcomes.map((po, index) => (
                      <th key={po.id} className="border p-2 bg-gray-100 text-center" title={po.description}>
                        PO{index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courseOutcomes.map((co) => (
                    <tr key={co.id}>
                      <td className="border p-2 font-medium">
                        CO{co.unitNumber}: {co.description}
                      </td>
                      {programOutcomes.map((po) => (
                        <td key={po.id} className="border p-2 text-center">
                          <Select
                            value={getWeightageValue(co.id, po.id).toString()}
                            onValueChange={(value) => handleWeightageChange(co.id, po.id, value)}
                          >
                            <SelectTrigger className="w-20 mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((value) => (
                                <SelectItem key={value} value={value.toString()}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={loadingData}>
                {loadingData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Mapping"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}