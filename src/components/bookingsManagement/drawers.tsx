import {
  AlertTriangle,
  Ban,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Store,
  User,
} from "lucide-react"
import * as React from "react"
import type { Booking } from "./data"
import { formatTimeFromApi } from "@/lib/mapAdminAppointment"
import { DrawerFrame, formatPrettyDate, formatShortDate, paymentBadge, statusBadge } from "./shared"

export function BookingDetailsDrawer({
  booking,
  onClose,
  onCancel,
  onComplete,
  onContactCustomer,
  onContactVendor,
}: {
  booking: Booking
  onClose: () => void
  onCancel: (bookingId: string) => void
  onComplete: (bookingId: string) => void
  onContactCustomer: (email: string) => void
  onContactVendor: (email: string) => void
}) {
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = React.useState(false)

  const canManageLifecycle = ["Upcoming", "Pending", "Accepted", "In Progress"].includes(booking.status)
  const amountLabel = booking.amount > 0 ? `$${booking.amount}` : "—"
  const timeLabel =
    booking.duration > 0 ? `${booking.time} (${booking.duration} mins)` : booking.time

  return (
    <>
      <DrawerFrame title="Booking Details" onClose={onClose}>
        <div className="space-y-5 p-5">
          <section className="rounded-xl border border-border bg-secondary-800 p-4">
            <p className="font-unageo text-xs text-accent-70">Reference</p>
            <p className="font-unbounded text-lg font-semibold text-primary-100">{booking.bookingRef}</p>
          </section>

          <DetailSection title="Service Information">
            <Info icon={Store} label="Service" value={booking.service} />
            <Info icon={Calendar} label="Date" value={formatPrettyDate(booking.date)} />
            <Info icon={Clock} label="Time" value={timeLabel} />
            <Info icon={MapPin} label="Location" value={`${booking.location} • ${booking.venueType}`} />
            <Info icon={DollarSign} label="Amount" value={amountLabel} bold />
          </DetailSection>

          {booking.rescheduleDate ? (
            <DetailSection title="Reschedule request">
              <Info icon={Calendar} label="Proposed date" value={formatPrettyDate(booking.rescheduleDate)} />
              <Info
                icon={Clock}
                label="Proposed time"
                value={booking.rescheduleTime ? formatTimeFromApi(booking.rescheduleTime) : "—"}
              />
            </DetailSection>
          ) : null}

          <DetailSection title="Customer Information">
            <Info icon={User} label="Name" value={booking.customerName} />
            <Info icon={Mail} label="Email" value={booking.customerEmail} />
            <Info icon={Phone} label="Phone" value={booking.customerPhone} />
            <button
              type="button"
              onClick={() => onContactCustomer(booking.customerEmail)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-white"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Customer
            </button>
          </DetailSection>

          <DetailSection title="Vendor Information">
            <Info icon={Store} label="Vendor Name" value={booking.vendorName} />
            <Info icon={Mail} label="Email" value={booking.vendorEmail} />
            <button
              type="button"
              onClick={() => onContactVendor(booking.vendorEmail)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-white"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Vendor
            </button>
          </DetailSection>

          <DetailSection title="Status & Payment">
            <Pair label="Booking Status" valueNode={statusBadge(booking.status)} />
            <Pair label="Payment Status" valueNode={paymentBadge(booking.paymentStatus)} />
            <Pair label="Payment Method" value={booking.paymentMethod} />
          </DetailSection>

          {booking.notes ? (
            <DetailSection title="Booking Notes">
              <p className="font-unageo text-sm leading-relaxed text-secondary-000">{booking.notes}</p>
            </DetailSection>
          ) : null}

          <DetailSection title="Metadata">
            <Pair label="Booking Created" value={formatShortDate(booking.bookingDate)} />
            <Pair label="Customer ID" value={booking.customerId} />
            <Pair label="Vendor ID" value={booking.vendorId} />
          </DetailSection>
        </div>

        {canManageLifecycle ? (
          <div className="sticky bottom-0 flex gap-2 rounded-t-2xl border-t border-border bg-white/95 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm md:rounded-none md:bg-white md:p-4 md:shadow-none">
            <button
              type="button"
              onClick={() => setShowCompleteConfirm(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white"
            >
              <Check className="h-4 w-4" />
              Mark Complete
            </button>
            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive bg-white px-4 py-3 font-unageo text-sm font-semibold text-destructive"
            >
              <Ban className="h-4 w-4" />
              Cancel Booking
            </button>
          </div>
        ) : null}
      </DrawerFrame>

      {showCancelConfirm ? (
        <ConfirmationModal
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This will refund the customer and notify both parties."
          confirmLabel="Yes, Cancel Booking"
          tone="danger"
          onConfirm={() => {
            onCancel(booking.id)
            setShowCancelConfirm(false)
          }}
          onCancel={() => setShowCancelConfirm(false)}
        />
      ) : null}

      {showCompleteConfirm ? (
        <ConfirmationModal
          title="Mark Booking Complete"
          message="Are you sure you want to mark this booking as completed? This will update the booking status and notify both parties."
          confirmLabel="Yes, Mark Complete"
          tone="success"
          onConfirm={() => {
            onComplete(booking.id)
            setShowCompleteConfirm(false)
          }}
          onCancel={() => setShowCompleteConfirm(false)}
        />
      ) : null}
    </>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h5 className="mb-2 font-unbounded text-base font-semibold text-secondary-000">{title}</h5>
      <div className="space-y-3 rounded-xl border border-border bg-secondary-800 p-4">{children}</div>
    </section>
  )
}

function Info({
  icon: Icon,
  label,
  value,
  bold = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent-60" />
      <div>
        <p className="font-unageo text-xs text-accent-70">{label}</p>
        <p className={`font-unageo text-sm text-secondary-000 ${bold ? "font-semibold" : ""}`}>{value}</p>
      </div>
    </div>
  )
}

function Pair({
  label,
  value,
  valueNode,
}: {
  label: string
  value?: string
  valueNode?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-unageo text-sm text-accent-70">{label}</span>
      {valueNode ?? <span className="font-unageo text-sm font-semibold text-secondary-000">{value}</span>}
    </div>
  )
}

function ConfirmationModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  tone,
}: {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  tone: "danger" | "success"
}) {
  const toneClass = tone === "danger" ? "bg-destructive text-white" : "bg-chart-2 text-white"

  return (
    <button
      type="button"
      className="fixed inset-0 z-1100 flex h-screen items-center justify-center bg-secondary-000/50 px-4"
      onClick={onCancel}
      aria-label="Close"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary-800">
          <AlertTriangle className="h-5 w-5 text-chart-5" />
        </div>
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
        <p className="mt-2 font-unageo text-sm leading-relaxed text-accent-70">{message}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000"
          >
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={`flex-1 rounded-lg px-4 py-2.5 font-unageo text-sm font-semibold ${toneClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </button>
  )
}
