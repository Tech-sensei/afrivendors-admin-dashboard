import type { LucideIcon } from "lucide-react"

export function AdminTableEmpty({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
      <Icon className="mx-auto h-10 w-10 text-accent-60" />
      <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">{title}</h3>
      {description ? <p className="mt-1 font-unageo text-sm text-accent-70">{description}</p> : null}
    </section>
  )
}
