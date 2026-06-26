import { Check, Clock, X, XCircle } from "lucide-react"
import type { ComponentType } from "react"
import type { RfsPaymentStatus, RfsRequestStatus } from "./data"

export { DrawerFrame, SelectField, formatPrettyDate, formatShortDate } from "@/components/bookingsManagement/shared"

export function statusBadge(status: RfsRequestStatus) {
  const styles: Record<RfsRequestStatus, string> = {
    Pending: "bg-chart-5/15 text-chart-5",
    Accepted: "bg-emerald-500/15 text-emerald-700",
    Completed: "bg-chart-2/15 text-chart-2",
    Cancelled: "bg-destructive/15 text-destructive",
    Rejected: "bg-destructive/15 text-destructive",
  }
  const iconMap: Record<RfsRequestStatus, ComponentType<{ className?: string }>> = {
    Pending: Clock,
    Accepted: Check,
    Completed: Check,
    Cancelled: XCircle,
    Rejected: XCircle,
  }
  const Icon = iconMap[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-unageo text-xs font-semibold ${styles[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  )
}

export function paymentBadge(status: RfsPaymentStatus) {
  const styles: Record<RfsPaymentStatus, string> = {
    Paid: "bg-chart-2/15 text-chart-2",
    Released: "bg-chart-2/15 text-chart-2",
    Pending: "bg-chart-5/15 text-chart-5",
    Refunded: "bg-accent-40/20 text-accent-70",
    Disputed: "bg-destructive/15 text-destructive",
    Unpaid: "bg-accent-40/20 text-accent-70",
  }
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-unageo text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  )
}

export function formatMoney(amount: number) {
  if (!amount || amount <= 0) return "—"
  const hasCents = Math.round(amount * 100) % 100 !== 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amount)
}

export function rfsSearchMatch(
  request: { title: string; customerName: string; category: string; referenceId: string },
  query: string,
) {
  const q = query.toLowerCase()
  return (
    request.title.toLowerCase().includes(q) ||
    request.customerName.toLowerCase().includes(q) ||
    request.category.toLowerCase().includes(q) ||
    request.referenceId.toLowerCase().includes(q)
  )
}
