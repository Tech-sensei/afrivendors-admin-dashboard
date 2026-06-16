import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "@/lib/http"
import {
  mapAdminDisputeApiToItem,
  normalizeDisputeDetail,
  normalizeDisputesList,
} from "@/lib/mapAdminDispute"
import type { AdminDisputeResolveAction } from "@/types/admin-disputes"

export const ADMIN_DISPUTES_LIST_QUERY_KEY = ["admin", "disputes", "list"] as const
export const ADMIN_DISPUTES_DETAIL_QUERY_KEY = ["admin", "disputes", "detail"] as const

export function useAdminDisputesList(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1
  const limit = params?.limit ?? 100

  return useQuery({
    queryKey: [...ADMIN_DISPUTES_LIST_QUERY_KEY, page, limit],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/disputes", {
        params: { page, limit },
      })
      const normalized = normalizeDisputesList(data)
      if (!normalized) throw new Error("Invalid disputes response")
      return normalized
    },
    staleTime: 30_000,
  })
}

export function useAdminDisputeDetail(disputeId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: [...ADMIN_DISPUTES_DETAIL_QUERY_KEY, disputeId],
    queryFn: async () => {
      const { data } = await http.get<unknown>(`/admin/disputes/${disputeId}`)
      const normalized = normalizeDisputeDetail(data)
      if (!normalized) throw new Error("Invalid dispute detail response")
      return mapAdminDisputeApiToItem(normalized)
    },
    enabled: enabled && disputeId != null,
  })
}

export function useAdminResolveDispute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      appointmentId,
      resolution,
      action,
    }: {
      appointmentId: number
      resolution: string
      action: AdminDisputeResolveAction
    }) => {
      const { data } = await http.post(
        `/admin/appointments/${appointmentId}/dispute/resolve`,
        { resolution, action },
      )
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_DISPUTES_LIST_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_DISPUTES_DETAIL_QUERY_KEY] })
    },
  })
}
