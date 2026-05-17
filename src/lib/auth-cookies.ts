const ACCESS_COOKIE = "accessToken"
const REFRESH_COOKIE = "refreshToken"

export function setAuthCookies(accessToken?: string, refreshToken?: string) {
  if (typeof document === "undefined") return

  if (accessToken) {
    document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; Max-Age=1800; Path=/; SameSite=Lax`
  }
  if (refreshToken) {
    document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; Max-Age=72000; Path=/; SameSite=Lax`
  }
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return
  document.cookie = `${ACCESS_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
  document.cookie = `${REFRESH_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
}
