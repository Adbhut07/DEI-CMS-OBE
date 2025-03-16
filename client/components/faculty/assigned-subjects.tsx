"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Subject {
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

interface AssignedSubjectsProps {
  subjects: Subject[]
}

export function AssignedSubjects({ subjects }: AssignedSubjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <p>No subjects assigned yet.</p>
        ) : (
          <div className="divide-y">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium">{subject.subject.name} ({subject.subject.code})</h3>
                  <p className="text-sm text-gray-500">
                    {subject.course.name} - Semester {subject.semester}, Batch {subject.batch.year}
                  </p>
                </div>
                <Link href={`/faculty/marks-dashboard`} passHref>
                  <Button variant="outline">Upload Marks</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
