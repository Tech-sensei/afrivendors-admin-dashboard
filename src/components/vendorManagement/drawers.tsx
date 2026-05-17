import { Ban, Check, CheckCircle, Lock, Mail } from "lucide-react"
import type { Vendor } from "@/components/vendorManagement/data"
import { DrawerFrame, InfoBlock, StatMini, statusBadge } from "./shared"

export function VendorDetailsDrawer({
  vendor,
  onClose,
  onApprove,
  onDisable,
  onActivate,
  onResetPassword,
  onApproveDocument,
  onRejectDocument,
}: {
  vendor: Vendor
  onClose: () => void
  onApprove: () => void
  onDisable: () => void
  onActivate: () => void
  onResetPassword: () => void
  onApproveDocument: (name: string) => void
  onRejectDocument: (name: string) => void
}) {
  const initials = vendor.owner
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <DrawerFrame title="Vendor Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        <section className="rounded-xl bg-secondary-800 p-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-40">
              <span className="font-unbounded text-2xl font-semibold text-secondary-000">{initials}</span>
            </div>
            <h4 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">{vendor.name}</h4>
            <p className="mt-1 font-unageo text-sm text-accent-70">
              {vendor.category} • {vendor.email}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {statusBadge(vendor.status)}
              {vendor.verified ? (
                <span className="rounded-full bg-chart-2/20 px-3 py-1 font-unageo text-xs font-semibold text-secondary-000">
                  Verified
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-xl border border-border p-4">
          <StatMini label="Rating" value={vendor.rating > 0 ? vendor.rating.toFixed(1) : "N/A"} />
          <StatMini label="Bookings" value={String(vendor.bookingsCompleted)} />
          <StatMini label="Revenue" value={`$${vendor.totalRevenue.toLocaleString()}`} />
          <StatMini label="Completion" value={`${vendor.completionRate}%`} />
        </section>

        <InfoBlock label="Owner" value={vendor.owner} />
        <InfoBlock label="Email" value={vendor.email} />
        <InfoBlock label="Phone" value={vendor.phone} />
        <InfoBlock label="Country" value={vendor.country} />
        <InfoBlock label="Address" value={vendor.address} />
        <InfoBlock label="Description" value={vendor.description} />

        <section>
          <h5 className="mb-2 font-unbounded text-base font-semibold text-secondary-000">Documents</h5>
          <div className="space-y-2">
            {vendor.documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary-800 p-3"
              >
                <div>
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{doc.name}</p>
                  <p className="font-unageo text-xs text-accent-70">Uploaded: {doc.uploadedDate}</p>
                </div>
                {doc.status === "Approved" ? (
                  <span className="rounded-full bg-chart-2/20 px-3 py-1 font-unageo text-xs font-semibold text-secondary-000">
                    Approved
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onApproveDocument(doc.name)}
                      className="rounded-md bg-chart-2 px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectDocument(doc.name)}
                      className="rounded-md bg-destructive px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-border bg-white p-4">
        {vendor.status === "Pending" ? (
          <button
            type="button"
            onClick={onApprove}
            className="flex-1 rounded-lg bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white"
          >
            Approve Vendor
          </button>
        ) : vendor.status === "Suspended" ? (
          <button
            type="button"
            onClick={onActivate}
            className="flex-1 rounded-lg bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white"
          >
            <span className="inline-flex items-center gap-1">
              <Check className="h-4 w-4" /> Activate Vendor
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onDisable}
            className="flex-1 rounded-lg border border-destructive bg-white px-4 py-3 font-unageo text-sm font-semibold text-destructive"
          >
            <span className="inline-flex items-center gap-1">
              <Ban className="h-4 w-4" /> Suspend Vendor
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
    <DrawerFrame title={title} onClose={onClose} slim>
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

export function DisableDrawer({
  vendor,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  vendor: Vendor
  reason: string
  onReasonChange: (v: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <DrawerFrame title="Suspend Vendor" onClose={onClose} slim>
      <div className="space-y-4 p-5">
        <div className="rounded-xl bg-destructive/10 p-4 text-center">
          <Ban className="mx-auto mb-2 h-10 w-10 text-destructive" />
          <p className="font-unageo text-sm text-secondary-000">You are about to suspend {vendor.name}</p>
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
          Suspend Vendor
        </button>
      </div>
    </DrawerFrame>
  )
}
