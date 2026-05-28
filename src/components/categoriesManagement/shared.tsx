import { CheckCircle, Clock, X } from "lucide-react"
import { motion } from "motion/react"
import { useEffect } from "react"
import type { Status } from "./data"

export function DrawerFrame({
  title,
  onClose,
  children,
  widthClass = "w-[500px]",
  zIndexClass = "z-1000",
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  widthClass?: string
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
        <Header title={title} onClose={onClose} />
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </motion.aside>
      <motion.aside
        className={`fixed bottom-0 right-0 top-0 ${zIndexClass} hidden ${widthClass} max-w-[95vw] flex-col bg-white shadow-2xl md:flex`}
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

export function statusBadge(status: Status) {
  if (status === "Inactive") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-chart-5/15 px-3 py-1 font-unageo text-xs font-semibold text-chart-5">
        <Clock className="h-3.5 w-3.5" />
        Inactive
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/15 px-3 py-1 font-unageo text-xs font-semibold text-chart-2">
      <CheckCircle className="h-3.5 w-3.5" />
      Active
    </span>
  )
}

export function ToggleSwitch({ isActive }: { isActive: boolean }) {
  return (
    <div className={`relative h-6 w-11 rounded-full transition ${isActive ? "bg-primary-100" : "bg-accent-40"}`}>
      <div className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow transition ${isActive ? "left-5.75" : "left-0.75"}`} />
    </div>
  )
}

export function infoRow(label: string, value: React.ReactNode) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-unageo text-sm text-accent-70">{label}</span>
      <span className="font-unageo text-sm font-semibold text-secondary-000">{value}</span>
    </div>
  )
}
