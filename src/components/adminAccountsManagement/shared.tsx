import { CheckCircle, X, XCircle } from "lucide-react"
import type { AdminAccountStatus } from "./data"

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

export function adminStatusBadge(status: AdminAccountStatus) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/20 px-3 py-1 font-unageo text-xs font-semibold text-chart-2">
        <CheckCircle className="h-3.5 w-3.5" />
        Active
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-3 py-1 font-unageo text-xs font-semibold text-destructive">
      <XCircle className="h-3.5 w-3.5" />
      Suspended
    </span>
  )
}

export function roleLabel(role: string) {
  return <span className="font-unageo text-sm font-semibold text-primary-100">{role}</span>
}

export function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 font-unageo text-xs font-semibold text-accent-70">{label}</p>
      <p className="font-unageo text-sm leading-relaxed text-secondary-000">{value}</p>
    </div>
  )
}

export function DrawerFrame({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-999 bg-secondary-000/30"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose()
        }}
        role="presentation"
      />
      <aside className="fixed bottom-0 right-0 top-0 z-1000 flex w-[480px] max-w-[90vw] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-secondary-000" />
          </button>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>
  )
}
