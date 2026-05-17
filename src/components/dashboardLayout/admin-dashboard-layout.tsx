"use client"

import { useCallback } from "react"
import { AdminHeader } from "@/components/dashboardLayout/admin-header"
import { AdminSidebar } from "@/components/dashboardLayout/admin-sidebar"
import { useAuthAPI } from "@/services/useAuthAPI"

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logoutAsync } = useAuthAPI()

  const onLogout = useCallback(() => {
    void logoutAsync()
  }, [logoutAsync])

  return (
    <div className="min-h-dvh bg-secondary-800">
      <AdminSidebar onLogout={onLogout} />
      <div className="min-h-dvh lg:ml-[280px]">
        <AdminHeader onLogout={onLogout} />
        <main className="min-w-0 px-3 pb-4 pt-[calc(72px+1rem)] text-secondary-000 sm:px-4 sm:pb-5 sm:pt-[calc(72px+1.25rem)] lg:px-6 lg:pb-6 lg:pt-[calc(72px+1.5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
