import { keepPreviousData, useQuery } from "@tanstack/react-query"
import http from "@/lib/http"
import { mapAdminVendorApiToVendor } from "@/lib/mapAdminVendor"
import type {
  AdminVendorApiItem,
  AdminVendorsBreakdown,
  AdminVendorsListResponse,
} from "@/types/vendors"

function normalizeVendorsBreakdown(payload: unknown): AdminVendorsBreakdown | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const inner = p.data
  const raw: unknown =
    inner && typeof inner === "object" && "totalVendors" in (inner as object) ? inner : p
  const src = raw as AdminVendorsBreakdown
  if (typeof src.totalVendors !== "number") return null
  return {
    totalVendors: src.totalVendors,
    activeVendors: src.activeVendors,
    blockedVendors: src.blockedVendors,
    pendingVendors: src.pendingVendors,
    deletedVendors: src.deletedVendors,
  }
}

export function useAdminVendorsBreakdown() {
  return useQuery({
    queryKey: ["admin", "vendors", "breakdown"],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/vendors/breakdown")
      return normalizeVendorsBreakdown(data)
    },
  })
}

function normalizeVendorsList(payload: unknown): AdminVendorsListResponse | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  if (!Array.isArray(p.data)) return null
  const meta = p.meta
  if (!meta || typeof meta !== "object") return null
  const m = meta as Record<string, unknown>
  if (typeof m.total !== "number" || typeof m.page !== "number") return null
  return {
    data: p.data as AdminVendorApiItem[],
    meta: {
      page: m.page,
      limit: typeof m.limit === "number" ? m.limit : 10,
      total: m.total,
      totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
    },
  }
}

export const ADMIN_VENDORS_LIST_QUERY_KEY = ["admin", "vendors", "list"] as const

export function useAdminVendorsList(params: {
  page: number
  limit: number
  /** Sent as `search`; backend matches vendor name and email. */
  search?: string
}) {
  const search = params.search?.trim() || undefined

  return useQuery({
    queryKey: [...ADMIN_VENDORS_LIST_QUERY_KEY, params.page, params.limit, search ?? ""],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/vendors", {
        params: {
          page: params.page,
          limit: params.limit,
          ...(search ? { search } : {}),
        },
      })
      const normalized = normalizeVendorsList(data)
      if (!normalized) throw new Error("Invalid vendors list response")
      return {
        vendors: normalized.data.map(mapAdminVendorApiToVendor),
        meta: normalized.meta,
      }
    },
  })
}
