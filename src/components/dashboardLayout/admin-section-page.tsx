import { notFound } from "next/navigation"
import { adminSectionCopy, isAdminSectionId, type AdminSectionId } from "@/lib/admin-sections"

type Props = { sectionId: AdminSectionId | string }

export function AdminSectionPage({ sectionId }: Props) {
  if (!isAdminSectionId(sectionId)) {
    notFound()
  }
  const { title, description } = adminSectionCopy[sectionId]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-unbounded text-2xl font-bold text-secondary-000">{title}</h1>
        <p className="mt-1 font-unageo text-sm text-accent-70">{description}</p>
      </div>
      <div
        className="rounded-xl border border-border border-dashed bg-white p-10 text-center font-unageo text-sm text-accent-70"
        aria-hidden
      >
        Content coming soon
      </div>
    </div>
  )
}
