import { keepPreviousData, useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { mapAdminCustomRequestApiToRfsRequest } from "@/lib/mapAdminCustomRequest";
import type {
  AdminCustomRequestApiItem,
  AdminCustomRequestListStatusParam,
  AdminCustomRequestsBreakdown,
  AdminCustomRequestsListResponse,
} from "@/types/admin-custom-requests";

function normalizeCustomRequestsList(payload: unknown): AdminCustomRequestsListResponse | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (!Array.isArray(p.data)) return null;
  const meta = p.meta;
  if (!meta || typeof meta !== "object") return null;
  const m = meta as Record<string, unknown>;
  if (typeof m.total !== "number" || typeof m.page !== "number") return null;
  return {
    data: p.data as AdminCustomRequestApiItem[],
    meta: {
      page: m.page,
      limit: typeof m.limit === "number" ? m.limit : 10,
      total: m.total,
      totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
    },
  };
}

function unwrapCustomRequestDetail(payload: unknown): AdminCustomRequestApiItem | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  if (typeof root.id === "number") return root as AdminCustomRequestApiItem;
  const data = root.data;
  if (data && typeof data === "object" && typeof (data as AdminCustomRequestApiItem).id === "number") {
    return data as AdminCustomRequestApiItem;
  }
  const nested = data as Record<string, unknown> | undefined;
  const customRequest = nested?.customRequest;
  if (customRequest && typeof customRequest === "object" && typeof (customRequest as AdminCustomRequestApiItem).id === "number") {
    return customRequest as AdminCustomRequestApiItem;
  }
  return null;
}

async function fetchStatusTotal(status?: AdminCustomRequestListStatusParam): Promise<number> {
  const { data } = await http.get<unknown>("/admin/custom-requests", {
    params: { page: 1, limit: 1, ...(status ? { status } : {}) },
  });
  const normalized = normalizeCustomRequestsList(data);
  return normalized?.meta.total ?? 0;
}

export const ADMIN_CUSTOM_REQUESTS_LIST_QUERY_KEY = ["admin", "custom-requests", "list"] as const;
export const ADMIN_CUSTOM_REQUESTS_BREAKDOWN_QUERY_KEY = ["admin", "custom-requests", "breakdown"] as const;
export const ADMIN_CUSTOM_REQUEST_DETAIL_QUERY_KEY = ["admin", "custom-requests", "detail"] as const;

export function useAdminCustomRequestsBreakdown() {
  return useQuery({
    queryKey: [...ADMIN_CUSTOM_REQUESTS_BREAKDOWN_QUERY_KEY],
    queryFn: async (): Promise<AdminCustomRequestsBreakdown> => {
      const [pending, accepted, rejected, cancelled, completed] = await Promise.all([
        fetchStatusTotal("pending"),
        fetchStatusTotal("accepted"),
        fetchStatusTotal("rejected"),
        fetchStatusTotal("cancelled"),
        fetchStatusTotal("completed"),
      ]);
      return { pending, accepted, rejected, cancelled, completed };
    },
  });
}

export function useAdminCustomRequestsList(params: { page: number; limit: number; status?: AdminCustomRequestListStatusParam }) {
  return useQuery({
    queryKey: [...ADMIN_CUSTOM_REQUESTS_LIST_QUERY_KEY, params.page, params.limit, params.status ?? ""],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/custom-requests", {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.status ? { status: params.status } : {}),
        },
      });
      const normalized = normalizeCustomRequestsList(data);
      if (!normalized) throw new Error("Invalid custom requests list response");
      return {
        requests: normalized.data.map(mapAdminCustomRequestApiToRfsRequest),
        meta: normalized.meta,
      };
    },
  });
}

export function useAdminCustomRequestDetail(id: number | null, enabled = true) {
  return useQuery({
    queryKey: [...ADMIN_CUSTOM_REQUEST_DETAIL_QUERY_KEY, id],
    enabled: enabled && id != null,
    queryFn: async () => {
      const { data } = await http.get<unknown>(`/admin/custom-requests/${id}`);
      const item = unwrapCustomRequestDetail(data);
      if (!item) throw new Error("Invalid custom request detail response");
      return mapAdminCustomRequestApiToRfsRequest(item);
    },
  });
}
