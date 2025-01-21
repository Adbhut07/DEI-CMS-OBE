import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/dashboard" passHref>
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </li>
        <li>
          <Link href="/course-management" passHref>
            <Button variant="ghost">Course Management</Button>
          </Link>
        </li>
        <li>
          <Link href="/view-assigned-faculty" passHref>
            <Button variant="ghost">View Assigned Faculty</Button>
          </Link>
        </li>
        {/* Add other navigation items as needed */}
      </ul>
    </nav>
  )
}

