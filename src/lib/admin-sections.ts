export const adminSectionIds = [
  "profile",
  "preferences",
  "system-logs",
  "dashboard",
  "vendors",
  "customers",
  "bookings",
  "payments",
  "payouts",
  "reviews",
  "rfs",
  "services",
  "disputes",
  "analytics",
  "cms",
  "settings",
  "notifications",
  "admin-accounts",
] as const

export type AdminSectionId = (typeof adminSectionIds)[number]

const sectionSet = new Set<string>(adminSectionIds)

export function isAdminSectionId(id: string): id is AdminSectionId {
  return sectionSet.has(id)
}

export const adminSectionCopy: Record<
  AdminSectionId,
  { title: string; description: string }
> = {
  profile: {
    title: "View Profile",
    description: "Your admin account profile and basic information.",
  },
  preferences: {
    title: "Preferences",
    description: "Personal preferences, theme, and notification options.",
  },
  "system-logs": {
    title: "System Logs",
    description: "Platform and audit logs for administrators.",
  },
  dashboard: {
    title: "Dashboard",
    description: "Overview and key metrics for the admin portal.",
  },
  vendors: {
    title: "Vendors",
    description: "Manage vendor accounts and platform listings.",
  },
  customers: {
    title: "Customers",
    description: "View and support customer accounts.",
  },
  bookings: {
    title: "Bookings / Appointments",
    description: "Track bookings and scheduled appointments.",
  },
  payments: {
    title: "Payments & Wallet",
    description: "Monitor payments, wallets, and transactions.",
  },
  payouts: {
    title: "Payouts",
    description: "Process and review vendor payouts.",
  },
  reviews: {
    title: "Reviews & Ratings",
    description: "Moderate reviews and ratings on the platform.",
  },
  rfs: {
    title: "RFS Requests",
    description: "Handle request-for-service workflows.",
  },
  services: {
    title: "Services Management",
    description: "Manage platform services, categories, and the service catalog.",
  },
  disputes: {
    title: "Disputes & Support",
    description: "Resolve disputes and support tickets.",
  },
  analytics: {
    title: "Analytics & Reports",
    description: "Insights, exports, and reporting tools.",
  },
  cms: {
    title: "Content Management",
    description: "Edit static content, pages, and CMS entries.",
  },
  settings: {
    title: "Settings",
    description: "Global platform and admin settings.",
  },
  notifications: {
    title: "Notifications",
    description: "Configure notification templates and delivery.",
  },
  "admin-accounts": {
    title: "Admin Accounts & Roles",
    description: "Manage admin users, roles, and permissions.",
  },
}
