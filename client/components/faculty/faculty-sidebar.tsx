// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { BookOpen, Home, Upload } from "lucide-react"

// const navigation = [
//   { name: "Dashboard", href: "/faculty", icon: Home },
//   { name: "Assigned Subjects", href: "/faculty/assigned-subjects", icon: BookOpen },
//   { name: "Upload Marks", href: "/faculty/upload-marks", icon: Upload },
// ]

// export function FacultySidebar() {
//   const pathname = usePathname()

//   return (
//     <div className="flex h-full w-64 flex-col bg-white shadow-md">
//       <div className="flex h-16 items-center justify-center border-b">
//         <h2 className="text-2xl font-semibold text-gray-800">Faculty Portal</h2>
//       </div>
//       <nav className="flex-1 space-y-1 px-2 py-4">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
//                 isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//               }`}
//             >
//               <item.icon className="mr-3 h-6 w-6" />
//               {item.name}
//             </Link>
//           )
//         })}
//       </nav>
//     </div>
//   )
// }

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, Upload } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/faculty", icon: Home },
  { name: "Assigned Subjects", href: "/faculty/assigned-subjects", icon: BookOpen },
  { name: "Upload Marks", href: "/faculty/upload-marks", icon: Upload },
]

export function FacultySidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-[73px] w-64 bg-white min-h-[calc(100vh-73px)] border-r">
      <div className="flex h-16 items-center justify-center border-b">
        <h2 className="text-2xl font-semibold text-gray-800">Faculty Portal</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
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


