import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Clock,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react"
import { motion } from "motion/react"
import { useEffect } from "react"
import type {
  PaymentTransaction,
  PaymentTransactionStatus,
  WalletTransaction,
  WalletTransactionType,
} from "./data"

export function DrawerFrame({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <>
      <motion.button
        type="button"
        className="fixed inset-0 z-999 h-screen bg-secondary-000/40"
        onClick={onClose}
        aria-label="Close"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.aside
        className="fixed inset-x-0 bottom-0 z-1000 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl md:hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex justify-center pb-1 pt-2">
          <span className="h-1 w-12 rounded-full bg-accent-40" />
        </div>
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
      <motion.aside
        className="fixed bottom-0 right-0 top-0 z-1000 hidden w-[600px] max-w-[95vw] flex-col bg-white shadow-2xl md:flex"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
    </>
  )
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <h3 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h3>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border"
      >
        <X className="h-4 w-4 text-secondary-000" />
      </button>
    </div>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-unageo text-xs font-semibold text-secondary-000">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function paymentStatusBadge(status: PaymentTransactionStatus) {
  const styles: Record<PaymentTransactionStatus, string> = {
    Completed: "bg-chart-2/15 text-chart-2",
    Pending: "bg-chart-5/15 text-chart-5",
    Refunded: "bg-accent-40/20 text-accent-70",
    Failed: "bg-destructive/15 text-destructive",
  }
  const iconMap: Record<PaymentTransactionStatus, React.ComponentType<{ className?: string }>> = {
    Completed: Check,
    Pending: Clock,
    Refunded: RefreshCw,
    Failed: XCircle,
  }
  const Icon = iconMap[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-unageo text-xs font-semibold ${styles[status]}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  )
}

export function walletTypeBadge(type: WalletTransactionType) {
  const styles: Record<WalletTransactionType, string> = {
    "Top-up": "bg-chart-2/15 text-chart-2",
    Credit: "bg-chart-2/15 text-chart-2",
    Debit: "bg-chart-5/15 text-chart-5",
    Withdrawal: "bg-accent-40/20 text-accent-70",
  }
  const iconMap: Record<WalletTransactionType, React.ComponentType<{ className?: string }>> = {
    "Top-up": ArrowDownLeft,
    Credit: ArrowDownLeft,
    Debit: ArrowUpRight,
    Withdrawal: ArrowUpRight,
  }
  const Icon = iconMap[type]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-unageo text-xs font-semibold ${styles[type]}`}>
      <Icon className="h-3.5 w-3.5" />
      {type}
    </span>
  )
}

export function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatPrettyDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function paymentMatchesSearch(payment: PaymentTransaction, query: string) {
  const q = query.toLowerCase()
  return (
    payment.transactionRef.toLowerCase().includes(q) ||
    payment.customerName.toLowerCase().includes(q) ||
    payment.vendorName.toLowerCase().includes(q) ||
    payment.bookingRef.toLowerCase().includes(q)
  )
}

export function walletMatchesSearch(wallet: WalletTransaction, query: string) {
  const q = query.toLowerCase()
  return (
    wallet.transactionRef.toLowerCase().includes(q) ||
    wallet.userName.toLowerCase().includes(q) ||
    wallet.userId.toLowerCase().includes(q)
  )
}
