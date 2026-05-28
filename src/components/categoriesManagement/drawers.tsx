import { AlertTriangle, Clock, Edit2, Plus, Tag } from "lucide-react"
import { useState } from "react"
import type { CategoryItem } from "./data"
import { DrawerFrame, infoRow, statusBadge, ToggleSwitch } from "./shared"

export function CategoryDetailsDrawer({
  category,
  onClose,
  onEdit,
  onToggleStatus,
}: {
  category: CategoryItem
  onClose: () => void
  onEdit: (category: CategoryItem) => void
  onToggleStatus: (category: CategoryItem) => void
}) {
  return (
    <DrawerFrame title="Category Details" onClose={onClose}>
      <div className="space-y-5 p-5">
        <Section title={category.name} subtitle={category.id}>
          {statusBadge(category.status)}
        </Section>
        <Block title="Description">
          <p className="font-unageo text-sm text-secondary-000">{category.description}</p>
        </Block>
        <Block title="Category Statistics">
          {infoRow("Vendor Services", category.serviceCount)}
          {infoRow("Active Vendors", category.vendorCount)}
        </Block>
        <Block title="Timeline">
          {infoRow("Created", category.createdDate)}
          {infoRow("Last Updated", category.lastUpdated)}
        </Block>
      </div>
      <Footer>
        <ActionButton onClick={() => onEdit(category)} tone="primary" icon={<Edit2 className="h-4 w-4" />} label="Edit Category" />
        <button
          type="button"
          onClick={() => onToggleStatus(category)}
          className={`inline-flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 font-unageo text-sm font-semibold ${category.status === "Active" ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
        >
          <ToggleSwitch isActive={category.status === "Active"} />
          {category.status === "Active" ? "Deactivate Category" : "Activate Category"}
        </button>
      </Footer>
    </DrawerFrame>
  )
}

export function CategoryFormDrawer({
  category,
  onClose,
  onSave,
  isEdit,
}: {
  category: CategoryItem | null
  onClose: () => void
  onSave: (data: { name: string; description: string }) => void
  isEdit: boolean
}) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  return (
    <DrawerFrame title={isEdit ? "Edit Category" : "Add New Category"} onClose={onClose}>
      <form
        className="space-y-5 p-5"
        onSubmit={(event) => {
          event.preventDefault()
          onSave({ name, description })
        }}
      >
        <Field label="Category Name *">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-white p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
        </Field>
        <Field label="Description *">
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border bg-white p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
        </Field>
        <Footer>
          <ActionButton onClick={onClose} tone="outline" label="Cancel" type="button" />
          <ActionButton
            tone="primary"
            label={isEdit ? "Save Changes" : "Create Category"}
            type="submit"
            icon={isEdit ? <Edit2 className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
          />
        </Footer>
      </form>
    </DrawerFrame>
  )
}

export function DeactivateCategoryModal({
  category,
  onClose,
  onConfirm,
}: {
  category: CategoryItem
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center bg-secondary-000/50 p-4"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
      role="presentation"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-chart-5/15">
          <AlertTriangle className="h-5 w-5 text-chart-5" />
        </div>
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">Deactivate Category</h4>
        <p className="mt-2 font-unageo text-sm text-accent-70">
          Are you sure you want to deactivate &quot;{category.name}&quot;? This affects{" "}
          <strong>{category.serviceCount} vendor services</strong> in this category.
        </p>
        <div className="mt-5 flex gap-2">
          <ActionButton onClick={onClose} tone="outline" label="Cancel" type="button" />
          <ActionButton onClick={onConfirm} tone="warning" label="Deactivate Category" type="button" icon={<Clock className="h-4 w-4" />} />
        </div>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-secondary-800 p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
          {subtitle ? <p className="font-unageo text-xs text-accent-70">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-secondary-800 p-4">
      <h5 className="mb-3 font-unageo text-sm font-semibold text-secondary-000">{title}</h5>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-white p-4 sm:flex-row">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-unageo text-sm font-semibold text-secondary-000">{label}</span>
      {children}
    </label>
  )
}

function ActionButton({
  onClick,
  tone,
  label,
  icon,
  type = "button",
}: {
  onClick?: () => void
  tone: "primary" | "outline" | "warning"
  label: string
  icon?: React.ReactNode
  type?: "button" | "submit"
}) {
  const toneClass =
    tone === "primary"
      ? "border-transparent bg-primary-100 text-white"
      : tone === "warning"
        ? "border-transparent bg-chart-5 text-white"
        : "border-border bg-white text-secondary-000"

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 py-3 font-unageo text-sm font-semibold ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  )
}
