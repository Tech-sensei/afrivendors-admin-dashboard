/** GET /admin/payouts — paginated payout list */

export type AdminPayoutVendorApi = {
  id: number
  firstName: string
  lastName: string
  email: string
  accountType: string
  phoneNumber?: string | null
}

export type AdminPayoutApiItem = {
  id: number
  amount: number
  status: string
  transactionId: string | null
  transactionRef: string | null
  userId: number
  rejectionReason: string | null
  transactionDate: string | null
  acceptedBy: string | null
  rejectedBy: string | null
  createdAt: string
  updatedAt: string
  vendor: AdminPayoutVendorApi
  businessName: string | null
}

export type AdminPayoutsListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminPayoutsListResponse = {
  data: AdminPayoutApiItem[]
  meta: AdminPayoutsListMeta
}

export type AdminPayoutVendorProfileCategoryApi = {
  id: number
  name: string
}

export type AdminPayoutVendorProfileApi = {
  businessName: string | null
  stripeStatus: string | null
  stripeAccountId: string | null
  category: AdminPayoutVendorProfileCategoryApi | null
}

export type AdminPayoutLedgerTransactionApi = {
  id: number
  amount: number
  currency: string
  status: string
  type: string
  commissionAmount: number
  referenceId: string
  referenceType: string
  description: string
  createdAt: string
  updatedAt: string
}

/** GET /admin/payouts/:id */

export type AdminPayoutDetailApi = {
  id: number
  amount: number
  status: string
  transactionId: string | null
  transactionRef: string | null
  userId: number
  rejectionReason: string | null
  transactionDate: string | null
  acceptedBy: string | null
  rejectedBy: string | null
  createdAt: string
  updatedAt: string
  vendor: AdminPayoutVendorApi
  vendorProfile: AdminPayoutVendorProfileApi | null
  ledgerTransaction: AdminPayoutLedgerTransactionApi | null
}
