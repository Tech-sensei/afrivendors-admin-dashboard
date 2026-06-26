import type {
  AdminDisputeApi,
  AdminDisputeOrderSnapshotApi,
  AdminDisputeOrderType,
  AdminDisputesListResponse,
  DisputeDisplayStatus,
  DisputeItem,
  DisputeStats,
} from "@/types/admin-disputes"

function padId(prefix: string, id: number, length: number) {
  return `${prefix}-${String(id).padStart(length, "0")}`
}

function getDisputeSnapshot(dispute: AdminDisputeApi): AdminDisputeOrderSnapshotApi | null {
  return dispute.appointment ?? dispute.customRequest ?? null
}

function getDisputeOrderType(dispute: AdminDisputeApi): AdminDisputeOrderType {
  if (dispute.type === "custom_request" || dispute.type === "appointment") {
    return dispute.type
  }
  return dispute.customRequest ? "custom_request" : "appointment"
}

function getDisputeOrderId(dispute: AdminDisputeApi, snapshot: AdminDisputeOrderSnapshotApi): number {
  return dispute.orderId ?? snapshot.id
}

function getSnapshotAmount(snapshot: AdminDisputeOrderSnapshotApi): number {
  return Number(snapshot.totalAmount ?? snapshot.agreedAmount ?? snapshot.budget ?? 0)
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
  const snapshot = getDisputeSnapshot(dispute)
  const paymentStatus = snapshot?.paymentStatus?.toLowerCase() ?? ""
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
  const snapshot = getDisputeSnapshot(dispute)
  if (!snapshot) {
    throw new Error("Dispute is missing order snapshot")
  }

  const orderType = getDisputeOrderType(dispute)
  const orderId = getDisputeOrderId(dispute, snapshot)
  const orderPrefix = orderType === "custom_request" ? "CR" : "APT"
  const orderLabelPrefix = orderType === "custom_request" ? "CR" : "ORD"

  const customerName =
    snapshot.customerName ||
    `${snapshot.user.firstName} ${snapshot.user.lastName}`.trim()

  const vendorName =
    `${snapshot.vendor.firstName} ${snapshot.vendor.lastName}`.trim()

  const serviceNames =
    snapshot.services?.map(
      (service) => service.serviceName ?? service.name ?? `Service #${service.id}`,
    ) ?? []

  const orderTitle =
    snapshot.requestTitle?.trim() ||
    snapshot.title?.trim() ||
    (serviceNames.length > 0 ? serviceNames.join(", ") : `${orderType === "custom_request" ? "Custom request" : "Appointment"} #${orderId}`)

  return {
    id: dispute.id,
    caseId: padId("DSP", dispute.id, 3),
    orderType,
    orderId,
    orderTitle,
    reason: dispute.reason,
    resolution: dispute.resolution,
    displayStatus: getDisputeDisplayStatus(dispute),
    apiStatus: dispute.status,
    customerName,
    customerInitials: getCustomerInitials(customerName),
    customerEmail: snapshot.customerEmail || snapshot.user.email,
    vendorName,
    vendorEmail: snapshot.vendor.email,
    appointmentId: orderId,
    appointmentLabel: padId(orderPrefix, orderId, 4),
    orderLabel: padId(orderLabelPrefix, orderId, 4),
    escrowFrozen: isDisputeEscrowFrozen(dispute),
    dateRaised: formatDisputeDate(dispute.createdAt),
    paymentStatus: snapshot.paymentStatus,
    paymentMethod: snapshot.paymentMethod,
    totalAmount: getSnapshotAmount(snapshot),
    appointmentDate: snapshot.date ?? "—",
    appointmentTime: snapshot.time ?? "—",
    appointmentStatus: snapshot.status,
    customerPhone: snapshot.customerPhone ?? "—",
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
  const hasAppointment = inner.appointment && typeof inner.appointment === "object"
  const hasCustomRequest = inner.customRequest && typeof inner.customRequest === "object"
  if (!hasAppointment && !hasCustomRequest) return null
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
