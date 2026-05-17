import { Eye, EyeOff, Flag, Star, X } from "lucide-react"
import { motion } from "motion/react"
import { useEffect } from "react"
import type { ReviewItem, ReviewStatus } from "./data"

export function DrawerFrame({
  title,
  onClose,
  children,
  zIndexClass = "z-1000",
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  zIndexClass?: string
}) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <>
      <motion.button
        type="button"
        className="fixed inset-0 z-999 h-screen bg-secondary-000/40"
        onClick={onClose}
        aria-label="Close"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.aside
        className={`fixed inset-x-0 bottom-0 ${zIndexClass} flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl md:hidden`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex justify-center pb-1 pt-2"><span className="h-1 w-12 rounded-full bg-accent-40" /></div>
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
      <motion.aside
        className={`fixed bottom-0 right-0 top-0 ${zIndexClass} hidden w-[600px] max-w-[95vw] flex-col bg-white shadow-2xl md:flex`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
    </>
  )
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <h3 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h3>
      <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md border border-border">
        <X className="h-4 w-4 text-secondary-000" />
      </button>
    </div>
  )
}

export function ReviewModalFrame({
  title,
  onClose,
  children,
  footer,
  zIndexClass = "z-1100",
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer: React.ReactNode
  zIndexClass?: string
}) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-secondary-000/50 p-4`}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto p-5">{children}</div>
        <div className="border-t border-border p-4">{footer}</div>
      </div>
    </div>
  )
}

export function statusBadge(status: ReviewStatus, flagged: boolean) {
  if (flagged) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-chart-5/15 px-3 py-1 font-unageo text-xs font-semibold text-chart-5">
        <Flag className="h-3.5 w-3.5" />
        Flagged
      </span>
    )
  }

  if (status === "Hidden") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-40/20 px-3 py-1 font-unageo text-xs font-semibold text-accent-70">
        <EyeOff className="h-3.5 w-3.5" />
        Hidden
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/15 px-3 py-1 font-unageo text-xs font-semibold text-chart-2">
      <Eye className="h-3.5 w-3.5" />
      Visible
    </span>
  )
}

export function RatingStars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${size} ${i < rating ? "fill-[#FFA500] text-[#FFA500]" : "text-border"}`} />
      ))}
    </div>
  )
}

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
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

export function infoRow(label: string, value: React.ReactNode, valueClass?: string) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-unageo text-sm text-accent-70">{label}</span>
      <span className={`text-right font-unageo text-sm font-semibold text-secondary-000 ${valueClass ?? ""}`}>{value}</span>
    </div>
  )
}

export function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max)}...`
}

export function initials(name: string) {
  const names = name.trim().split(" ")
  if (names.length >= 2) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function nowDateTime() {
  const date = new Date().toISOString().split("T")[0]
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  return { date, time }
}

export function reviewSearchMatch(review: ReviewItem, query: string) {
  const q = query.toLowerCase()
  return (
    review.customerName.toLowerCase().includes(q) ||
    review.vendorName.toLowerCase().includes(q) ||
    review.reviewText.toLowerCase().includes(q)
  )
}
