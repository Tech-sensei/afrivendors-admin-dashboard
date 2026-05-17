export interface AdminVendorsBreakdown {
  totalVendors: number
  activeVendors: number
  blockedVendors: number
  pendingVendors: number
  deletedVendors: number
}

/** GET /vendors — paginated vendor list (admin) */

export type AdminVendorCategoryApi = {
  id: number
  name: string
  iconName: string | null
}

export type AdminVendorApiItem = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  createdAt: string
  businessName: string | null
  category: AdminVendorCategoryApi | null
  stripeReady: boolean
  currency: string | null
}

export type AdminVendorsListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminVendorsListResponse = {
  data: AdminVendorApiItem[]
  meta: AdminVendorsListMeta
}
