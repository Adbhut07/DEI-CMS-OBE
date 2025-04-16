// // "use client";

// // import { useState, useEffect } from "react";
// // import { FileText, Download, Upload, Save } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Input } from "@/components/ui/input";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { saveMarks } from "@/lib/api";

// // // Types
// // interface Subject {
// //   id: number;
// //   name: string;
// //   code: string;
// // }

// // interface Course {
// //   id: number;
// //   name: string;
// // }

// // interface Batch {
// //   id: number;
// //   year: number;
// // }

// // interface AssignedSubject {
// //   id: number;
// //   subject: Subject;
// //   course: Course;
// //   batch: Batch;
// //   semester: number;
// // }

// // interface Question {
// //   id: number;
// //   questionText: string;
// //   marksAllocated: number;
// // }

// // interface Exam {
// //   id: number;
// //   examType: string;
// //   subjectId: number;
// //   questions: Question[];
// // }

// // interface Student {
// //   id: number;
// //   name: string;
// //   email: string;
// //   rollNo: string;
// //   marks?: Record<string, number>;
// // }

// // interface MarksData {
// //   examId: number;
// //   questions: { id: number; text: string }[];
// //   students: Student[];
// // }

// // export default function MarksUploadPage() {
// //   const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>(
// //     []
// //   );
// //   const [selectedSubject, setSelectedSubject] =
// //     useState<AssignedSubject | null>(null);
// //   const [exams, setExams] = useState<Exam[]>([]);
// //   const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
// //   const [students, setStudents] = useState<Student[]>([]);
// //   const [marksData, setMarksData] = useState<MarksData | null>(null);
// //   const [loading, setLoading] = useState({
// //     subjects: false,
// //     exams: false,
// //     students: false,
// //     marks: false,
// //   });
// //   const [studentMarks, setStudentMarks] = useState<
// //     Record<string, Record<string, number>>
// //   >({});
// //   const [isSaving, setIsSaving] = useState(false);

// //   // Fetch assigned subjects
// //   useEffect(() => {
// //     const fetchAssignedSubjects = async () => {
// //       setLoading((prev) => ({ ...prev, subjects: true }));
// //       try {
// //         const response = await fetch(
// //           "http://localhost:8000/api/v1/faculty/get-assigned-subjects",
// //           {
// //             credentials: "include",
// //           }
// //         );
// //         const data = await response.json();
// //         if (data.success) {
// //           setAssignedSubjects(data.data);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching assigned subjects:", error);
// //       } finally {
// //         setLoading((prev) => ({ ...prev, subjects: false }));
// //       }
// //     };

// //     fetchAssignedSubjects();
// //   }, []);

// //   // Fetch exams when subject is selected
// //   useEffect(() => {
// //     if (!selectedSubject) return;

// //     const fetchExams = async () => {
// //       setLoading((prev) => ({ ...prev, exams: true }));
// //       try {
// //         const response = await fetch(
// //           `http://localhost:8000/api/v1/exams/getExamsBySubject/${selectedSubject.subject.id}`,
// //           { credentials: "include" }
// //         );
// //         const data = await response.json();
// //         if (data.success) {
// //           setExams(data.data);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching exams:", error);
// //       } finally {
// //         setLoading((prev) => ({ ...prev, exams: false }));
// //       }
// //     };

// //     fetchExams();
// //   }, [selectedSubject]);

// //   // Fetch students when subject is selected
// //   useEffect(() => {
// //     if (!selectedSubject) return;

// //     const fetchStudents = async () => {
// //       setLoading((prev) => ({ ...prev, students: true }));
// //       try {
// //         const response = await fetch(
// //           `http://localhost:8000/api/v1/enrollments/course/batch/${selectedSubject.batch.id}`,
// //           { credentials: "include" }
// //         );
// //         const data = await response.json();
// //         if (data.success) {
// //           setStudents(data.students);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching students:", error);
// //       } finally {
// //         setLoading((prev) => ({ ...prev, students: false }));
// //       }
// //     };

// //     fetchStudents();
// //   }, [selectedSubject]);

// //   // Fetch marks when exam is selected
// //   useEffect(() => {
// //     if (!selectedExam) return;

// //     const fetchMarks = async () => {
// //       setLoading((prev) => ({ ...prev, marks: true }));
// //       try {
// //         const response = await fetch(
// //           `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
// //           {
// //             credentials: "include",
// //           }
// //         );
// //         const data = await response.json();
// //         if (data.success) {
// //           setMarksData(data.data);

// //           // Initialize student marks from fetched data
// //           const initialMarks: Record<string, Record<string, number>> = {};
// //           data.data.students.forEach((student: Student) => {
// //             initialMarks[student.id] = student.marks || {};
// //           });
// //           setStudentMarks(initialMarks);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching marks:", error);
// //       } finally {
// //         setLoading((prev) => ({ ...prev, marks: false }));
// //       }
// //     };

// //     fetchMarks();
// //   }, [selectedExam]);

// //   const handleSubjectChange = (subjectId: string) => {
// //     const subject = assignedSubjects.find(
// //       (s) => s.id === Number.parseInt(subjectId)
// //     );
// //     setSelectedSubject(subject || null);
// //     setSelectedExam(null);
// //     setMarksData(null);
// //   };

// //   const handleExamChange = (examId: string) => {
// //     const exam = exams.find((e) => e.id === Number.parseInt(examId));
// //     setSelectedExam(exam || null);
// //   };

// //   const handleMarkChange = (
// //     studentId: number,
// //     questionId: number,
// //     value: string
// //   ) => {
// //     // Allow explicit zeros by checking if the value is an empty string
// //     const numValue = value === "" ? null : Number.parseInt(value);

// //     setStudentMarks((prev) => ({
// //       ...prev,
// //       [studentId]: {
// //         ...(prev[studentId] || {}),
// //         [questionId]: numValue,
// //       },
// //     }));
// //   };

// //   const calculateTotal = (studentId: number) => {
// //     if (!selectedExam || !studentMarks[studentId]) return 0;

// //     return selectedExam.questions.reduce((total, question) => {
// //       const mark = studentMarks[studentId][question.id];
// //       // Only add to total if mark is a number (including zero)
// //       return total + (mark !== null && mark !== undefined ? mark : 0);
// //     }, 0);
// //   };

// //   const calculateMaxTotal = () => {
// //     if (!selectedExam) return 0;

// //     return selectedExam.questions.reduce((total, question) => {
// //       return total + question.marksAllocated;
// //     }, 0);
// //   };

// //   const handleSaveMarks = async () => {
// //     if (!selectedExam) return;

// //     setIsSaving(true);

// //     try {
// //       // Filter out students with no marks entered (all null)
// //       const filteredMarks: Record<string, Record<string, number>> = {};

