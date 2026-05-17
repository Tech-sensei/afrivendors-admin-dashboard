import { Ban, CheckCircle, Lock, Mail } from "lucide-react"
import { formatCustomerDate, formatCustomerDateTime, type Customer } from "@/components/customerManagement/data"
import { DrawerFrame, InfoBlock, StatMini, statusBadge, verificationBadge } from "./shared"

export function CustomerDetailsDrawer({
  customer,
  onClose,
  onSuspend,
  onActivate,
  onResetPassword,
}: {
  customer: Customer
  onClose: () => void
  onSuspend: () => void
  onActivate: () => void
  onResetPassword: () => void
}) {
  const initials = customer.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <DrawerFrame title="Customer Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        <section className="rounded-xl bg-secondary-800 p-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-40">
              <span className="font-unbounded text-2xl font-semibold text-secondary-000">{initials}</span>
            </div>
            <h4 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">{customer.name}</h4>
            <p className="mt-1 break-all font-unageo text-sm text-accent-70">{customer.email}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {statusBadge(customer.status)}
              {verificationBadge(customer.verified)}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-xl border border-border p-4">
          <StatMini label="Joined" value={formatCustomerDate(customer.joinedDate)} />
          <StatMini label="Email verified" value={customer.verified ? "Yes" : "No"} />
        </section>

        <InfoBlock label="Email" value={customer.email} />
        <InfoBlock label="Phone" value={customer.phone} />
        <InfoBlock
          label="Email verified at"
          value={customer.emailVerifiedAt ? formatCustomerDateTime(customer.emailVerifiedAt) : "Not verified"}
        />
        <InfoBlock label="Activity" value={customer.lastActivity} />
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-border bg-white p-4">
        {customer.status === "Suspended" ? (
          <button
            type="button"
            onClick={onActivate}
            className="flex-1 rounded-lg bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white"
          >
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Activate Customer
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSuspend}
            className="flex-1 rounded-lg border border-destructive bg-white px-4 py-3 font-unageo text-sm font-semibold text-destructive"
          >
            <span className="inline-flex items-center gap-1">
              <Ban className="h-4 w-4" /> Suspend Customer
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={onResetPassword}
          className="flex-1 rounded-lg border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000"
        >
          <span className="inline-flex items-center gap-1">
            <Lock className="h-4 w-4" /> Reset Password
          </span>
        </button>
      </div>
    </DrawerFrame>
  )
}

export function ActionDrawer({
  title,
  icon,
  description,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
}: {
  title: string
  icon: React.ReactNode
  description: string
  confirmLabel: string
  confirmClass: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <DrawerFrame title={title} onClose={onClose}>
      <div className="flex flex-1 flex-col p-5">
        <div className="rounded-xl bg-secondary-800 p-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">{icon}</div>
          <p className="font-unageo text-sm text-secondary-000">{description}</p>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border p-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 rounded-lg px-4 py-3 font-unageo text-sm font-semibold ${confirmClass}`}
        >
          {title === "Reset Password" ? (
            <span className="inline-flex items-center gap-1">
              <Mail className="h-4 w-4" /> {confirmLabel}
            </span>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </DrawerFrame>
  )
}

export function SuspendDrawer({
  customer,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  customer: Customer
  reason: string
  onReasonChange: (v: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <DrawerFrame title="Suspend Customer" onClose={onClose}>
      <div className="space-y-4 p-5">
        <div className="rounded-xl bg-destructive/10 p-4 text-center">
          <Ban className="mx-auto mb-2 h-10 w-10 text-destructive" />
          <p className="font-unageo text-sm text-secondary-000">You are about to suspend {customer.name}</p>
        </div>
        <label className="block">
          <span className="mb-1 block font-unageo text-sm font-semibold text-secondary-000">Reason for Suspension *</span>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="w-full rounded-lg border border-border p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
            placeholder="Enter reason..."
          />
        </label>
      </div>
      <div className="flex gap-2 border-t border-border p-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-destructive px-4 py-3 font-unageo text-sm font-semibold text-white"
        >
          Suspend Customer
        </button>
      </div>
    </DrawerFrame>
  )
}
