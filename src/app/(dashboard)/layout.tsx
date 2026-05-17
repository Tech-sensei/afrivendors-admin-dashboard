import { AdminDashboardLayout } from "@/components/dashboardLayout/admin-dashboard-layout"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>
}
