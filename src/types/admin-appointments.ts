/** GET /admin/appointments & GET /admin/appointments/breakdown
 *  List query: page, limit, status?, vendorName? (vendor display name filter)
 */

export type AdminAppointmentVendorApi = {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type AdminAppointmentUserApi = {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type AdminAppointmentServiceApi = {
  id: number
  serviceName: string
}

export type AdminAppointmentApiItem = {
  id: number
  status: string
  date: string
  time: string
  rescheduleDate: string | null
  rescheduleTime: string | null
  customerName: string
  customerPhone: string
  customerEmail: string
  vendor: AdminAppointmentVendorApi
  user: AdminAppointmentUserApi
  services: AdminAppointmentServiceApi[]
  createdAt: string
}

export type AdminAppointmentsListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminAppointmentsListResponse = {
  data: AdminAppointmentApiItem[]
  meta: AdminAppointmentsListMeta
}

export type AdminAppointmentsBreakdown = {
  pending: number
  accepted: number
  rejected: number
  canceled: number
  completed: number
}

export type AdminAppointmentListStatusParam =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled"
  | "completed"
