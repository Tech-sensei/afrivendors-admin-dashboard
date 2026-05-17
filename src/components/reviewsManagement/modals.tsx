import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import type { ReviewItem } from "./data"
import { ReviewModalFrame, infoRow } from "./shared"

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-secondary-800 p-4">
      <h5 className="mb-3 font-unageo text-sm font-semibold text-secondary-000">{title}</h5>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

export function HideReviewModal({
  review,
  isSubmitting = false,
  onClose,
  onConfirm,
}: {
  review: ReviewItem
  isSubmitting?: boolean
  onClose: () => void
  onConfirm: (notes: string) => void | Promise<void>
}) {
  const [adminNotes, setAdminNotes] = useState(review.adminNotes || "")
  const isHiding = review.status === "Visible"

  return (
    <ReviewModalFrame
      title={isHiding ? "Hide Review" : "Unhide Review"}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm(adminNotes)}
            disabled={isSubmitting || (isHiding && !adminNotes.trim())}
            className="flex-1 rounded-lg bg-primary-100 px-4 py-3 font-unageo text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : isHiding ? "Hide Review" : "Unhide Review"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <section className="rounded-xl border border-chart-5/30 bg-chart-5/10 p-4">
          <p className="font-unageo text-sm text-secondary-000">
            {isHiding
              ? "This review will be hidden from public view. Customers and vendors will not be able to see it."
              : "This review will be made visible to customers and vendors again."}
          </p>
        </section>
        <ModalSection title="Review Details">
          {infoRow("Review ID", review.id)}
          {infoRow("Customer", review.customerName)}
          {infoRow("Vendor", review.vendorName)}
          {infoRow("Rating", `${review.rating}.0`)}
        </ModalSection>
        <label className="block">
          <span className="mb-1 block font-unageo text-sm font-semibold text-secondary-000">
            Admin Notes {isHiding ? "(Required)" : ""}
          </span>
          <textarea
            rows={5}
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
            placeholder={isHiding ? "Explain why this review is being hidden..." : "Add notes about unhiding this review..."}
            className="w-full rounded-lg border border-border p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
        </label>
      </div>
    </ReviewModalFrame>
  )
}

export function DeleteReviewModal({
  review,
  isSubmitting = false,
  onClose,
  onConfirm,
}: {
  review: ReviewItem
  isSubmitting?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}) {
  return (
    <ReviewModalFrame
      title="Delete Review"
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-border px-4 py-3 font-unageo text-sm font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-destructive px-4 py-3 font-unageo text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Deleting…" : "Delete Review"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <section className="rounded-xl border-2 border-destructive bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-unageo text-sm font-semibold text-destructive">This action cannot be undone</p>
              <p className="mt-1 font-unageo text-sm text-secondary-000">
                The review will be permanently deleted from the system. This action is irreversible.
              </p>
            </div>
          </div>
        </section>
        <ModalSection title="Review to Delete">
          {infoRow("Review ID", review.id)}
          {infoRow("Customer", review.customerName)}
          {infoRow("Vendor", review.vendorName)}
          <div className="border-t border-border pt-3">
            <p className="mb-2 font-unageo text-xs text-accent-70">Review Text</p>
            <p className="font-unageo text-sm text-secondary-000">{review.reviewText}</p>
          </div>
        </ModalSection>
      </div>
    </ReviewModalFrame>
  )
}
