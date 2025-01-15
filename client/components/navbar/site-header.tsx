'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Curriculum', href: '/curriculum' },
  { name: 'Reports', href: '/reports' },
  { name: 'Assessment', href: '/assessment' },
  { name: 'Attainment', href: '/attainment' },
  { name: 'Survey', href: '/survey' },
  { name: 'FacultyCollaboration', href: '/faculty-collaboration' },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="w-full bg-white">
      <div className="container mx-auto px-4 py-1">
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
      </div>
      
      <nav className="border-t mt-2">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                  pathname === item.href
                    ? "bg-green-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

