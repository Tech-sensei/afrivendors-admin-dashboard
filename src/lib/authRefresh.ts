import axios from "axios"
import { parseCookies, setCookie } from "nookies"
import type { AdminAuthRefreshResponse } from "@/types/auth"

/** Match backend access JWT lifetime (30 minutes). */
const ACCESS_MAX_AGE = 30 * 60
/** Match backend refresh JWT lifetime (20 hours). */
const REFRESH_MAX_AGE = 20 * 60 * 60

function unwrapData<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data
    if (inner && typeof inner === "object") return inner as T
  }
  return raw as T
}

/**
 * `POST /auth/refresh` with the **refresh** JWT as Bearer (not the access token).
 * Updates cookies when successful. Uses standalone axios (no `http` interceptors).
 */
export async function performTokenRefresh(): Promise<AdminAuthRefreshResponse | null> {
  if (typeof window === "undefined") return null

  const { refreshToken } = parseCookies()
  if (!refreshToken) return null

  const baseURL = process.env.NEXT_PUBLIC_API_URL
  if (!baseURL) return null

  try {
    const res = await axios.post<unknown>(
      `${baseURL.replace(/\/$/, "")}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    const body = unwrapData<AdminAuthRefreshResponse>(res.data)
    if (!body?.accessToken) return null

    setCookie(null, "accessToken", body.accessToken, {
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    })
    if (body.refreshToken) {
      setCookie(null, "refreshToken", body.refreshToken, {
        maxAge: REFRESH_MAX_AGE,
        path: "/",
      })
    }

    return body
  } catch {
    return null
  }
}
