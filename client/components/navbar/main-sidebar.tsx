"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Users, LayoutDashboard, FileText, ClipboardList, BarChart, FileQuestion, Users2, Plus, UserPlus, Contact } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users Management", href: "/admin/users", icon: Users2 },
  { name: "Create User", href: "/admin/create-user", icon: UserPlus },
  { name: "Course Management", href: "/admin/course", icon: Book },
  { name: "View Assigned Faculty", href: "/admin/view-assigned-faculty", icon: Users },
  { name: "Enrollments", href: "/admin/enrollments", icon: Contact },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Assessment", href: "/admin/assessment", icon: ClipboardList },
  { name: "Attainment", href: "/admin/attainment", icon: BarChart },

]

export function MainSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-[73px] w-64 bg-gray-100 min-h-[calc(100vh-73px)] border-r">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "text-gray-700 hover:bg-gray-200",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