// //       Object.entries(studentMarks).forEach(([studentId, questionMarks]) => {
// //         // Check if student has any marks entered (including zeros)
// //         const hasAnyMarks = Object.values(questionMarks).some(
// //           (mark) => mark !== null && mark !== undefined
// //         );

// //         if (hasAnyMarks) {
// //           // Convert null values to 0 for the API
// //           const processedMarks: Record<string, number> = {};
// //           Object.entries(questionMarks).forEach(([qId, mark]) => {
// //             processedMarks[qId] =
// //               mark === null || mark === undefined ? 0 : mark;
// //           });

// //           filteredMarks[studentId] = processedMarks;
// //         }
// //       });

// //       // Call the API to save marks
// //       const response = await saveMarks(selectedExam.id, filteredMarks);

// //       if (response.success) {
// //         // Refresh marks data
// //         const marksResponse = await fetch(
// //           `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
// //           {
// //             credentials: "include",
// //           }
// //         );
// //         const data = await marksResponse.json();

// //         if (data.success) {
// //           setMarksData(data.data);

// //           // Update student marks from fetched data
// //           const updatedMarks: Record<string, Record<string, number>> = {};
// //           data.data.students.forEach((student: Student) => {
// //             updatedMarks[student.id] = student.marks || {};
// //           });
// //           setStudentMarks(updatedMarks);
// //         }

// //         // Show success message
// //         alert("Marks saved successfully!");
// //       } else {
// //         throw new Error(response.message || "Failed to save marks");
// //       }
// //     } catch (error) {
// //       console.error("Error saving marks:", error);
// //       alert(
// //         error instanceof Error
// //           ? error.message
// //           : "Failed to save marks. Please try again."
// //       );
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <div className="flex items-center gap-2">
// //           <FileText className="h-6 w-6 text-blue-600" />
// //           <h1 className="text-2xl font-bold">Student Marks Management</h1>
// //         </div>
// //         <div className="flex gap-2">
// //           <Button variant="outline" className="flex items-center gap-2">
// //             <Upload className="h-4 w-4" />
// //             Import Students
// //           </Button>
// //           <Button variant="outline" className="flex items-center gap-2">
// //             <Download className="h-4 w-4" />
// //             Export Marks
// //           </Button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //         <Card className="md:col-span-1">
// //           <CardHeader>
// //             <CardTitle>Exam Selection</CardTitle>
// //             <p className="text-sm text-muted-foreground">
// //               Choose an exam to input marks for
// //             </p>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="space-y-2">
// //               <label className="text-sm font-medium">Select Subject</label>
// //               {loading.subjects ? (
// //                 <Skeleton className="h-10 w-full" />
// //               ) : (
// //                 <Select onValueChange={handleSubjectChange}>
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select a subject" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {assignedSubjects.map((subject) => (
// //                       <SelectItem
// //                         key={subject.id}
// //                         value={subject.id.toString()}
// //                       >
// //                         {subject.subject.name} ({subject.subject.code}) -{" "}
// //                         {subject.course.name}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <label className="text-sm font-medium">Select Exam</label>
// //               {loading.exams ? (
// //                 <Skeleton className="h-10 w-full" />
// //               ) : (
// //                 <Select
// //                   onValueChange={handleExamChange}
// //                   disabled={!selectedSubject}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select an exam" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {exams.map((exam) => (
// //                       <SelectItem key={exam.id} value={exam.id.toString()}>
// //                         {exam.examType}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               )}
// //             </div>

// //             <Button
// //               className="w-full mt-4"
// //               variant="outline"
// //               disabled={!selectedSubject}
// //             >
// //               Create New Exam
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         <Card className="md:col-span-3">
// //           <CardHeader>
// //             <CardTitle>
// //               {selectedExam
// //                 ? `${selectedExam.examType} Marks Entry`
// //                 : "Marks Entry"}
// //             </CardTitle>
// //             <p className="text-sm text-muted-foreground">
// //               Enter marks for each student and question
// //             </p>
// //           </CardHeader>
// //           <CardContent>
// //             {loading.marks || loading.students ? (
// //               <div className="space-y-4">
// //                 <Skeleton className="h-10 w-full" />
// //                 <Skeleton className="h-20 w-full" />
// //                 <Skeleton className="h-20 w-full" />
// //               </div>
// //             ) : selectedExam && marksData ? (
// //               <div className="overflow-x-auto">
// //                 {students.length > 0 ? (
// //                   <>
// //                     <table className="w-full border-collapse">
// //                       <thead>
// //                         <tr className="border-b">
// //                           <th className="py-2 px-4 text-left font-medium">
// //                             Roll No.
// //                           </th>
// //                           <th className="py-2 px-4 text-left font-medium">
// //                             Student Name
// //                           </th>
// //                           {selectedExam.questions.map((question, index) => (
// //                             <th
// //                               key={question.id}
// //                               className="py-2 px-4 text-center font-medium"
// //                             >
// //                               <div>Q{index + 1}</div>
// //                               <div className="text-xs text-muted-foreground">
// //                                 (Max: {question.marksAllocated})
// //                               </div>
// //                             </th>
// //                           ))}
// //                           <th className="py-2 px-4 text-center font-medium">
// //                             <div>Total</div>
// //                             <div className="text-xs text-muted-foreground">
// //                               (Max: {calculateMaxTotal()})
// //                             </div>
// //                           </th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {students.map((student) => (
// //                           <tr key={student.id} className="border-b">
// //                             <td className="py-2 px-4">{student.rollNo}</td>
// //                             <td className="py-2 px-4">{student.name}</td>
// //                             {selectedExam.questions.map((question, index) => (
// //                               <td
// //                                 key={question.id}
// //                                 className="py-2 px-4 text-center"
// //                               >
// //                                 <Input
// //                                   type="number"
// //                                   min="0"
// //                                   max={question.marksAllocated}
// //                                   className="w-16 mx-auto text-center"
// //                                   value={
// //                                     studentMarks[student.id]?.[question.id] ===
// //                                       null ||
// //                                     studentMarks[student.id]?.[question.id] ===
// //                                       undefined
// //                                       ? ""
// //                                       : studentMarks[student.id]?.[question.id]
// //                                   }
// //                                   onChange={(e) =>
// //                                     handleMarkChange(
// //                                       student.id,
// //                                       question.id,
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   placeholder="N/A"
// //                                 />
// //                               </td>
// //                             ))}
// //                             <td className="py-2 px-4 text-center font-medium text-red-500">
// //                               {calculateTotal(student.id)} /{" "}
// //                               {calculateMaxTotal()}
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                     <div className="flex justify-end mt-6">
// //                       <Button
// //                         onClick={handleSaveMarks}
// //                         disabled={isSaving}
// //                         className="flex items-center gap-2"
// //                       >
// //                         <Save className="h-4 w-4" />
// //                         Save Marks
// //                       </Button>
// //                     </div>
// //                   </>
// //                 ) : (
// //                   <div className="text-center py-8 text-muted-foreground border rounded-md bg-gray-50">
// //                     <p className="font-medium text-lg">No students enrolled</p>
// //                     <p>
// //                       There are currently no students enrolled in this course
// //                       batch.
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <div className="text-center py-8 text-muted-foreground">
// //                 Select a subject and exam to view and enter marks
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }




