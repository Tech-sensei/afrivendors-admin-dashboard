import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/apiErrors"
import http from "@/lib/http"
import type {
  AdminCategoryCommissionApi,
  AdminCategoryCommissionPayload,
  AdminCommissionDefaultPayload,
  CategoryCommissionRow,
} from "@/types/commission"

export const ADMIN_COMMISSION_DEFAULT_QUERY_KEY = ["admin", "commission", "default"] as const
export const ADMIN_COMMISSION_CATEGORIES_QUERY_KEY = ["admin", "commission", "categories"] as const

function unwrapDefault(payload: unknown): number {
  if (typeof payload === "number") return payload
  if (!payload || typeof payload !== "object") return 0

  const obj = payload as Record<string, unknown>
  const inner = obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : obj

  if (typeof inner.percent === "number") return inner.percent
  if (typeof inner.defaultPercent === "number") return inner.defaultPercent
  return 0
}

function unwrapCategoryList(payload: unknown): AdminCategoryCommissionApi[] {
  if (Array.isArray(payload)) return payload as AdminCategoryCommissionApi[]
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data
    if (Array.isArray(inner)) return inner as AdminCategoryCommissionApi[]
  }
  return []
}

function mapCategoryRow(item: AdminCategoryCommissionApi): CategoryCommissionRow {
  const rate =
    typeof item.effectivePercent === "number"
      ? item.effectivePercent
      : typeof item.percent === "number"
        ? item.percent
        : typeof item.customPercent === "number"
          ? item.customPercent
          : 0

  return {
    categoryId: item.mainCategoryId,
    name: item.name ?? "Unnamed category",
    rate,
    usesDefault: Boolean(item.useDefault),
    customPercent: item.customPercent ?? (item.useDefault ? null : item.percent),
  }
}

export function useAdminCommissionSettings() {
  const queryClient = useQueryClient()

  const defaultQuery = useQuery({
    queryKey: [...ADMIN_COMMISSION_DEFAULT_QUERY_KEY],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/commission/default")
      return unwrapDefault(data)
    },
  })

  const categoriesQuery = useQuery({
    queryKey: [...ADMIN_COMMISSION_CATEGORIES_QUERY_KEY],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/admin/commission/categories")
      return unwrapCategoryList(data).map(mapCategoryRow)
    },
  })

  const saveGlobalMutation = useMutation({
    mutationFn: async (percent: number) => {
      const payload: AdminCommissionDefaultPayload = { percent }
      const { data } = await http.patch<unknown>("/admin/commission/default", payload)
      return unwrapDefault(data)
    },
    onSuccess: (percent) => {
      queryClient.setQueryData([...ADMIN_COMMISSION_DEFAULT_QUERY_KEY], percent)
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_COMMISSION_CATEGORIES_QUERY_KEY] })
      toast.success("Global commission rate saved")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to save global commission rate"))
    },
  })

  const saveCategoryMutation = useMutation({
    mutationFn: async ({
      categoryId,
      useDefault,
      percent,
    }: {
      categoryId: number | string
      useDefault: boolean
      percent?: number
    }) => {
      const payload: AdminCategoryCommissionPayload = useDefault
        ? { useDefault: true }
        : { useDefault: false, percent: percent ?? 0 }

      const { data } = await http.put<unknown>(
        `/admin/commission/categories/${encodeURIComponent(String(categoryId))}`,
        payload,
      )

      const list = unwrapCategoryList(data)
      if (list.length > 0) return list.map(mapCategoryRow)

      void queryClient.invalidateQueries({ queryKey: [...ADMIN_COMMISSION_CATEGORIES_QUERY_KEY] })
      return null
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_COMMISSION_CATEGORIES_QUERY_KEY] })
      toast.success(
        variables.useDefault
          ? "Category now uses the default rate"
          : "Category commission updated",
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update category commission"))
    },
  })

  return {
    globalRate: defaultQuery.data ?? 0,
    rows: categoriesQuery.data ?? [],
    isLoading: defaultQuery.isLoading || categoriesQuery.isLoading,
    isError: defaultQuery.isError || categoriesQuery.isError,
    saveGlobalRate: saveGlobalMutation.mutateAsync,
    saveCategoryRate: saveCategoryMutation.mutateAsync,
    isSavingGlobal: saveGlobalMutation.isPending,
    isSavingCategory: saveCategoryMutation.isPending,
  }
}
