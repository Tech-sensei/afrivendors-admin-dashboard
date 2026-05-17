import type { AdminAppointmentApiItem } from "@/types/admin-appointments"
import type { Booking, BookingStatus, PaymentMethod, PaymentStatus } from "@/components/bookingsManagement/data"

function vendorDisplayName(v: AdminAppointmentApiItem["vendor"]): string {
  return `${v.firstName} ${v.lastName}`.trim()
}

function serviceLine(services: AdminAppointmentApiItem["services"]): string {
  if (!services.length) return "—"
  const names = services.map((s) => s.serviceName?.trim()).filter(Boolean)
  if (!names.length) return "—"
  return names.join(", ")
}

function mapApiStatus(status: string): BookingStatus {
  const s = status.toLowerCase()
  if (s === "completed") return "Completed"
  if (s === "canceled" || s === "cancelled") return "Cancelled"
  if (s === "rejected") return "Rejected"
  if (s === "accepted") return "Accepted"
  if (s === "pending") return "Pending"
  return "Pending"
}

/** Format `HH:mm:ss` for display (12h). */
export function formatTimeFromApi(time: string): string {
  if (!time) return "—"
  const parts = time.split(":").map((p) => Number(p))
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

export function mapAdminAppointmentApiToBooking(raw: AdminAppointmentApiItem): Booking {
  const vendorName = vendorDisplayName(raw.vendor)
  const created = new Date(raw.createdAt)

  return {
    id: String(raw.id),
    bookingRef: `#${raw.id}`,
    customerName: raw.customerName,
    customerId: String(raw.user.id),
    customerEmail: raw.customerEmail,
    customerPhone: raw.customerPhone,
    vendorName,
    vendorId: String(raw.vendor.id),
    vendorEmail: raw.vendor.email,
    service: serviceLine(raw.services),
    date: raw.date,
    time: formatTimeFromApi(raw.time),
    duration: 0,
    amount: 0,
    status: mapApiStatus(raw.status),
    paymentStatus: "Pending" as PaymentStatus,
    paymentMethod: "Online" as PaymentMethod,
    location: "—",
    notes: "",
    bookingDate: created.toISOString().split("T")[0] ?? raw.date,
    venueType: "—",
    rescheduleDate: raw.rescheduleDate,
    rescheduleTime: raw.rescheduleTime,
  }
}