// "use client";

// import { useState, useEffect } from "react";
// import { FileText, Download, Upload, Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import { saveMarks } from "@/lib/api";

// // Types
// interface Subject {
//   id: number;
//   name: string;
//   code: string;
// }

// interface Course {
//   id: number;
//   name: string;
// }

// interface Batch {
//   id: number;
//   year: number;
// }

// interface AssignedSubject {
//   id: number;
//   subject: Subject;
//   course: Course;
//   batch: Batch;
//   semester: number;
// }

// interface Question {
//   id: number;
//   text: string;
//   marksAllocated: number;
// }

// interface Exam {
//   id: number;
//   examType: string;
//   subjectId: number;
//   questions: Question[];
//   isQuestionWise?: boolean;
//   totalMarks?: number;
// }

// interface Student {
//   id: number;
//   name: string;
//   email: string;
//   rollNo: string;
//   questionMarks?: Record<string, number>;
//   totalMarks?: number;
//   marksObtained?: number;
// }

// interface MarksData {
//   examId: number;
//   examType: string;
//   isQuestionWise: boolean;
//   questions?: { id: number; text: string; marksAllocated: number }[];
//   students: Student[];
//   totalMarks?: number;
// }

// export default function MarksUploadPage() {
//   const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>(
//     []
//   );
//   const [selectedSubject, setSelectedSubject] =
//     useState<AssignedSubject | null>(null);
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [marksData, setMarksData] = useState<MarksData | null>(null);
//   const [loading, setLoading] = useState({
//     subjects: false,
//     exams: false,
//     students: false,
//     marks: false,
//   });
//   const [studentMarks, setStudentMarks] = useState<
//     Record<string, Record<string, number | null> | number | null>
//   >({});
//   const [isSaving, setIsSaving] = useState(false);

//   // Fetch assigned subjects
//   useEffect(() => {
//     const fetchAssignedSubjects = async () => {
//       setLoading((prev) => ({ ...prev, subjects: true }));
//       try {
//         const response = await fetch(
//           "http://localhost:8000/api/v1/faculty/get-assigned-subjects",
//           {
//             credentials: "include",
//           }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setAssignedSubjects(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching assigned subjects:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, subjects: false }));
//       }
//     };

//     fetchAssignedSubjects();
//   }, []);

//   // Fetch exams when subject is selected
//   useEffect(() => {
//     if (!selectedSubject) return;

//     const fetchExams = async () => {
//       setLoading((prev) => ({ ...prev, exams: true }));
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/v1/exams/getExamsBySubject/${selectedSubject.subject.id}`,
//           { credentials: "include" }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setExams(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching exams:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, exams: false }));
//       }
//     };

//     fetchExams();
//   }, [selectedSubject]);

//   // Fetch students when subject is selected
//   useEffect(() => {
//     if (!selectedSubject) return;

//     const fetchStudents = async () => {
//       setLoading((prev) => ({ ...prev, students: true }));
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/v1/enrollments/course/batch/${selectedSubject.batch.id}`,
//           { credentials: "include" }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setStudents(data.students);
//         }
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, students: false }));
//       }
//     };

//     fetchStudents();
//   }, [selectedSubject]);

//   // Fetch marks when exam is selected
//   useEffect(() => {
//     if (!selectedExam) return;

//     const fetchMarks = async () => {
//       setLoading((prev) => ({ ...prev, marks: true }));
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
//           {
//             credentials: "include",
//           }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setMarksData(data.data);

//           // Initialize student marks from fetched data
//           const initialMarks: Record<string, Record<string, number | null> | number | null> = {};
//           data.data.students.forEach((student: Student) => {
//             if (data.data.isQuestionWise) {
//               initialMarks[student.id] = student.questionMarks || {};
//             } else {
//               // For non-question-wise exams, use totalMarks instead of marksObtained
//               initialMarks[student.id] = student.totalMarks || null;
//             }
//           });
//           setStudentMarks(initialMarks);
//         }
//       } catch (error) {
//         console.error("Error fetching marks:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, marks: false }));
//       }
//     };

//     fetchMarks();
//   }, [selectedExam]);

//   const handleSubjectChange = (subjectId: string) => {
//     const subject = assignedSubjects.find(
//       (s) => s.id === Number.parseInt(subjectId)
//     );
//     setSelectedSubject(subject || null);
//     setSelectedExam(null);
//     setMarksData(null);
//   };

//   const handleExamChange = (examId: string) => {
//     const exam = exams.find((e) => e.id === Number.parseInt(examId));
//     setSelectedExam(exam || null);
//   };

//   const handleQuestionMarkChange = (
//     studentId: number,
//     questionId: number,
//     value: string
//   ) => {
//     // Allow explicit zeros by checking if the value is an empty string
//     const numValue = value === "" ? null : Number.parseInt(value);

//     setStudentMarks((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...(prev[studentId] as Record<string, number | null> || {}),
//         [questionId]: numValue,
//       },
//     }));
//   };

//   const handleTotalMarkChange = (
//     studentId: number,
//     value: string
//   ) => {
//     // Allow explicit zeros by checking if the value is an empty string
//     const numValue = value === "" ? null : Number.parseInt(value);

//     setStudentMarks((prev) => ({
//       ...prev,
//       [studentId]: numValue,
//     }));
//   };

//   // Calculate total based on exam type
//   const calculateTotal = (studentId: number) => {
//     if (!marksData?.isQuestionWise || !selectedExam || !studentMarks[studentId]) return 0;

//     const studentMarkRecord = studentMarks[studentId] as Record<string, number | null>;
    
//     // Get an array of marks for this student (exclude null values)
//     const validMarks = Object.entries(studentMarkRecord)
//       .map(([_questionId, mark]) => mark)
//       .filter(mark => mark !== null && mark !== undefined) as number[];
    
//     const examType = marksData.examType.toUpperCase();
    
//     if (examType.startsWith('CT')) {
//       // For CT exams, take the top 4 marks
//       return validMarks
//         .sort((a, b) => b - a) // sort in descending order
//         .slice(0, 4) // take top 4
//         .reduce((sum, mark) => sum + mark, 0); // sum them
//     } else if (examType === 'ESE') {
//       // For ESE, take the top 5 marks
//       return validMarks
//         .sort((a, b) => b - a) // sort in descending order
//         .slice(0, 5) // take top 5
//         .reduce((sum, mark) => sum + mark, 0); // sum them
//     } else if (examType === 'CA') {
//       // For CA, take all marks
//       return validMarks.reduce((sum, mark) => sum + mark, 0);
//     } else {
//       // Default case, sum all valid marks
//       return validMarks.reduce((sum, mark) => sum + mark, 0);
//     }
//   };

