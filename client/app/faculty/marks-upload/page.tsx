"use client"

import { useState } from "react"
import { SubjectSelection } from "./subject-selection"
import { MarksUploadTable } from "./marks-upload-table"

export default function MarksUploadPage() {
  const [selectedSubject, setSelectedSubject] = useState<{ id: number; courseId: number } | null>(null)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Student Marks</h1>
      {!selectedSubject ? (
        <SubjectSelection onSubjectSelect={setSelectedSubject} />
      ) : (
        <MarksUploadTable subjectId={selectedSubject.id} courseId={selectedSubject.courseId} />
      )}
    </div>
  )
}

