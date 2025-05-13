"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface CreateEnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (studentId: number, rollNo: string) => void
  batchId: string | null
}

interface Student {
  id: number
  name: string
  email: string
}

export default function CreateEnrollmentModal({ isOpen, onClose, onSubmit, batchId }: CreateEnrollmentModalProps) {
  const [email, setEmail] = useState("")
  const [rollNo, setRollNo] = useState("")
  const [student, setStudent] = useState<Student | null>(null)

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://outcomemagic-backend.asdevx.com/api/v1/users/email/${email}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success && result.data) {
        setStudent(result.data)
      } else {
        throw new Error("Student not found")
      }
    } catch (error) {
      console.error("Error searching for student:", error)
      toast({
        title: "Error",
        description: "Failed to find student. Please check the email and try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (student) {
      onSubmit(student.id, rollNo)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Enrollment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Student Email</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter student email"
                  required
                />
                <Button type="button" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>
            {student && (
              <div>
                <p>Student Name: {student.name}</p>
                <p>Student Email: {student.email}</p>
              </div>
            )}
            <div>
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter roll number"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!student || !rollNo}>
              Create Enrollment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