//   // Get the maximum possible total marks based on exam type
//   const calculateMaxTotal = () => {
//     if (!marksData?.isQuestionWise || !marksData.questions) return marksData?.totalMarks || 0;

//     const examType = marksData.examType.toUpperCase();
    
//     if (examType.startsWith('CT')) {
//       return 40; // CT exams are out of 40
//     } else if (examType === 'ESE') {
//       return 50; // ESE is out of 50
//     } else if (examType === 'CA') {
//       return 40; // CA is out of 40
//     } else {
//       // Default case, sum all question marks
//       return marksData.questions.reduce((total, question) => {
//         return total + question.marksAllocated;
//       }, 0);
//     }
//   };

//   // Get the maximum possible marks for non-question-wise exams
//   const getMaxMarksForExamType = () => {
//     if (!marksData) return 0;
    
//     const examType = marksData.examType.toUpperCase();
    
//     if (examType === 'DHA') {
//       return 40;
//     } else if (examType === 'AA') {
//       return 20;
//     } else if (examType === 'ATT') {
//       return 10;
//     } else {
//       // Fallback to the value from API or 0
//       return marksData.totalMarks || 0;
//     }
//   };

//   // Get number of required questions based on exam type
//   const getRequiredQuestionsCount = () => {
//     if (!marksData?.isQuestionWise) return 0;

//     const examType = marksData.examType.toUpperCase();
    
//     if (examType.startsWith('CT')) {
//       return 4; // CT requires 4 questions
//     } else if (examType === 'ESE') {
//       return 5; // ESE requires 5 questions
//     } else if (examType === 'CA') {
//       return marksData.questions?.length || 0; // CA requires all questions
//     } else {
//       return 0; // Default case
//     }
//   };

//   const handleSaveMarks = async () => {
//     if (!selectedExam || !marksData) return;

//     setIsSaving(true);

//     try {
//       // Filter out students with no marks entered (all null)
//       const filteredMarks: Record<string, Record<string, number | null> | number | null> = {};

//       if (marksData.isQuestionWise) {
//         // Handle question-wise exams (CT1, CT2, ESE, CA)
//         Object.entries(studentMarks).forEach(([studentId, questionMarks]) => {
//           if (typeof questionMarks !== 'object') return;
          
//           // Check if student has any marks entered (including zeros)
//           const hasAnyMarks = Object.values(questionMarks).some(
//             (mark) => mark !== null && mark !== undefined
//           );

//           if (hasAnyMarks) {
//             filteredMarks[studentId] = questionMarks;
//           }
//         });
//       } else {
//         // Handle total-only exams (AA, ATT, DHA)
//         Object.entries(studentMarks).forEach(([studentId, totalMark]) => {
//           // Only include non-null marks
//           if (totalMark !== null && totalMark !== undefined) {
//             filteredMarks[studentId] = totalMark;
//           }
//         });
//       }

//       // Call the API to save marks
//       const response = await saveMarks(selectedExam.id, filteredMarks);

//       if (response.success) {
//         // Refresh marks data
//         const marksResponse = await fetch(
//           `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
//           {
//             credentials: "include",
//           }
//         );
//         const data = await marksResponse.json();

//         if (data.success) {
//           setMarksData(data.data);

//           // Update student marks from fetched data
//           const updatedMarks: Record<string, Record<string, number | null> | number | null> = {};
//           data.data.students.forEach((student: Student) => {
//             if (data.data.isQuestionWise) {
//               updatedMarks[student.id] = student.questionMarks || {};
//             } else {
//               // For non-question-wise exams, use totalMarks
//               updatedMarks[student.id] = student.totalMarks || null;
//             }
//           });
//           setStudentMarks(updatedMarks);
//         }

//         // Show success message
//         alert("Marks saved successfully!");
//       } else {
//         throw new Error(response.message || "Failed to save marks");
//       }
//     } catch (error) {
//       console.error("Error saving marks:", error);
//       alert(
//         error instanceof Error
//           ? error.message
//           : "Failed to save marks. Please try again."
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Calculate how many questions the student has filled out so far
//   const calculateAnsweredQuestionsCount = (studentId: number) => {
//     if (!marksData?.isQuestionWise || !studentMarks[studentId]) return 0;

//     const studentMarkRecord = studentMarks[studentId] as Record<string, number | null>;
//     return Object.values(studentMarkRecord).filter(
//       mark => mark !== null && mark !== undefined
//     ).length;
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <FileText className="h-6 w-6 text-blue-600" />
//           <h1 className="text-2xl font-bold">Student Marks Management</h1>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" className="flex items-center gap-2">
//             <Upload className="h-4 w-4" />
//             Import Students
//           </Button>
//           <Button variant="outline" className="flex items-center gap-2">
//             <Download className="h-4 w-4" />
//             Export Marks
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="md:col-span-1">
//           <CardHeader>
//             <CardTitle>Exam Selection</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Choose an exam to input marks for
//             </p>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Select Subject</label>
//               {loading.subjects ? (
//                 <Skeleton className="h-10 w-full" />
//               ) : (
//                 <Select onValueChange={handleSubjectChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a subject" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {assignedSubjects.map((subject) => (
//                       <SelectItem
//                         key={subject.id}
//                         value={subject.id.toString()}
//                       >
//                         {subject.subject.name} ({subject.subject.code}) -{" "}
//                         {subject.course.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Select Exam</label>
//               {loading.exams ? (
//                 <Skeleton className="h-10 w-full" />
//               ) : (
//                 <Select
//                   onValueChange={handleExamChange}
//                   disabled={!selectedSubject}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select an exam" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {exams.map((exam) => (
//                       <SelectItem key={exam.id} value={exam.id.toString()}>
//                         {exam.examType}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             </div>

//             {marksData?.isQuestionWise && (
//               <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
//                 <p className="font-medium text-blue-700">Exam Details:</p>
//                 <ul className="mt-1 space-y-1 text-blue-600">
//                   {marksData.examType.toUpperCase().startsWith('CT') && (
//                     <li>• CT: 4 questions required (out of 40)</li>
//                   )}
//                   {marksData.examType.toUpperCase() === 'ESE' && (
//                     <li>• ESE: 5 questions required (out of 50)</li>
//                   )}
//                   {marksData.examType.toUpperCase() === 'CA' && (
//                     <li>• CA: All questions required (out of 40)</li>
//                   )}
//                 </ul>
//               </div>
//             )}

