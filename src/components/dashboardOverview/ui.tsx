import { AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { KpiCard } from "./data"

function toneClass(tone: KpiCard["tone"]) {
  if (tone === "chart2") return "text-chart-2 bg-chart-2/10"
  if (tone === "chart5") return "text-chart-5 bg-chart-5/10"
  if (tone === "destructive") return "text-destructive bg-destructive/10"
  return "text-primary-100 bg-primary-100/10"
}

export function DashboardHeader() {
  return (
    <div>
      <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">
        Dashboard Overview
      </h2>
      <p className="mt-2 font-unageo text-base text-accent-70">
        Monitor your platform&apos;s performance and activity
      </p>
    </div>
  )
}

export function KpiCardItem({ card }: { card: KpiCard }) {
  const Icon = card.icon
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", toneClass(card.tone))}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-1">
          {card.trend === "up" ? (
            <ArrowUpRight className="h-4 w-4 text-chart-2" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          )}
          <span
            className={cn(
              "font-unageo text-xs font-semibold",
              card.trend === "up" ? "text-chart-2" : "text-destructive",
            )}
          >
            {card.change}
          </span>
        </div>
      </div>
      <h3 className="font-unbounded text-[1.75rem] font-semibold leading-none text-secondary-000">
        {card.value}
      </h3>
      <p className="mt-2 font-unageo text-sm text-accent-70">{card.label}</p>
    </article>
  )
}

export function AlertStrip({
  alerts,
  onAction,
}: {
  alerts: { message: string; action: string }[]
  onAction: (action: string) => void
}) {
  if (!alerts.length) return null
  return (
    <section className="rounded-xl border border-chart-5/40 bg-chart-5/10 p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-chart-5" />
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">System Alerts</h4>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.message} className="flex items-center justify-between gap-3">
            <p className="font-unageo text-sm text-secondary-000">{alert.message}</p>
            <button
              type="button"
              onClick={() => onAction(alert.action)}
              className="rounded-md border border-chart-5/50 px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 transition hover:bg-chart-5/20"
            >
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
