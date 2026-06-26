import { buildAdminNotificationHref } from "@/lib/notificationRoutes"
import type {
  AdminNotification,
  AdminNotificationType,
} from "@/types/admin-notifications"

const ADMIN_KNOWN_TYPES = new Set<AdminNotificationType>([
  "dispute",
  "booking",
  "payment",
  "payout",
  "vendor",
  "customer",
  "custom_request",
  "review",
  "message",
  "system",
  "update",
])

function typeFromReferenceType(referenceType: unknown): AdminNotificationType | null {
  const ref = String(referenceType ?? "").toLowerCase()
  if (ref === "dispute") return "dispute"
  if (ref === "appointment_booking") return "booking"
  if (ref === "custom_request") return "custom_request"
  if (ref === "chat_message") return "message"
  if (ref === "vendor_application") return "vendor"
  if (ref.includes("payout")) return "payout"
  if (ref.includes("payment")) return "payment"
  if (ref.includes("review")) return "review"
  return null
}

function normalizeAdminNotificationType(raw: unknown): AdminNotificationType {
  const fromRef = typeFromReferenceType(raw)
  if (fromRef) return fromRef

  const value = String(raw ?? "")
    .toLowerCase()
    .replace(/_/g, "-")

  if (value.includes("dispute")) return "dispute"
  if (value.includes("custom") && value.includes("request")) return "custom_request"
  if (value.includes("book") || value.includes("appointment")) return "booking"
  if (value.includes("payout")) return "payout"
  if (value.includes("payment") || value.includes("wallet")) return "payment"
  if (value.includes("vendor")) return "vendor"
  if (value.includes("customer") || value.includes("user")) return "customer"
  if (value.includes("review")) return "review"
  if (value.includes("message") || value.includes("chat")) return "message"
  if (value.includes("system") || value.includes("maintenance")) return "system"

  if (ADMIN_KNOWN_TYPES.has(value as AdminNotificationType)) {
    return value as AdminNotificationType
  }

  return "update"
}

function parseNotificationDate(raw: unknown): Date {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw
  const parsed = new Date(String(raw ?? ""))
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

function readActionUrl(raw: Record<string, unknown>): string | undefined {
  const url = raw.actionUrl ?? raw.action_url ?? raw.link ?? raw.url ?? raw.href
  if (url == null || url === "") return undefined
  return String(url)
}

function readIsRead(raw: Record<string, unknown>): boolean {
  if (typeof raw.isRead === "boolean") return raw.isRead
  if (typeof raw.read === "boolean") return raw.read
  if (raw.readAt != null || raw.read_at != null) return true
  return false
}

function readItemId(raw: Record<string, unknown>): number | null {
  const value = raw.itemId ?? raw.item_id ?? raw.referenceId ?? raw.reference_id
  if (value == null || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function mapApiNotificationToAdmin(raw: unknown): AdminNotification {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}

  const referenceType = String(row.referenceType ?? row.reference_type ?? "")
  const itemId = readItemId(row)
  const type = normalizeAdminNotificationType(
    referenceType || row.type || row.category || row.event,
  )

  const mapped: AdminNotification = {
    id: String(row.id ?? row._id ?? ""),
    type,
    title: String(row.title ?? row.subject ?? row.heading ?? "Notification"),
    message: String(row.message ?? row.body ?? row.content ?? row.description ?? ""),
    timestamp: parseNotificationDate(
      row.createdAt ?? row.created_at ?? row.timestamp ?? row.sentAt,
    ),
    isRead: readIsRead(row),
    referenceType: referenceType || undefined,
    itemId,
  }

  mapped.actionUrl =
    readActionUrl(row) ?? buildAdminNotificationHref(mapped) ?? undefined

  return mapped
}

export function parseUnreadCountResponse(body: unknown): number {
  if (typeof body === "number" && Number.isFinite(body)) {
    return Math.max(0, Math.floor(body))
  }

  const root =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {}

  if (typeof root.count === "number") {
    return Math.max(0, Math.floor(root.count))
  }
  if (typeof root.unreadCount === "number") {
    return Math.max(0, Math.floor(root.unreadCount))
  }

  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null

  if (nested) {
    if (typeof nested.count === "number") {
      return Math.max(0, Math.floor(nested.count))
    }
    if (typeof nested.unreadCount === "number") {
      return Math.max(0, Math.floor(nested.unreadCount))
    }
  }

  return 0
}

export function parseNotificationsListResponse(body: unknown): {
  items: AdminNotification[]
  meta: { page: number; limit: number; total: number; totalPages: number }
} {
  const root =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {}

  const payload =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root

  const rawList = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.notifications)
        ? payload.notifications
        : Array.isArray(root.data)
          ? root.data
          : []

  const items = rawList.map((row) => mapApiNotificationToAdmin(row))

  const metaRaw = (payload.meta ?? root.meta ?? {}) as Record<string, unknown>
  const page = Number(metaRaw.page ?? 1)
  const limit = Number(metaRaw.limit ?? (items.length || 20))
  const total = Number(metaRaw.total ?? items.length)
  const totalPages = Math.max(
    1,
    Number(metaRaw.totalPages ?? (limit > 0 ? Math.ceil(total / limit) : 1)),
  )

  return {
    items,
    meta: { page, limit, total, totalPages },
  }
}
