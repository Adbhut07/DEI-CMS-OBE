import { FacultyLayout } from "@/components/faculty/faculty-layout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FacultyLayout>{children}</FacultyLayout>
  )
}

