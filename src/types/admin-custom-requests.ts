/** GET /admin/custom-requests & GET /admin/custom-requests/{id} */

export type AdminCustomRequestListStatusParam =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed"

export type AdminCustomRequestUserApi = {
  id: number
  firstName?: string
  lastName?: string
  name?: string
  email?: string
}

export type AdminCustomRequestVendorApi = {
  id: number
  firstName?: string
  lastName?: string
  businessName?: string
  name?: string
  email?: string
}

export type AdminCustomRequestQuoteLineApi = {
  item?: string
  description?: string
  price?: number
  amount?: number
}

export type AdminCustomRequestQuoteApi = {
  id: number
  vendorId?: number
  vendor?: AdminCustomRequestVendorApi
  vendorName?: string
  breakdown?: AdminCustomRequestQuoteLineApi[]
  lineItems?: AdminCustomRequestQuoteLineApi[]
  totalAmount?: number
  total?: number
  amount?: number
  note?: string | null
  message?: string | null
  validUntil?: string | null
  status?: string
  createdAt?: string
}

export type AdminCustomRequestApiItem = {
  id: number
  requestTitle?: string
  title?: string
  referenceId?: string
  reference?: string
  categoryId?: number
  category?: { id?: number; name?: string } | string
  categoryName?: string
  description?: string
  budget?: number
  date?: string
  preferredDate?: string
  time?: string
  preferredTime?: string
  location?: string
  priority?: string
  imageUrl?: string | null
  status?: string
  paymentStatus?: string | null
  paymentMethod?: string | null
  user?: AdminCustomRequestUserApi
  customer?: AdminCustomRequestUserApi
  customerName?: string
  customerEmail?: string
  vendor?: AdminCustomRequestVendorApi
  agreedAmount?: number
  acceptedQuoteId?: number | null
  acceptedQuote?: AdminCustomRequestQuoteApi | null
  quotes?: AdminCustomRequestQuoteApi[]
  quoteCount?: number
  escrowAmount?: number
  createdAt?: string
  updatedAt?: string
  completedAt?: string | null
  fundsReleasedAt?: string | null
  dispute?: unknown
}

export type AdminCustomRequestsListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminCustomRequestsListResponse = {
  data: AdminCustomRequestApiItem[]
  meta: AdminCustomRequestsListMeta
}

export type AdminCustomRequestsBreakdown = {
  pending: number
  accepted: number
  rejected: number
  cancelled: number
  completed: number
}
