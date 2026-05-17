"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  bookingsData,
  chartColors,
  revenueByCategoryData,
  revenueData,
  vendorsCustomersData,
} from "./data"

const axisProps = {
  stroke: chartColors.muted,
  style: { fontFamily: "var(--font-unageo-sans)", fontSize: "12px" },
}

const tooltipStyle = {
  backgroundColor: chartColors.bg,
  border: `1px solid ${chartColors.border}`,
  borderRadius: "10px",
  fontFamily: "var(--font-unageo-sans)",
  fontSize: "12px",
}

const formatCurrency = (value: unknown) => {
  const num = Number(value ?? 0)
  return `$${num.toLocaleString()}`
}

export function DashboardCharts({
  chartPeriod,
  onPeriodChange,
}: {
  chartPeriod: "daily" | "weekly" | "monthly"
  onPeriodChange: (period: "daily" | "weekly" | "monthly") => void
}) {
  return (
    <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
      <Card title="Revenue Analytics" subtitle="Monthly revenue trend">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="New Vendors vs Customers" subtitle="Monthly sign-ups comparison">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={vendorsCustomersData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontFamily: "var(--font-unageo-sans)", fontSize: "12px" }} />
            <Bar dataKey="vendors" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="customers" fill={chartColors.chart2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        title="Bookings Overview"
        subtitle="This week's bookings"
        action={
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onPeriodChange(period)}
                className={
                  chartPeriod === period
                    ? "rounded-md border border-primary-100 bg-primary-100 px-3 py-1.5 font-unageo text-xs font-semibold capitalize text-white"
                    : "rounded-md border border-border bg-transparent px-3 py-1.5 font-unageo text-xs font-semibold capitalize text-accent-70 hover:bg-secondary-800"
                }
              >
                {period}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={bookingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis dataKey="day" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [Number(value ?? 0), "Bookings"]} />
            <Line type="monotone" dataKey="bookings" stroke={chartColors.chart5} strokeWidth={2} dot={{ fill: chartColors.chart5, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Revenue by Category" subtitle="Top performing categories">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueByCategoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis type="number" {...axisProps} tickFormatter={(value) => `$${value / 1000}k`} />
            <YAxis type="category" dataKey="category" {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), "Revenue"]} />
            <Bar dataKey="revenue" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </section>
  )
}

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
          <p className="mt-1 font-unageo text-xs text-accent-70">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </article>
  )
}
