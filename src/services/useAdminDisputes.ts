import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "@/lib/http"
import type {
  AdminDisputeAppointmentApi,
  AdminDisputeResolveAction,
} from "@/types/admin-disputes"

const DISPUTES_QUERY_KEY = ["admin", "disputes"] as const

function isDisputeOpen(dispute: AdminDisputeAppointmentApi["dispute"]): boolean {
  if (!dispute) return false
  const s = dispute.status.toLowerCase()
  return s !== "resolved" && s !== "closed" && s !== "cancelled"
}

function normalizeAppointment(raw: unknown): AdminDisputeAppointmentApi | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== "number") return null
  return raw as AdminDisputeAppointmentApi
}

export function useAdminOpenDisputes() {
  return useQuery({
    queryKey: DISPUTES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/appointments", {
        params: { status: "completed", limit: 100, page: 1 },
      })
      const payload = data as { data?: unknown[] }
      const list = Array.isArray(payload?.data) ? payload.data : []
      return list
        .map(normalizeAppointment)
        .filter((a): a is AdminDisputeAppointmentApi => !!a && isDisputeOpen(a.dispute))
    },
    staleTime: 30_000,
  })
}

export function useAdminAppointmentDetail(appointmentId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "appointment", appointmentId],
    queryFn: async () => {
      const { data } = await http.get<unknown>(`/admin/appointments/${appointmentId}`)
      const raw = (data as { data?: unknown })?.data ?? data
      const normalized = normalizeAppointment(raw)
      if (!normalized) throw new Error("Invalid appointment")
      return normalized
    },
    enabled: enabled && !!appointmentId,
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
        { resolution, action }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPUTES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "appointment"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] })
    },
  })
}
