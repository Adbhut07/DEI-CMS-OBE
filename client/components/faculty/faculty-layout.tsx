import { FacultySidebar } from "./faculty-sidebar"
import { SiteHeader } from "../navbar/site-header"

interface AdminLayoutProps {
    children: React.ReactNode
  }
  
  export function FacultyLayout({ children }: AdminLayoutProps) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <FacultySidebar />
        <main className="pl-64 pt-[73px]">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    )
  }
  
  