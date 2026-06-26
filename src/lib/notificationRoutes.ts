import type { AdminNotification } from "@/types/admin-notifications"

export const ADMIN_NOTIFICATION_ROUTE_MAP: Record<string, string> = {
  "admin-disputes": "/disputes",
  "admin-vendors": "/vendors",
  "admin-customers": "/customers",
  "admin-bookings": "/bookings",
  "admin-appointments": "/bookings",
  "admin-payments": "/payments",
  "admin-payouts": "/payouts",
  "admin-reviews": "/reviews",
  "admin-custom-requests": "/custom-requests",
  "admin-rfs": "/custom-requests",
  "admin-notifications": "/notifications",
  "admin-dashboard": "/dashboard",
}

export function buildAdminNotificationHref(
  notification: Pick<
    AdminNotification,
    "referenceType" | "itemId" | "type" | "actionUrl"
  >,
): string | undefined {
  const itemId = notification.itemId
  const ref = notification.referenceType?.toLowerCase()

  if (ref === "dispute" && itemId != null) {
    return `/disputes?disputeId=${itemId}`
  }
  if (ref === "appointment_booking" && itemId != null) {
    return `/bookings?appointmentId=${itemId}`
  }
  if (ref === "custom_request" && itemId != null) {
    return `/custom-requests?requestId=${itemId}`
  }
  if (ref === "vendor_application" && itemId != null) {
    return `/vendors?vendorId=${itemId}`
  }
  if (ref === "payout" && itemId != null) {
    return `/payouts?payoutId=${itemId}`
  }

  if (notification.actionUrl) {
    return resolveAdminNotificationHref(notification.actionUrl)
  }

  if (notification.type === "dispute") return "/disputes"
  if (notification.type === "booking") return "/bookings"
  if (notification.type === "custom_request") return "/custom-requests"
  if (notification.type === "vendor") return "/vendors"
  if (notification.type === "customer") return "/customers"
  if (notification.type === "payment") return "/payments"
  if (notification.type === "payout") return "/payouts"
  if (notification.type === "review") return "/reviews"

  return undefined
}

export function resolveAdminNotificationHref(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  if (url.startsWith("admin-")) {
    return ADMIN_NOTIFICATION_ROUTE_MAP[url] ?? `/${url.replace(/^admin-/, "")}`
  }
  if (url.startsWith("/")) {
    return url
  }
  return `/${url}`
}
