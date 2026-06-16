import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "@/lib/http"
import { mapAdminCategoryApiToItem } from "@/lib/mapAdminCategory"
import type { AdminCategoryApi, AdminCategoryPayload } from "@/types/categories"

function unwrapList(payload: unknown): AdminCategoryApi[] {
  if (Array.isArray(payload)) return payload as AdminCategoryApi[]
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data
    if (Array.isArray(inner)) return inner as AdminCategoryApi[]
  }
  return []
}

function unwrapItem(payload: unknown): AdminCategoryApi | null {
  if (!payload || typeof payload !== "object") return null
  if ("data" in payload) {
    const inner = (payload as { data: unknown }).data
    if (inner && typeof inner === "object" && "id" in inner) return inner as AdminCategoryApi
  }
  if ("id" in payload) return payload as AdminCategoryApi
  return null
}

export const ADMIN_CATEGORIES_LIST_QUERY_KEY = ["admin", "categories", "list"] as const

export function useAdminCategoriesList() {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_LIST_QUERY_KEY],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/categories")
      return unwrapList(data).map(mapAdminCategoryApiToItem)
    },
  })
}

export function useAdminCategoryDetail(categoryId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "categories", "detail", categoryId],
    enabled: enabled && categoryId != null,
    queryFn: async () => {
      const { data } = await http.get<unknown>(`/categories/${categoryId}`)
      const item = unwrapItem(data)
      if (!item) throw new Error("Invalid category response")
      return mapAdminCategoryApiToItem(item)
    },
  })
}

export function useAdminCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AdminCategoryPayload) => {
      const { data } = await http.post<unknown>("/categories", payload)
      const item = unwrapItem(data)
      if (!item) throw new Error("Invalid create category response")
      return mapAdminCategoryApiToItem(item)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_CATEGORIES_LIST_QUERY_KEY] })
    },
  })
}

export function useAdminUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: AdminCategoryPayload }) => {
      const { data } = await http.patch<unknown>(`/categories/${id}`, payload)
      const item = unwrapItem(data)
      if (!item) throw new Error("Invalid update category response")
      return mapAdminCategoryApiToItem(item)
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_CATEGORIES_LIST_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories", "detail", variables.id] })
    },
  })
}
