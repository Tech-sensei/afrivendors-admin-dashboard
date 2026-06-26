"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { NotificationItem } from "@/components/notifications/NotificationItem"
import { buildAdminNotificationHref } from "@/lib/notificationRoutes"
import type { AdminNotification } from "@/types/admin-notifications"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsInfinite,
  useUnreadNotificationCount,
} from "@/services/useNotifications"

type FilterType =
  | "all"
  | "unread"
  | "disputes"
  | "bookings"
  | "payments"
  | "vendors"

function matchesFilter(notification: AdminNotification, filter: FilterType): boolean {
  if (filter === "unread") return !notification.isRead
  if (filter === "disputes") return notification.type === "dispute"
  if (filter === "bookings") {
    return (
      notification.type === "booking" ||
      notification.referenceType === "appointment_booking"
    )
  }
  if (filter === "payments") {
    return notification.type === "payment" || notification.type === "payout"
  }
  if (filter === "vendors") {
    return notification.type === "vendor" || notification.referenceType === "vendor_application"
  }
  return true
}

export function NotificationsManagement() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const listQuery = useNotificationsInfinite()
  const { data: apiUnreadCount = 0 } = useUnreadNotificationCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [listQuery.data],
  )

  const filteredNotifications = useMemo(
    () => notifications.filter((n) => matchesFilter(n, activeFilter)),
    [notifications, activeFilter],
  )

  const countForFilter = (filter: FilterType) =>
    notifications.filter((n) => matchesFilter(n, filter)).length

  const handleMarkAsRead = (id: string) => {
    markRead.mutate(id, {
      onError: () => toast.error("Could not mark notification as read"),
    })
  }

  const handleMarkAllAsRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Could not mark all notifications as read"),
    })
  }

  const handleNavigate = (notification: AdminNotification) => {
    const href = buildAdminNotificationHref(notification)
    if (!href) return
    if (href.startsWith("http://") || href.startsWith("https://")) {
      window.location.href = href
      return
    }
    router.push(href)
  }

  const isLoading = listQuery.isLoading
  const isError = listQuery.isError
  const hasNextPage = listQuery.hasNextPage ?? false
  const isFetchingNextPage = listQuery.isFetchingNextPage

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="font-unbounded text-3xl font-semibold text-secondary-000">
              Notifications
            </h1>
            {apiUnreadCount > 0 ? (
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-destructive px-2.5 font-unageo text-sm font-bold text-white">
                {apiUnreadCount > 99 ? "99+" : apiUnreadCount}
              </span>
            ) : null}
          </div>
          <p className="font-unageo text-base text-accent-70">
            Stay updated on platform activity and admin alerts
          </p>
        </div>

        {apiUnreadCount > 0 ? (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllRead.isPending}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 font-unageo text-sm font-semibold text-secondary-000 shadow-sm transition-all hover:bg-secondary-800 disabled:opacity-60"
          >
            {markAllRead.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCheck size={18} />
            )}
            Mark all read
          </button>
        ) : null}
      </header>

      <div className="-mx-2 overflow-x-auto px-2 pb-2">
        <div className="flex w-max shrink-0 gap-2 rounded-xl border border-border bg-white p-1.5 shadow-sm">
          {(
            [
              { id: "all" as FilterType, label: "All" },
              { id: "unread" as FilterType, label: "Unread" },
              { id: "disputes" as FilterType, label: "Disputes" },
              { id: "bookings" as FilterType, label: "Bookings" },
              { id: "payments" as FilterType, label: "Payments" },
              { id: "vendors" as FilterType, label: "Vendors" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap rounded-[10px] px-5 py-2.5 font-unageo text-sm font-semibold transition-all ${
                activeFilter === filter.id
                  ? "bg-primary-100 text-white shadow-md"
                  : "bg-transparent text-accent-70 hover:bg-secondary-800 hover:text-secondary-000"
              }`}
            >
              {filter.label}{" "}
              <span className="ml-1 opacity-80">({countForFilter(filter.id)})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
            <p className="font-unageo text-sm text-accent-70">Loading notifications…</p>
          </div>
        ) : null}

        {isError && !isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <p className="font-unbounded text-lg font-semibold text-secondary-000">
              Could not load notifications
            </p>
            <p className="font-unageo text-accent-70">Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => listQuery.refetch()}
              className="rounded-xl border border-border px-5 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!isLoading && !isError && filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-800">
              <Bell size={32} className="text-accent-70" />
            </div>
            <h3 className="mb-2 font-unbounded text-lg font-semibold text-secondary-000">
              No notifications found
            </h3>
            <p className="max-w-xs font-unageo text-accent-70">
              {activeFilter === "all"
                ? "You're all caught up. Check back later for updates."
                : `You don't have any ${activeFilter} notifications right now.`}
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && filteredNotifications.length > 0 ? (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
                onNavigate={handleNavigate}
                isMarkingRead={markRead.isPending && markRead.variables === notification.id}
              />
            ))}
          </div>
        ) : null}
      </div>

      {!isLoading && !isError && hasNextPage ? (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={isFetchingNextPage}
            onClick={() => listQuery.fetchNextPage()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 font-unageo text-sm font-semibold text-secondary-000 shadow-sm transition-all hover:bg-secondary-800 disabled:opacity-60"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      ) : null}

      {notifications.length > 0 && !isLoading && !isError ? (
        <p className="text-center font-unageo text-sm text-accent-70">
          Showing {filteredNotifications.length} of {notifications.length} loaded
          {listQuery.data?.pages[0]?.meta.total != null &&
            ` (${listQuery.data.pages[0].meta.total} total)`}
        </p>
      ) : null}
    </div>
  )
}
