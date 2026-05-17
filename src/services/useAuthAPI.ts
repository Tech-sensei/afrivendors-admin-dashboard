import { useMutation, useQueryClient } from "@tanstack/react-query"
import { destroyCookie, setCookie } from "nookies"
import { toast } from "sonner"
import http, { redirectToSignIn } from "@/lib/http"
import { adminLoginToProfile } from "@/lib/adminAuthProfile"
import { clearAuth, setProfile } from "@/store/authSlice"
import { useAppDispatch } from "@/store/hooks"
import type { AdminLoginResponse, SignInPayload } from "@/types/auth"
import {
  APP_AUTH_PORTAL,
  assertLoginAccountTypeOrThrow,
  wrongPortalLoginMessage,
} from "@/lib/authPortal"

export const useAuthAPI = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const signInMutation = useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const response = await http.post<AdminLoginResponse>("/auth/login", {
        ...payload,
        portal: APP_AUTH_PORTAL,
      })
      const data = response.data
      assertLoginAccountTypeOrThrow(data)
      return data
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        setCookie(null, "accessToken", data.accessToken, { maxAge: 30 * 60, path: "/" })
      }
      if (data?.refreshToken) {
        setCookie(null, "refreshToken", data.refreshToken, { maxAge: 20 * 60 * 60, path: "/" })
      }
      dispatch(setProfile(adminLoginToProfile(data)))
      toast.success("Welcome back!")
    },
    onError: (error: any) => {
      if (error?.wrongPortal) {
        toast.error(error.message || wrongPortalLoginMessage())
        return
      }
      const status = error?.response?.status
      const msg =
        error?.response?.data?.responseMessage || error?.response?.data?.message
      if (status === 403) {
        toast.error(msg || wrongPortalLoginMessage())
        return
      }
      toast.error(msg || "Sign in failed")
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await http.post("/auth/sign-out")
      return response.data
    },
    onSuccess: () => {
      destroyCookie(null, "accessToken", { path: "/" })
      destroyCookie(null, "refreshToken", { path: "/" })
      dispatch(clearAuth())
      queryClient.clear()
      toast.success("You've been signed out.")
      if (typeof window !== "undefined") {
        window.location.assign("/sign-in")
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Sign out failed. Please try again.",
      )
      redirectToSignIn()
    },
  })

  return {
    signInAsync: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
