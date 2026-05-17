import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "@/lib/http"
import { mapAdminReviewApiToReviewItem } from "@/lib/mapAdminReview"
import type {
  AdminReviewApiItem,
  AdminReviewRatingParam,
  AdminReviewsBreakdown,
  AdminReviewsListResponse,
} from "@/types/admin-reviews"

function normalizeReviewsList(payload: unknown): AdminReviewsListResponse | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  if (!Array.isArray(p.data)) return null
  const meta = p.meta
  if (!meta || typeof meta !== "object") return null
  const m = meta as Record<string, unknown>
  if (typeof m.total !== "number" || typeof m.page !== "number") return null
  return {
    data: p.data as AdminReviewApiItem[],
    meta: {
      page: m.page,
      limit: typeof m.limit === "number" ? m.limit : 10,
      total: m.total,
      totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
    },
  }
}

function normalizeReviewsBreakdown(payload: unknown): AdminReviewsBreakdown | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const raw = (p.data && typeof p.data === "object" && !Array.isArray(p.data) ? p.data : p) as Record<string, unknown>
  if (typeof raw.totalReviews !== "number") return null
  return {
    totalReviews: raw.totalReviews,
    hiddenReviews: Number(raw.hiddenReviews ?? 0),
    flaggedReviews: Number(raw.flaggedReviews ?? 0),
  }
}

export const ADMIN_REVIEWS_LIST_QUERY_KEY = ["admin", "reviews", "list"] as const
export const ADMIN_REVIEWS_BREAKDOWN_QUERY_KEY = ["admin", "reviews", "breakdown"] as const

export function useAdminReviewsBreakdown() {
  return useQuery({
    queryKey: [...ADMIN_REVIEWS_BREAKDOWN_QUERY_KEY],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/reviews/breakdown")
      return normalizeReviewsBreakdown(data)
    },
  })
}

/** PATCH /admin/reviews/:id/hide — body `{ hidden: boolean }` */
export function useAdminReviewSetHidden() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ reviewId, hidden }: { reviewId: string; hidden: boolean }) => {
      await http.patch(`/admin/reviews/${reviewId}/hide`, { hidden })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_REVIEWS_LIST_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_REVIEWS_BREAKDOWN_QUERY_KEY] })
    },
  })
}

export function useAdminReviewsList(params: {
  page: number
  limit: number
  customerName?: string
  vendorName?: string
  rating?: AdminReviewRatingParam
}) {
  const customerName = params.customerName?.trim() || undefined
  const vendorName = params.vendorName?.trim() || undefined

  return useQuery({
    queryKey: [
      ...ADMIN_REVIEWS_LIST_QUERY_KEY,
      params.page,
      params.limit,
      customerName ?? "",
      vendorName ?? "",
      params.rating ?? "",
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/reviews", {
        params: {
          page: params.page,
          limit: params.limit,
          ...(customerName ? { customerName } : {}),
          ...(vendorName ? { vendorName } : {}),
          ...(params.rating != null ? { rating: params.rating } : {}),
        },
      })
      const normalized = normalizeReviewsList(data)
      if (!normalized) throw new Error("Invalid reviews list response")
      return {
        reviews: normalized.data.map(mapAdminReviewApiToReviewItem),
        meta: normalized.meta,
      }
    },
  })
}
