"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { saveMarks } from "@/lib/api";

// Types
interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Course {
  id: number;
  name: string;
}

interface Batch {
  id: number;
  year: number;
}

interface AssignedSubject {
  id: number;
  subject: Subject;
  course: Course;
  batch: Batch;
  semester: number;
}

interface Question {
  id: number;
  questionText: string;
  marksAllocated: number;
}

interface Exam {
  id: number;
  examType: string;
  subjectId: number;
  questions: Question[];
}

interface Student {
  id: number;
  name: string;
  email: string;
  rollNo: string;
  marks?: Record<string, number>;
}

interface MarksData {
  examId: number;
  questions: { id: number; text: string }[];
  students: Student[];
}

export default function MarksUploadPage() {
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>(
    []
  );
  const [selectedSubject, setSelectedSubject] =
    useState<AssignedSubject | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [marksData, setMarksData] = useState<MarksData | null>(null);
  const [loading, setLoading] = useState({
    subjects: false,
    exams: false,
    students: false,
    marks: false,
  });
  const [studentMarks, setStudentMarks] = useState<
    Record<string, Record<string, number>>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch assigned subjects
  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      setLoading((prev) => ({ ...prev, subjects: true }));
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/faculty/get-assigned-subjects",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setAssignedSubjects(data.data);
        }
      } catch (error) {
        console.error("Error fetching assigned subjects:", error);
      } finally {
        setLoading((prev) => ({ ...prev, subjects: false }));
      }
    };

    fetchAssignedSubjects();
  }, []);

  // Fetch exams when subject is selected
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchExams = async () => {
      setLoading((prev) => ({ ...prev, exams: true }));
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/exams/getExamsBySubject/${selectedSubject.subject.id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success) {
          setExams(data.data);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading((prev) => ({ ...prev, exams: false }));
      }
    };

    fetchExams();
  }, [selectedSubject]);

  // Fetch students when subject is selected
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchStudents = async () => {
      setLoading((prev) => ({ ...prev, students: true }));
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/enrollments/course/batch/${selectedSubject.batch.id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading((prev) => ({ ...prev, students: false }));
      }
    };

    fetchStudents();
  }, [selectedSubject]);

  // Fetch marks when exam is selected
  useEffect(() => {
    if (!selectedExam) return;

    const fetchMarks = async () => {
      setLoading((prev) => ({ ...prev, marks: true }));
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setMarksData(data.data);

          // Initialize student marks from fetched data
          const initialMarks: Record<string, Record<string, number>> = {};
          data.data.students.forEach((student: Student) => {
            initialMarks[student.id] = student.marks || {};
          });
          setStudentMarks(initialMarks);
        }
      } catch (error) {
        console.error("Error fetching marks:", error);
      } finally {
        setLoading((prev) => ({ ...prev, marks: false }));
      }
    };

    fetchMarks();
  }, [selectedExam]);

  const handleSubjectChange = (subjectId: string) => {
    const subject = assignedSubjects.find(
      (s) => s.id === Number.parseInt(subjectId)
    );
    setSelectedSubject(subject || null);
    setSelectedExam(null);
    setMarksData(null);
  };

  const handleExamChange = (examId: string) => {
    const exam = exams.find((e) => e.id === Number.parseInt(examId));
    setSelectedExam(exam || null);
  };

  const handleMarkChange = (
    studentId: number,
    questionId: number,
    value: string
  ) => {
    // Allow explicit zeros by checking if the value is an empty string
    const numValue = value === "" ? null : Number.parseInt(value);

    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [questionId]: numValue,
      },
    }));
  };

  const calculateTotal = (studentId: number) => {
    if (!selectedExam || !studentMarks[studentId]) return 0;

    return selectedExam.questions.reduce((total, question) => {
      const mark = studentMarks[studentId][question.id];
      // Only add to total if mark is a number (including zero)
      return total + (mark !== null && mark !== undefined ? mark : 0);
    }, 0);
  };

  const calculateMaxTotal = () => {
    if (!selectedExam) return 0;

    return selectedExam.questions.reduce((total, question) => {
      return total + question.marksAllocated;
    }, 0);
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) return;

    setIsSaving(true);

    try {
      // Filter out students with no marks entered (all null)
      const filteredMarks: Record<string, Record<string, number>> = {};

      Object.entries(studentMarks).forEach(([studentId, questionMarks]) => {
        // Check if student has any marks entered (including zeros)
        const hasAnyMarks = Object.values(questionMarks).some(
          (mark) => mark !== null && mark !== undefined
        );

        if (hasAnyMarks) {
          // Convert null values to 0 for the API
          const processedMarks: Record<string, number> = {};
          Object.entries(questionMarks).forEach(([qId, mark]) => {
            processedMarks[qId] =
              mark === null || mark === undefined ? 0 : mark;
          });

          filteredMarks[studentId] = processedMarks;
        }
      });

      // Call the API to save marks
      const response = await saveMarks(selectedExam.id, filteredMarks);

      if (response.success) {
        // Refresh marks data
        const marksResponse = await fetch(
          `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
          {
            credentials: "include",
          }
        );
        const data = await marksResponse.json();

        if (data.success) {
          setMarksData(data.data);

          // Update student marks from fetched data
          const updatedMarks: Record<string, Record<string, number>> = {};
          data.data.students.forEach((student: Student) => {
            updatedMarks[student.id] = student.marks || {};
          });
          setStudentMarks(updatedMarks);
        }

        // Show success message
        alert("Marks saved successfully!");
      } else {
        throw new Error(response.message || "Failed to save marks");
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save marks. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Student Marks Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Students
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Marks
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Exam Selection</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose an exam to input marks for
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Subject</label>
              {loading.subjects ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedSubjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id.toString()}
                      >
                        {subject.subject.name} ({subject.subject.code}) -{" "}
                        {subject.course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Exam</label>
              {loading.exams ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  onValueChange={handleExamChange}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id.toString()}>
                        {exam.examType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Button
              className="w-full mt-4"
              variant="outline"
              disabled={!selectedSubject}
            >
              Create New Exam
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedExam
                ? `${selectedExam.examType} Marks Entry`
                : "Marks Entry"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter marks for each student and question
            </p>
          </CardHeader>
          <CardContent>
            {loading.marks || loading.students ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : selectedExam && marksData ? (
              <div className="overflow-x-auto">
                {students.length > 0 ? (
                  <>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left font-medium">
                            Roll No.
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Student Name
                          </th>
                          {selectedExam.questions.map((question, index) => (
                            <th
                              key={question.id}
                              className="py-2 px-4 text-center font-medium"
                            >
                              <div>Q{index + 1}</div>
                              <div className="text-xs text-muted-foreground">
                                (Max: {question.marksAllocated})
                              </div>
                            </th>
                          ))}
                          <th className="py-2 px-4 text-center font-medium">
                            <div>Total</div>
                            <div className="text-xs text-muted-foreground">
                              (Max: {calculateMaxTotal()})
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b">
                            <td className="py-2 px-4">{student.rollNo}</td>
                            <td className="py-2 px-4">{student.name}</td>
                            {selectedExam.questions.map((question, index) => (
                              <td
                                key={question.id}
                                className="py-2 px-4 text-center"
                              >
                                <Input
                                  type="number"
                                  min="0"
                                  max={question.marksAllocated}
                                  className="w-16 mx-auto text-center"
                                  value={
                                    studentMarks[student.id]?.[question.id] ===
                                      null ||
                                    studentMarks[student.id]?.[question.id] ===
                                      undefined
                                      ? ""
                                      : studentMarks[student.id]?.[question.id]
                                  }
                                  onChange={(e) =>
                                    handleMarkChange(
                                      student.id,
                                      question.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="N/A"
                                />
                              </td>
                            ))}
                            <td className="py-2 px-4 text-center font-medium text-red-500">
                              {calculateTotal(student.id)} /{" "}
                              {calculateMaxTotal()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={handleSaveMarks}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Marks
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-md bg-gray-50">
                    <p className="font-medium text-lg">No students enrolled</p>
                    <p>
                      There are currently no students enrolled in this course
                      batch.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a subject and exam to view and enter marks
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
