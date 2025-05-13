"use client"

import { useState, useEffect } from "react"
import { ChevronDown, User, BookOpen, Calendar, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StudentDetails {
  name: string
  email: string
  rollNo: string
  batchYear: number
  courseName: string
  profileDetails: Record<string, any>
}

interface SemesterInfo {
  batchId: number
  batchYear: number
  courseName: string
  activeSemesters: { semester: number }[]
}

interface QuestionWiseMarks {
  questionId: number
  questionText: string
  unitNumber: number
  marksAllocated: number
  marksObtained: number
}

interface StandardExam {
  examType: string
  totalMarks: number
  questionWiseMarks: QuestionWiseMarks[]
}

interface InternalAssessment {
  examType: string
  marksObtained: number
}

interface SubjectMarks {
  standardExams: StandardExam[]
  internalAssessments: InternalAssessment[]
}

interface StudentMarks {
  [subject: string]: SubjectMarks
}

export default function StudentDashboard() {
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null)
  const [semesterInfo, setSemesterInfo] = useState<SemesterInfo | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null)
  const [studentMarks, setStudentMarks] = useState<StudentMarks | null>(null)
  const [showMarks, setShowMarks] = useState(false)
  const [loading, setLoading] = useState(true)
  const [marksLoading, setMarksLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        setLoading(true)
        const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/student/details", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch student details")
        }

        const data = await response.json()
        setStudentDetails(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching student details:", err)
        setError("Failed to load student details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentDetails()
  }, [])

  const fetchSemesterInfo = async () => {
    try {
      const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/semester/student", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch semester information")
      }

      const data = await response.json()
      setSemesterInfo(data)

      // Auto-select the first semester if available
      if (data.activeSemesters && data.activeSemesters.length > 0) {
        const firstSemester = data.activeSemesters[0].semester
        setSelectedSemester(firstSemester)
        fetchStudentMarks(firstSemester) // Fetch marks immediately
      }

      setError(null)
    } catch (err) {
      console.error("Error fetching semester info:", err)
      setError("Failed to load semester information. Please try again later.")
    }
  }

  const fetchStudentMarks = async (semester: number) => {
    try {
      setMarksLoading(true)
      // Changed from GET to POST method and fixed the body format
      const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/student/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ semester }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch student marks")
      }

      const data = await response.json()
      setStudentMarks(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching student marks:", err)
      setError("Failed to load student marks. Please try again later.")
    } finally {
      setMarksLoading(false)
    }
  }

  const handleViewMarks = async () => {
    if (!showMarks) {
      await fetchSemesterInfo()
    }
    setShowMarks(!showMarks)
  }

  const handleSemesterChange = (value: string) => {
    const semester = Number.parseInt(value, 10)
    setSelectedSemester(semester)
    fetchStudentMarks(semester)
  }

  const calculatePercentage = (obtained: number, allocated: number) => {
    return (obtained / allocated) * 100
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatExamType = (type: string) => {
    switch (type) {
      case "CT1":
        return "Class Test 1"
      case "CT2":
        return "Class Test 2"
      case "AA":
        return "Additional Assignment"
      case "ATT":
        return "Attendance"
      case "DHA":
        return "Daily Home Assignment"
      case "CA":
        return "Class Assignment"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40 md:col-span-2" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {studentDetails && (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {studentDetails.name}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Profile Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{studentDetails.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Roll No:</span>
                    <span className="text-sm">{studentDetails.rollNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Batch Year:</span>
                    <span className="text-sm">{studentDetails.batchYear}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Course:</span>
                    <span className="text-sm">{studentDetails.courseName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Academic Information</CardTitle>
                <CardDescription>Your course and semester details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">{studentDetails.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Program</h3>
                    <p className="text-sm text-muted-foreground">{studentDetails.courseName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Expected Graduation</h3>
                    <p className="text-sm text-muted-foreground">{studentDetails.batchYear}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleViewMarks} className="w-full">
                  {showMarks ? "Hide Marks" : "View Marks"}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMarks ? "rotate-180" : ""}`} />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {showMarks && (
            <div className="space-y-6">
              {semesterInfo && (
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <h2 className="text-xl font-semibold">Select Semester:</h2>
                  <Select value={selectedSemester?.toString()} onValueChange={handleSemesterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterInfo.activeSemesters.map((sem) => (
                        <SelectItem key={sem.semester} value={sem.semester.toString()}>
                          Semester {sem.semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {marksLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-64" />
                </div>
              ) : (
                studentMarks &&
                selectedSemester && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Semester {selectedSemester} Marks</h2>

                    <Tabs defaultValue={Object.keys(studentMarks)[0]}>
                      <TabsList className="mb-4 flex flex-wrap">
                        {Object.keys(studentMarks).map((subject) => (
                          <TabsTrigger key={subject} value={subject} className="text-sm">
                            {subject}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Object.entries(studentMarks).map(([subject, marks]) => (
                        <TabsContent key={subject} value={subject} className="space-y-6">
                          <h3 className="text-xl font-semibold">{subject}</h3>

                          {/* Standard Exams */}
                          {marks.standardExams.length > 0 ? (
                            <div className="space-y-6">
                              <h4 className="text-lg font-medium">Standard Exams</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {marks.standardExams.map((exam, index) => (
                                  <Card key={index}>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-lg">{formatExamType(exam.examType)}</CardTitle>
                                      <CardDescription>Total Marks: {exam.totalMarks}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        {exam.questionWiseMarks.map((question) => (
                                          <div key={question.questionId} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                              <span>
                                                Q{question.questionId}: Unit {question.unitNumber}
                                              </span>
                                              <span>
                                                {question.marksObtained}/{question.marksAllocated}
                                              </span>
                                            </div>
                                            <Progress
                                              value={calculatePercentage(
                                                question.marksObtained,
                                                question.marksAllocated,
                                              )}
                                              className={getProgressColor(
                                                calculatePercentage(question.marksObtained, question.marksAllocated),
                                              )}
                                            />
                                            <p className="text-xs text-muted-foreground">{question.questionText}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No standard exam data available</p>
                          )}

                          {/* Internal Assessments */}
                          {marks.internalAssessments.length > 0 ? (
                            <div className="space-y-6">
                              <h4 className="text-lg font-medium">Internal Assessments</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {marks.internalAssessments.map((assessment, index) => (
                                  <Card key={index}>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-base">{formatExamType(assessment.examType)}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{assessment.marksObtained}</div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No internal assessment data available</p>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}