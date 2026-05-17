import { Loader2 } from "lucide-react"

/** Matches Customer Management table loading (centered card + spinner). */
export function AdminListTableLoading({ resourceLabel }: { resourceLabel: string }) {
  return (
    <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-100/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" aria-hidden />
          <span className="sr-only">Loading {resourceLabel}</span>
        </div>
        <div>
          <h3 className="font-unbounded text-xl font-semibold text-secondary-000">Loading {resourceLabel}…</h3>
          <p className="mt-1 font-unageo text-sm text-accent-70">Fetching data from the server</p>
        </div>
      </div>
    </section>
  )
}
