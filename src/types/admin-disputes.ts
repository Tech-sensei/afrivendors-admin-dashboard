export type AdminDisputePartyApi = {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type AdminDisputeServiceApi = {
  id: number
  serviceName?: string
  name?: string
}

export type AdminDisputeAppointmentSnapshotApi = {
  id: number
  status: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: number
  date: string
  time: string
  customerName: string
  customerPhone: string
  customerEmail: string
  vendor: AdminDisputePartyApi
  user: AdminDisputePartyApi
  services?: AdminDisputeServiceApi[]
}

/** GET /admin/disputes item */
export type AdminDisputeApi = {
  id: number
  reason: string
  resolution: string | null
  status: string
  resolver: number | null
  resolvedBy: string | null
  resolvedAt: string | null
  escalatedBy: number | null
  escalatedAt: string | null
  createdAt: string
  updatedAt: string
  appointment: AdminDisputeAppointmentSnapshotApi
}

export type AdminDisputesListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminDisputesListResponse = {
  data: AdminDisputeApi[]
  meta: AdminDisputesListMeta
}

export type AdminDisputeResolveAction = "release_funds" | "refund"

export type DisputeDisplayStatus = "Open" | "Under Review" | "Escalated" | "Resolved"

export type DisputeStats = {
  total: number
  open: number
  underReview: number
  escalated: number
  resolved: number
  escrowFrozen: number
}

export type DisputeItem = {
  id: number
  caseId: string
  reason: string
  resolution: string | null
  displayStatus: DisputeDisplayStatus
  apiStatus: string
  customerName: string
  customerInitials: string
  customerEmail: string
  vendorName: string
  vendorEmail: string
  appointmentId: number
  appointmentLabel: string
  orderLabel: string
  escrowFrozen: boolean
  dateRaised: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: number
  appointmentDate: string
  appointmentTime: string
  appointmentStatus: string
  customerPhone: string
  serviceNames: string[]
  resolvedAt: string | null
  resolvedBy: string | null
  escalatedAt: string | null
  raw: AdminDisputeApi
}
