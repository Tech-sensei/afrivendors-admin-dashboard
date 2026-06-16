export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string; responseMessage?: string } } }).response?.data
    return res?.responseMessage || res?.message || fallback
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
