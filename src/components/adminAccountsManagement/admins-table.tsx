"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Ban, Edit2, Eye, Shield, Trash2, Users } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { AdminAccountItem, AdminRoleItem } from "./data"
import { adminStatusBadge, roleLabel } from "./shared"

export function AdminsTable({
  admins,
  onView,
  onSuspend,
}: {
  admins: AdminAccountItem[]
  onView: (admin: AdminAccountItem) => void
  onSuspend: (admin: AdminAccountItem) => void
}) {
  const columns = useMemo<ColumnDef<AdminAccountItem, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Admin Name" },
      {
        accessorKey: "role",
        header: "Role",
        enableSorting: false,
        cell: ({ row }) => roleLabel(row.original.role),
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => adminStatusBadge(row.original.status),
      },
      { accessorKey: "lastActive", header: "Last Active" },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onView(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              type="button"
              onClick={() => onSuspend(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 font-unageo text-xs font-semibold text-destructive hover:bg-destructive/5"
            >
              <Ban className="h-3.5 w-3.5" />
              {row.original.status === "Suspended" ? "Reactivate" : "Suspend"}
            </button>
          </div>
        ),
      },
    ],
    [onSuspend, onView],
  )

  return (
    <AdminDataTable
      data={admins}
      columns={columns}
      resourceLabel="admin accounts"
      minWidth="920px"
      getRowId={(row) => row.id}
      emptyState={
        <AdminTableEmpty
          icon={Users}
          title="No admin accounts found"
          description="Try adjusting your search or filters."
        />
      }
    />
  )
}

export function RolesTable({
  roles,
  onEdit,
  onDelete,
}: {
  roles: AdminRoleItem[]
  onEdit: (role: AdminRoleItem) => void
  onDelete: (role: AdminRoleItem) => void
}) {
  const columns = useMemo<ColumnDef<AdminRoleItem, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Role Name" },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
        meta: { cellClassName: "text-accent-70" },
      },
      {
        id: "assignedAdmins",
        header: "Assigned Admins",
        accessorFn: (row) => row.assignedAdmins,
        cell: ({ row }) =>
          `${row.original.assignedAdmins} admin${row.original.assignedAdmins === 1 ? "" : "s"}`,
      },
      {
        id: "permissions",
        header: "Permissions",
        accessorFn: (row) => row.permissionsCount,
        cell: ({ row }) => `${row.original.permissionsCount} permissions`,
      },
      { accessorKey: "createdOn", header: "Created On", meta: { cellClassName: "text-accent-70" } },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(row.original)}
              disabled={row.original.isSystem}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 font-unageo text-xs font-semibold text-destructive hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onEdit],
  )

  return (
    <AdminDataTable
      data={roles}
      columns={columns}
      resourceLabel="roles"
      minWidth="980px"
      getRowId={(row) => row.id}
      emptyState={
        <AdminTableEmpty icon={Shield} title="No roles yet" description="Create a role to get started." />
      }
    />
  )
}
