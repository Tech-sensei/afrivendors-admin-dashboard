"use client"

import { Bell, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AdminNotificationsDropdown } from "@/components/dashboardLayout/admin-notifications-dropdown"
import { AdminProfileDropdown } from "@/components/dashboardLayout/admin-profile-dropdown"
import { cn } from "@/lib/utils"

export interface AdminTopNavProps {
  onNavigate: (panel: string) => void
  onOpenNotifications: () => void
  onLogout: () => void
  unreadNotificationsCount?: number
}

export function AdminTopNav({
  onNavigate,
  onOpenNotifications,
  onLogout,
  unreadNotificationsCount = 0,
}: AdminTopNavProps) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-20 flex h-[72px] items-center justify-between gap-3 border-b border-border bg-white px-3 sm:gap-4 sm:px-4 lg:left-[280px] lg:px-8",
      )}
    >
      <div className="flex max-w-[600px] flex-1 items-center">
        <div className="relative w-full min-w-0">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-accent-70"
            aria-hidden
          />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Search vendors, customers, bookings, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full rounded-[10px] border border-border bg-secondary-800 py-3 pl-11 font-unageo text-sm text-secondary-000 outline-none transition duration-150",
              "focus:border-primary-100 focus:bg-white",
              "placeholder:text-accent-70",
              searchQuery ? "pr-11" : "pr-4",
            )}
            autoComplete="off"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-none bg-transparent text-accent-70 transition-colors hover:bg-secondary-800"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotificationDropdown((o) => !o)}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-full border border-border transition duration-150",
              showNotificationDropdown
                ? "bg-secondary-800"
                : "bg-transparent hover:bg-secondary-800",
            )}
            aria-label={
              unreadNotificationsCount > 0
                ? `Notifications (${unreadNotificationsCount} unread)`
                : "Notifications"
            }
            aria-expanded={showNotificationDropdown}
            aria-haspopup="dialog"
          >
            <Bell className="h-5 w-5 text-accent-80" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-destructive px-1.5 text-[10px] font-semibold text-white">
                {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotificationDropdown && (
            <AdminNotificationsDropdown
              onClose={() => setShowNotificationDropdown(false)}
              onViewAll={() => {
                setShowNotificationDropdown(false)
                onOpenNotifications()
              }}
            />
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProfileDropdown((o) => !o)}
            className={cn(
              "flex items-center gap-2 rounded-[10px] border border-border py-2 pl-2 pr-2 text-left font-unageo transition duration-150 sm:gap-3 sm:pr-3",
              showProfileDropdown
                ? "bg-secondary-800"
                : "bg-transparent hover:bg-secondary-800",
            )}
            aria-expanded={showProfileDropdown}
            aria-haspopup="true"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <span className="font-unbounded text-sm font-semibold text-white">AD</span>
            </div>
            <div className="hidden sm:block">
              <p className="m-0 text-[13px] font-semibold leading-tight text-secondary-000">Admin</p>
              <p className="m-0 mt-0.5 text-[11px] leading-tight text-accent-70">System Administrator</p>
            </div>
          </button>

          {showProfileDropdown && (
            <AdminProfileDropdown
              onClose={() => setShowProfileDropdown(false)}
              onNavigate={onNavigate}
              onLogout={onLogout}
            />
          )}
        </div>
      </div>
    </header>
  )
}
