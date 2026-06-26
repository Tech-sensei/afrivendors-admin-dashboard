export type AdminNotificationType =
  | "dispute"
  | "booking"
  | "payment"
  | "payout"
  | "vendor"
  | "customer"
  | "custom_request"
  | "review"
  | "message"
  | "system"
  | "update"

export type AdminNotificationReferenceType =
  | "appointment_booking"
  | "custom_request"
  | "dispute"
  | "chat_message"
  | "vendor_application"
  | "payout"
  | (string & {})

export interface AdminNotification {
  id: string
  type: AdminNotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  referenceType?: AdminNotificationReferenceType
  itemId?: number | null
}

export interface NotificationsListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface NotificationsPage {
  items: AdminNotification[]
  meta: NotificationsListMeta
}
