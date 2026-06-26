"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/apiErrors"
import {
  computeDisputeStats,
  disputeMatchesSearch,
  disputeMatchesStatusFilter,
  mapAdminDisputeApiToItem,
  type DisputeStatusFilter,
} from "@/lib/mapAdminDispute"
import {
  useAdminDisputeDetail,
  useAdminDisputesList,
  useAdminResolveDispute,
  useAdminSplitResolveDispute,
} from "@/services/useAdminDisputes"
import type { AdminDisputeResolveMode } from "@/types/admin-disputes"
import { DisputeDetailsDrawer } from "./drawers"
import { DisputesFilters } from "./filters"
import { DisputesStats } from "./stats"
import { DisputesTable } from "./table"

const ITEMS_PER_PAGE = 10

export function DisputesManagement() {
  const { data, isLoading, isError, refetch } = useAdminDisputesList({ page: 1, limit: 100 })
  const { mutate: resolveDispute, isPending: isResolving } = useAdminResolveDispute()
  const { mutate: splitResolveDispute, isPending: isSplitResolving } = useAdminSplitResolveDispute()

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<DisputeStatusFilter>("All Statuses")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null)
  const [resolveMode, setResolveMode] = useState<AdminDisputeResolveMode | null>(null)
  const [resolution, setResolution] = useState("")
  const [vendorPercent, setVendorPercent] = useState(50)
  const [clientPercent, setClientPercent] = useState(50)

  const {
    data: disputeDetail,
    isLoading: detailLoading,
    isError: detailError,
    refetch: refetchDetail,
  } = useAdminDisputeDetail(selectedDisputeId, selectedDisputeId != null)

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
    return () => window.clearTimeout(id)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter])

  const allItems = useMemo(
    () => (data?.data ?? []).map(mapAdminDisputeApiToItem),
    [data?.data],
  )

  const selectedDispute =
    disputeDetail ?? allItems.find((item) => item.id === selectedDisputeId) ?? null

  const stats = useMemo(() => computeDisputeStats(data?.data ?? []), [data?.data])

  const filteredDisputes = useMemo(() => {
    return allItems.filter(
      (item) => disputeMatchesSearch(item, debouncedSearch) && disputeMatchesStatusFilter(item, statusFilter),
    )
  }, [allItems, debouncedSearch, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredDisputes.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredDisputes.length)
  const pageDisputes = filteredDisputes.slice(startIndex, endIndex)

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const resetResolveForm = () => {
    setResolveMode(null)
    setResolution("")
    setVendorPercent(50)
    setClientPercent(50)
  }

  const submitResolve = () => {
    if (!selectedDispute || !resolveMode) return
    const trimmed = resolution.trim()
    if (trimmed.length < 20) return

    const onSuccess = (message: string) => {
      toast.success(message)
      resetResolveForm()
      setSelectedDisputeId(null)
      void refetch()
    }

    const onError = (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Could not resolve dispute."))
    }

    if (resolveMode === "split") {
      if (vendorPercent + clientPercent !== 100) {
        toast.error("Split percentages must add up to 100%.")
        return
      }

      splitResolveDispute(
        {
          type: selectedDispute.orderType,
          orderId: selectedDispute.orderId,
          resolution: trimmed,
          vendorPercent,
          clientPercent,
        },
        {
          onSuccess: () =>
            onSuccess(
              `Split settlement applied (${vendorPercent}% vendor · ${clientPercent}% customer).`,
            ),
          onError,
        },
      )
      return
    }

    resolveDispute(
      {
        type: selectedDispute.orderType,
        orderId: selectedDispute.orderId,
        resolution: trimmed,
        action: resolveMode,
      },
      {
        onSuccess: () =>
          onSuccess(
            resolveMode === "release_funds" ? "Funds released to vendor." : "Customer refunded.",
          ),
        onError,
      },
    )
  }

  const closeDrawer = () => {
    setSelectedDisputeId(null)
    resetResolveForm()
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Disputes Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">
          Review and resolve disputes raised by customers and vendors
        </p>
      </header>

      <DisputesStats stats={stats} isLoading={isLoading} />

      <DisputesFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isError ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-unageo text-sm text-accent-70">Could not load disputes.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 font-unageo text-sm font-semibold text-primary-100"
          >
            Try again
          </button>
        </div>
      ) : (
        <DisputesTable
          disputes={pageDisputes}
          isLoading={isLoading}
          filteredCount={filteredDisputes.length}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onViewCase={(dispute) => setSelectedDisputeId(dispute.id)}
        />
      )}

      {selectedDisputeId != null ? (
        <DisputeDetailsDrawer
          dispute={selectedDispute}
          isLoading={detailLoading && !disputeDetail}
          isError={detailError && !disputeDetail}
          onRetry={() => void refetchDetail()}
          resolveMode={resolveMode}
          resolution={resolution}
          vendorPercent={vendorPercent}
          clientPercent={clientPercent}
          isResolving={isResolving || isSplitResolving}
          onClose={closeDrawer}
          onStartResolve={setResolveMode}
          onCancelResolve={resetResolveForm}
          onResolutionChange={setResolution}
          onVendorPercentChange={setVendorPercent}
          onClientPercentChange={setClientPercent}
          onConfirmResolve={submitResolve}
        />
      ) : null}
    </div>
  )
}
