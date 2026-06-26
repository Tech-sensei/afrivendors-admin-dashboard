"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { AdminTopNav } from "@/components/dashboardLayout/admin-top-nav"
import { useUnreadNotificationCount } from "@/services/useNotifications"

export function AdminHeader({ onLogout }: { onLogout: () => void }) {
  const router = useRouter()
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationCount()

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
      unreadNotificationsCount={unreadNotificationsCount}
    />
  )
}
