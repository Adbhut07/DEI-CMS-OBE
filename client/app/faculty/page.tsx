"use client"
import { AssignedSubjects } from "@/components/faculty/assigned-subjects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalAssignedSubjects: number
  pendingMarkUploads: number
  upcomingDeadlines: number
}

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

export default function FacultyDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignedSubjects: 0,
    pendingMarkUploads: 0,
    upcomingDeadlines: 0,
  })
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("http://outcomemagic-backend.asdevx.com/api/v1/faculty/get-assigned-subjects", {
          credentials: "include",
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }
        
        const data = await response.json()
        
        if (data.success) {
          const fetchedSubjects = data.data
          const totalAssignedSubjects = fetchedSubjects.length
          
          setSubjects(fetchedSubjects)
          setStats({
            totalAssignedSubjects,
            pendingMarkUploads: 5,
            upcomingDeadlines: 3,
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
      <h1 className="text-3xl font-bold">Welcome, Professor</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Assigned Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAssignedSubjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Mark Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pendingMarkUploads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.upcomingDeadlines}</p>
          </CardContent>
        </Card>
      </div>
      <AssignedSubjects subjects={subjects} />
    </div>
  )
}