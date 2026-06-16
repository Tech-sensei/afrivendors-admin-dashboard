"use client"

import type { AdminAccountItem } from "./data"
import { formatAdminDate } from "./data"
import { adminStatusBadge, DrawerFrame, InfoBlock, roleLabel } from "./shared"

export function AdminDetailsDrawer({
  admin,
  onClose,
  onSuspend,
}: {
  admin: AdminAccountItem
  onClose: () => void
  onSuspend: () => void
}) {
  return (
    <DrawerFrame title="Admin Details" onClose={onClose}>
      <div className="space-y-6 p-4">
        <div>
          <h4 className="font-unbounded text-xl font-semibold text-secondary-000">{admin.name}</h4>
          <div className="mt-2">{roleLabel(admin.role)}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoBlock label="Email" value={admin.email} />
          <InfoBlock label="Phone" value={admin.phoneNumber ?? "—"} />
          <InfoBlock label="Status" value={admin.status} />
          <InfoBlock label="Last Active" value={admin.lastActive} />
          <InfoBlock label="Joined" value={formatAdminDate(admin.createdAt)} />
        </div>

        <div>{adminStatusBadge(admin.status)}</div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onSuspend}
            className="rounded-lg border border-destructive/30 px-4 py-2.5 font-unageo text-sm font-semibold text-destructive hover:bg-destructive/5"
          >
            {admin.status === "Suspended" ? "Reactivate Account" : "Suspend Account"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            Close
          </button>
        </div>
      </div>
    </DrawerFrame>
  )
}
