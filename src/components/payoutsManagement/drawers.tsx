import { AlertCircle, Ban, Building, Check, CheckCircle, Loader2, Mail, Phone, XCircle } from "lucide-react"
import type { PayoutRequest } from "./data"
import { DrawerFrame, infoRow, kycBadge, rejectIcon, rejectPreviewList, statusBadge } from "./shared"
import { useAdminPayoutDetail } from "@/services/useAdminPayouts"

function formatPayoutMoney(amount: number, currency?: string | null) {
  const c = currency?.trim() || "GBP"
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: c }).format(amount)
  } catch {
    return `${c} ${amount.toFixed(2)}`
  }
}

export function PayoutDetailsDrawer({
  payoutId,
  summaryPayout,
  isApproveSubmitting = false,
  onClose,
  onApprove,
  onReject,
}: {
  payoutId: string
  summaryPayout: PayoutRequest
  isApproveSubmitting?: boolean
  onClose: () => void
  onApprove: (payoutId: string) => void
  onReject: (payout: PayoutRequest) => void
}) {
  const { data: detailPayout, isLoading, isError, error } = useAdminPayoutDetail(payoutId)
  const payout = detailPayout ?? summaryPayout

  const initials = payout.vendorOwner
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (isLoading && !detailPayout) {
    return (
      <DrawerFrame title="Payout Request Details" onClose={onClose}>
        <div className="flex flex-col items-center gap-4 px-5 py-16">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-100/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" aria-hidden />
            <span className="sr-only">Loading payout details</span>
          </div>
          <p className="font-unageo text-sm text-accent-70">Loading payout details…</p>
        </div>
      </DrawerFrame>
    )
  }

  if (isError && !detailPayout) {
    return (
      <DrawerFrame title="Payout Request Details" onClose={onClose}>
        <div className="p-5">
          <p className="font-unageo text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load payout details."}
          </p>
        </div>
      </DrawerFrame>
    )
  }

  const currency = payout.payoutCurrency ?? "GBP"

  return (
    <DrawerFrame title="Payout Request Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        <section className="rounded-xl border border-border bg-secondary-800 p-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-40">
              <span className="font-unbounded text-2xl font-semibold text-secondary-000">{initials}</span>
            </div>
            <h4 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">{payout.vendorName}</h4>
            <p className="mt-1 font-unageo text-sm text-accent-70">
              {payout.vendorEmail} • {payout.vendorOwner}
            </p>
            <div className="mt-3">{statusBadge(payout.status)}</div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
            <Mini label="Payout amount" value={formatPayoutMoney(payout.amount, currency)} />
            <Mini label="Bookings" value={String(payout.completedBookings)} />
            <div className="text-center">
              <p className="font-unageo text-xs text-accent-70">Stripe / KYC</p>
              <div className="mt-1 inline-flex">{kycBadge(payout.kycStatus)}</div>
            </div>
          </div>
        </section>

        <Section title="Contact Information">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-unageo text-sm text-secondary-000">
              <Mail className="h-4 w-4 text-accent-60" /> {payout.vendorEmail}
            </div>
            <div className="inline-flex items-center gap-2 font-unageo text-sm text-secondary-000">
              <Phone className="h-4 w-4 text-accent-60" /> {payout.vendorPhone}
            </div>
          </div>
        </Section>

        {payout.vendorCategory ? (
          <Section title="Vendor profile">
            <div className="space-y-2">
              {infoRow("Category", payout.vendorCategory)}
              {payout.stripeConnectStatus ? infoRow("Stripe status", payout.stripeConnectStatus) : null}
            </div>
          </Section>
        ) : null}

        <Section title="Payout Summary">
          <div className="space-y-2">
            {infoRow("Request ID", payout.id)}
            {infoRow("Vendor ID", payout.vendorId)}
            {payout.transactionId != null && payout.transactionId !== "" ? infoRow("Transaction ID", payout.transactionId) : null}
            {payout.transactionRef != null && payout.transactionRef !== "" ? infoRow("Transaction ref", payout.transactionRef) : null}
            {infoRow("Wallet balance", payout.walletBalance > 0 ? formatPayoutMoney(payout.walletBalance, currency) : "—")}
            {infoRow("Payout amount", formatPayoutMoney(payout.amount, currency), "text-chart-2")}
            {infoRow("Platform fee", formatPayoutMoney(payout.platformFee, currency))}
            {infoRow("Net payout", formatPayoutMoney(payout.netAmount, currency), "text-primary-100")}
            {infoRow("Completed bookings", String(payout.completedBookings))}
            <div className="border-t border-border pt-2">{infoRow("Status", payout.status)}</div>
          </div>
        </Section>

        {payout.ledgerDescription ? (
          <Section title="Ledger transaction">
            <div className="space-y-2">
              {payout.ledgerType ? infoRow("Type", payout.ledgerType) : null}
              {infoRow("Description", payout.ledgerDescription)}
              {payout.ledgerReferenceType && payout.ledgerReferenceId
                ? infoRow("Reference", `${payout.ledgerReferenceType} · ${payout.ledgerReferenceId}`)
                : null}
            </div>
          </Section>
        ) : null}

        <Section title="Bank / payout destination" icon={<Building className="h-4 w-4 text-secondary-000" />}>
          <div className="space-y-2">
            {infoRow("Bank / provider", payout.bankName)}
            {infoRow("Account / connect ID", payout.accountNumber)}
            {infoRow("Account name", payout.accountName)}
            <div className="flex items-center gap-2 border-t border-border pt-2">
              {payout.kycStatus === "Verified" ? <CheckCircle className="h-4 w-4 text-chart-2" /> : <AlertCircle className="h-4 w-4 text-chart-5" />}
              <span className={`font-unageo text-xs font-semibold ${payout.kycStatus === "Verified" ? "text-chart-2" : "text-chart-5"}`}>
                {payout.kycStatus === "Verified" ? "Stripe fully active" : "Pending verification"}
              </span>
            </div>
          </div>
        </Section>

        {payout.status === "Approved" || payout.status === "Completed" ? (
          <section className="rounded-xl border border-chart-2/30 bg-chart-2/10 p-4">
            <h5 className="mb-2 inline-flex items-center gap-2 font-unageo text-sm font-semibold text-chart-2">
              <CheckCircle className="h-4 w-4" /> Payout Approved
            </h5>
            <div className="space-y-1">
              {infoRow("Approved by", payout.approvedBy ?? "-")}
              {infoRow("Approved on", `${payout.approvedDate ?? "-"} at ${payout.approvedTime ?? "-"}`)}
              {infoRow("Payout Reference", payout.payoutRef ?? "-")}
            </div>
          </section>
        ) : null}

        {payout.status === "Rejected" || payout.status === "Failed" ? (
          <section className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
            <h5 className="mb-2 inline-flex items-center gap-2 font-unageo text-sm font-semibold text-destructive">
              <XCircle className="h-4 w-4" /> Payout Rejected
            </h5>
            <div className="space-y-1">
              {infoRow("Rejected by", payout.rejectedBy ?? "-")}
              {infoRow("Rejected on", `${payout.rejectedDate ?? "-"} at ${payout.rejectedTime ?? "-"}`)}
            </div>
            {payout.rejectionReason ? (
              <p className="mt-3 font-unageo text-sm italic text-secondary-000">{`"${payout.rejectionReason}"`}</p>
            ) : null}
          </section>
        ) : null}
      </div>

      {payout.status === "Pending" || payout.status === "Processing" ? (
        <div className="sticky bottom-0 flex gap-2 rounded-t-2xl border-t border-border bg-white/95 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm md:rounded-none md:bg-white md:p-4 md:shadow-none">
          <button
            type="button"
            disabled={isApproveSubmitting}
            onClick={() => onApprove(payout.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApproveSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Approve Payout
          </button>
          <button
            type="button"
            disabled={isApproveSubmitting}
            onClick={() => onReject(payout)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive bg-white px-4 py-3 font-unageo text-sm font-semibold text-destructive disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Ban className="h-4 w-4" />
            Reject Payout
          </button>
        </div>
      ) : null}
    </DrawerFrame>
  )
}

export function RejectPayoutDrawer({
  payout,
  reason,
  isSubmitting = false,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  payout: PayoutRequest
  reason: string
  isSubmitting?: boolean
  onReasonChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const currency = payout.payoutCurrency ?? "GBP"
  const amountLabel = formatPayoutMoney(payout.amount, currency)

  return (
    <DrawerFrame title="Reject Payout" onClose={onClose} zIndexClass="z-1100">
      <div className="space-y-5 p-5">
        <section className="rounded-xl bg-destructive/10 p-4 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">{rejectIcon()}</div>
          <p className="font-unageo text-sm text-secondary-000">You are about to reject payout for:</p>
          <p className="mt-1 font-unbounded text-lg font-semibold text-secondary-000">{payout.vendorName}</p>
          <p className="mt-1 font-unageo text-sm text-accent-70">Amount: {amountLabel}</p>
        </section>

        <label className="block">
          <span className="mb-1 block font-unageo text-sm font-semibold text-secondary-000">Reason for Rejection *</span>
          <textarea
            rows={5}
            value={reason}
            disabled={isSubmitting}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Enter the reason for rejecting this payout request..."
            className="w-full rounded-lg border border-border p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
        </label>

        <div className="rounded-lg border border-border bg-secondary-800 p-4">
          <p className="mb-2 font-unageo text-xs font-semibold text-secondary-000">This action will:</p>
          {rejectPreviewList()}
        </div>
      </div>

      <div className="sticky bottom-0 flex gap-2 rounded-t-2xl border-t border-border bg-white/95 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm md:rounded-none md:bg-white md:p-4 md:shadow-none">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 rounded-lg border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-60">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-3 font-unageo text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
          Reject Payout
        </button>
      </div>
    </DrawerFrame>
  )
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-secondary-800 p-4">
      <h5 className="mb-3 inline-flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
        {icon}
        {title}
      </h5>
      {children}
    </section>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-unageo text-xs text-accent-70">{label}</p>
      <p className="mt-1 font-unbounded text-base font-semibold text-secondary-000">{value}</p>
    </div>
  )
}
