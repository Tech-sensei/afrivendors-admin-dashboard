import { AlertCircle, Ban, CheckCircle, Clock, RefreshCw, X, XCircle } from "lucide-react"
import { motion } from "motion/react"
import { useEffect } from "react"
import type { KycStatus, PayoutStatus } from "./data"

export function DrawerFrame({
  title,
  onClose,
  children,
  zIndexClass = "z-1000",
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  zIndexClass?: string
}) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
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
        className={`fixed inset-x-0 bottom-0 ${zIndexClass} flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl md:hidden`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex justify-center pb-1 pt-2"><span className="h-1 w-12 rounded-full bg-accent-40" /></div>
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
      <motion.aside
        className={`fixed bottom-0 right-0 top-0 ${zIndexClass} hidden w-[600px] max-w-[95vw] flex-col bg-white shadow-2xl md:flex`}
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
      <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md border border-border">
        <X className="h-4 w-4 text-secondary-000" />
      </button>
    </div>
  )
}

export function statusBadge(status: PayoutStatus) {
  if (status === "Approved") return <Badge icon={CheckCircle} className="bg-chart-2/15 text-chart-2" label={status} />
  if (status === "Completed") return <Badge icon={CheckCircle} className="bg-emerald-500/15 text-emerald-700" label={status} />
  if (status === "Rejected") return <Badge icon={XCircle} className="bg-destructive/15 text-destructive" label={status} />
  if (status === "Failed") return <Badge icon={AlertCircle} className="bg-destructive/15 text-destructive" label={status} />
  if (status === "Processing") return <Badge icon={RefreshCw} className="bg-primary-100/15 text-primary-100" label={status} />
  return <Badge icon={Clock} className="bg-chart-5/15 text-chart-5" label={status} />
}

export function kycBadge(status: KycStatus) {
  if (status === "Verified") return <Badge icon={CheckCircle} className="bg-chart-2/15 text-chart-2" label={status} />
  return <Badge icon={AlertCircle} className="bg-chart-5/15 text-chart-5" label={status} />
}

export function SelectField({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  )
}

function Badge({
  icon: Icon,
  className,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  className: string
  label: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-unageo text-xs font-semibold ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

export function infoRow(label: string, value: React.ReactNode, valueClass?: string) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-unageo text-sm text-accent-70">{label}</span>
      <span className={`font-unageo text-sm font-semibold text-secondary-000 ${valueClass ?? ""}`}>{value}</span>
    </div>
  )
}

export function rejectPreviewList() {
  return (
    <ul className="list-disc space-y-1 pl-5 font-unageo text-sm text-accent-70">
      <li>Reject the payout request</li>
      <li>Keep funds in vendor wallet</li>
      <li>Send notification email to vendor</li>
      <li>Record rejection reason in history</li>
    </ul>
  )
}

export function rejectIcon() {
  return <Ban className="h-10 w-10 text-destructive" />
}
