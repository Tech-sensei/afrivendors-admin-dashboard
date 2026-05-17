import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "@/lib/http"
import { mapAdminPayoutApiToRequest, mapAdminPayoutDetailToRequest } from "@/lib/mapAdminPayout"
import type {
  AdminPayoutApiItem,
  AdminPayoutDetailApi,
  AdminPayoutsListResponse,
} from "@/types/admin-payouts"

/** Query `status` values for GET /admin/payouts (Swagger). */
export type AdminPayoutListStatusParam =
  | "pending"
  | "processing"
  | "accepted"
  | "completed"
  | "rejected"
  | "failed"

function normalizePayoutsList(payload: unknown): AdminPayoutsListResponse | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  if (!Array.isArray(p.data)) return null
  const meta = p.meta
  if (!meta || typeof meta !== "object") return null
  const m = meta as Record<string, unknown>
  if (typeof m.total !== "number" || typeof m.page !== "number") return null
  return {
    data: p.data as AdminPayoutApiItem[],
    meta: {
      page: m.page,
      limit: typeof m.limit === "number" ? m.limit : 10,
      total: m.total,
      totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
    },
  }
}

export const ADMIN_PAYOUTS_LIST_QUERY_KEY = ["admin", "payouts", "list"] as const
export const ADMIN_PAYOUT_DETAIL_QUERY_KEY = ["admin", "payouts", "detail"] as const

function normalizePayoutDetail(payload: unknown): AdminPayoutDetailApi | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const innerUnknown: unknown =
    p.data && typeof p.data === "object" && !Array.isArray(p.data) && "id" in (p.data as object)
      ? p.data
      : p
  const inner = innerUnknown as AdminPayoutDetailApi
  if (typeof inner.id !== "number") return null
  if (!inner.vendor || typeof inner.vendor !== "object") return null
  return inner
}

export function useAdminPayoutDetail(payoutId: string | null) {
  return useQuery({
    queryKey: [...ADMIN_PAYOUT_DETAIL_QUERY_KEY, payoutId ?? ""],
    enabled: Boolean(payoutId),
    queryFn: async () => {
      const { data } = await http.get<unknown>(`/admin/payouts/${payoutId}`)
      const normalized = normalizePayoutDetail(data)
      if (!normalized) throw new Error("Invalid payout detail response")
      return mapAdminPayoutDetailToRequest(normalized)
    },
  })
}

export function useAdminPayoutApprove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payoutId: string) => {
      await http.patch(`/admin/payouts/${payoutId}/approve`)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_PAYOUTS_LIST_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_PAYOUT_DETAIL_QUERY_KEY] })
    },
  })
}

export function useAdminPayoutReject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ payoutId, reason }: { payoutId: string; reason: string }) => {
      await http.patch(`/admin/payouts/${payoutId}/reject`, { rejectionReason: reason })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_PAYOUTS_LIST_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_PAYOUT_DETAIL_QUERY_KEY] })
    },
  })
}

export function useAdminPayoutsList(params: {
  page: number
  limit: number
  status?: AdminPayoutListStatusParam
}) {
  return useQuery({
    queryKey: [...ADMIN_PAYOUTS_LIST_QUERY_KEY, params.page, params.limit, params.status ?? ""],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/payouts", {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.status ? { status: params.status } : {}),
        },
      })
      const normalized = normalizePayoutsList(data)
      if (!normalized) throw new Error("Invalid payouts list response")
      return {
        payouts: normalized.data.map(mapAdminPayoutApiToRequest),
        meta: normalized.meta,
      }
    },
  })
}
