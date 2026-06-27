import type {
  AdminCustomRequestApiItem,
  AdminCustomRequestQuoteApi,
} from "@/types/admin-custom-requests"
import type {
  RfsAcceptedQuote,
  RfsPaymentStatus,
  RfsRequest,
  RfsRequestStatus,
} from "@/components/rfsManagement/data"
import { formatTimeFromApi } from "@/lib/mapAdminAppointment"

function getCategoryName(api: AdminCustomRequestApiItem): string {
  if (typeof api.category === "string") return api.category
  if (api.category && typeof api.category === "object") {
    return api.category.name ?? "Category"
  }
  return api.categoryName ?? "Category"
}

function getCustomerName(api: AdminCustomRequestApiItem): string {
  if (api.customerName?.trim()) return api.customerName.trim()
  const user = api.user ?? api.customer
  if (!user) return "Customer"
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return full || user.name || "Customer"
}

function getCustomerEmail(api: AdminCustomRequestApiItem): string {
  if (api.customerEmail?.trim()) return api.customerEmail.trim()
  return api.user?.email ?? api.customer?.email ?? "—"
}

function getCustomerId(api: AdminCustomRequestApiItem): string {
  const id = api.user?.id ?? api.customer?.id
  return id != null ? String(id) : "—"
}

function getCustomerUserId(api: AdminCustomRequestApiItem): number | null {
  const id = api.user?.id ?? api.customer?.id
  return id != null ? Number(id) : null
}

function getVendorUserId(api: AdminCustomRequestApiItem): number | null {
  const id = api.vendor?.id
  return id != null ? Number(id) : null
}

function getVendorName(api: AdminCustomRequestApiItem): string {
  const vendor = api.vendor
  if (vendor) {
    if (vendor.businessName?.trim()) return vendor.businessName.trim()
    const full = [vendor.firstName, vendor.lastName].filter(Boolean).join(" ").trim()
    if (full) return full
    if (vendor.name?.trim()) return vendor.name.trim()
  }
  return getVendorNameFromQuote(pickPrimaryQuote(api))
}

function getVendorId(api: AdminCustomRequestApiItem): string {
  if (api.vendor?.id != null) return String(api.vendor.id)
  return getVendorIdFromQuote(pickPrimaryQuote(api))
}

function getVendorEmail(api: AdminCustomRequestApiItem): string {
  if (api.vendor?.email?.trim()) return api.vendor.email.trim()
  const quote = pickPrimaryQuote(api)
  return quote?.vendor?.email?.trim() ?? "—"
}

function getVendorNameFromQuote(quote?: AdminCustomRequestQuoteApi | null): string {
  if (!quote) return "—"
  if (quote.vendorName?.trim()) return quote.vendorName.trim()
  const vendor = quote.vendor
  if (!vendor) return "—"
  if (vendor.businessName?.trim()) return vendor.businessName.trim()
  const full = [vendor.firstName, vendor.lastName].filter(Boolean).join(" ").trim()
  return full || vendor.name || "—"
}

function getVendorIdFromQuote(quote?: AdminCustomRequestQuoteApi | null): string {
  if (!quote) return "—"
  if (quote.vendorId != null) return String(quote.vendorId)
  if (quote.vendor?.id != null) return String(quote.vendor.id)
  return "—"
}

function mapApiStatus(status?: string): RfsRequestStatus {
  const key = String(status ?? "pending").toLowerCase()
  if (key === "accepted") return "Accepted"
  if (key === "rejected") return "Rejected"
  if (key === "cancelled" || key === "canceled") return "Cancelled"
  if (key === "completed") return "Completed"
  return "Pending"
}

function mapPaymentStatus(status?: string | null): RfsPaymentStatus {
  const key = String(status ?? "unpaid").toLowerCase()
  if (key === "paid") return "Paid"
  if (key === "released") return "Released"
  if (key === "refunded") return "Refunded"
  if (key === "disputed") return "Disputed"
  if (key === "pending") return "Pending"
  return "Unpaid"
}

