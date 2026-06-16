import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import http from "@/lib/http"
import { getApiErrorMessage } from "@/lib/apiErrors"
import { setProfile } from "@/store/authSlice"
import { store } from "@/store/store"
import type { AdminAccount, AdminProfile } from "@/types/auth"

export type UpdateAdminProfilePayload = {
  firstName: string
  lastName: string
  phoneNumber?: string
}

export const ADMIN_PROFILE_QUERY_KEY = ["admin", "profile", "me"] as const

function unwrapProfile(payload: unknown): Partial<AdminAccount> | null {
  if (!payload || typeof payload !== "object") return null
  const p = payload as Record<string, unknown>
  const inner = p.data && typeof p.data === "object" ? (p.data as Record<string, unknown>) : p
  if (!inner || typeof inner !== "object") return null
  if (typeof inner.id !== "number") return null
  return {
    id: inner.id,
    firstName: typeof inner.firstName === "string" ? inner.firstName : "",
    lastName: typeof inner.lastName === "string" ? inner.lastName : "",
    phoneNumber: typeof inner.phoneNumber === "string" ? inner.phoneNumber : undefined,
    email: typeof inner.email === "string" ? inner.email : "",
    accountType: typeof inner.accountType === "string" ? inner.accountType : "admin",
    adminRoles: (inner.adminRoles as AdminAccount["adminRoles"]) ?? null,
    createdAt: typeof inner.createdAt === "string" ? inner.createdAt : new Date().toISOString(),
    updatedAt: typeof inner.updatedAt === "string" ? inner.updatedAt : undefined,
  }
}

function toAdminProfile(account: Partial<AdminAccount>): AdminProfile {
  return {
    admin: {
      id: account.id ?? 0,
      firstName: account.firstName ?? "",
      lastName: account.lastName ?? "",
      email: account.email ?? "",
      phoneNumber: account.phoneNumber,
      accountType: account.accountType ?? "admin",
      adminRoles: account.adminRoles ?? null,
      createdAt: account.createdAt ?? new Date().toISOString(),
      updatedAt: account.updatedAt,
    },
  }
}

export function useAdminProfile() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [...ADMIN_PROFILE_QUERY_KEY],
    queryFn: async () => {
      const { data } = await http.get<unknown>("/users/me")
      const account = unwrapProfile(data)
      if (!account) throw new Error("Invalid profile response")
      const profile = toAdminProfile(account)
      store.dispatch(setProfile(profile))
      return profile
    },
    retry: 1,
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateAdminProfilePayload) => {
      const { data } = await http.patch<unknown>("/users/me", payload)
      return unwrapProfile(data)
    },
    onSuccess: (data, variables) => {
      const current = store.getState().auth.profile as AdminProfile | null
      if (current?.admin) {
        const next = {
          admin: {
            ...current.admin,
            firstName: data?.firstName ?? variables.firstName,
            lastName: data?.lastName ?? variables.lastName,
            phoneNumber: data?.phoneNumber ?? variables.phoneNumber ?? current.admin.phoneNumber,
            email: data?.email ?? current.admin.email,
          },
        }
        store.dispatch(setProfile(next))
      }
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_PROFILE_QUERY_KEY] })
      toast.success("Profile updated successfully")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update profile"))
    },
  })

  return { ...query, updateProfile: updateMutation }
}
