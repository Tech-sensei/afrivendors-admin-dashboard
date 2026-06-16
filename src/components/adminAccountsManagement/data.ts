export type AdminAccountStatus = "Active" | "Suspended"

export type AdminAccountItem = {
  id: string
  name: string
  role: string
  email: string
  status: AdminAccountStatus
  lastActive: string
  phoneNumber?: string
  createdAt: string
}

export type AdminRoleItem = {
  id: string
  name: string
  description: string
  assignedAdmins: number
  permissionsCount: number
  createdOn: string
  /** System roles cannot be deleted */
  isSystem?: boolean
}

export const initialAdminAccounts: AdminAccountItem[] = [
  {
    id: "admin-1",
    name: "Kwame Mensah",
    role: "Super Admin",
    email: "kwame.mensah@afrivendor.com",
    status: "Active",
    lastActive: "5 minutes ago",
    phoneNumber: "+233 24 123 4567",
    createdAt: "2024-01-10",
  },
  {
    id: "admin-2",
    name: "Ama Osei",
    role: "Operations Manager",
    email: "ama.osei@afrivendor.com",
    status: "Active",
    lastActive: "2 hours ago",
    phoneNumber: "+233 20 987 6543",
    createdAt: "2024-01-15",
  },
  {
    id: "admin-3",
    name: "Kofi Adjei",
    role: "Content Manager",
    email: "kofi.adjei@afrivendor.com",
    status: "Active",
    lastActive: "Yesterday",
    createdAt: "2024-02-01",
  },
  {
    id: "admin-4",
    name: "Abena Owusu",
    role: "Customer Support",
    email: "abena.owusu@afrivendor.com",
    status: "Active",
    lastActive: "3 days ago",
    createdAt: "2024-02-15",
  },
  {
    id: "admin-5",
    name: "Yaw Boateng",
    role: "Finance Manager",
    email: "yaw.boateng@afrivendor.com",
    status: "Suspended",
    lastActive: "2 weeks ago",
    createdAt: "2024-03-01",
  },
]

export const initialAdminRoles: AdminRoleItem[] = [
  {
    id: "role-1",
    name: "Super Admin",
    description: "Full platform access with all permissions",
    assignedAdmins: 1,
    permissionsCount: 40,
    createdOn: "Jan 10, 2024",
    isSystem: true,
  },
  {
    id: "role-2",
    name: "Operations Manager",
    description: "Manage vendors, customers, and bookings",
    assignedAdmins: 1,
    permissionsCount: 24,
    createdOn: "Jan 15, 2024",
  },
  {
    id: "role-3",
    name: "Content Manager",
    description: "Manage CMS, services, and platform content",
    assignedAdmins: 1,
    permissionsCount: 12,
    createdOn: "Feb 1, 2024",
  },
  {
    id: "role-4",
    name: "Customer Support",
    description: "Handle customer inquiries and disputes",
    assignedAdmins: 1,
    permissionsCount: 10,
    createdOn: "Feb 15, 2024",
  },
  {
    id: "role-5",
    name: "Finance Manager",
    description: "Manage payments, payouts, and financial data",
    assignedAdmins: 1,
    permissionsCount: 14,
    createdOn: "Mar 1, 2024",
  },
]

export const adminRoleOptions = initialAdminRoles.map((role) => role.name)

export function formatAdminDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return value
  }
}

export function computeAdminStats(accounts: AdminAccountItem[], roles: AdminRoleItem[]) {
  const activeAdmins = accounts.filter((a) => a.status === "Active").length
  const suspendedAdmins = accounts.filter((a) => a.status === "Suspended").length
  return {
    totalAdmins: accounts.length,
    activeAdmins,
    suspendedAdmins,
    totalRoles: roles.length,
  }
}

export type AdminAccountsStatsData = ReturnType<typeof computeAdminStats>
