"use client"

import { useEffect, useRef } from "react"
import { parseCookies } from "nookies"
import { performTokenRefresh } from "@/lib/authRefresh"
import { redirectToSignIn } from "@/lib/http"
import { clearAuth, fetchUserProfile } from "@/store/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return typeof payload.exp === "number" ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

const REFRESH_BEFORE_EXPIRY_MS = 30_000

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const scheduleProactiveRefresh = (accessToken: string) => {
      clearTimer()
      const expiryMs = getTokenExpiry(accessToken)
      if (expiryMs === null) return

      const now = Date.now()
      const delay = Math.max(0, expiryMs - now - REFRESH_BEFORE_EXPIRY_MS)

      timerRef.current = setTimeout(async () => {
        const { refreshToken } = parseCookies()
        if (!refreshToken) {
          redirectToSignIn()
          return
        }
        const body = await performTokenRefresh()
        if (!body?.accessToken) {
          redirectToSignIn()
          return
        }
        scheduleProactiveRefresh(body.accessToken)
      }, delay)
    }

    async function bootstrap() {
      const { accessToken, refreshToken } = parseCookies()

      if (!accessToken && !refreshToken) {
        if (isAuthenticated) dispatch(clearAuth())
        return
      }

      const accessExpired =
        !accessToken ||
        (() => {
          const exp = getTokenExpiry(accessToken)
          return exp !== null && exp <= Date.now()
        })()

      if (accessExpired) {
        if (!refreshToken) {
          redirectToSignIn()
          return
        }
        const body = await performTokenRefresh()
        if (!body?.accessToken) {
          redirectToSignIn()
          return
        }
        dispatch(fetchUserProfile())
        scheduleProactiveRefresh(body.accessToken)
        return
      }

      dispatch(fetchUserProfile())
      scheduleProactiveRefresh(accessToken)
    }

    void bootstrap()

    return () => {
      clearTimer()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
