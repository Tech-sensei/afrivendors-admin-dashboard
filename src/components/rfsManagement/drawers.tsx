import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Store,
  Tag,
  User,
} from "lucide-react"
import type { RfsRequest } from "./data"
import {
  DrawerFrame,
  formatMoney,
  formatPrettyDate,
  formatShortDate,
  paymentBadge,
  statusBadge,
} from "./shared"

export function RfsDetailsDrawer({
  request,
  isLoading,
  onClose,
  onContactCustomer,
  onContactVendor,
  onMessageCustomer,
  onMessageVendor,
}: {
  request: RfsRequest
  isLoading?: boolean
  onClose: () => void
  onContactCustomer: (email: string) => void
  onContactVendor: (email: string) => void
  onMessageCustomer: (request: RfsRequest) => void
  onMessageVendor: (request: RfsRequest) => void
}) {
  const acceptedQuote = request.acceptedQuote
  const agreedLabel = request.agreedAmount > 0 ? formatMoney(request.agreedAmount) : "—"
  const budgetLabel = request.budget > 0 ? formatMoney(request.budget) : "—"

  return (
    <DrawerFrame title="Custom Request Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        {isLoading ? (
          <p className="rounded-xl border border-border bg-secondary-800 px-4 py-3 font-unageo text-sm text-accent-70">
            Loading full request details…
          </p>
        ) : null}

        <section className="rounded-xl border border-border bg-secondary-800 p-4">
          <p className="font-unageo text-xs text-accent-70">Reference</p>
          <p className="font-unbounded text-lg font-semibold text-primary-100">{request.referenceId}</p>
        </section>

        <DetailSection title="Request Information">
          <Info icon={FileText} label="Title" value={request.title} />
          <Info icon={Tag} label="Category" value={request.category} />
          <Info icon={Calendar} label="Preferred date" value={request.preferredDate || "—"} />
          <Info icon={Clock} label="Preferred time" value={request.preferredTime || "—"} />
          <Info icon={MapPin} label="Location" value={request.location} />
          <Info icon={DollarSign} label="Agreed amount" value={agreedLabel} bold />
          {request.budget > 0 ? (
            <Info icon={DollarSign} label="Customer budget" value={budgetLabel} />
          ) : null}
        </DetailSection>

        {request.description ? (
          <DetailSection title="Description">
            <p className="font-unageo text-sm leading-relaxed text-secondary-000">{request.description}</p>
          </DetailSection>
        ) : null}

        <DetailSection title="Customer Information">
          <Info icon={User} label="Name" value={request.customerName} />
          <Info icon={Mail} label="Email" value={request.customerEmail} />
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onMessageCustomer(request)}
              disabled={request.customerUserId == null}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white hover:bg-primary-100/90 disabled:opacity-50"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </button>
            <button
              type="button"
              onClick={() => onContactCustomer(request.customerEmail)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-white"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>
        </DetailSection>

        {request.vendorName !== "—" ? (
          <DetailSection title="Assigned Vendor">
            <Info icon={Store} label="Vendor" value={request.vendorName} />
            <Info icon={Tag} label="Vendor ID" value={request.vendorId} />
            {request.vendorEmail !== "—" ? (
              <Info icon={Mail} label="Email" value={request.vendorEmail} />
            ) : null}
            {request.vendorName !== "—" ? (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onMessageVendor(request)}
                  disabled={request.vendorUserId == null}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white hover:bg-primary-100/90 disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
                {request.vendorEmail !== "—" ? (
                  <button
                    type="button"
                    onClick={() => onContactVendor(request.vendorEmail)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-white"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                ) : null}
              </div>
            ) : null}
          </DetailSection>
        ) : null}

        {acceptedQuote ? (
          <DetailSection title="Accepted Quote">
            <Info icon={Store} label="Vendor" value={acceptedQuote.vendorName} />
            <Info icon={DollarSign} label="Total" value={formatMoney(acceptedQuote.totalAmount)} bold />
            {acceptedQuote.lineItems.length > 0 ? (
              <div className="space-y-2 pt-1">
                {acceptedQuote.lineItems.map((line, index) => (
                  <div
                    key={`${line.description}-${index}`}
                    className="flex items-center justify-between gap-3 font-unageo text-sm text-secondary-000"
                  >
                    <span>{line.description}</span>
                    <span className="font-semibold">{formatMoney(line.amount)}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {acceptedQuote.note ? (
              <p className="font-unageo text-sm text-accent-70">{acceptedQuote.note}</p>
            ) : null}
          </DetailSection>
        ) : request.quotes.length > 0 ? (
          <DetailSection title={`Quotes (${request.quotes.length})`}>
            {request.quotes.map((quote) => (
              <div key={quote.id} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{quote.vendorName}</p>
                  <p className="font-unageo text-sm font-semibold text-secondary-000">
                    {formatMoney(quote.totalAmount)}
                  </p>
                </div>
                <p className="mt-1 font-unageo text-xs text-accent-70 capitalize">{quote.status}</p>
              </div>
            ))}
          </DetailSection>
        ) : null}

        <DetailSection title="Status & Payment">
          <Pair label="Request status" valueNode={statusBadge(request.status)} />
          <Pair label="Payment status" valueNode={paymentBadge(request.paymentStatus)} />
          <Pair label="Payment method" value={request.paymentMethod} />
          {request.hasDispute ? (
            <Pair label="Dispute" value="Active dispute on this request" />
          ) : null}
        </DetailSection>

        <DetailSection title="Metadata">
          <Pair label="Submitted" value={request.createdAt ? formatShortDate(request.createdAt) : "—"} />
          {request.completedAt ? (
            <Pair label="Completed" value={formatPrettyDate(request.completedAt)} />
          ) : null}
          {request.fundsReleasedAt ? (
            <Pair label="Funds released" value={formatPrettyDate(request.fundsReleasedAt)} />
          ) : null}
          <Pair label="Customer ID" value={request.customerId} />
          <Pair label="Request ID" value={request.id} />
        </DetailSection>
      </div>
    </DrawerFrame>
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

function Pair({
  label,
  value,
  valueNode,
}: {
  label: string
  value?: string
  valueNode?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-unageo text-sm text-accent-70">{label}</span>
      {valueNode ?? <span className="font-unageo text-sm font-semibold text-secondary-000">{value}</span>}
    </div>
  )
}
