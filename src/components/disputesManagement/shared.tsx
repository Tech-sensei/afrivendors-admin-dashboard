import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Shield,
  Unlock,
} from "lucide-react"
import type { DisputeDisplayStatus } from "@/types/admin-disputes"

export function formatDisputeMoney(amount?: number) {
  if (amount == null || Number.isNaN(amount)) return "—"
  return `£${amount.toFixed(2)}`
}

export function formatDisputeDateLabel(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return value
  }
}

export function disputeStatusBadge(status: DisputeDisplayStatus) {
  if (status === "Open") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 font-unageo text-[11px] font-semibold text-destructive">
        <AlertTriangle className="h-3 w-3" />
        Open
      </span>
    )
  }

  if (status === "Under Review") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-5/15 px-2.5 py-1 font-unageo text-[11px] font-semibold text-secondary-000">
        <Clock className="h-3 w-3 text-chart-5" />
        Under Review
      </span>
    )
  }

  if (status === "Escalated") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 font-unageo text-[11px] font-semibold text-violet-800">
        <Shield className="h-3 w-3" />
        Escalated
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-2/15 px-2.5 py-1 font-unageo text-[11px] font-semibold text-secondary-000">
      <CheckCircle className="h-3 w-3 text-chart-2" />
      Resolved
    </span>
  )
}

export function escrowStatusBadge(frozen: boolean) {
  if (frozen) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-5/15 px-2.5 py-1 font-unageo text-[11px] font-semibold text-secondary-000">
        <Lock className="h-3 w-3 text-chart-5" />
        Frozen
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-20 px-2.5 py-1 font-unageo text-[11px] font-semibold text-accent-70">
      <Unlock className="h-3 w-3" />
      Released
    </span>
  )
}

export function customerAvatar(initials: string) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100/12 font-unageo text-xs font-bold text-primary-100">
      {initials}
    </span>
  )
}

export function referenceBadge(label: string) {
  return (
    <span className="inline-flex rounded-md border border-border bg-secondary-800/50 px-2 py-0.5 font-unageo text-[11px] font-semibold text-accent-70">
      {label}
    </span>
  )
}
