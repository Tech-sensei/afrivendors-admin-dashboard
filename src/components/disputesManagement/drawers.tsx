"use client"

import {
  Calendar,
  CreditCard,
  Loader2,
  Mail,
  MessageSquare,
  Store,
  User,
} from "lucide-react"
import type { ComponentType } from "react"
import { DrawerFrame } from "@/components/bookingsManagement/shared"
import type { AdminDisputeResolveMode, DisputeItem } from "@/types/admin-disputes"
import {
  disputeStatusBadge,
  escrowStatusBadge,
  formatDisputeDateLabel,
  formatDisputeMoney,
  referenceBadge,
} from "./shared"

const MIN_RESOLUTION = 20

function orderTypeLabel(type: DisputeItem["orderType"]) {
  return type === "custom_request" ? "Custom request" : "Appointment"
}

function resolveModeTitle(mode: AdminDisputeResolveMode) {
  if (mode === "release_funds") return "Release funds to vendor"
  if (mode === "refund_user") return "Refund customer"
  return "Split settlement"
}

export function DisputeDetailsDrawer({
  dispute,
  isLoading,
  isError,
  onRetry,
  resolveMode,
  resolution,
  vendorPercent,
  clientPercent,
  isResolving,
  onClose,
  onStartResolve,
  onCancelResolve,
  onResolutionChange,
  onVendorPercentChange,
  onClientPercentChange,
  onConfirmResolve,
}: {
  dispute: DisputeItem | null
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  resolveMode: AdminDisputeResolveMode | null
  resolution: string
  vendorPercent: number
  clientPercent: number
  isResolving: boolean
  onClose: () => void
  onStartResolve: (mode: AdminDisputeResolveMode) => void
  onCancelResolve: () => void
  onResolutionChange: (value: string) => void
  onVendorPercentChange: (value: number) => void
  onClientPercentChange: (value: number) => void
  onConfirmResolve: () => void
}) {
  const trimmed = resolution.trim()
  const title = dispute ? dispute.caseId : "Case details"
  const isResolved = dispute?.displayStatus === "Resolved"
  const splitTotal = vendorPercent + clientPercent
  const splitValid = splitTotal === 100
  const vendorShare = dispute ? (dispute.totalAmount * vendorPercent) / 100 : 0
  const clientShare = dispute ? (dispute.totalAmount * clientPercent) / 100 : 0

  const handleVendorPercentChange = (value: number) => {
    const next = Math.min(100, Math.max(0, value))
    onVendorPercentChange(next)
    onClientPercentChange(100 - next)
  }

  const handleClientPercentChange = (value: number) => {
    const next = Math.min(100, Math.max(0, value))
    onClientPercentChange(next)
    onVendorPercentChange(100 - next)
  }

  const canConfirm =
    trimmed.length >= MIN_RESOLUTION &&
    (resolveMode !== "split" || splitValid) &&
    !isResolving

  return (
    <DrawerFrame title={title} onClose={onClose}>
      <div className="space-y-5 p-5">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
          </div>
        ) : isError && !dispute ? (
          <div className="py-10 text-center">
            <p className="font-unageo text-sm text-accent-70">Could not load dispute details.</p>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 font-unageo text-sm font-semibold text-primary-100"
              >
                Try again
              </button>
            ) : null}
          </div>
        ) : dispute ? (
          <>
            <div className="rounded-xl border border-border bg-secondary-800/30 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-unbounded text-lg font-semibold text-secondary-000">{dispute.caseId}</p>
                  <p className="mt-1 font-unageo text-sm text-accent-70">
                    Raised {formatDisputeDateLabel(dispute.dateRaised)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {disputeStatusBadge(dispute.displayStatus)}
                  {escrowStatusBadge(dispute.escrowFrozen)}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {referenceBadge(orderTypeLabel(dispute.orderType))}
                {referenceBadge(dispute.appointmentLabel)}
                {referenceBadge(dispute.orderLabel)}
              </div>
            </div>

            <section className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-4">
              <p className="font-unageo text-xs font-semibold uppercase tracking-wide text-amber-900">
                Issue reported
              </p>
              <p className="mt-2 font-unageo text-sm leading-relaxed text-secondary-000">{dispute.reason}</p>
            </section>

            {dispute.resolution ? (
              <section className="rounded-xl border border-chart-2/25 bg-chart-2/8 p-4">
                <p className="font-unageo text-xs font-semibold uppercase tracking-wide text-chart-2">Resolution</p>
                <p className="mt-2 font-unageo text-sm leading-relaxed text-secondary-000">{dispute.resolution}</p>
                {dispute.resolvedBy ? (
                  <p className="mt-2 font-unageo text-xs text-accent-70">
                    By {dispute.resolvedBy}
                    {dispute.resolvedAt
                      ? ` · ${new Date(dispute.resolvedAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""}
                  </p>
                ) : null}
              </section>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PartyCard
                icon={User}
                label="Customer"
                name={dispute.customerName}
                email={dispute.customerEmail}
                extra={dispute.customerPhone}
              />
              <PartyCard
                icon={Store}
                label="Vendor"
                name={dispute.vendorName}
                email={dispute.vendorEmail}
              />
            </div>

            <section className="rounded-xl border border-border p-4">
              <p className="mb-3 font-unbounded text-sm font-semibold text-secondary-000">
                {orderTypeLabel(dispute.orderType)} & payment
              </p>
              <div className="space-y-2.5">
                <InfoRow icon={Calendar} label="Order" value={dispute.orderTitle} />
                {dispute.serviceNames.length > 0 ? (
                  <InfoRow icon={Calendar} label="Services" value={dispute.serviceNames.join(", ")} />
                ) : null}
                <InfoRow
                  icon={Calendar}
                  label="Schedule"
                  value={`${dispute.appointmentDate} · ${dispute.appointmentTime}`}
                />
                <InfoRow icon={CreditCard} label="Amount" value={formatDisputeMoney(dispute.totalAmount)} />
                <InfoRow
                  icon={CreditCard}
                  label="Payment"
                  value={`${dispute.paymentStatus} · ${dispute.paymentMethod}`}
                />
                <InfoRow icon={Calendar} label="Order status" value={dispute.appointmentStatus} />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`mailto:${dispute.customerEmail}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
              >
                <Mail className="h-3.5 w-3.5" />
                Email customer
              </a>
              <a
                href={`mailto:${dispute.vendorEmail}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
              >
                <Mail className="h-3.5 w-3.5" />
                Email vendor
              </a>
            </div>

            <p className="flex items-center gap-2 rounded-lg bg-accent-20/50 px-3 py-2 font-unageo text-xs text-accent-70">
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              Review in-app messages on client and vendor accounts if needed.
            </p>

            {!isResolved ? (
              resolveMode ? (
                <section className="space-y-3 rounded-xl border border-border p-4">
                  <p className="font-unbounded text-sm font-semibold text-secondary-000">
                    {resolveModeTitle(resolveMode)}
                  </p>

                  {resolveMode === "split" ? (
                    <div className="space-y-3 rounded-lg border border-border bg-secondary-800/40 p-3">
                      <PercentField
                        label="Vendor share"
                        value={vendorPercent}
                        amount={vendorShare}
                        onChange={handleVendorPercentChange}
                      />
                      <PercentField
                        label="Customer refund"
                        value={clientPercent}
                        amount={clientShare}
                        onChange={handleClientPercentChange}
                      />
                      <p
                        className={`font-unageo text-xs ${splitValid ? "text-accent-70" : "text-destructive"}`}
                      >
                        {splitValid
                          ? `Total escrow ${formatDisputeMoney(dispute.totalAmount)} split between both parties.`
                          : `Percentages must add up to 100% (currently ${splitTotal}%).`}
                      </p>
                    </div>
                  ) : null}

                  <textarea
                    value={resolution}
                    onChange={(e) => onResolutionChange(e.target.value)}
                    placeholder="Admin resolution note (min 20 characters)…"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-border px-3 py-2.5 font-unageo text-sm outline-none focus:border-primary-100"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!canConfirm}
                      onClick={onConfirmResolve}
                      className="flex-1 rounded-lg bg-primary-100 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {isResolving ? "Saving…" : "Confirm resolution"}
                    </button>
                    <button
                      type="button"
                      onClick={onCancelResolve}
                      className="rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000"
                    >
                      Cancel
                    </button>
                  </div>
                </section>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => onStartResolve("release_funds")}
                      className="rounded-lg bg-primary-100 py-3 font-unageo text-sm font-semibold text-white hover:bg-primary-100/90"
                    >
                      Pay vendor
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartResolve("refund_user")}
                      className="rounded-lg border border-destructive/30 bg-destructive/5 py-3 font-unageo text-sm font-semibold text-destructive hover:bg-destructive/10"
                    >
                      Refund customer
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartResolve("split")}
                    className="rounded-lg border border-chart-1/30 bg-chart-1/8 py-3 font-unageo text-sm font-semibold text-chart-1 hover:bg-chart-1/12"
                  >
                    Split settlement
                  </button>
                </div>
              )
            ) : null}
          </>
        ) : null}
      </div>
    </DrawerFrame>
  )
}

function PercentField({
  label,
  value,
  amount,
  onChange,
}: {
  label: string
  value: number
  amount: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="font-unageo text-sm font-semibold text-secondary-000">{label}</span>
        <span className="font-unageo text-sm text-accent-70">{formatDisputeMoney(amount)}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary-100"
        />
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 rounded-lg border border-border px-2 py-1.5 text-center font-unageo text-sm outline-none focus:border-primary-100"
        />
        <span className="font-unageo text-sm text-accent-70">%</span>
      </div>
    </label>
  )
}

function PartyCard({
  icon: Icon,
  label,
  name,
  email,
  extra,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  name: string
  email: string
  extra?: string
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100/10 text-primary-100">
          <Icon className="h-4 w-4" />
        </span>
        <p className="font-unageo text-xs font-semibold uppercase tracking-wide text-accent-70">{label}</p>
      </div>
      <p className="font-unageo text-sm font-semibold text-secondary-000">{name}</p>
      <p className="mt-0.5 truncate font-unageo text-xs text-accent-70">{email}</p>
      {extra ? <p className="mt-1 font-unageo text-xs text-accent-70">{extra}</p> : null}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-70" />
      <div className="min-w-0">
        <p className="font-unageo text-xs text-accent-70">{label}</p>
        <p className="font-unageo text-sm text-secondary-000">{value}</p>
      </div>
    </div>
  )
}
