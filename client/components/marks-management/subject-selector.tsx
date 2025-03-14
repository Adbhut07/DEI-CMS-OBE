"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectedSubject } from "@/app/faculty/upload-marks/types"

interface SubjectSelectorProps {
  onSubjectSelect: (subject: SelectedSubject) => void
  selectedSubject: SelectedSubject | null
}

export function SubjectSelector({ onSubjectSelect, selectedSubject }: SubjectSelectorProps) {
  const [subjectMappings, setSubjectMappings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8000/api/v1/faculty/get-assigned-subjects", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch subjects")
        }

        const data = await response.json()
        if (data.success) {
          setSubjectMappings(data.data || [])
        } else {
          setError(data.message || "Failed to fetch subjects")
        }
      } catch (error) {
        setError("Error fetching subjects. Please try again.")
        console.error("Error fetching subjects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const handleSubjectChange = (value: string) => {
    const mapping = subjectMappings.find((m) => m.id.toString() === value)
    if (mapping) {
      // Make sure we're correctly structuring the subject object with all required properties
      const selectedSubject: SelectedSubject = {
        id: mapping.subject.id,
        name: mapping.subject.name,
        code: mapping.subject.code,
        courseId: mapping.course.id,
        courseName: mapping.course.name,
        batchId: mapping.batch.id,
        batchYear: mapping.batch.year,
        semester: mapping.semester,
        mappingId: mapping.id,
      }

      console.log("Selected subject in selector:", selectedSubject)
      onSubjectSelect(selectedSubject)
    }
  }

  if (loading) {
    return <div className="my-4">Loading subjects...</div>
  }

  if (error) {
    return <div className="my-4 text-red-500">{error}</div>
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Select Subject</label>
      <Select onValueChange={handleSubjectChange} value={selectedSubject?.mappingId?.toString()}>
        <SelectTrigger className="w-full h-9">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          {subjectMappings.map((mapping) => (
            <SelectItem key={mapping.id} value={mapping.id.toString()}>
              {mapping.subject.name} ({mapping.subject.code}) - {mapping.course.name} - Batch {mapping.batch.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}