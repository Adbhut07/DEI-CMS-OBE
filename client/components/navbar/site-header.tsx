// "use client"

// import Image from "next/image"

// export function SiteHeader() {
//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
//       <div className="container mx-auto px-4 py-2">
//         <div className="flex items-center gap-4">
//           <Image
//             src="/dei-logo.jpg"
//             alt="Dayalbagh Educational Institute Logo"
//             width={40}
//             height={40}
//             className="object-contain"
//           />
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
//               DAYALBAGH EDUCATIONAL INSTITUTE
//             </h1>
//             <p className="text-sm text-gray-600">(Deemed to be University)</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { clearUser } from "@/lib/store/features/user/userSlice"

interface RootState {
  user: {
    id: string | null
    name: string | null
    email: string | null
    role: string | null
    isAuthenticated: boolean
    image: string | null
  }
}

export function SiteHeader() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Get user data from Redux store
  const user = useAppSelector((state: RootState) => state.user)

  // Handle logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token")

    dispatch(clearUser())

    router.push("/signin")

    // Close dropdown
    setOpen(false)
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user.name) return "U"

    const nameParts = user.name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/dei-logo.jpg"
              alt="Dayalbagh Educational Institute Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                DAYALBAGH EDUCATIONAL INSTITUTE
              </h1>
              <p className="text-sm text-gray-600">(Deemed to be University)</p>
            </div>
          </div>

          {user.isAuthenticated && (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-10 w-10 cursor-pointer border-2 border-gray-200 transition-all hover:border-gray-300">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">Role: {user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer flex items-center"
                  onClick={() => {
                    setOpen(false)
                    router.push("/profile")
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

