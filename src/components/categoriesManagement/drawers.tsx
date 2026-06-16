import { Edit2, Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { CATEGORY_ICON_OPTIONS, getCategoryIconComponent } from "@/lib/categoryIcons"
import type { CategoryItem } from "./data"
import { DrawerFrame, infoRow } from "./shared"

export function CategoryDetailsDrawer({
  category,
  isLoading,
  onClose,
  onEdit,
}: {
  category: CategoryItem | null
  isLoading?: boolean
  onClose: () => void
  onEdit: (category: CategoryItem) => void
}) {
  const Icon = getCategoryIconComponent(category?.iconName)

  return (
    <DrawerFrame title="Category Details" onClose={onClose}>
      {isLoading || !category ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
        </div>
      ) : (
        <>
          <div className="space-y-5 p-5">
            <section className="rounded-xl border border-border bg-secondary-800 p-4">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100/10 text-primary-100">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{category.name}</h4>
                  <p className="font-unageo text-xs text-accent-70">ID: {category.id}</p>
                </div>
              </div>
            </section>
            <Block title="Category Information">
              {infoRow("Icon Name", category.iconName ?? "—")}
              {infoRow("Vendors", category.vendorCount)}
            </Block>
          </div>
          <Footer>
            <ActionButton onClick={() => onEdit(category)} tone="primary" icon={<Edit2 className="h-4 w-4" />} label="Edit Category" />
          </Footer>
        </>
      )}
    </DrawerFrame>
  )
}

export function CategoryFormDrawer({
  category,
  isSaving,
  onClose,
  onSave,
  isEdit,
}: {
  category: CategoryItem | null
  isSaving?: boolean
  onClose: () => void
  onSave: (data: { name: string; iconName: string }) => void
  isEdit: boolean
}) {
  const [name, setName] = useState(category?.name ?? "")
  const [iconName, setIconName] = useState(category?.iconName ?? "layout_grid")
  const PreviewIcon = getCategoryIconComponent(iconName)

  return (
    <DrawerFrame title={isEdit ? "Edit Category" : "Add New Category"} onClose={onClose}>
      <form
        className="space-y-5 p-5"
        onSubmit={(event) => {
          event.preventDefault()
          onSave({ name: name.trim(), iconName: iconName.trim() })
        }}
      >
        <Field label="Category Name *">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Restaurant"
            className="w-full rounded-lg border border-border bg-white p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
        </Field>
        <Field label="Icon *">
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-secondary-800/50 px-3 py-2">
            <PreviewIcon className="h-5 w-5 text-primary-100" />
            <span className="font-unageo text-sm text-accent-70">Preview</span>
          </div>
          <select
            required
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            className="w-full rounded-lg border border-border bg-white p-3 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          >
            {CATEGORY_ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.value})
              </option>
            ))}
          </select>
        </Field>
        <Footer>
          <ActionButton onClick={onClose} tone="outline" label="Cancel" type="button" disabled={isSaving} />
          <ActionButton
            tone="primary"
            label={isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
            type="submit"
            disabled={isSaving}
            icon={isEdit ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          />
        </Footer>
      </form>
    </DrawerFrame>
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
  disabled,
}: {
  onClick?: () => void
  tone: "primary" | "outline"
  label: string
  icon?: React.ReactNode
  type?: "button" | "submit"
  disabled?: boolean
}) {
  const toneClass =
    tone === "primary"
      ? "border-transparent bg-primary-100 text-white disabled:opacity-60"
      : "border-border bg-white text-secondary-000 disabled:opacity-60"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 py-3 font-unageo text-sm font-semibold ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  )
}
