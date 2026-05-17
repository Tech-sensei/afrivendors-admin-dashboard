import { Eye, EyeOff, Mail, Phone, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import type { ReviewItem } from "./data"
import { DrawerFrame, RatingStars, infoRow, initials, statusBadge } from "./shared"

export function ReviewDetailsDrawer({
  review,
  onClose,
  onToggleVisibility,
  onDelete,
}: {
  review: ReviewItem
  onClose: () => void
  onToggleVisibility: (review: ReviewItem) => void
  onDelete: (review: ReviewItem) => void
}) {
  const customerInitials = initials(review.customerName)

  return (
    <DrawerFrame title="Review Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        <section className="rounded-xl border border-border bg-secondary-800 p-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c56c31]">
              <span className="font-unbounded text-2xl font-semibold text-white">{customerInitials}</span>
            </div>
            <h4 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">{review.customerName}</h4>
            <p className="mt-1 font-unageo text-sm text-accent-70">{review.customerId}</p>
          </div>
          <div className="mt-5 grid gap-2 border-t border-border pt-4">
            {infoRow("Email", review.customerEmail)}
            {infoRow("Phone", review.customerPhone)}
          </div>
        </section>

        <Section title="Vendor & Service">
          {infoRow("Vendor Name", review.vendorName)}
          {infoRow("Vendor ID", review.vendorId)}
          {infoRow("Service", review.service)}
          {infoRow("Booking ID", review.bookingId)}
        </Section>

        <Section title="Review">
          <div className="mb-3 inline-flex items-center gap-2">
            <RatingStars rating={review.rating} size="h-5 w-5" />
            <span className="font-unbounded text-lg font-semibold text-secondary-000">{review.rating}.0</span>
          </div>
          <p className="font-unageo text-sm leading-relaxed text-secondary-000">{review.reviewText}</p>
          <div className="mt-4 flex gap-4 border-t border-border pt-3">
            <span className="inline-flex items-center gap-1 font-unageo text-xs text-secondary-000">
              <ThumbsUp className="h-4 w-4 text-chart-2" /> {review.helpful} helpful
            </span>
            <span className="inline-flex items-center gap-1 font-unageo text-xs text-secondary-000">
              <ThumbsDown className="h-4 w-4 text-accent-70" /> {review.notHelpful} not helpful
            </span>
          </div>
        </Section>

        <Section title="Status & Metadata">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-unageo text-sm text-accent-70">Status</span>
            {statusBadge(review.status, review.flagged)}
          </div>
          {infoRow("Review ID", review.id)}
          {infoRow("Date Posted", `${review.date} at ${review.time}`)}
        </Section>

        {review.adminNotes ? (
          <section className="rounded-xl border border-chart-5/30 bg-chart-5/10 p-4">
            <h5 className="mb-2 font-unageo text-sm font-semibold text-chart-5">Admin Notes</h5>
            <p className="font-unageo text-sm text-secondary-000">{review.adminNotes}</p>
          </section>
        ) : null}

        <Section title="Review History">
          <div className="space-y-3">
            {review.history.map((item, index) => (
              <div key={`${item.action}-${item.date}-${index}`} className={`${index < review.history.length - 1 ? "border-b border-border pb-3" : ""} flex items-start gap-3`}>
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-100" />
                <div>
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{item.action}</p>
                  <p className="font-unageo text-xs text-accent-70">
                    {item.date} at {item.time} • {item.by}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="sticky bottom-0 flex gap-2 rounded-t-2xl border-t border-border bg-white/95 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm md:rounded-none md:bg-white md:p-4 md:shadow-none">
        <button type="button" onClick={() => onToggleVisibility(review)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 font-unageo text-sm font-semibold text-secondary-000">
          {review.status === "Visible" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {review.status === "Visible" ? "Hide Review" : "Unhide Review"}
        </button>
        <button type="button" onClick={() => onDelete(review)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive bg-white px-4 py-3 font-unageo text-sm font-semibold text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete Review
        </button>
      </div>
    </DrawerFrame>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-secondary-800 p-4">
      <h5 className="mb-3 font-unageo text-sm font-semibold text-secondary-000">{title}</h5>
      <div className="space-y-2">{children}</div>
    </section>
  )
}
