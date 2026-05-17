export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  createdAt: string
  blocked: boolean | null
  emailVerifiedAt: string | null
}

export interface AdminUsersListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminUsersListResponse {
  data: AdminUser[]
  meta: AdminUsersListMeta
}

export interface AdminUsersBreakdown {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  pendingUsers: number
  deletedUsers: number
}
