import { Calendar, CheckCircle, Clock, DollarSign, MessageSquare, Users } from "lucide-react"
import type { Booking, Dispute, SupportTicket, Vendor } from "./data"

export function DashboardLists({
  recentBookings,
  recentActivities,
  recentVendors,
  supportTickets,
  disputes,
  onOpen,
  onViewAllTickets,
  onViewAllDisputes,
}: {
  recentBookings: Booking[]
  recentActivities: {
    user: string
    action: string
    target: string
    time: string
    type: "booking" | "profile" | "review" | "service" | "payout"
  }[]
  recentVendors: Vendor[]
  supportTickets: SupportTicket[]
  disputes: Dispute[]
  onOpen: (type: "booking" | "vendor" | "ticket" | "dispute", data: unknown) => void
  onViewAllTickets: () => void
  onViewAllDisputes: () => void
}) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card title="Recent Bookings">
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => onOpen("booking", booking)}
                className="w-full rounded-lg bg-secondary-800 p-4 text-left transition hover:bg-accent-10"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-unageo text-sm font-semibold text-secondary-000">{booking.customer}</p>
                    <p className="mt-0.5 font-unageo text-xs text-accent-70">
                      {booking.vendor} • {booking.service}
                    </p>
                  </div>
                  <span className={statusClass(booking.status)}>{booking.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-unageo text-xs text-accent-70">{booking.date}</span>
                  <span className="font-unbounded text-sm font-semibold text-primary-100">${booking.amount}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="New Vendors Needing Approval">
          <div className="space-y-3">
            {recentVendors.map((vendor) => (
              <button
                key={vendor.id}
                type="button"
                onClick={() => onOpen("vendor", vendor)}
                className="w-full rounded-lg bg-secondary-800 p-4 text-left transition hover:bg-accent-10"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-unageo text-sm font-semibold text-secondary-000">{vendor.name}</p>
                    <p className="mt-0.5 font-unageo text-xs text-accent-70">
                      {vendor.category} • {vendor.location}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-chart-5" />
                </div>
                <span className="font-unageo text-xs text-accent-70">Applied: {vendor.joinedDate}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card title="Recent Activities">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={`${activity.user}-${activity.time}`} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-800">
                  {activity.type === "booking" && <Calendar className="h-4 w-4 text-primary-100" />}
                  {activity.type === "profile" && <Users className="h-4 w-4 text-chart-2" />}
                  {activity.type === "review" && <MessageSquare className="h-4 w-4 text-chart-5" />}
                  {activity.type === "service" && <CheckCircle className="h-4 w-4 text-chart-2" />}
                  {activity.type === "payout" && <DollarSign className="h-4 w-4 text-primary-100" />}
                </div>
                <div>
                  <p className="font-unageo text-sm text-secondary-000">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                    <span className="text-accent-70">{activity.target}</span>
                  </p>
                  <span className="font-unageo text-xs text-accent-70">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Recent Support Tickets"
          action={
            <button
              type="button"
              onClick={onViewAllTickets}
              className="rounded-md px-3 py-1.5 font-unageo text-xs font-semibold text-primary-100 transition hover:bg-primary-100/10"
            >
              View All Tickets →
            </button>
          }
        >
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onOpen("ticket", ticket)}
                className="w-full rounded-lg bg-secondary-800 p-4 text-left transition hover:bg-accent-10"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-unageo text-sm font-semibold text-secondary-000">{ticket.subject}</p>
                    <p className="mt-0.5 font-unageo text-xs text-accent-70">
                      {ticket.customer ?? ticket.vendor} • {ticket.created}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
                    <span className={ticketStatusClass(ticket.status)}>{ticket.status}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Disputes Needing Attention"
        action={
          <button
            type="button"
            onClick={onViewAllDisputes}
            className="rounded-md px-3 py-1.5 font-unageo text-xs font-semibold text-primary-100 transition hover:bg-primary-100/10"
          >
            View All Disputes →
          </button>
        }
      >
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <button
              key={dispute.id}
              type="button"
              onClick={() => onOpen("dispute", dispute)}
              className="w-full rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-left transition hover:opacity-90"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-unageo text-sm font-semibold text-secondary-000">
                    {dispute.customer} vs {dispute.vendor}
                  </p>
                  <p className="mt-1 font-unageo text-sm text-accent-80">{dispute.issue}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-unageo text-xs text-accent-70">Amount: ${dispute.amount}</span>
                    <span className="font-unageo text-xs text-accent-70">Date: {dispute.created}</span>
                    <span className="rounded bg-chart-5/20 px-2 py-1 font-unageo text-xs font-semibold text-secondary-000">
                      {dispute.status}
                    </span>
                  </div>
                </div>
                <MessageSquare className="h-5 w-5 text-destructive" />
              </div>
            </button>
          ))}
        </div>
      </Card>
    </section>
  )
}

function Card({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
        {action}
      </div>
      {children}
    </article>
  )
}

function statusClass(status: Booking["status"]) {
  if (status === "Completed") return "rounded bg-chart-2/20 px-2 py-1 font-unageo text-xs font-semibold text-secondary-000"
  if (status === "Confirmed") return "rounded bg-primary-100/15 px-2 py-1 font-unageo text-xs font-semibold text-secondary-000"
  return "rounded bg-chart-5/20 px-2 py-1 font-unageo text-xs font-semibold text-secondary-000"
}

function priorityClass(priority: SupportTicket["priority"]) {
  if (priority === "High") return "rounded bg-destructive/20 px-2 py-0.5 font-unageo text-[11px] font-semibold text-secondary-000"
  if (priority === "Medium") return "rounded bg-chart-5/20 px-2 py-0.5 font-unageo text-[11px] font-semibold text-secondary-000"
  return "rounded bg-accent-10 px-2 py-0.5 font-unageo text-[11px] font-semibold text-secondary-000"
}

function ticketStatusClass(status: SupportTicket["status"]) {
  if (status === "Open") return "rounded bg-destructive/15 px-2 py-0.5 font-unageo text-[11px] font-semibold text-secondary-000"
  if (status === "In Progress") return "rounded bg-chart-5/20 px-2 py-0.5 font-unageo text-[11px] font-semibold text-secondary-000"
  return "rounded bg-chart-2/20 px-2 py-0.5 font-unageo text-[11px] font-semibold text-secondary-000"
}
