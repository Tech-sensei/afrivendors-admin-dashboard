"use client"

import { CheckCircle, Lock } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Vendor } from "./data"
import { DisableDrawer, VendorDetailsDrawer, ActionDrawer } from "./drawers"
import { VendorFilters } from "./filters"
import { VendorStats } from "./stats"
import { VendorsTable } from "./table"
import {
  ADMIN_VENDORS_LIST_QUERY_KEY,
  useAdminVendorsBreakdown,
  useAdminVendorsList,
} from "@/services/useAdminVendors"

const ITEMS_PER_PAGE = 10

export function VendorManagement() {
  const queryClient = useQueryClient()
  const {
    data: vendorBreakdown,
    isLoading: vendorBreakdownLoading,
    isError: vendorBreakdownError,
  } = useAdminVendorsBreakdown()

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [approveVendor, setApproveVendor] = useState<Vendor | null>(null)
  const [disableVendor, setDisableVendor] = useState<Vendor | null>(null)
  const [disableReason, setDisableReason] = useState("")
  const [resetPasswordVendor, setResetPasswordVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 400)
    return () => window.clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useAdminVendorsList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
  })

  const vendors = listData?.vendors ?? []
  const meta = listData?.meta
  const total = meta?.total ?? 0
  const totalPages = Math.max(1, meta?.totalPages ?? 1)
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + vendors.length

  const invalidateVendorList = () => {
    void queryClient.invalidateQueries({ queryKey: [...ADMIN_VENDORS_LIST_QUERY_KEY] })
  }

  const activateVendor = (vendor: Vendor) => {
    toast.success("Vendor Activated", { description: `${vendor.name}'s account has been activated.` })
    setSelectedVendor(null)
    invalidateVendorList()
  }

  const confirmApproveVendor = () => {
    if (!approveVendor) return
    toast.success("Vendor Approved", { description: `${approveVendor.name} has been approved and activated.` })
    setApproveVendor(null)
    invalidateVendorList()
  }

  const confirmDisableVendor = () => {
    if (!disableVendor) return
    if (!disableReason.trim()) {
      toast.error("Reason Required", { description: "Please provide a reason for disabling this account." })
      return
    }
    toast.warning("Account Disabled", { description: `${disableVendor.name}'s account has been disabled.` })
    setDisableVendor(null)
    setDisableReason("")
    invalidateVendorList()
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Vendor Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">
          Manage vendor profiles, approvals, verification, and services
        </p>
      </header>

      <VendorStats
        breakdown={vendorBreakdown}
        isLoading={vendorBreakdownLoading}
        isError={vendorBreakdownError}
      />

      <VendorFilters searchQuery={searchInput} onSearchQueryChange={setSearchInput} />

      {listError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-unageo text-sm text-red-800">
          {listErr instanceof Error ? listErr.message : "Could not load vendors. Try again."}
        </div>
      ) : null}

      <VendorsTable
        vendors={vendors}
        isLoading={listLoading}
        filteredCount={total}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetails={setSelectedVendor}
      />

      {selectedVendor ? (
        <VendorDetailsDrawer
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onApprove={() => {
            setApproveVendor(selectedVendor)
            setSelectedVendor(null)
          }}
          onDisable={() => {
            setDisableVendor(selectedVendor)
            setSelectedVendor(null)
          }}
          onActivate={() => activateVendor(selectedVendor)}
          onResetPassword={() => {
            setResetPasswordVendor(selectedVendor)
            setSelectedVendor(null)
          }}
          onApproveDocument={(doc) => toast.success("Document Approved", { description: `${doc} has been approved.` })}
          onRejectDocument={(doc) => toast.error("Document Rejected", { description: `${doc} has been rejected.` })}
        />
      ) : null}

      {approveVendor ? (
        <ActionDrawer
          title="Approve Vendor"
          icon={<CheckCircle className="h-10 w-10 text-chart-2" />}
          description={`Approve ${approveVendor.name} and activate account access.`}
          confirmLabel="Approve Vendor"
          confirmClass="bg-chart-2 text-white"
          onConfirm={confirmApproveVendor}
          onClose={() => setApproveVendor(null)}
        />
      ) : null}

      {disableVendor ? (
        <DisableDrawer
          vendor={disableVendor}
          reason={disableReason}
          onReasonChange={setDisableReason}
          onClose={() => {
            setDisableVendor(null)
            setDisableReason("")
          }}
          onConfirm={confirmDisableVendor}
        />
      ) : null}

      {resetPasswordVendor ? (
        <ActionDrawer
          title="Reset Password"
          icon={<Lock className="h-10 w-10 text-primary-100" />}
          description={`Send password reset link to ${resetPasswordVendor.email}.`}
          confirmLabel="Send Reset Link"
          confirmClass="bg-primary-100 text-white"
          onConfirm={() => {
            toast.success("Password Reset Link Sent", { description: `Reset link sent to ${resetPasswordVendor.email}` })
            setResetPasswordVendor(null)
          }}
          onClose={() => setResetPasswordVendor(null)}
        />
      ) : null}
    </div>
  )
}
