"use client"

import { Eye, EyeOff, Lock, Save } from "lucide-react"
import { useState } from "react"
import { changePasswordSchema } from "@/lib/validations/authValidationSchema"
import { useAuthAPI } from "@/services/useAuthAPI"

const emptyPasswordData = { oldPassword: "", newPassword: "", confirmNewPassword: "" }

export function PasswordSettings() {
  const { changePasswordAsync, isChangingPassword } = useAuthAPI()
  const [passwordData, setPasswordData] = useState(emptyPasswordData)
  const [passwordErrors, setPasswordErrors] = useState(emptyPasswordData)
  const [showFields, setShowFields] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  })

  const handleSubmit = async () => {
    const result = changePasswordSchema.safeParse(passwordData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setPasswordErrors({
        oldPassword: fieldErrors.oldPassword?.[0] ?? "",
        newPassword: fieldErrors.newPassword?.[0] ?? "",
        confirmNewPassword: fieldErrors.confirmNewPassword?.[0] ?? "",
      })
      return
    }

    setPasswordErrors(emptyPasswordData)
    await changePasswordAsync(result.data)
    setPasswordData(emptyPasswordData)
    setShowFields({ oldPassword: false, newPassword: false, confirmNewPassword: false })
  }

  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100/10">
          <Lock className="h-5 w-5 text-primary-100" />
        </div>
        <div>
          <h3 className="font-unbounded text-lg font-semibold text-secondary-000">Change Password</h3>
          <p className="mt-1 font-unageo text-sm text-accent-70">
            Update your sign-in password. If you signed in with a temporary password from your invite, set a new one
            here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PasswordField
          label="Current Password"
          value={passwordData.oldPassword}
          error={passwordErrors.oldPassword}
          visible={showFields.oldPassword}
          onToggleVisible={() => setShowFields((s) => ({ ...s, oldPassword: !s.oldPassword }))}
          onChange={(value) => setPasswordData((d) => ({ ...d, oldPassword: value }))}
          placeholder="Enter current password"
        />
        <div className="hidden md:block" />
        <PasswordField
          label="New Password"
          value={passwordData.newPassword}
          error={passwordErrors.newPassword}
          visible={showFields.newPassword}
          onToggleVisible={() => setShowFields((s) => ({ ...s, newPassword: !s.newPassword }))}
          onChange={(value) => setPasswordData((d) => ({ ...d, newPassword: value }))}
          placeholder="At least 8 characters"
        />
        <PasswordField
          label="Confirm New Password"
          value={passwordData.confirmNewPassword}
          error={passwordErrors.confirmNewPassword}
          visible={showFields.confirmNewPassword}
          onToggleVisible={() => setShowFields((s) => ({ ...s, confirmNewPassword: !s.confirmNewPassword }))}
          onChange={(value) => setPasswordData((d) => ({ ...d, confirmNewPassword: value }))}
          placeholder="Confirm new password"
        />
      </div>

      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={isChangingPassword}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-100 px-5 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {isChangingPassword ? "Updating..." : "Update Password"}
      </button>
    </section>
  )
}

function PasswordField({
  label,
  value,
  error,
  visible,
  onToggleVisible,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  error: string
  visible: boolean
  onToggleVisible: () => void
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-unageo text-xs font-semibold uppercase tracking-wide text-accent-70">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 pr-10 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-70 hover:text-secondary-000"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="mt-1 font-unageo text-xs text-destructive">{error}</p> : null}
    </label>
  )
}