//             {!marksData?.isQuestionWise && marksData && (
//               <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
//                 <p className="font-medium text-blue-700">Exam Details:</p>
//                 <ul className="mt-1 space-y-1 text-blue-600">
//                   {marksData.examType.toUpperCase() === 'DHA' && (
//                     <li>• DHA: Daily Home Assignment (out of 40)</li>
//                   )}
//                   {marksData.examType.toUpperCase() === 'AA' && (
//                     <li>• AA: Additional Assignment (out of 20)</li>
//                   )}
//                   {marksData.examType.toUpperCase() === 'ATT' && (
//                     <li>• ATT: Attendance (out of 10)</li>
//                   )}
//                 </ul>
//               </div>
//             )}

//             <Button
//               className="w-full mt-4"
//               variant="outline"
//               disabled={!selectedSubject}
//             >
//               Create New Exam
//             </Button>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-3">
//           <CardHeader>
//             <CardTitle>
//               {selectedExam
//                 ? `${selectedExam.examType} Marks Entry`
//                 : "Marks Entry"}
//             </CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Enter marks for each student
//               {marksData?.isQuestionWise ? " and question" : ""}
//               {marksData?.isQuestionWise && (
//                 <span>
//                   {" "}
//                   - {getRequiredQuestionsCount()} questions
//                   {marksData.examType.toUpperCase() === 'CA'
//                     ? " required"
//                     : " of your choice"}
//                 </span>
//               )}
//             </p>
//           </CardHeader>
//           <CardContent>
//             {loading.marks || loading.students ? (
//               <div className="space-y-4">
//                 <Skeleton className="h-10 w-full" />
//                 <Skeleton className="h-20 w-full" />
//                 <Skeleton className="h-20 w-full" />
//               </div>
//             ) : selectedExam && marksData ? (
//               <div className="overflow-x-auto">
//                 {students.length > 0 ? (
//                   <>
//                     {marksData.isQuestionWise ? (
//                       // Question-wise marks table (CT1, CT2, ESE, CA)
//                       <table className="w-full border-collapse">
//                         <thead>
//                           <tr className="border-b">
//                             <th className="py-2 px-4 text-left font-medium">
//                               Roll No.
//                             </th>
//                             <th className="py-2 px-4 text-left font-medium">
//                               Student Name
//                             </th>
//                             {marksData.questions?.map((question, index) => (
//                               <th
//                                 key={question.id}
//                                 className="py-2 px-4 text-center font-medium"
//                               >
//                                 <div className="whitespace-nowrap">Q{index + 1} ({question.marksAllocated} marks)</div>
//                                 <div className="text-xs text-muted-foreground truncate max-w-32" title={question.text}>
//                                   {question.text.length > 30 ? question.text.substring(0, 30) + '...' : question.text}
//                                 </div>
//                               </th>
//                             ))}
//                             <th className="py-2 px-4 text-center font-medium">
//                               <div>Questions Answered</div>
//                               <div className="text-xs text-muted-foreground">
//                                 (Required: {getRequiredQuestionsCount()})
//                               </div>
//                             </th>
//                             <th className="py-2 px-4 text-center font-medium">
//                               <div>Total</div>
//                               <div className="text-xs text-muted-foreground">
//                                 (Max: {calculateMaxTotal()})
//                               </div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {students.map((student) => {
//                             const answeredCount = calculateAnsweredQuestionsCount(student.id);
//                             const requiredCount = getRequiredQuestionsCount();
//                             const isWarning = answeredCount < requiredCount && answeredCount > 0;
//                             const isError = answeredCount > requiredCount;
                            
//                             return (
//                               <tr key={student.id} className="border-b">
//                                 <td className="py-2 px-4">{student.rollNo}</td>
//                                 <td className="py-2 px-4">{student.name}</td>
//                                 {marksData.questions?.map((question) => {
//                                   const studentMarkRecord = studentMarks[student.id] as Record<string, number | null> || {};
//                                   return (
//                                     <td
//                                       key={question.id}
//                                       className="py-2 px-4 text-center"
//                                     >
//                                       <Input
//                                         type="number"
//                                         min="0"
//                                         max={question.marksAllocated}
//                                         className="w-16 mx-auto text-center"
//                                         value={
//                                           studentMarkRecord[question.id] === null ||
//                                           studentMarkRecord[question.id] === undefined
//                                             ? ""
//                                             : studentMarkRecord[question.id]
//                                         }
//                                         onChange={(e) =>
//                                           handleQuestionMarkChange(
//                                             student.id,
//                                             question.id,
//                                             e.target.value
//                                           )
//                                         }
//                                         placeholder="N/A"
//                                       />
//                                     </td>
//                                   );
//                                 })}
//                                 <td className={`py-2 px-4 text-center font-medium ${
//                                   isWarning ? "text-amber-500" : 
//                                   isError ? "text-red-500" : 
//                                   answeredCount === requiredCount ? "text-green-500" : ""
//                                 }`}>
//                                   {answeredCount} / {requiredCount}
//                                 </td>
//                                 <td className="py-2 px-4 text-center font-medium text-red-500">
//                                   {calculateTotal(student.id)} /{" "}
//                                   {calculateMaxTotal()}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     ) : (
//                       // Total-only marks table (AA, ATT, DHA)
//                       <table className="w-full border-collapse">
//                         <thead>
//                           <tr className="border-b">
//                             <th className="py-2 px-4 text-left font-medium">
//                               Roll No.
//                             </th>
//                             <th className="py-2 px-4 text-left font-medium">
//                               Student Name
//                             </th>
//                             <th className="py-2 px-4 text-center font-medium">
//                               <div>Marks</div>
//                               <div className="text-xs text-muted-foreground">
//                                 (Max: {getMaxMarksForExamType()})
//                               </div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {students.map((student) => (
//                             <tr key={student.id} className="border-b">
//                               <td className="py-2 px-4">{student.rollNo}</td>
//                               <td className="py-2 px-4">{student.name}</td>
//                               <td className="py-2 px-4 text-center">
//                                 <Input
//                                   type="number"
//                                   min="0"
//                                   max={getMaxMarksForExamType()}
//                                   className="w-20 mx-auto text-center"
//                                   value={
//                                     studentMarks[student.id] === null ||
//                                     studentMarks[student.id] === undefined
//                                       ? ""
//                                       : studentMarks[student.id]
//                                   }
//                                   onChange={(e) =>
//                                     handleTotalMarkChange(
//                                       student.id,
//                                       e.target.value
//                                     )
//                                   }
//                                   placeholder="N/A"
//                                 />
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     )}
//                     <div className="flex justify-end mt-6">
//                       <Button
//                         onClick={handleSaveMarks}
//                         disabled={isSaving}
//                         className="flex items-center gap-2"
//                       >
//                         <Save className="h-4 w-4" />
//                         Save Marks
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-8 text-muted-foreground border rounded-md bg-gray-50">
//                     <p className="font-medium text-lg">No students enrolled</p>
//                     <p>
//                       There are currently no students enrolled in this course
//                       batch.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-muted-foreground">
//                 Select a subject and exam to view and enter marks
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




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
  text: string;
  marksAllocated: number;
}

