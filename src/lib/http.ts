import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { destroyCookie, parseCookies } from "nookies"
import { performTokenRefresh } from "@/lib/authRefresh"
import { clearAuth } from "@/store/authSlice"
import { store } from "@/store/store"

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

/** 401 on these routes must not trigger refresh (wrong password, etc.). */
function isAuthPublic401Path(config: InternalAxiosRequestConfig): boolean {
  const path = `${config.baseURL ?? ""}${config.url ?? ""}`.toLowerCase()
  const needles = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/resend-verification",
    "/auth/resend-2fa-code",
    "/auth/two-factor/verify",
    "/auth/sign-out",
  ]
  return needles.some((n) => path.includes(n))
}

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const { accessToken } = parseCookies()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})

let isRedirecting = false
let refreshPromise: Promise<string | null> | null = null

export function redirectToSignIn() {
  if (isRedirecting || typeof window === "undefined") return
  isRedirecting = true
  destroyCookie(null, "accessToken", { path: "/" })
  destroyCookie(null, "refreshToken", { path: "/" })
  store.dispatch(clearAuth())
  window.location.href = "/sign-in"
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const body = await performTokenRefresh()
      return body?.accessToken ?? null
    })().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined
    const status = error.response?.status

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (isAuthPublic401Path(originalRequest)) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      redirectToSignIn()
      return Promise.reject(error)
    }

    const newAccess = await refreshAccessToken()
    if (!newAccess) {
      redirectToSignIn()
      return Promise.reject(error)
    }

    originalRequest._retry = true
    originalRequest.headers = originalRequest.headers ?? {}
    originalRequest.headers.Authorization = `Bearer ${newAccess}`

    return http(originalRequest)
  },
)

export default http
