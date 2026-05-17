"use client"

import { AlertTriangle, X } from "lucide-react"
import { useMemo, useState } from "react"
import type { Booking, Dispute, SupportTicket, Vendor } from "./data"

export type DrawerContent =
  | { type: "booking"; data: Booking }
  | { type: "vendor"; data: Vendor }
  | { type: "ticket"; data: SupportTicket }
  | { type: "dispute"; data: Dispute }
  | null

export function DashboardDetailDrawer({
  open,
  content,
  onClose,
  onApproveVendor,
  onRejectVendor,
}: {
  open: boolean
  content: DrawerContent
  onClose: () => void
  onApproveVendor: (vendor: Vendor) => void
  onRejectVendor: (vendor: Vendor, reason: string) => void
}) {
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState("")

  const title = useMemo(() => {
    if (!content) return ""
    if (content.type === "vendor") return "Vendor Approval"
    if (content.type === "booking") return "Booking Details"
    if (content.type === "ticket") return "Support Ticket"
    return "Dispute Details"
  }, [content])

  if (!open || !content) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-999 bg-secondary-000/30 h-screen"
        onClick={onClose}
        aria-label="Close details"
      />
      <aside className="fixed bottom-0 right-0 top-0 z-1000 flex w-[480px] max-w-[90vw] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary-800"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5 text-accent-70" />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-6">
          {content.type === "vendor" && (
            <div className="space-y-4">
              <Info label="Vendor Name" value={content.data.name} />
              <Info label="Vendor ID" value={content.data.id} />
              <Info label="Category" value={content.data.category} />
              <Info label="Location" value={content.data.location} />
              <Info label="Email" value={content.data.email} />
              <Info label="Phone" value={content.data.phone} />
              <Info label="Description" value={content.data.description} />
              <Info label="Opening Hours" value={content.data.openingHours} />
            </div>
          )}
          {content.type === "booking" && (
            <div className="space-y-4">
              <Info label="Booking ID" value={content.data.id} />
              <Info label="Customer" value={content.data.customer} />
              <Info label="Vendor" value={content.data.vendor} />
              <Info label="Service" value={content.data.service} />
              <Info label="Amount" value={`$${content.data.amount}`} />
              <Info label="Status" value={content.data.status} />
            </div>
          )}
          {content.type === "ticket" && (
            <div className="space-y-4">
              <Info label="Ticket ID" value={content.data.id} />
              <Info label="Subject" value={content.data.subject} />
              <Info label="Category" value={content.data.category} />
              <Info label="Priority" value={content.data.priority} />
              <Info label="Status" value={content.data.status} />
              <Info label="Description" value={content.data.description} />
            </div>
          )}
          {content.type === "dispute" && (
            <div className="space-y-4">
              <Info label="Dispute ID" value={content.data.id} />
              <Info label="Booking ID" value={content.data.bookingId} />
              <Info label="Customer" value={content.data.customer} />
              <Info label="Vendor" value={content.data.vendor} />
              <Info label="Issue" value={content.data.issue} />
              <Info label="Amount" value={`$${content.data.amount}`} />
              <Info label="Status" value={content.data.status} />
            </div>
          )}
        </div>

        <div className="border-t border-border p-6">
          {content.type === "vendor" ? (
            <div className="space-y-3">
              {!showReject ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReject(true)}
                    className="flex-1 rounded-md border border-destructive px-4 py-3 font-unageo text-sm font-semibold text-destructive hover:bg-destructive/10"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onApproveVendor(content.data)}
                    className="flex-1 rounded-md bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white hover:opacity-90"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                    <p className="font-unageo text-xs text-secondary-000">
                      Confirm rejection for <span className="font-semibold">{content.data.name}</span>.
                    </p>
                  </div>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-border p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
                    placeholder="Reason for rejection (optional)"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReject(false)}
                      className="flex-1 rounded-md border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectVendor(content.data, reason)}
                      className="flex-1 rounded-md bg-destructive px-4 py-3 font-unageo text-sm font-semibold text-white hover:opacity-90"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md bg-primary-100 px-4 py-3 font-unageo text-sm font-semibold text-white hover:opacity-90"
            >
              Close
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 font-unageo text-xs font-semibold uppercase tracking-wide text-accent-70">
        {label}
      </p>
      <p className="font-unageo text-sm leading-relaxed text-secondary-000">{value}</p>
    </div>
  )
}
