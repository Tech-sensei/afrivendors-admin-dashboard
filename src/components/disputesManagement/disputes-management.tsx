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
} from "@/services/useAdminDisputes"
import type { AdminDisputeResolveAction } from "@/types/admin-disputes"
import { DisputeDetailsDrawer } from "./drawers"
import { DisputesFilters } from "./filters"
import { DisputesStats } from "./stats"
import { DisputesTable } from "./table"

const ITEMS_PER_PAGE = 10

export function DisputesManagement() {
  const { data, isLoading, isError, refetch } = useAdminDisputesList({ page: 1, limit: 100 })
  const { mutate: resolveDispute, isPending: isResolving } = useAdminResolveDispute()

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<DisputeStatusFilter>("All Statuses")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null)
  const [resolveAction, setResolveAction] = useState<AdminDisputeResolveAction | null>(null)
  const [resolution, setResolution] = useState("")

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

  const submitResolve = () => {
    if (!selectedDispute || !resolveAction) return
    const trimmed = resolution.trim()
    if (trimmed.length < 20) return

    resolveDispute(
      {
        appointmentId: selectedDispute.appointmentId,
        resolution: trimmed,
        action: resolveAction,
      },
      {
        onSuccess: () => {
          toast.success(
            resolveAction === "release_funds" ? "Funds released to vendor." : "Customer refunded.",
          )
          setResolveAction(null)
          setResolution("")
          setSelectedDisputeId(null)
          void refetch()
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Could not resolve dispute."))
        },
      },
    )
  }

  const closeDrawer = () => {
    setSelectedDisputeId(null)
    setResolveAction(null)
    setResolution("")
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
          resolveAction={resolveAction}
          resolution={resolution}
          isResolving={isResolving}
          onClose={closeDrawer}
          onStartResolve={setResolveAction}
          onCancelResolve={() => {
            setResolveAction(null)
            setResolution("")
          }}
          onResolutionChange={setResolution}
          onConfirmResolve={submitResolve}
        />
      ) : null}
    </div>
  )
}
