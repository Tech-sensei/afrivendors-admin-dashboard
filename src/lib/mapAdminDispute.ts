import type {
  AdminDisputeApi,
  AdminDisputesListResponse,
  DisputeDisplayStatus,
  DisputeItem,
  DisputeStats,
} from "@/types/admin-disputes"

function padId(prefix: string, id: number, length: number) {
  return `${prefix}-${String(id).padStart(length, "0")}`
}

export function getDisputeDisplayStatus(dispute: AdminDisputeApi): DisputeDisplayStatus {
  const status = dispute.status.toLowerCase()
  if (status === "resolved" || status === "closed") return "Resolved"
  if (dispute.escalatedAt) return "Escalated"
  if (status === "under_review" || status === "under review") return "Under Review"
  return "Open"
}

export function isDisputeEscrowFrozen(dispute: AdminDisputeApi): boolean {
  const status = dispute.status.toLowerCase()
  if (status === "resolved" || status === "closed") return false
  const paymentStatus = dispute.appointment.paymentStatus?.toLowerCase() ?? ""
  return paymentStatus === "paid" || paymentStatus === "pending" || paymentStatus === "held"
}

export function getCustomerInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
}

export function formatDisputeDate(value: string) {
  try {
    return new Date(value).toISOString().slice(0, 10)
  } catch {
    return value
  }
}

export function mapAdminDisputeApiToItem(dispute: AdminDisputeApi): DisputeItem {
  const customerName =
    dispute.appointment.customerName ||
    `${dispute.appointment.user.firstName} ${dispute.appointment.user.lastName}`.trim()

  const vendorName =
    `${dispute.appointment.vendor.firstName} ${dispute.appointment.vendor.lastName}`.trim()

  const serviceNames =
    dispute.appointment.services?.map(
      (service) => service.serviceName ?? service.name ?? `Service #${service.id}`,
    ) ?? []

  return {
    id: dispute.id,
    caseId: padId("DSP", dispute.id, 3),
    reason: dispute.reason,
    resolution: dispute.resolution,
    displayStatus: getDisputeDisplayStatus(dispute),
    apiStatus: dispute.status,
    customerName,
    customerInitials: getCustomerInitials(customerName),
    customerEmail: dispute.appointment.customerEmail || dispute.appointment.user.email,
    vendorName,
    vendorEmail: dispute.appointment.vendor.email,
    appointmentId: dispute.appointment.id,
    appointmentLabel: padId("APT", dispute.appointment.id, 4),
    orderLabel: padId("ORD", dispute.appointment.id, 4),
    escrowFrozen: isDisputeEscrowFrozen(dispute),
    dateRaised: formatDisputeDate(dispute.createdAt),
    paymentStatus: dispute.appointment.paymentStatus,
    paymentMethod: dispute.appointment.paymentMethod,
    totalAmount: dispute.appointment.totalAmount,
    appointmentDate: dispute.appointment.date,
    appointmentTime: dispute.appointment.time,
    appointmentStatus: dispute.appointment.status,
    customerPhone: dispute.appointment.customerPhone,
    serviceNames,
    resolvedAt: dispute.resolvedAt,
    resolvedBy: dispute.resolvedBy,
    escalatedAt: dispute.escalatedAt,
    raw: dispute,
  }
}

export function computeDisputeStats(disputes: AdminDisputeApi[]): DisputeStats {
  return {
    total: disputes.length,
    open: disputes.filter((d) => getDisputeDisplayStatus(d) === "Open").length,
    underReview: disputes.filter((d) => getDisputeDisplayStatus(d) === "Under Review").length,
    escalated: disputes.filter((d) => getDisputeDisplayStatus(d) === "Escalated").length,
    resolved: disputes.filter((d) => getDisputeDisplayStatus(d) === "Resolved").length,
    escrowFrozen: disputes.filter(isDisputeEscrowFrozen).length,
  }
}

export function normalizeDisputeDetail(payload: unknown): AdminDisputeApi | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const inner =
    p.data && typeof p.data === "object" && !Array.isArray(p.data)
      ? (p.data as Record<string, unknown>)
      : p
  if (typeof inner.id !== "number") return null
  if (!inner.appointment || typeof inner.appointment !== "object") return null
  return inner as AdminDisputeApi
}

export function normalizeDisputesList(payload: unknown): AdminDisputesListResponse | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  if (!Array.isArray(p.data)) return null
  const meta = p.meta
  if (!meta || typeof meta !== "object") return null
  const m = meta as Record<string, unknown>
  if (typeof m.total !== "number" || typeof m.page !== "number") return null

  return {
    data: p.data as AdminDisputeApi[],
    meta: {
      page: m.page,
      limit: typeof m.limit === "number" ? m.limit : 10,
      total: m.total,
      totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
    },
  }
}

export function disputeMatchesSearch(item: DisputeItem, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    item.caseId.toLowerCase().includes(q) ||
    item.customerName.toLowerCase().includes(q) ||
    item.customerEmail.toLowerCase().includes(q) ||
    item.vendorName.toLowerCase().includes(q) ||
    item.orderLabel.toLowerCase().includes(q) ||
    item.appointmentLabel.toLowerCase().includes(q) ||
    item.reason.toLowerCase().includes(q)
  )
}

export function disputeMatchesStatusFilter(item: DisputeItem, filter: string) {
  if (filter === "All Statuses") return true
  return item.displayStatus === filter
}

export type DisputeStatusFilter =
  | "All Statuses"
  | "Open"
  | "Under Review"
  | "Escalated"
  | "Resolved"

export const disputeStatusFilterOptions: DisputeStatusFilter[] = [
  "All Statuses",
  "Open",
  "Under Review",
  "Escalated",
  "Resolved",
]
