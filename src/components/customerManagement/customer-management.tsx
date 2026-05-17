"use client"

import { Lock } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { adminUserToCustomer, type Customer } from "./data"
import { ActionDrawer, CustomerDetailsDrawer, SuspendDrawer } from "./drawers"
import { CustomerFilters } from "./filters"
import { CustomerStats } from "./stats"
import { CustomersTable } from "./table"
import { useAdminUsersBreakdown, useAdminUsersList } from "@/services/useAdminCustomers"

const ITEMS_PER_PAGE = 10

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedVerification, setSelectedVerification] = useState("All")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [suspendCustomer, setSuspendCustomer] = useState<Customer | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const [resetPasswordCustomer, setResetPasswordCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
    return () => window.clearTimeout(id)
  }, [searchQuery])

  const { data: listResponse, isLoading, isError, error } = useAdminUsersList(
    currentPage,
    ITEMS_PER_PAGE,
    debouncedSearch || undefined,
  )
  const {
    data: breakdown,
    isLoading: breakdownLoading,
    isError: breakdownError,
  } = useAdminUsersBreakdown()

  useEffect(() => {
    if (!isError) return
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Could not load customers."
    toast.error("Failed to load customers", { description: String(message) })
  }, [isError, error])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedStatus, selectedVerification])

  const meta = listResponse?.meta

  useEffect(() => {
    if (!meta?.totalPages || meta.totalPages < 1) return
    if (currentPage > meta.totalPages) setCurrentPage(meta.totalPages)
  }, [meta?.totalPages, currentPage])

  const pageUsers = useMemo(
    () => (listResponse?.data ?? []).map(adminUserToCustomer),
    [listResponse?.data],
  )

  const serverPage = meta?.page ?? currentPage
  const serverLimit = meta?.limit ?? ITEMS_PER_PAGE
  const serverTotal = meta?.total ?? 0
  const serverTotalPages = Math.max(1, meta?.totalPages ?? 1)

  const filteredCustomers = useMemo(() => {
    return pageUsers.filter((customer) => {
      const matchesStatus = selectedStatus === "All" || customer.status === selectedStatus
      const matchesVerification =
        selectedVerification === "All" ||
        (selectedVerification === "Verified" && customer.verified) ||
        (selectedVerification === "Unverified" && !customer.verified)
      return matchesStatus && matchesVerification
    })
  }, [pageUsers, selectedStatus, selectedVerification])

  const activateCustomer = (_customer: Customer) => {
    toast.info("Activate customer", {
      description: "Connect the admin user API when unblock/activate is available.",
    })
    setSelectedCustomer(null)
  }

  const confirmSuspendCustomer = () => {
    if (!suspendCustomer) return
    if (!suspendReason.trim()) {
      toast.error("Reason required", { description: "Please provide a reason for suspending this account." })
      return
    }
    toast.info("Suspend customer", {
      description: "Connect the admin user API when suspend/block is available.",
    })
    setSuspendCustomer(null)
    setSuspendReason("")
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Customer Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">Manage customer accounts, verification, and support</p>
      </header>

      <CustomerStats breakdown={breakdown} isLoading={breakdownLoading} isError={breakdownError} />

      <CustomerFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={setSelectedStatus}
        selectedVerification={selectedVerification}
        onSelectedVerificationChange={setSelectedVerification}
      />

      <CustomersTable
        customers={filteredCustomers}
        unfilteredPageCount={pageUsers.length}
        serverTotal={serverTotal}
        serverPage={serverPage}
        serverTotalPages={serverTotalPages}
        serverLimit={serverLimit}
        currentPage={currentPage}
        totalPages={serverTotalPages}
        onPageChange={setCurrentPage}
        onViewDetails={setSelectedCustomer}
        isLoading={isLoading}
      />

      {selectedCustomer ? (
        <CustomerDetailsDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSuspend={() => {
            setSuspendCustomer(selectedCustomer)
            setSelectedCustomer(null)
          }}
          onActivate={() => activateCustomer(selectedCustomer)}
          onResetPassword={() => {
            setResetPasswordCustomer(selectedCustomer)
            setSelectedCustomer(null)
          }}
        />
      ) : null}

      {suspendCustomer ? (
        <SuspendDrawer
          customer={suspendCustomer}
          reason={suspendReason}
          onReasonChange={setSuspendReason}
          onClose={() => {
            setSuspendCustomer(null)
            setSuspendReason("")
          }}
          onConfirm={confirmSuspendCustomer}
        />
      ) : null}

      {resetPasswordCustomer ? (
        <ActionDrawer
          title="Reset Password"
          icon={<Lock className="h-10 w-10 text-primary-100" />}
          description={`Send password reset link to ${resetPasswordCustomer.email}.`}
          confirmLabel="Send Reset Link"
          confirmClass="bg-primary-100 text-white"
          onConfirm={() => {
            toast.success("Password reset link sent", {
              description: `Reset link sent to ${resetPasswordCustomer.email}`,
            })
            setResetPasswordCustomer(null)
          }}
          onClose={() => setResetPasswordCustomer(null)}
        />
      ) : null}
    </div>
  )
}
