"use client"

import {
  Bell,
  Calendar,
  CheckCheck,
  DollarSign,
  FileText,
  Loader2,
  Scale,
  Settings,
  Store,
  Users,
  X,
} from "lucide-react"
import type { ComponentType } from "react"
import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { buildAdminNotificationHref } from "@/lib/notificationRoutes"
import type { AdminNotification, AdminNotificationType } from "@/types/admin-notifications"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsInfinite,
} from "@/services/useNotifications"

interface AdminNotificationsDropdownProps {
  onClose: () => void
  onViewAll: () => void
}

const DROPDOWN_LIMIT = 8

export function AdminNotificationsDropdown({
  onClose,
  onViewAll,
}: AdminNotificationsDropdownProps) {
  const router = useRouter()
  const listQuery = useNotificationsInfinite(true)
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.items).slice(0, DROPDOWN_LIMIT) ?? [],
    [listQuery.data],
  )

  const unreadInList = notifications.filter((n) => !n.isRead).length

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id)
    }
    const href = buildAdminNotificationHref(notification)
    if (href) {
      onClose()
      if (href.startsWith("http://") || href.startsWith("https://")) {
        window.location.href = href
        return
      }
      router.push(href)
    }
  }

  const handleMarkAllAsRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Could not mark all notifications as read"),
    })
  }

  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-1.5rem,24rem)] rounded-xl border border-border bg-white font-unageo shadow-lg"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-secondary-000">Notifications</p>
          {unreadInList > 0 ? (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-white">
              {unreadInList}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-accent-70 transition-colors hover:bg-secondary-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {unreadInList > 0 ? (
        <div className="border-b border-border px-4 py-2">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllRead.isPending}
            className="inline-flex items-center gap-1.5 font-unageo text-xs font-semibold text-primary-100 disabled:opacity-60"
          >
            {markAllRead.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5" />
            )}
            Mark all as read
          </button>
        </div>
      ) : null}

      <div className="max-h-[min(100vh,20rem)] overflow-y-auto">
        {listQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-accent-70">
            <Loader2 className="h-4 w-4 animate-spin text-primary-100" />
            Loading…
          </div>
        ) : null}

        {listQuery.isError && !listQuery.isLoading ? (
          <div className="px-4 py-8 text-center text-sm text-accent-70">
            Could not load notifications.
          </div>
        ) : null}

        {!listQuery.isLoading && !listQuery.isError && notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Bell className="h-6 w-6 text-accent-70" />
            <p className="text-sm font-semibold text-secondary-000">No notifications</p>
            <p className="text-xs text-accent-70">You&apos;re all caught up.</p>
          </div>
        ) : null}

        {!listQuery.isLoading && !listQuery.isError
          ? notifications.map((notification) => {
              const Icon = getIcon(notification.type)
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex w-full gap-3 border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-b-0 ${
                    notification.isRead
                      ? "text-secondary-000 hover:bg-secondary-800"
                      : "bg-primary-100/8 text-secondary-000 hover:bg-primary-100/12"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      notification.isRead
                        ? "bg-secondary-800 text-accent-70"
                        : "bg-primary-100 text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block font-semibold">{notification.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-accent-70">
                      {notification.message}
                    </span>
                    <span className="mt-1 block text-[11px] text-accent-70">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </span>
                </button>
              )
            })
          : null}
      </div>

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full rounded-lg py-2.5 text-center text-sm font-semibold text-primary-100 transition-colors hover:bg-primary-100/10"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function getIcon(type: AdminNotificationType): ComponentType<{ className?: string }> {
  switch (type) {
    case "dispute":
      return Scale
    case "booking":
      return Calendar
    case "payment":
    case "payout":
      return DollarSign
    case "vendor":
      return Store
    case "customer":
      return Users
    case "custom_request":
      return FileText
    case "system":
      return Settings
    default:
      return Bell
  }
}
