import { Shield, UserRoundCheck, UserRoundX, Users } from "lucide-react"
import type { AdminAccountsStatsData } from "./data"

export function AdminAccountsStats({ stats }: { stats: AdminAccountsStatsData }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        label="Total Admins"
        value={String(stats.totalAdmins)}
        subtitle="All admin accounts"
        tone="primary"
      />
      <StatCard
        icon={UserRoundCheck}
        label="Active Admins"
        value={String(stats.activeAdmins)}
        subtitle="Currently active"
        tone="success"
      />
      <StatCard
        icon={UserRoundX}
        label="Suspended Admins"
        value={String(stats.suspendedAdmins)}
        subtitle="Temporarily suspended"
        tone="danger"
      />
      <StatCard
        icon={Shield}
        label="Total Roles"
        value={String(stats.totalRoles)}
        subtitle="Permission roles"
        tone="neutral"
      />
    </section>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  subtitle: string
  tone: "primary" | "success" | "danger" | "neutral"
}) {
  const toneClass =
    tone === "success"
      ? "text-chart-2 bg-chart-2/10"
      : tone === "danger"
        ? "text-destructive bg-destructive/10"
        : tone === "neutral"
          ? "text-secondary-000 bg-accent-20"
          : "text-primary-100 bg-primary-100/10"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-unageo text-xs text-accent-70">{label}</p>
          <p className="font-unbounded text-2xl font-semibold text-secondary-000">{value}</p>
          <p className="mt-0.5 font-unageo text-xs text-accent-70">{subtitle}</p>
        </div>
      </div>
    </article>
  )
}
