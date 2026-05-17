import { CheckCircle, Clock, X, XCircle } from "lucide-react"
import type { Vendor } from "@/components/vendorManagement/data"

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

export function statusBadge(status: Vendor["status"]) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/20 px-3 py-1 font-unageo text-xs font-semibold text-secondary-000">
        <CheckCircle className="h-3.5 w-3.5 text-chart-2" />
        Active
      </span>
    )
  }
  if (status === "Suspended") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/20 px-3 py-1 font-unageo text-xs font-semibold text-secondary-000">
        <XCircle className="h-3.5 w-3.5 text-destructive" />
        Suspended
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-chart-5/20 px-3 py-1 font-unageo text-xs font-semibold text-secondary-000">
      <Clock className="h-3.5 w-3.5 text-chart-5" />
      Pending
    </span>
  )
}

export function DrawerFrame({
  title,
  onClose,
  children,
  slim = false,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  slim?: boolean
}) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-999 h-screen bg-secondary-000/30"
        onClick={onClose}
        aria-label="Close"
      />
      <aside className="fixed bottom-0 right-0 top-0 z-1000 flex w-[480px] max-w-[90vw] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md border border-border">
            <X className="h-4 w-4 text-secondary-000" />
          </button>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>
  )
}

export function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 font-unageo text-xs font-semibold text-accent-70">{label}</p>
      <p className="font-unageo text-sm leading-relaxed text-secondary-000">{value}</p>
    </div>
  )
}

export function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3 text-center">
      <p className="font-unageo text-xs text-accent-70">{label}</p>
      <p className="mt-1 font-unbounded text-lg font-semibold text-secondary-000">{value}</p>
    </div>
  )
}
