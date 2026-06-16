"use client"

import { useEffect, useState } from "react"
import type { AdminAccountItem, AdminRoleItem } from "./data"
import { adminRoleOptions } from "./data"
import { SelectField } from "./shared"

function ModalShell({
  title,
  description,
  onClose,
  children,
}: {
  title: string
  description?: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center bg-secondary-000/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">{title}</h4>
        {description ? <p className="mt-1 font-unageo text-sm text-accent-70">{description}</p> : null}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-unageo text-xs font-semibold uppercase tracking-wide text-accent-70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
      />
    </label>
  )
}

export function SuspendAdminModal({
  admin,
  onClose,
  onConfirm,
}: {
  admin: AdminAccountItem
  onClose: () => void
  onConfirm: () => void
}) {
  const isSuspended = admin.status === "Suspended"

  return (
    <ModalShell
      title={isSuspended ? "Reactivate Admin" : "Suspend Admin"}
      description={
        isSuspended
          ? `Restore access for ${admin.name}?`
          : `Temporarily suspend ${admin.name}? They will not be able to sign in until reactivated.`
      }
      onClose={onClose}
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 rounded-lg px-4 py-2.5 font-unageo text-sm font-semibold text-white ${
            isSuspended ? "bg-primary-100 hover:bg-primary-100/90" : "bg-destructive hover:bg-destructive/90"
          }`}
        >
          {isSuspended ? "Reactivate" : "Suspend"}
        </button>
      </div>
    </ModalShell>
  )
}

export function AddAdminModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (payload: { name: string; email: string; role: string }) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState(adminRoleOptions[1] ?? "Operations Manager")

  return (
    <ModalShell
      title="Add New Admin"
      description="Invite a new administrator. They will receive login credentials by email."
      onClose={onClose}
    >
      <div className="space-y-4">
        <TextField label="Full Name" value={name} onChange={setName} placeholder="Enter full name" />
        <TextField label="Email" value={email} onChange={setEmail} type="email" placeholder="admin@afrivendor.com" />
        <SelectField label="Role" value={role} onChange={setRole} options={adminRoleOptions} />
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ name: name.trim(), email: email.trim(), role })}
            disabled={!name.trim() || !email.trim()}
            className="flex-1 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
          >
            Send Invite
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

export function RoleFormModal({
  title,
  description,
  initial,
  onClose,
  onSave,
}: {
  title: string
  description?: string
  initial?: Pick<AdminRoleItem, "name" | "description">
  onClose: () => void
  onSave: (payload: { name: string; description: string }) => void
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [roleDescription, setRoleDescription] = useState(initial?.description ?? "")

  return (
    <ModalShell title={title} description={description} onClose={onClose}>
      <div className="space-y-4">
        <TextField label="Role Name" value={name} onChange={setName} placeholder="e.g. Support Lead" />
        <label className="block">
          <span className="mb-1.5 block font-unageo text-xs font-semibold uppercase tracking-wide text-accent-70">
            Description
          </span>
          <textarea
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            rows={3}
            placeholder="Describe what this role can access"
            className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          />
        </label>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ name: name.trim(), description: roleDescription.trim() })}
            disabled={!name.trim() || !roleDescription.trim()}
            className="flex-1 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
          >
            Save Role
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

export function DeleteRoleModal({
  role,
  onClose,
  onConfirm,
}: {
  role: AdminRoleItem
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ModalShell
      title="Delete Role"
      description={`Delete "${role.name}"? Admins assigned to this role will need a new role.`}
      onClose={onClose}
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-destructive px-4 py-2.5 font-unageo text-sm font-semibold text-white"
        >
          Delete
        </button>
      </div>
    </ModalShell>
  )
}
