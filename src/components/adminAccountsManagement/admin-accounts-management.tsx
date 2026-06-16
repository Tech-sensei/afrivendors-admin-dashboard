"use client"

import { Plus, Shield, UserPlus, Users } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AdminsTable, RolesTable } from "./admins-table"
import {
  computeAdminStats,
  initialAdminAccounts,
  initialAdminRoles,
  type AdminAccountItem,
  type AdminRoleItem,
} from "./data"
import { AdminDetailsDrawer } from "./drawers"
import { AdminAccountsFilters } from "./filters"
import {
  AddAdminModal,
  DeleteRoleModal,
  RoleFormModal,
  SuspendAdminModal,
} from "./modals"
import { AdminAccountsStats } from "./stats"

type AdminAccountsTab = "accounts" | "roles"

export function AdminAccountsManagement() {
  const [activeTab, setActiveTab] = useState<AdminAccountsTab>("accounts")
  const [admins, setAdmins] = useState(initialAdminAccounts)
  const [roles, setRoles] = useState(initialAdminRoles)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedRole, setSelectedRole] = useState("All Roles")

  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccountItem | null>(null)
  const [suspendAdmin, setSuspendAdmin] = useState<AdminAccountItem | null>(null)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [editRole, setEditRole] = useState<AdminRoleItem | null>(null)
  const [deleteRole, setDeleteRole] = useState<AdminRoleItem | null>(null)

  const stats = useMemo(() => computeAdminStats(admins, roles), [admins, roles])

  const filteredAdmins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return admins.filter((admin) => {
      const matchesSearch =
        !query || admin.name.toLowerCase().includes(query) || admin.email.toLowerCase().includes(query)
      const matchesStatus =
        selectedStatus === "All Status" || admin.status === selectedStatus
      const matchesRole = selectedRole === "All Roles" || admin.role === selectedRole
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [admins, searchQuery, selectedStatus, selectedRole])

  const toggleAdminStatus = (admin: AdminAccountItem) => {
    const nextStatus = admin.status === "Suspended" ? "Active" : "Suspended"
    setAdmins((prev) =>
      prev.map((item) =>
        item.id === admin.id
          ? { ...item, status: nextStatus, lastActive: nextStatus === "Active" ? "Just now" : item.lastActive }
          : item,
      ),
    )
    setSuspendAdmin(null)
    setSelectedAdmin((current) => (current?.id === admin.id ? { ...admin, status: nextStatus } : current))
    toast.success(nextStatus === "Suspended" ? "Admin suspended" : "Admin reactivated", {
      description: `${admin.name} is now ${nextStatus.toLowerCase()}.`,
    })
  }

  const handleAddAdmin = (payload: { name: string; email: string; role: string }) => {
    const newAdmin: AdminAccountItem = {
      id: `admin-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: "Active",
      lastActive: "Just now",
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setAdmins((prev) => [newAdmin, ...prev])
    setRoles((prev) =>
      prev.map((role) =>
        role.name === payload.role ? { ...role, assignedAdmins: role.assignedAdmins + 1 } : role,
      ),
    )
    setShowAddAdmin(false)
    toast.success("Admin invited", { description: `Invitation sent to ${payload.email}.` })
  }

  const handleAddRole = (payload: { name: string; description: string }) => {
    const newRole: AdminRoleItem = {
      id: `role-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      assignedAdmins: 0,
      permissionsCount: 0,
      createdOn: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }
    setRoles((prev) => [...prev, newRole])
    setShowAddRole(false)
    toast.success("Role created", { description: `"${payload.name}" has been added.` })
  }

  const handleEditRole = (payload: { name: string; description: string }) => {
    if (!editRole) return
    const previousName = editRole.name
    setRoles((prev) =>
      prev.map((role) =>
        role.id === editRole.id ? { ...role, name: payload.name, description: payload.description } : role,
      ),
    )
    if (previousName !== payload.name) {
      setAdmins((prev) =>
        prev.map((admin) => (admin.role === previousName ? { ...admin, role: payload.name } : admin)),
      )
    }
    setEditRole(null)
    toast.success("Role updated")
  }

  const handleDeleteRole = () => {
    if (!deleteRole || deleteRole.isSystem) return
    setRoles((prev) => prev.filter((role) => role.id !== deleteRole.id))
    setDeleteRole(null)
    toast.success("Role deleted", { description: `"${deleteRole.name}" has been removed.` })
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Admin Accounts & Permissions</h2>
          <p className="mt-2 font-unageo text-base text-accent-70">
            Manage admin accounts, roles, and access control
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAddAdmin(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            <UserPlus className="h-4 w-4" />
            Add New Admin
          </button>
          <button
            type="button"
            onClick={() => setShowAddRole(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white hover:bg-primary-100/90"
          >
            <Plus className="h-4 w-4" />
            Add New Role
          </button>
        </div>
      </header>

      <AdminAccountsStats stats={stats} />

      <div className="flex gap-2 overflow-x-auto border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("accounts")}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 font-unageo text-sm font-semibold transition-colors",
            activeTab === "accounts"
              ? "border-primary-100 text-primary-100"
              : "border-transparent text-accent-70 hover:text-secondary-000",
          )}
        >
          <Users className="h-4 w-4" />
          Admin Accounts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 font-unageo text-sm font-semibold transition-colors",
            activeTab === "roles"
              ? "border-primary-100 text-primary-100"
              : "border-transparent text-accent-70 hover:text-secondary-000",
          )}
        >
          <Shield className="h-4 w-4" />
          Roles & Permissions
        </button>
      </div>

      {activeTab === "accounts" ? (
        <div className="space-y-4">
          <AdminAccountsFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onSelectedStatusChange={setSelectedStatus}
            selectedRole={selectedRole}
            onSelectedRoleChange={setSelectedRole}
          />
          <AdminsTable
            admins={filteredAdmins}
            onView={setSelectedAdmin}
            onSuspend={setSuspendAdmin}
          />
        </div>
      ) : (
        <RolesTable roles={roles} onEdit={setEditRole} onDelete={setDeleteRole} />
      )}

      {selectedAdmin ? (
        <AdminDetailsDrawer
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onSuspend={() => setSuspendAdmin(selectedAdmin)}
        />
      ) : null}

      {suspendAdmin ? (
        <SuspendAdminModal
          admin={suspendAdmin}
          onClose={() => setSuspendAdmin(null)}
          onConfirm={() => toggleAdminStatus(suspendAdmin)}
        />
      ) : null}

      {showAddAdmin ? (
        <AddAdminModal onClose={() => setShowAddAdmin(false)} onSave={handleAddAdmin} />
      ) : null}

      {showAddRole ? (
        <RoleFormModal
          title="Add New Role"
          description="Create a permission role for admin accounts."
          onClose={() => setShowAddRole(false)}
          onSave={handleAddRole}
        />
      ) : null}

      {editRole ? (
        <RoleFormModal
          title="Edit Role"
          initial={{ name: editRole.name, description: editRole.description }}
          onClose={() => setEditRole(null)}
          onSave={handleEditRole}
        />
      ) : null}

      {deleteRole ? (
        <DeleteRoleModal
          role={deleteRole}
          onClose={() => setDeleteRole(null)}
          onConfirm={handleDeleteRole}
        />
      ) : null}
    </div>
  )
}
