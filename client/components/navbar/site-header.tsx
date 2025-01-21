"use client"

import Image from "next/image"

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-2">
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
    </header>
  )
}

