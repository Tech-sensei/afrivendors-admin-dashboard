import { AlertTriangle, Calendar, Check, CreditCard, DollarSign, Mail, RefreshCw, Store, User, Wallet } from "lucide-react"
import * as React from "react"
import type { PaymentTransaction, WalletTransaction } from "./data"
import { DrawerFrame, formatPrettyDate, paymentStatusBadge, walletTypeBadge } from "./shared"

export function PaymentDetailsDrawer({
  payment,
  onClose,
  onIssueRefund,
  onMarkAsPaid,
}: {
  payment: PaymentTransaction
  onClose: () => void
  onIssueRefund: (id: string) => void
  onMarkAsPaid: (id: string) => void
}) {
  const [showRefundConfirm, setShowRefundConfirm] = React.useState(false)
  const [showMarkPaidConfirm, setShowMarkPaidConfirm] = React.useState(false)

  return (
    <>
      <DrawerFrame title="Payment Details" onClose={onClose}>
        <div className="space-y-5 p-5">
          <Reference refText={payment.transactionRef} />

          <DetailSection title="Transaction Information">
            <Info label="Amount" value={`$${payment.amount}`} icon={DollarSign} bold />
            <Info label="Platform Fee (10%)" value={`$${payment.platformFee}`} icon={DollarSign} />
            <Info label="Vendor Amount" value={`$${payment.vendorAmount}`} icon={Wallet} />
            <hr className="border-border" />
            <Info label="Payment Method" value={payment.paymentMethod} icon={CreditCard} />
            <Info label="Provider" value={payment.paymentProvider} icon={Calendar} />
            <Info label="Date & Time" value={`${formatPrettyDate(payment.date)} at ${payment.time}`} icon={Calendar} />
            <Pair label="Status" valueNode={paymentStatusBadge(payment.status)} />
          </DetailSection>

          <DetailSection title="Customer Information">
            <Info label="Name" value={payment.customerName} icon={User} />
            <Info label="Email" value={payment.customerEmail} icon={Mail} />
          </DetailSection>

          <DetailSection title="Vendor Information">
            <Info label="Name" value={payment.vendorName} icon={Store} />
            <Info label="Email" value={payment.vendorEmail} icon={Mail} />
          </DetailSection>

          <DetailSection title="Description">
            <p className="font-unageo text-sm leading-relaxed text-secondary-000">{payment.description}</p>
            <p className="mt-2 font-unageo text-sm text-accent-70">
              Booking Reference: <span className="font-semibold text-primary-100">{payment.bookingRef}</span>
            </p>
          </DetailSection>
        </div>

        {(payment.status === "Completed" || payment.status === "Pending") ? (
          <div className="sticky bottom-0 flex gap-2 rounded-t-2xl border-t border-border bg-white/95 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm md:rounded-none md:bg-white md:p-4 md:shadow-none">
            {payment.status === "Pending" ? (
              <button
                type="button"
                onClick={() => setShowMarkPaidConfirm(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-chart-2 px-4 py-3 font-unageo text-sm font-semibold text-white"
              >
                <Check className="h-4 w-4" />
                Mark as Paid
              </button>
            ) : null}
            {payment.status === "Completed" ? (
              <button
                type="button"
                onClick={() => setShowRefundConfirm(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive bg-white px-4 py-3 font-unageo text-sm font-semibold text-destructive"
              >
                <RefreshCw className="h-4 w-4" />
                Issue Refund
              </button>
            ) : null}
          </div>
        ) : null}
      </DrawerFrame>

      {showRefundConfirm ? (
        <ConfirmationModal
          title="Issue Refund"
          message="Are you sure you want to issue a refund for this payment? This will refund the customer and deduct from the vendor's wallet."
          confirmLabel="Yes, Issue Refund"
          tone="danger"
          onConfirm={() => {
            onIssueRefund(payment.id)
            setShowRefundConfirm(false)
          }}
          onCancel={() => setShowRefundConfirm(false)}
        />
      ) : null}
      {showMarkPaidConfirm ? (
        <ConfirmationModal
          title="Mark as Paid"
          message="Are you sure you want to mark this payment as completed? This will update the payment status and credit the vendor's wallet."
          confirmLabel="Yes, Mark as Paid"
          tone="success"
          onConfirm={() => {
            onMarkAsPaid(payment.id)
            setShowMarkPaidConfirm(false)
          }}
          onCancel={() => setShowMarkPaidConfirm(false)}
        />
      ) : null}
    </>
  )
}

export function WalletDetailsDrawer({
  wallet,
  onClose,
}: {
  wallet: WalletTransaction
  onClose: () => void
}) {
  return (
    <DrawerFrame title="Wallet Transaction Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        <Reference refText={wallet.transactionRef} />
        <DetailSection title="Transaction Information">
          <Pair label="Type" valueNode={walletTypeBadge(wallet.type)} />
          <Info
            label="Amount"
            value={`${wallet.type === "Credit" || wallet.type === "Top-up" ? "+" : "-"}$${wallet.amount}`}
            icon={DollarSign}
            bold
          />
          <Info label="Balance Before" value={`$${wallet.balanceBefore}`} icon={Wallet} />
          <Info label="Balance After" value={`$${wallet.balanceAfter}`} icon={Wallet} bold />
          <hr className="border-border" />
          <Info label="Method" value={wallet.method} icon={CreditCard} />
          <Info label="Date & Time" value={`${formatPrettyDate(wallet.date)} at ${wallet.time}`} icon={Calendar} />
        </DetailSection>

        <DetailSection title="User Information">
          <Info label="Name" value={wallet.userName} icon={User} />
          <Info label="User ID" value={wallet.userId} icon={User} />
          <Info label="User Type" value={wallet.userType} icon={User} />
        </DetailSection>

        <DetailSection title="Description">
          <p className="font-unageo text-sm leading-relaxed text-secondary-000">{wallet.description}</p>
          {wallet.linkedTransaction ? (
            <p className="mt-2 font-unageo text-sm text-accent-70">
              Linked Transaction: <span className="font-semibold text-primary-100">{wallet.linkedTransaction}</span>
            </p>
          ) : null}
        </DetailSection>
      </div>
    </DrawerFrame>
  )
}

function Reference({ refText }: { refText: string }) {
  return (
    <section className="rounded-xl border border-border bg-secondary-800 p-4">
      <p className="font-unageo text-xs text-accent-70">Reference</p>
      <p className="font-unbounded text-lg font-semibold text-primary-100">{refText}</p>
    </section>
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

function Pair({ label, valueNode }: { label: string; valueNode: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-unageo text-sm text-accent-70">{label}</span>
      {valueNode}
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
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary-800">
          <AlertTriangle className="h-5 w-5 text-chart-5" />
        </div>
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
        <p className="mt-2 font-unageo text-sm leading-relaxed text-accent-70">{message}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000">
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
