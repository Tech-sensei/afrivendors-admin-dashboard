import type { Vendor } from "@/components/vendorManagement/data"
import type { AdminVendorApiItem } from "@/types/vendors"

/** Maps admin GET /vendors list item to the UI Vendor model; missing fields use placeholders. */
export function mapAdminVendorApiToVendor(raw: AdminVendorApiItem): Vendor {
  const owner = `${raw.firstName} ${raw.lastName}`.trim()
  const displayName = raw.businessName?.trim() || owner || "Vendor"

  return {
    id: String(raw.id),
    name: displayName,
    category: raw.category?.name ?? "—",
    country: "—",
    email: raw.email,
    phone: raw.phoneNumber,
    status: "Active",
    verified: raw.stripeReady,
    bookingsCompleted: 0,
    rating: 0,
    owner,
    address: "—",
    website: "—",
    openingHours: "—",
    description: "—",
    joinedDate: new Date(raw.createdAt).toLocaleDateString(),
    completionRate: 0,
    totalRevenue: 0,
    documents: [],
    kycStatus: raw.stripeReady ? "Verified" : "Pending",
    services: [],
    currency: raw.currency,
  }
}
