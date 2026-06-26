"use client"

import {
  Bell,
  Calendar,
  Check,
  DollarSign,
  MessageSquare,
  Scale,
  Store,
  Users,
  FileText,
  Star,
  Settings,
} from "lucide-react"
import type { ComponentType } from "react"
import type { AdminNotification, AdminNotificationType } from "@/types/admin-notifications"

interface NotificationItemProps {
  notification: AdminNotification
  onRead: (id: string) => void
  onNavigate?: (notification: AdminNotification) => void
  isMarkingRead?: boolean
}

export function NotificationItem({
  notification,
  onRead,
  onNavigate,
  isMarkingRead = false,
}: NotificationItemProps) {
  const Icon = getIcon(notification.type)
  const iconBgColor = getIconColor(notification.type, notification.isRead)

  const handleRowClick = () => {
    if (!notification.isRead) {
      onRead(notification.id)
    }
    onNavigate?.(notification)
  }

  return (
    <div
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleRowClick()
        }
      }}
      role="button"
      tabIndex={0}
      className={`group relative cursor-pointer border-b border-border p-5 transition-all duration-200 ${
        notification.isRead
          ? "bg-white hover:bg-secondary-800/40"
          : "bg-primary-100/8 hover:bg-primary-100/12"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${iconBgColor}`}
        >
          <Icon size={20} className={notification.isRead ? "text-accent-70" : "text-white"} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1.5 flex items-start justify-between gap-4">
            <h4
              className={`font-unageo text-[15px] leading-snug text-secondary-000 ${
                notification.isRead ? "font-semibold" : "font-bold"
              }`}
            >
              {notification.title}
            </h4>
            <span className="shrink-0 whitespace-nowrap font-unageo text-[13px] text-accent-70">
              {getTimeAgo(notification.timestamp)}
            </span>
          </div>

          <p
            className={`font-unageo text-sm leading-relaxed ${
              notification.isRead ? "text-accent-70" : "text-secondary-000"
            }`}
          >
            {notification.message}
          </p>

          {!notification.isRead ? (
            <div className="mt-3 flex flex-wrap gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                disabled={isMarkingRead}
                onClick={(e) => {
                  e.stopPropagation()
                  onRead(notification.id)
                }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 font-unageo text-xs font-bold text-accent-70 shadow-sm transition-all hover:border-primary-100 hover:text-primary-100 disabled:opacity-50"
              >
                <Check size={14} />
                {isMarkingRead ? "Marking…" : "Mark read"}
              </button>
            </div>
          ) : null}
        </div>
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getIcon(type: AdminNotificationType): ComponentType<{ size?: number; className?: string }> {
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
    case "review":
      return Star
    case "message":
      return MessageSquare
    case "system":
      return Settings
    default:
      return Bell
  }
}

function getIconColor(type: AdminNotificationType, isRead: boolean): string {
  if (isRead) return "bg-secondary-800 text-accent-70"

  switch (type) {
    case "dispute":
      return "bg-destructive"
    case "payment":
    case "payout":
      return "bg-emerald-600"
    case "vendor":
      return "bg-chart-1"
    case "customer":
      return "bg-chart-5"
    case "custom_request":
      return "bg-purple-600"
    case "review":
      return "bg-amber-500"
    case "system":
      return "bg-accent-70"
    default:
      return "bg-primary-100"
  }
}
