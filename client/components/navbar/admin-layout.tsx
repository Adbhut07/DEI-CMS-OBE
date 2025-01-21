import { MainSidebar } from "./main-sidebar"
import { SiteHeader } from "./site-header"

interface AdminLayoutProps {
    children: React.ReactNode
  }
  
  export function AdminLayout({ children }: AdminLayoutProps) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <MainSidebar />
        <main className="pl-64 pt-[73px]">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    )
  }
  
  