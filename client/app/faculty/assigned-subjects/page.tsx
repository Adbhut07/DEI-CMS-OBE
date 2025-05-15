"use client"
import { AssignedSubjects } from "@/components/faculty/assigned-subjects";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast"

interface SubjectData {
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

interface DashboardStats {
  totalAssignedSubjects: number
  pendingMarkUploads: number
  upcomingDeadlines: number
}

export default function AssignedSubjectsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignedSubjects: 0,
    pendingMarkUploads: 0,
    upcomingDeadlines: 0,
  })
  const [assignedSubjects, setAssignedSubjects] = useState<SubjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
      const fetchDashboardStats = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/faculty/get-assigned-subjects`, {
            credentials: "include",
          })
          if (!response.ok) {
            throw new Error("Failed to fetch dashboard stats")
          }
          const data = await response.json()
          if (data.success) {
            setAssignedSubjects(data.data)
            setStats({
              totalAssignedSubjects: data.data.length,
              pendingMarkUploads: data.data.length * 2, // Example logic, adjust accordingly
              upcomingDeadlines: data.data.length * 1, // Example logic, adjust accordingly
            })
          } else {
            throw new Error("Unexpected response format")
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error)
          toast({
            title: "Error",
            description: "Failed to fetch dashboard stats. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchDashboardStats()
    }, [toast])
  
    if (isLoading) {
      return <div>Loading dashboard...</div>
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assigned Subjects</h1>
      <AssignedSubjects subjects={assignedSubjects} />
    </div>
  )
}

