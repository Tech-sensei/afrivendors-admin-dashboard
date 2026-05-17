import { AlertCircle, Building, DollarSign, TrendingUp } from "lucide-react"

export function PayoutStats({
  pendingAmount,
  approvedAmount,
  totalPayoutRecords,
  rejectedAmount,
  pendingCount,
  approvedCount,
  rejectedCount,
  showPageScopeNote,
}: {
  pendingAmount: number
  approvedAmount: number
  totalPayoutRecords: number
  rejectedAmount: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  showPageScopeNote?: boolean
}) {
  const pageNote = showPageScopeNote ? "On this page" : undefined

  return (
    <div className="space-y-2">
      {showPageScopeNote ? (
        <p className="font-unageo text-xs text-accent-70">
          Pending, approved, and rejected amounts and counts reflect the current page only. Total records includes all pages.
        </p>
      ) : null}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={DollarSign}
          tone="warning"
          label="Pending Payouts"
          value={`$${pendingAmount.toLocaleString()}`}
          sub={pageNote ? `${pendingCount} requests · ${pageNote}` : `${pendingCount} requests`}
        />
        <Card
          icon={TrendingUp}
          tone="success"
          label="Approved"
          value={`$${approvedAmount.toLocaleString()}`}
          sub={pageNote ? `${approvedCount} payouts · ${pageNote}` : `${approvedCount} payouts`}
        />
        <Card
          icon={AlertCircle}
          tone="danger"
          label="Rejected"
          value={`$${rejectedAmount.toLocaleString()}`}
          sub={pageNote ? `${rejectedCount} rejected · ${pageNote}` : `${rejectedCount} rejected`}
        />
        <Card
          icon={Building}
          tone="primary"
          label="Total payout requests"
          value={String(totalPayoutRecords)}
          sub="All statuses (API)"
        />
      </section>
    </div>
  )
}

function Card({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
  tone: "warning" | "success" | "primary" | "danger"
}) {
  const toneClass =
    tone === "warning"
      ? "text-chart-5 bg-chart-5/15"
      : tone === "success"
        ? "text-chart-2 bg-chart-2/15"
        : tone === "danger"
          ? "text-destructive bg-destructive/15"
          : "text-primary-100 bg-primary-100/15"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-unageo text-xs text-accent-70">{label}</p>
          <p className="font-unbounded text-2xl font-semibold text-secondary-000">{value}</p>
          <p className="font-unageo text-xs text-accent-70">{sub}</p>
        </div>
      </div>
    </article>
  )
}
