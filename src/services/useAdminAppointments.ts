import { keepPreviousData, useQuery } from "@tanstack/react-query"
import http from "@/lib/http"
import { mapAdminAppointmentApiToBooking } from "@/lib/mapAdminAppointment"
import type {
  AdminAppointmentApiItem,
  AdminAppointmentsBreakdown,
  AdminAppointmentsListResponse,
  AdminAppointmentListStatusParam,
} from "@/types/admin-appointments"

function normalizeAppointmentsList(payload: unknown): AdminAppointmentsListResponse | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  if (!Array.isArray(p.data)) return null
  const meta = p.meta
  if (!meta || typeof meta !== "object") return null
  const m = meta as Record<string, unknown>
  if (typeof m.total !== "number" || typeof m.page !== "number") return null
  return {
    data: p.data as AdminAppointmentApiItem[],
    meta: {
      page: m.page,
      limit: typeof m.limit === "number" ? m.limit : 10,
      total: m.total,
      totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
    },
  }
}

function normalizeBreakdown(payload: unknown): AdminAppointmentsBreakdown | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const raw = (p.data && typeof p.data === "object" && !Array.isArray(p.data) ? p.data : p) as Record<string, unknown>
  if (typeof raw.pending !== "number") return null
  return {
    pending: raw.pending,
    accepted: Number(raw.accepted ?? 0),
    rejected: Number(raw.rejected ?? 0),
    canceled: Number(raw.canceled ?? 0),
    completed: Number(raw.completed ?? 0),
  }
}

export const ADMIN_APPOINTMENTS_LIST_QUERY_KEY = ["admin", "appointments", "list"] as const
export const ADMIN_APPOINTMENTS_BREAKDOWN_QUERY_KEY = ["admin", "appointments", "breakdown"] as const

export function useAdminAppointmentsBreakdown() {
  return useQuery({
    queryKey: [...ADMIN_APPOINTMENTS_BREAKDOWN_QUERY_KEY],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/appointments/breakdown")
      return normalizeBreakdown(data)
    },
  })
}

export function useAdminAppointmentsList(params: {
  page: number
  limit: number
  status?: AdminAppointmentListStatusParam
  /** Filter list by vendor display name (first + last); sent as `vendorName`. */
  vendorName?: string
}) {
  const vendorName = params.vendorName?.trim() || undefined

  return useQuery({
    queryKey: [...ADMIN_APPOINTMENTS_LIST_QUERY_KEY, params.page, params.limit, params.status ?? "", vendorName ?? ""],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/appointments", {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.status ? { status: params.status } : {}),
          ...(vendorName ? { vendorName } : {}),
        },
      })
      const normalized = normalizeAppointmentsList(data)
      if (!normalized) throw new Error("Invalid appointments list response")
      return {
        bookings: normalized.data.map(mapAdminAppointmentApiToBooking),
        meta: normalized.meta,
      }
    },
  })
}