interface Exam {
  id: number;
  examType: string;
  subjectId: number;
  questions: Question[];
  isQuestionWise?: boolean;
  totalMarks?: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  rollNo: string;
  questionMarks?: Record<string, number>;
  totalMarks?: number;
  marksObtained?: number;
}

interface MarksData {
  examId: number;
  examType: string;
  isQuestionWise: boolean;
  questions?: { id: number; text: string; marksAllocated: number }[];
  students: Student[];
  totalMarks?: number;
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
    Record<string, Record<string, number | null> | number | null>
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
          // Sort students by roll number in ascending order
          const sortedStudents = [...data.students].sort((a, b) => {
            return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true, sensitivity: 'base' });
          });
          setStudents(sortedStudents);
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
  // useEffect(() => {
  //   if (!selectedExam) return;

  //   const fetchMarks = async () => {
  //     setLoading((prev) => ({ ...prev, marks: true }));
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
  //         {
  //           credentials: "include",
  //         }
  //       );
  //       const data = await response.json();
  //       if (data.success) {
  //         // Sort marksData students by roll number in ascending order
  //         if (data.data.students && data.data.students.length > 0) {
  //           data.data.students.sort((a: Student, b: Student) => {
  //             return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true, sensitivity: 'base' });
  //           });
  //         }
          
  //         setMarksData(data.data);

  //         // Initialize student marks from fetched data
  //         const initialMarks: Record<string, Record<string, number | null> | number | null> = {};
  //         data.data.students.forEach((student: Student) => {
  //           if (data.data.isQuestionWise) {
  //             initialMarks[student.id] = student.questionMarks || {};
  //           } else {
  //             // For non-question-wise exams, use totalMarks instead of marksObtained
  //             initialMarks[student.id] = student.totalMarks || null;
  //           }
  //         });
  //         setStudentMarks(initialMarks);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching marks:", error);
  //     } finally {
  //       setLoading((prev) => ({ ...prev, marks: false }));
  //     }
  //   };

  //   fetchMarks();
  // }, [selectedExam]);

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
          // Sort marksData students by roll number in ascending order
          if (data.data.students && data.data.students.length > 0) {
            data.data.students.sort((a: Student, b: Student) => {
              return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true, sensitivity: 'base' });
            });
          }
          
          setMarksData(data.data);
  
          // Initialize student marks from fetched data
          const initialMarks: Record<string, Record<string, number | null> | number | null> = {};
          data.data.students.forEach((student: Student) => {
            if (data.data.isQuestionWise) {
              // Make sure we're not converting undefined/null to 0
              const questionMarks: Record<string, number | null> = {};
              
              // If the student has question marks, process them
              if (student.questionMarks) {
                // For each question ID in the fetched data
                Object.keys(student.questionMarks).forEach(qId => {
                  const mark = student.questionMarks?.[qId];
                  // Only set non-null values
                  if (mark !== null && mark !== undefined) {
                    questionMarks[qId] = mark;
                  } else {
                    questionMarks[qId] = null;
                  }
                });
              }
              
              // For questions not in the fetched data, set to null
              if (data.data.questions) {
                data.data.questions.forEach(question => {
                  if (!(question.id.toString() in questionMarks)) {
                    questionMarks[question.id] = null;
                  }
                });
              }
              
              initialMarks[student.id] = questionMarks;
            } else {
              // For non-question-wise exams, use totalMarks but ensure null remains null
              initialMarks[student.id] = student.totalMarks !== undefined ? student.totalMarks : null;
            }
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

  // const handleQuestionMarkChange = (
  //   studentId: number,
  //   questionId: number,
  //   value: string
  // ) => {
  //   // Allow explicit zeros by checking if the value is an empty string
  //   const numValue = value === "" ? null : Number.parseInt(value);

  //   setStudentMarks((prev) => ({
  //     ...prev,
  //     [studentId]: {
  //       ...(prev[studentId] as Record<string, number | null> || {}),
  //       [questionId]: numValue,
  //     },
  //   }));
  // };

  // N/A issue fix
  const handleQuestionMarkChange = (
    studentId: number,
    questionId: number,
    value: string
  ) => {
    // Convert empty string to null, otherwise parse as number
    const numValue = value === "" ? null : Number(value);
  
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] as Record<string, number | null> || {}),
        [questionId]: numValue,
      },
    }));
  };

  // const handleTotalMarkChange = (
  //   studentId: number,
  //   value: string
  // ) => {
  //   // Allow explicit zeros by checking if the value is an empty string
  //   const numValue = value === "" ? null : Number.parseInt(value);

  //   setStudentMarks((prev) => ({
  //     ...prev,
  //     [studentId]: numValue,
  //   }));
  // };

  const handleTotalMarkChange = (
    studentId: number,
    value: string
  ) => {
    // Convert empty string to null, otherwise parse as number
    const numValue = value === "" ? null : Number(value);
  
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: numValue,
    }));
  };

  // Calculate total based on exam type
  const calculateTotal = (studentId: number) => {
    if (!marksData?.isQuestionWise || !selectedExam || !studentMarks[studentId]) return 0;

    const studentMarkRecord = studentMarks[studentId] as Record<string, number | null>;
    
    // Get an array of marks for this student (exclude null values)
    const validMarks = Object.entries(studentMarkRecord)
      .map(([_questionId, mark]) => mark)
      .filter(mark => mark !== null && mark !== undefined) as number[];
    
    const examType = marksData.examType.toUpperCase();
    
    if (examType.startsWith('CT')) {
      // For CT exams, take the top 4 marks
      return validMarks
        .sort((a, b) => b - a) // sort in descending order
        .slice(0, 4) // take top 4
        .reduce((sum, mark) => sum + mark, 0); // sum them
    } else if (examType === 'ESE') {
      // For ESE, take the top 5 marks
      return validMarks
        .sort((a, b) => b - a) // sort in descending order
        .slice(0, 5) // take top 5
        .reduce((sum, mark) => sum + mark, 0); // sum them
    } else if (examType === 'CA') {
      // For CA, take all marks
      return validMarks.reduce((sum, mark) => sum + mark, 0);
    } else {
      // Default case, sum all valid marks
      return validMarks.reduce((sum, mark) => sum + mark, 0);
    }
  };

  // Get the maximum possible total marks based on exam type
  const calculateMaxTotal = () => {
    if (!marksData?.isQuestionWise || !marksData.questions) return marksData?.totalMarks || 0;

    const examType = marksData.examType.toUpperCase();
    
    if (examType.startsWith('CT')) {
      return 40; // CT exams are out of 40
    } else if (examType === 'ESE') {
      return 50; // ESE is out of 50
    } else if (examType === 'CA') {
      return 40; // CA is out of 40
    } else {
      // Default case, sum all question marks
      return marksData.questions.reduce((total, question) => {
        return total + question.marksAllocated;
      }, 0);
    }
  };

  // Get the maximum possible marks for non-question-wise exams
  const getMaxMarksForExamType = () => {
    if (!marksData) return 0;
    
    const examType = marksData.examType.toUpperCase();
    
    if (examType === 'DHA') {
      return 40;
    } else if (examType === 'AA') {
      return 20;
    } else if (examType === 'ATT') {
      return 10;
    } else {
      // Fallback to the value from API or 0
      return marksData.totalMarks || 0;
    }
  };

  // Get number of required questions based on exam type
  const getRequiredQuestionsCount = () => {
    if (!marksData?.isQuestionWise) return 0;

    const examType = marksData.examType.toUpperCase();
    
    if (examType.startsWith('CT')) {
      return 4; // CT requires 4 questions
    } else if (examType === 'ESE') {
      return 5; // ESE requires 5 questions
    } else if (examType === 'CA') {
      return marksData.questions?.length || 0; // CA requires all questions
    } else {
      return 0; // Default case
    }
  };

  // const handleSaveMarks = async () => {
  //   if (!selectedExam || !marksData) return;

  //   setIsSaving(true);

  //   try {
  //     // Filter out students with no marks entered (all null)
  //     const filteredMarks: Record<string, Record<string, number | null> | number | null> = {};

  //     if (marksData.isQuestionWise) {
  //       // Handle question-wise exams (CT1, CT2, ESE, CA)
  //       Object.entries(studentMarks).forEach(([studentId, questionMarks]) => {
  //         if (typeof questionMarks !== 'object') return;
          
  //         // Check if student has any marks entered (including zeros)
  //         const hasAnyMarks = Object.values(questionMarks).some(
  //           (mark) => mark !== null && mark !== undefined
  //         );

  //         if (hasAnyMarks) {
  //           filteredMarks[studentId] = questionMarks;
  //         }
  //       });
  //     } else {
  //       // Handle total-only exams (AA, ATT, DHA)
  //       Object.entries(studentMarks).forEach(([studentId, totalMark]) => {
  //         // Only include non-null marks
  //         if (totalMark !== null && totalMark !== undefined) {
  //           filteredMarks[studentId] = totalMark;
  //         }
  //       });
  //     }

  //     // Call the API to save marks
  //     const response = await saveMarks(selectedExam.id, filteredMarks);

  //     if (response.success) {
  //       // Refresh marks data
  //       const marksResponse = await fetch(
  //         `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
  //         {
  //           credentials: "include",
  //         }
  //       );
  //       const data = await marksResponse.json();

  //       if (data.success) {
  //         // Sort marksData students by roll number in ascending order
  //         if (data.data.students && data.data.students.length > 0) {
  //           data.data.students.sort((a: Student, b: Student) => {
  //             return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true, sensitivity: 'base' });
  //           });
  //         }
          
  //         setMarksData(data.data);

  //         // Update student marks from fetched data
  //         const updatedMarks: Record<string, Record<string, number | null> | number | null> = {};
  //         data.data.students.forEach((student: Student) => {
  //           if (data.data.isQuestionWise) {
  //             updatedMarks[student.id] = student.questionMarks || {};
  //           } else {
  //             // For non-question-wise exams, use totalMarks
  //             updatedMarks[student.id] = student.totalMarks || null;
  //           }
  //         });
  //         setStudentMarks(updatedMarks);
  //       }

  //       // Show success message
  //       alert("Marks saved successfully!");
  //     } else {
  //       throw new Error(response.message || "Failed to save marks");
  //     }
  //   } catch (error) {
  //     console.error("Error saving marks:", error);
  //     alert(
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to save marks. Please try again."
  //     );
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  //Updated code 
  const handleSaveMarks = async () => {
    if (!selectedExam || !marksData) return;
  
    setIsSaving(true);
  
    try {
      // Filter out students with no marks entered (all null)
      const filteredMarks: Record<string, Record<string, number | null> | number | null> = {};
  
      if (marksData.isQuestionWise) {
        // Handle question-wise exams (CT1, CT2, ESE, CA)
        Object.entries(studentMarks).forEach(([studentId, questionMarks]) => {
          if (typeof questionMarks !== 'object') return;
          
          // Create a clean object with only non-null values
          const cleanQuestionMarks: Record<string, number> = {};
          let hasAnyMarks = false;
          
          Object.entries(questionMarks).forEach(([questionId, mark]) => {
            if (mark !== null && mark !== undefined) {
              cleanQuestionMarks[questionId] = mark;
              hasAnyMarks = true;
            }
          });
  
          if (hasAnyMarks) {
            filteredMarks[studentId] = cleanQuestionMarks;
          }
        });
      } else {
        // Handle total-only exams (AA, ATT, DHA)
        Object.entries(studentMarks).forEach(([studentId, totalMark]) => {
          // Only include non-null marks
          if (totalMark !== null && totalMark !== undefined) {
            filteredMarks[studentId] = totalMark;
          }
        });
      }
  
      // Call the API to save marks
      const response = await saveMarks(selectedExam.id, filteredMarks);
  
      if (response.success) {
        // Refresh marks data with the same null-preservation logic
        const marksResponse = await fetch(
          `http://localhost:8000/api/v1/marks/${selectedExam.id}`,
          {
            credentials: "include",
          }
        );
        const data = await marksResponse.json();
  
        if (data.success) {
          // Sort marksData students by roll number in ascending order
          if (data.data.students && data.data.students.length > 0) {
            data.data.students.sort((a: Student, b: Student) => {
              return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true, sensitivity: 'base' });
            });
          }
          
          setMarksData(data.data);
  
          // Update student marks from fetched data with null preservation
          const updatedMarks: Record<string, Record<string, number | null> | number | null> = {};
          data.data.students.forEach((student: Student) => {
            if (data.data.isQuestionWise) {
              const questionMarks: Record<string, number | null> = {};
              
              // Process question marks from API response
              if (student.questionMarks) {
                Object.keys(student.questionMarks).forEach(qId => {
                  const mark = student.questionMarks?.[qId];
                  // Only set non-null values
                  if (mark !== null && mark !== undefined) {
                    questionMarks[qId] = mark;
                  } else {
                    questionMarks[qId] = null;
                  }
                });
              }
              
              // Set null for questions not in the response
              if (data.data.questions) {
                data.data.questions.forEach(question => {
                  if (!(question.id.toString() in questionMarks)) {
                    questionMarks[question.id] = null;
                  }
                });
              }
              
              updatedMarks[student.id] = questionMarks;
            } else {
              // For non-question-wise exams, preserve null
              updatedMarks[student.id] = student.totalMarks !== undefined ? student.totalMarks : null;
            }
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

  // Calculate how many questions the student has filled out so far
  // const calculateAnsweredQuestionsCount = (studentId: number) => {
  //   if (!marksData?.isQuestionWise || !studentMarks[studentId]) return 0;

  //   const studentMarkRecord = studentMarks[studentId] as Record<string, number | null>;
  //   return Object.values(studentMarkRecord).filter(
  //     mark => mark !== null && mark !== undefined
  //   ).length;
  // };

  const calculateAnsweredQuestionsCount = (studentId: number) => {
    if (!marksData?.isQuestionWise || !studentMarks[studentId]) return 0;
  
    const studentMarkRecord = studentMarks[studentId] as Record<string, number | null>;
    return Object.values(studentMarkRecord).filter(
      mark => mark !== null && mark !== undefined
    ).length;
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

            {marksData?.isQuestionWise && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                <p className="font-medium text-blue-700">Exam Details:</p>
                <ul className="mt-1 space-y-1 text-blue-600">
                  {marksData.examType.toUpperCase().startsWith('CT') && (
                    <li>• CT: 4 questions required (out of 40)</li>
                  )}
                  {marksData.examType.toUpperCase() === 'ESE' && (
                    <li>• ESE: 5 questions required (out of 50)</li>
                  )}
                  {marksData.examType.toUpperCase() === 'CA' && (
                    <li>• CA: All questions required (out of 40)</li>
                  )}
                </ul>
              </div>
            )}

            {!marksData?.isQuestionWise && marksData && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                <p className="font-medium text-blue-700">Exam Details:</p>
                <ul className="mt-1 space-y-1 text-blue-600">
                  {marksData.examType.toUpperCase() === 'DHA' && (
                    <li>• DHA: Daily Home Assignment (out of 40)</li>
                  )}
                  {marksData.examType.toUpperCase() === 'AA' && (
                    <li>• AA: Additional Assignment (out of 20)</li>
                  )}
                  {marksData.examType.toUpperCase() === 'ATT' && (
                    <li>• ATT: Attendance (out of 10)</li>
                  )}
                </ul>
              </div>
            )}

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
              Enter marks for each student
              {marksData?.isQuestionWise ? " and question" : ""}
              {marksData?.isQuestionWise && (
                <span>
                  {" "}
                  - {getRequiredQuestionsCount()} questions
                  {marksData.examType.toUpperCase() === 'CA'
                    ? " required"
                    : " of your choice"}
                </span>
              )}
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
                    {marksData.isQuestionWise ? (
                      // Question-wise marks table (CT1, CT2, ESE, CA)
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left font-medium">
                              Roll No.
                            </th>
                            <th className="py-2 px-4 text-left font-medium">
                              Student Name
                            </th>
                            {marksData.questions?.map((question, index) => (
                              <th
                                key={question.id}
                                className="py-2 px-4 text-center font-medium"
                              >
                                <div className="whitespace-nowrap">Q{index + 1} ({question.marksAllocated} marks)</div>
                                <div className="text-xs text-muted-foreground truncate max-w-32" title={question.text}>
                                  {question.text.length > 30 ? question.text.substring(0, 30) + '...' : question.text}
                                </div>
                              </th>
                            ))}
                            <th className="py-2 px-4 text-center font-medium">
                              <div>Questions Answered</div>
                              <div className="text-xs text-muted-foreground">
                                (Required: {getRequiredQuestionsCount()})
                              </div>
                            </th>
                            <th className="py-2 px-4 text-center font-medium">
                              <div>Total</div>
                              <div className="text-xs text-muted-foreground">
                                (Max: {calculateMaxTotal()})
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => {
                            const answeredCount = calculateAnsweredQuestionsCount(student.id);
                            const requiredCount = getRequiredQuestionsCount();
                            const isWarning = answeredCount < requiredCount && answeredCount > 0;
                            const isError = answeredCount > requiredCount;
                            
                            return (
                              <tr key={student.id} className="border-b">
                                <td className="py-2 px-4">{student.rollNo}</td>
                                <td className="py-2 px-4">{student.name}</td>
                                {/* {marksData.questions?.map((question) => {
                                  const studentMarkRecord = studentMarks[student.id] as Record<string, number | null> || {};
                                  return (
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
                                          studentMarkRecord[question.id] === null ||
                                          studentMarkRecord[question.id] === undefined
                                            ? ""
                                            : studentMarkRecord[question.id]
                                        }
                                        onChange={(e) =>
                                          handleQuestionMarkChange(
                                            student.id,
                                            question.id,
                                            e.target.value
                                          )
                                        }
                                        placeholder="N/A"
                                      />
                                    </td>
                                  );
                                })} */}

{marksData.questions?.map((question) => {
  const studentMarkRecord = studentMarks[student.id] as Record<string, number | null> || {};
  const markValue = studentMarkRecord[question.id];
  
  return (
    <td
      key={question.id}
      className="py-2 px-4 text-center"
    >
      <Input
        type="number"
        min="0"
        max={question.marksAllocated}
        className="w-16 mx-auto text-center"
        value={markValue === null || markValue === undefined ? "" : markValue.toString()}
        onChange={(e) =>
          handleQuestionMarkChange(
            student.id,
            question.id,
            e.target.value
          )
        }
        placeholder="N/A"
      />
    </td>
  );
})}
                                <td className={`py-2 px-4 text-center font-medium ${
                                  isWarning ? "text-amber-500" : 
                                  isError ? "text-red-500" : 
                                  answeredCount === requiredCount ? "text-green-500" : ""
                                }`}>
                                  {answeredCount} / {requiredCount}
                                </td>
                                <td className="py-2 px-4 text-center font-medium text-red-500">
                                  {calculateTotal(student.id)} /{" "}
                                  {calculateMaxTotal()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      // Total-only marks table (AA, ATT, DHA)
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left font-medium">
                              Roll No.
                            </th>
                            <th className="py-2 px-4 text-left font-medium">
                              Student Name
                            </th>
                            <th className="py-2 px-4 text-center font-medium">
                              <div>Marks</div>
                              <div className="text-xs text-muted-foreground">
                                (Max: {getMaxMarksForExamType()})
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className="border-b">
                              <td className="py-2 px-4">{student.rollNo}</td>
                              <td className="py-2 px-4">{student.name}</td>
                              <td className="py-2 px-4 text-center">
                                {/* <Input
                                  type="number"
                                  min="0"
                                  max={getMaxMarksForExamType()}
                                  className="w-20 mx-auto text-center"
                                  value={
                                    studentMarks[student.id] === null ||
                                    studentMarks[student.id] === undefined
                                      ? ""
                                      : studentMarks[student.id]
                                  }
                                  onChange={(e) =>
                                    handleTotalMarkChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="N/A"
                                /> */}

<Input
  type="number"
  min="0"
  max={getMaxMarksForExamType()}
  className="w-20 mx-auto text-center"
  value={
    studentMarks[student.id] === null ||
    studentMarks[student.id] === undefined
      ? ""
      : studentMarks[student.id].toString()
  }
  onChange={(e) =>
    handleTotalMarkChange(
      student.id,
      e.target.value
    )
  }
  placeholder="N/A"
/>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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





