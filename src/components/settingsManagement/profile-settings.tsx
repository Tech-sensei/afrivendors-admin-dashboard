"use client"

import { Edit2, Loader2, Save } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useAdminProfile } from "@/services/useAdminProfile"
import { useAppSelector } from "@/store/hooks"

function formatRoles(roles: string[] | string | null | undefined) {
  if (!roles) return "Admin"
  if (Array.isArray(roles)) return roles.join(", ")
  return String(roles)
}

function formatDate(value?: string) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return value
  }
}

export function ProfileSettings() {
  const profile = useAppSelector((state) => state.auth.profile)
  const { isLoading, isError, updateProfile } = useAdminProfile()

  const admin = profile?.admin
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    if (!admin) return
    setFirstName(admin.firstName)
    setLastName(admin.lastName)
    setPhoneNumber(admin.phoneNumber ?? "")
  }, [admin])

  const initials = useMemo(() => {
    const a = admin?.firstName?.[0] ?? ""
    const b = admin?.lastName?.[0] ?? ""
    return (a + b).toUpperCase() || "A"
  }, [admin])

  if (isLoading && !admin) {
    return (
      <section className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary-100" />
        <p className="mt-2 font-unageo text-sm text-accent-70">Loading profile...</p>
      </section>
    )
  }

  if (isError && !admin) {
    return (
      <section className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="font-unageo text-sm text-destructive">Unable to load profile. Try signing in again.</p>
      </section>
    )
  }

  if (!admin) return null

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setFirstName(admin.firstName)
    setLastName(admin.lastName)
    setPhoneNumber(admin.phoneNumber ?? "")
    setEditing(false)
  }

  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-unbounded text-lg font-semibold text-secondary-000">Admin Profile</h3>
          <p className="mt-1 font-unageo text-sm text-accent-70">View and update your account details</p>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : null}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100/15 font-unbounded text-xl font-semibold text-primary-100">
          {initials}
        </div>
        <div>
          <p className="font-unbounded text-lg font-semibold text-secondary-000">
            {admin.firstName} {admin.lastName}
          </p>
          <p className="font-unageo text-sm text-accent-70">{formatRoles(admin.adminRoles)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="First Name" editing={editing} value={firstName} onChange={setFirstName} />
        <Field label="Last Name" editing={editing} value={lastName} onChange={setLastName} />
        <Field label="Email" editing={false} value={admin.email || "—"} readOnly />
        <Field label="Phone Number" editing={editing} value={phoneNumber} onChange={setPhoneNumber} />
        <Field label="Account Type" editing={false} value={admin.accountType} readOnly />
        <Field label="Member Since" editing={false} value={formatDate(admin.createdAt)} readOnly />
      </div>

      {editing ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateProfile.isPending}
            className="rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updateProfile.isPending || !firstName.trim() || !lastName.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </button>
        </div>
      ) : null}
    </section>
  )
}

function Field({
  label,
  value,
  editing,
  onChange,
  readOnly,
}: {
  label: string
  value: string
  editing: boolean
  onChange?: (value: string) => void
  readOnly?: boolean
}) {
  const isEditable = editing && !readOnly

  return (
    <label className="block">
      <span className="mb-1.5 block font-unageo text-xs font-semibold uppercase tracking-wide text-accent-70">{label}</span>
      {isEditable ? (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
        />
      ) : (
        <div className="rounded-lg border border-border bg-secondary-800/40 px-3 py-2.5 font-unageo text-sm text-secondary-000">
          {value || "—"}
        </div>
      )}
    </label>
  )
}
