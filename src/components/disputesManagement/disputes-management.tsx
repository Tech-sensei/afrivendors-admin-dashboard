"use client"

import { useState } from "react"
import { Loader2, Mail, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { DrawerFrame } from "@/components/bookingsManagement/shared"
import {
  useAdminOpenDisputes,
  useAdminAppointmentDetail,
  useAdminResolveDispute,
} from "@/services/useAdminDisputes"
import type { AdminDisputeAppointmentApi, AdminDisputeResolveAction } from "@/types/admin-disputes"

const MIN_RESOLUTION = 20

function formatMoney(n?: number) {
  if (n == null || Number.isNaN(n)) return "—"
  return `£${n.toFixed(2)}`
}

export function DisputesManagement() {
  const { data: disputes = [], isLoading, isError, refetch } = useAdminOpenDisputes()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [resolveAction, setResolveAction] = useState<AdminDisputeResolveAction | null>(null)
  const [resolution, setResolution] = useState("")

  const { data: detail, isLoading: detailLoading } = useAdminAppointmentDetail(
    selectedId,
    !!selectedId
  )
  const { mutate: resolveDispute, isPending: isResolving } = useAdminResolveDispute()

  const appt = detail ?? disputes.find((d) => d.id === selectedId) ?? null
  const trimmed = resolution.trim()

  const submitResolve = () => {
    if (!selectedId || !resolveAction || trimmed.length < MIN_RESOLUTION) return
    resolveDispute(
      { appointmentId: selectedId, resolution: trimmed, action: resolveAction },
      {
        onSuccess: () => {
          toast.success(
            resolveAction === "release_funds"
              ? "Funds released to vendor."
              : "Customer refunded."
          )
          setResolveAction(null)
          setResolution("")
          setSelectedId(null)
          refetch()
        },
        onError: (e: unknown) => {
          toast.error(
            (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              "Could not resolve dispute."
          )
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-unageo text-sm text-accent-70">Could not load disputes.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 font-unageo text-sm font-semibold text-primary-100"
          >
            Try again
          </button>
        </div>
      ) : disputes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center font-unageo text-sm text-accent-70">
          No open disputes right now.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary-800 font-unageo text-xs font-semibold text-accent-70">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-border/60 hover:bg-secondary-800/50"
                  onClick={() => setSelectedId(row.id)}
                >
                  <td className="px-4 py-3 font-unageo font-semibold text-secondary-000">
                    #{row.id}
                  </td>
                  <td className="px-4 py-3 font-unageo text-accent-80">{row.customerName}</td>
                  <td className="px-4 py-3 font-unageo text-accent-80">
                    {row.vendor.firstName} {row.vendor.lastName}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-unageo text-accent-80">
                    {row.dispute?.reason ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                      {row.dispute?.status ?? "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && appt && (
        <DrawerFrame title={`Dispute #${appt.dispute?.id ?? appt.id}`} onClose={() => setSelectedId(null)}>
          <div className="space-y-5 p-5">
            {detailLoading && !detail ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-100" />
              </div>
            ) : (
              <>
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-unageo text-xs font-semibold text-amber-900">Customer reason</p>
                  <p className="mt-1 font-unageo text-sm text-secondary-000">
                    {appt.dispute?.reason ?? "—"}
                  </p>
                </section>

                <section className="space-y-2 rounded-xl border border-border p-4">
                  <p className="font-unbounded text-sm font-semibold text-secondary-000">
                    Booking
                  </p>
                  <p className="font-unageo text-sm text-accent-80">
                    {appt.services.map((s) => s.serviceName).join(", ") || "—"}
                  </p>
                  <p className="font-unageo text-sm text-accent-80">
                    {appt.date} · {appt.time}
                  </p>
                  <p className="font-unageo text-sm">
                    Total {formatMoney(appt.totalAmount)} · Vendor{" "}
                    {formatMoney(appt.vendorAmount)}
                  </p>
                  <p className="font-unageo text-sm text-accent-80">
                    Payment: {appt.paymentStatus ?? "—"}
                  </p>
                </section>

                <section className="grid grid-cols-2 gap-2">
                  <a
                    href={`mailto:${appt.customerEmail}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 font-unageo text-xs font-semibold"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email customer
                  </a>
                  <a
                    href={`mailto:${appt.vendor.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 font-unageo text-xs font-semibold"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email vendor
                  </a>
                </section>
                <p className="flex items-center gap-2 font-unageo text-xs text-accent-70">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Review in-app messages on client and vendor accounts if needed.
                </p>

                {resolveAction ? (
                  <section className="space-y-3 rounded-xl border border-border p-4">
                    <p className="font-unbounded text-sm font-semibold text-secondary-000">
                      {resolveAction === "release_funds"
                        ? "Release to vendor"
                        : "Refund customer"}
                    </p>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Admin resolution note (min 20 characters)…"
                      rows={4}
                      className="w-full resize-none rounded-lg border border-border px-3 py-2 font-unageo text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isResolving || trimmed.length < MIN_RESOLUTION}
                        onClick={submitResolve}
                        className="flex-1 rounded-lg bg-primary-100 py-2.5 font-unageo text-sm font-bold text-white disabled:opacity-50"
                      >
                        {isResolving ? "Saving…" : "Confirm"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResolveAction(null)
                          setResolution("")
                        }}
                        className="rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </section>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setResolveAction("release_funds")}
                      className="rounded-lg bg-primary-100 py-3 font-unageo text-sm font-bold text-white"
                    >
                      Pay vendor
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolveAction("refund")}
                      className="rounded-lg bg-red-600 py-3 font-unageo text-sm font-bold text-white"
                    >
                      Refund customer
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </DrawerFrame>
      )}
    </div>
  )
}
