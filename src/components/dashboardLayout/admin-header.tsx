"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { AdminTopNav } from "@/components/dashboardLayout/admin-top-nav"

export function AdminHeader({ onLogout }: { onLogout: () => void }) {
  const router = useRouter()

  const onNavigate = useCallback(
    (panel: string) => {
      router.push(`/${panel}`)
    },
    [router],
  )

  const onOpenNotifications = useCallback(() => {
    router.push("/notifications")
  }, [router])

  return (
    <AdminTopNav
      onNavigate={onNavigate}
      onOpenNotifications={onOpenNotifications}
      onLogout={onLogout}
    />
  )
}
