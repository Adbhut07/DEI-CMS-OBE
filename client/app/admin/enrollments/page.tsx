// 'use client'
// import { useEffect, useState } from "react";
// import EnrollmentManager from "./enrollment-manager";

// async function fetchCourses() {
//     try {
//       const response = await fetch('http://outcomemagic-backend.asdevx.com/api/v1/courses/getAllCourses', {
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('Failed to fetch courses');
//       const result = await response.json();
//       if (result.success) {
//         return result.data.map((course) => ({
//           id: course.id.toString(),
//           name: course.courseName
//         }));
//       } else {
//         throw new Error('Unexpected response format');
//       }
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       throw new Error(`Failed to fetch courses: ${error instanceof Error ? error.message : "Unknown error"}`);
//     }
//   }

// export default function EnrollmentsPage() {
//   const [courses, setCourses] = useState([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getCourses = async () => {
//       try {
//         const coursesData = await fetchCourses();
//         setCourses(coursesData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unknown error occurred");
//       }
//     };

//     getCourses();
//   }, []);

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-8">Student Enrollments</h1>
//       {error ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       ) : (
//         <EnrollmentManager courses={courses} />
//       )}
//     </div>
//   );
// }


"use client"
import { useEffect, useState } from "react"
import EnrollmentManager from "./enrollment-manager"

async function fetchCourses() {
  try {
    const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/courses/getAllCourses", {
      credentials: "include",
    })
    if (!response.ok) throw new Error("Failed to fetch courses")
    const result = await response.json()
    if (result.success) {
      return result.data.map((course) => ({
        id: course.id.toString(),
        name: course.courseName,
      }))
    } else {
      throw new Error("Unexpected response format")
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw new Error(`Failed to fetch courses: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export default function EnrollmentsPage() {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getCourses = async () => {
      try {
        const coursesData = await fetchCourses()
        setCourses(coursesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      }
    }

    getCourses()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Student Enrollments</h1>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <EnrollmentManager courses={courses} />
      )}
    </div>
  )
}

