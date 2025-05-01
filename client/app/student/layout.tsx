import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "View your academic profile and performance",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  )
}
