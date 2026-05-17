import { keepPreviousData, useQuery } from "@tanstack/react-query"
import http from "@/lib/http"
import type {
  AdminUsersBreakdown,
  AdminUsersListResponse,
  AdminUser,
} from "@/types/users"

function normalizeListPayload(payload: unknown): AdminUsersListResponse {
  if (!payload || typeof payload !== "object") {
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }
  }
  const p = payload as Record<string, unknown>
  let rows: unknown = p.data
  let meta = p.meta as AdminUsersListResponse["meta"] | undefined

  if (!Array.isArray(rows) && rows && typeof rows === "object") {
    const inner = rows as Record<string, unknown>
    if (Array.isArray(inner.data)) {
      rows = inner.data
      meta = (inner.meta as AdminUsersListResponse["meta"]) ?? meta
    }
  }

  const data = Array.isArray(rows) ? (rows as AdminUser[]) : []
  return {
    data,
    meta: meta ?? {
      page: 1,
      limit: 10,
      total: data.length,
      totalPages: data.length ? 1 : 0,
    },
  }
}

function normalizeBreakdown(payload: unknown): AdminUsersBreakdown | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const inner = p.data
  const raw: unknown =
    inner && typeof inner === "object" && "totalUsers" in (inner as object) ? inner : p
  const src = raw as AdminUsersBreakdown
  if (typeof src.totalUsers !== "number") return null
  return {
    totalUsers: src.totalUsers,
    activeUsers: src.activeUsers,
    blockedUsers: src.blockedUsers,
    pendingUsers: src.pendingUsers,
    deletedUsers: src.deletedUsers,
  }
}

export function useAdminUsersList(page: number, limit: number, name?: string) {
  const trimmed = name?.trim() ?? ""
  return useQuery({
    queryKey: ["admin", "users", { page, limit, name: trimmed }],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/users", {
        params: {
          page,
          limit,
          ...(trimmed ? { name: trimmed } : {}),
        },
      })
      return normalizeListPayload(data)
    },
  })
}

export function useAdminUsersBreakdown() {
  return useQuery({
    queryKey: ["admin", "users", "breakdown"],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/users/breakdown")
      return normalizeBreakdown(data)
    },
  })
}
