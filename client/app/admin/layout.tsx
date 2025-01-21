import { AdminLayout } from "@/components/navbar/admin-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}

