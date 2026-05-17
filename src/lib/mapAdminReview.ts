import type { ReviewItem } from "@/components/reviewsManagement/data"
import type { AdminReviewApiItem, AdminReviewPersonApi } from "@/types/admin-reviews"

function personDisplayName(person: AdminReviewPersonApi): string {
  return `${person.firstName} ${person.lastName}`.trim()
}

function clampRating(value: number): ReviewItem["rating"] {
  const n = Math.round(value)
  if (n <= 1) return 1
  if (n >= 5) return 5
  return n as ReviewItem["rating"]
}

export function mapAdminReviewApiToReviewItem(raw: AdminReviewApiItem): ReviewItem {
  const created = new Date(raw.createdAt)
  const date = created.toISOString().split("T")[0] ?? ""
  const time = created.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  const customerName = personDisplayName(raw.customer)

  return {
    id: String(raw.id),
    customerId: String(raw.customer.id),
    customerName,
    customerEmail: raw.customer.email,
    customerPhone: "—",
    vendorId: String(raw.vendor.id),
    vendorName: personDisplayName(raw.vendor),
    vendorOwner: personDisplayName(raw.vendor),
    rating: clampRating(raw.rating),
    reviewText: raw.comment,
    date,
    time,
    bookingId: "—",
    service: "—",
    status: raw.isHidden ? "Hidden" : "Visible",
    helpful: 0,
    notHelpful: 0,
    flagged: raw.isFlagged,
    adminNotes: "",
    history: [{ action: "Review Posted", date, time, by: customerName }],
  }
}
