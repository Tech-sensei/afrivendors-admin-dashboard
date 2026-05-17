import type { PayoutRequest, PayoutStatus } from "@/components/payoutsManagement/data"
import type { AdminPayoutApiItem, AdminPayoutDetailApi } from "@/types/admin-payouts"

function mapApiStatus(status: string): PayoutStatus {
  const s = status.toLowerCase()
  if (s === "pending") return "Pending"
  if (s === "processing") return "Processing"
  if (s === "accepted") return "Approved"
  if (s === "completed") return "Completed"
  if (s === "rejected") return "Rejected"
  if (s === "failed") return "Failed"
  if (s === "approved" || s === "success") return "Approved"
  if (s === "cancelled" || s === "canceled") return "Rejected"
  return "Pending"
}

export function mapAdminPayoutApiToRequest(raw: AdminPayoutApiItem): PayoutRequest {
  const owner = `${raw.vendor.firstName} ${raw.vendor.lastName}`.trim()
  const displayName = raw.businessName?.trim() || owner || "Vendor"
  const created = new Date(raw.createdAt)

  return {
    id: String(raw.id),
    vendorId: String(raw.vendor.id),
    vendorName: displayName,
    vendorOwner: owner,
    vendorEmail: raw.vendor.email,
    vendorPhone: "—",
    amount: raw.amount,
    bankName: "—",
    accountNumber: "—",
    accountName: "—",
    dateRequested: created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeRequested: created.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    status: mapApiStatus(raw.status),
    requestedBy: owner,
    walletBalance: 0,
    completedBookings: 0,
    platformFee: 0,
    netAmount: raw.amount,
    transactionHistory: [],
    kycStatus: "Pending",
    approvedBy: raw.acceptedBy ?? undefined,
    rejectedBy: raw.rejectedBy ?? undefined,
    rejectionReason: raw.rejectionReason ?? undefined,
    payoutRef: raw.transactionRef ?? undefined,
    transactionId: raw.transactionId,
    transactionRef: raw.transactionRef,
  }
}

export function mapAdminPayoutDetailToRequest(raw: AdminPayoutDetailApi): PayoutRequest {
  const owner = `${raw.vendor.firstName} ${raw.vendor.lastName}`.trim()
  const displayName = raw.vendorProfile?.businessName?.trim() || owner || "Vendor"
  const created = new Date(raw.createdAt)
  const ledger = raw.ledgerTransaction
  const commission = ledger?.commissionAmount ?? 0
  const stripeId = raw.vendorProfile?.stripeAccountId
  const stripeStatus = raw.vendorProfile?.stripeStatus
  const stripeReady = stripeStatus === "fully_active"

  return {
    id: String(raw.id),
    vendorId: String(raw.vendor.id),
    vendorName: displayName,
    vendorOwner: owner,
    vendorEmail: raw.vendor.email,
    vendorPhone: raw.vendor.phoneNumber?.trim() || "—",
    amount: raw.amount,
    bankName: stripeId ? "Stripe Connect" : "—",
    accountNumber: stripeId ?? "—",
    accountName: displayName,
    dateRequested: created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeRequested: created.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    status: mapApiStatus(raw.status),
    requestedBy: owner,
    walletBalance: 0,
    completedBookings: 0,
    platformFee: commission,
    netAmount: ledger?.amount ?? raw.amount,
    transactionHistory: [],
    kycStatus: stripeReady ? "Verified" : "Pending",
    approvedBy: raw.acceptedBy ?? undefined,
    rejectedBy: raw.rejectedBy ?? undefined,
    rejectionReason: raw.rejectionReason ?? undefined,
    payoutRef: raw.transactionRef ?? undefined,
    transactionId: raw.transactionId,
    transactionRef: raw.transactionRef,
    payoutCurrency: ledger?.currency ?? null,
    ledgerDescription: ledger?.description ?? null,
    ledgerType: ledger?.type ?? null,
    ledgerReferenceId: ledger?.referenceId ?? null,
    ledgerReferenceType: ledger?.referenceType ?? null,
    vendorCategory: raw.vendorProfile?.category?.name ?? null,
    stripeConnectStatus: stripeStatus,
  }
}
