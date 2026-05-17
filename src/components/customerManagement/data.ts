import type { AdminUser } from "@/types/users"

/** e.g. 4 Apr 2026 */
export function formatCustomerDate(iso: string | null | undefined): string {
  if (iso == null || String(iso).trim() === "") return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** e.g. 4 Apr 2026, 14:30 */
export function formatCustomerDateTime(iso: string | null | undefined): string {
  if (iso == null || String(iso).trim() === "") return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export type CustomerStatus = "Active" | "Suspended" | "Pending"

export interface Customer {
  numericId: number
  name: string
  email: string
  phone: string
  status: CustomerStatus
  verified: boolean
  joinedDate: string
  emailVerifiedAt: string | null
  lastActivity: string
}

export function adminUserToCustomer(u: AdminUser): Customer {
  const verified = u.emailVerifiedAt != null && String(u.emailVerifiedAt).length > 0
  const blocked = u.blocked === true
  let status: CustomerStatus
  if (blocked) status = "Suspended"
  else if (verified) status = "Active"
  else status = "Pending"

  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.email

  let lastActivity: string
  if (blocked) lastActivity = "Account blocked"
  else if (u.emailVerifiedAt) {
    lastActivity = `Email verified ${formatCustomerDateTime(u.emailVerifiedAt)}`
  } else lastActivity = "Email not verified yet"

  return {
    numericId: u.id,
    name,
    email: u.email,
    phone: u.phoneNumber?.trim() || "—",
    status,
    verified,
    joinedDate: u.createdAt,
    emailVerifiedAt: u.emailVerifiedAt,
    lastActivity,
  }
}
