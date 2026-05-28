export type AdminAppointmentDisputeApi = {
  id: number
  reason: string
  resolution: string | null
  status: string
  resolver: string | null
  resolvedBy: number | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminDisputeAppointmentApi = {
  id: number
  status: string
  date: string
  time: string
  customerName: string
  customerPhone: string
  customerEmail: string
  totalAmount?: number
  vendorAmount?: number
  commissionAmount?: number
  paymentStatus?: string
  paymentMethod?: string
  vendor: { id: number; firstName: string; lastName: string; email: string }
  user: { id: number; firstName: string; lastName: string; email: string }
  services: { id: number; serviceName: string }[]
  dispute: AdminAppointmentDisputeApi | null
  createdAt: string
}

export type AdminDisputeResolveAction = "release_funds" | "refund"
