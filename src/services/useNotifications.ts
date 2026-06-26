"use client"

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query"
import http from "@/lib/http"
import {
  mapApiNotificationToAdmin,
  parseNotificationsListResponse,
  parseUnreadCountResponse,
} from "@/lib/mapAdminNotification"
import type { AdminNotification, NotificationsPage } from "@/types/admin-notifications"

export const NOTIFICATIONS_UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const
export const NOTIFICATIONS_LIST_ROOT_KEY = ["notifications", "list"] as const
export const DEFAULT_NOTIFICATIONS_LIMIT = 15

function unwrapPayload(data: unknown): unknown {
  if (data && typeof data === "object" && "data" in (data as object)) {
    const inner = (data as { data: unknown }).data
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      return data
    }
  }
  return data
}

async function fetchUnreadCount(): Promise<number> {
  const { data } = await http.get("/notifications/unread/count")
  return parseUnreadCountResponse(unwrapPayload(data))
}

async function fetchNotificationsPage(params: {
  page: number
  limit: number
}): Promise<NotificationsPage> {
  const { data } = await http.get("/notifications", {
    params: { page: params.page, limit: params.limit },
  })
  return parseNotificationsListResponse(unwrapPayload(data))
}

export function useUnreadNotificationCount(enabled = true) {
  return useQuery({
    queryKey: NOTIFICATIONS_UNREAD_COUNT_KEY,
    queryFn: fetchUnreadCount,
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useNotificationsInfinite(enabled = true) {
  const limit = DEFAULT_NOTIFICATIONS_LIMIT

  return useInfiniteQuery({
    queryKey: NOTIFICATIONS_LIST_ROOT_KEY,
    queryFn: async ({ pageParam }) =>
      fetchNotificationsPage({ page: pageParam as number, limit }),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    staleTime: 30_000,
  })
}

export function patchNotificationInListCache(
  queryClient: QueryClient,
  notificationId: string,
  updater: (n: AdminNotification) => AdminNotification,
) {
  queryClient.setQueriesData<InfiniteData<NotificationsPage>>(
    { queryKey: NOTIFICATIONS_LIST_ROOT_KEY },
    (old) => {
      if (!old?.pages?.length) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((n) => (n.id === notificationId ? updater(n) : n)),
        })),
      }
    },
  )
}

export function markAllReadInListCache(queryClient: QueryClient) {
  queryClient.setQueriesData<InfiniteData<NotificationsPage>>(
    { queryKey: NOTIFICATIONS_LIST_ROOT_KEY },
    (old) => {
      if (!old?.pages?.length) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((n) => ({ ...n, isRead: true })),
        })),
      }
    },
  )
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.patch(`/notifications/${id}/read`)
      return mapApiNotificationToAdmin(unwrapPayload(data) ?? { id, isRead: true })
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_LIST_ROOT_KEY })
      const previous = queryClient.getQueryData(NOTIFICATIONS_LIST_ROOT_KEY)
      const previousCount = queryClient.getQueryData<number>(NOTIFICATIONS_UNREAD_COUNT_KEY)

      let wasUnread = false
      patchNotificationInListCache(queryClient, id, (n) => {
        if (!n.isRead) wasUnread = true
        return { ...n, isRead: true }
      })
      if (wasUnread) {
        queryClient.setQueryData<number>(NOTIFICATIONS_UNREAD_COUNT_KEY, (old) =>
          Math.max(0, (old ?? 0) - 1),
        )
      }

      return { previous, previousCount }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_LIST_ROOT_KEY, context.previous)
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(NOTIFICATIONS_UNREAD_COUNT_KEY, context.previousCount)
      }
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_KEY })
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_ROOT_KEY })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_KEY })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await http.patch("/notifications/read-all")
      return data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_LIST_ROOT_KEY })
      const previous = queryClient.getQueryData(NOTIFICATIONS_LIST_ROOT_KEY)
      markAllReadInListCache(queryClient)
      queryClient.setQueryData(NOTIFICATIONS_UNREAD_COUNT_KEY, 0)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_LIST_ROOT_KEY, context.previous)
      }
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_KEY })
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_ROOT_KEY })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_KEY })
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_ROOT_KEY })
    },
  })
}