function mapQuote(quote: AdminCustomRequestQuoteApi): RfsAcceptedQuote {
  const lineItems = (quote.breakdown ?? quote.lineItems ?? []).map((row) => ({
    description: row.item ?? row.description ?? "Item",
    amount: Number(row.price ?? row.amount ?? 0),
  }))
  const totalAmount = Number(
    quote.totalAmount ??
      quote.total ??
      quote.amount ??
      lineItems.reduce((sum, row) => sum + row.amount, 0),
  )

  return {
    id: String(quote.id),
    vendorId: getVendorIdFromQuote(quote),
    vendorName: getVendorNameFromQuote(quote),
    totalAmount,
    lineItems,
    note: quote.note ?? quote.message ?? undefined,
    validUntil: quote.validUntil ?? undefined,
    status: String(quote.status ?? "pending"),
    createdAt: quote.createdAt ?? "",
  }
}

function pickPrimaryQuote(api: AdminCustomRequestApiItem): AdminCustomRequestQuoteApi | undefined {
  return api.acceptedQuote ?? api.quotes?.find((q) => String(q.status).toLowerCase() === "accepted") ?? api.quotes?.[0]
}

function getAgreedAmount(api: AdminCustomRequestApiItem, primaryQuote?: AdminCustomRequestQuoteApi): number {
  if (api.agreedAmount != null && api.agreedAmount > 0) return Number(api.agreedAmount)
  if (api.escrowAmount != null && api.escrowAmount > 0) return Number(api.escrowAmount)
  if (primaryQuote) {
    return Number(
      primaryQuote.totalAmount ?? primaryQuote.total ?? primaryQuote.amount ?? 0,
    )
  }
  return 0
}

export function mapAdminCustomRequestApiToRfsRequest(
  api: AdminCustomRequestApiItem,
): RfsRequest {
  const primaryQuote = pickPrimaryQuote(api)
  const quotes = (api.quotes ?? []).map(mapQuote)
  const acceptedQuote = api.acceptedQuote ? mapQuote(api.acceptedQuote) : undefined
  const agreedAmount = getAgreedAmount(api, primaryQuote)
  const budget = Number(api.budget ?? 0)

  return {
    id: String(api.id),
    referenceId:
      api.referenceId ?? api.reference ?? `CR-${String(api.id).padStart(4, "0")}`,
    title: api.requestTitle ?? api.title ?? "Custom request",
    description: api.description ?? "",
    category: getCategoryName(api),
    customerName: getCustomerName(api),
    customerId: getCustomerId(api),
    customerUserId: getCustomerUserId(api),
    customerEmail: getCustomerEmail(api),
    vendorName: getVendorName(api),
    vendorId: getVendorId(api),
    vendorUserId: getVendorUserId(api),
    vendorEmail: getVendorEmail(api),
    budget,
    agreedAmount,
    amount: agreedAmount > 0 ? agreedAmount : budget,
    preferredDate: api.date ?? api.preferredDate ?? "",
    preferredTime: formatTimeFromApi(api.time ?? api.preferredTime ?? ""),
    location: api.location ?? "—",
    priority: String(api.priority ?? "medium"),
    status: mapApiStatus(api.status),
    paymentStatus: mapPaymentStatus(api.paymentStatus),
    paymentMethod: api.paymentMethod ? String(api.paymentMethod) : "—",
    createdAt: api.createdAt ?? "",
    completedAt: api.completedAt ?? undefined,
    quoteCount: api.quoteCount ?? api.quotes?.length ?? 0,
    acceptedQuote,
    quotes,
    imageUrl: api.imageUrl ?? undefined,
    fundsReleasedAt: api.fundsReleasedAt ?? undefined,
    hasDispute: Boolean(api.dispute),
  }
}
