"use client"

import { Bell, Calendar, CreditCard, Package, X } from "lucide-react"

type Item = { id: string; title: string; time: string; icon: typeof Bell }

const items: Item[] = [
  {
    id: "1",
    title: "Payout of ₦25,000 completed",
    time: "2 min ago",
    icon: CreditCard,
  },
  {
    id: "2",
    title: "New vendor application pending review",
    time: "1 h ago",
    icon: Package,
  },
  {
    id: "3",
    title: "System maintenance window scheduled",
    time: "Yesterday",
    icon: Calendar,
  },
]

interface AdminNotificationsDropdownProps {
  onClose: () => void
  onViewAll: () => void
}

export function AdminNotificationsDropdown({
  onClose,
  onViewAll,
}: AdminNotificationsDropdownProps) {
  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-1.5rem,22rem)] rounded-xl border border-border bg-white font-unageo shadow-lg"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-secondary-000">Notifications</p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-accent-70 transition-colors hover:bg-secondary-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="max-h-[min(100vh,18rem)] divide-y divide-border overflow-y-auto">
        {items.map((n) => {
          const Icon = n.icon
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={onClose}
                className="flex w-full gap-3 px-4 py-3 text-left text-sm text-secondary-000 transition-colors hover:bg-secondary-800"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100/10 text-primary-100">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="line-clamp-2 block">{n.title}</span>
                  <span className="mt-0.5 block text-xs text-accent-70">{n.time}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
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
