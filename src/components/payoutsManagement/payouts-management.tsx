"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import type { PayoutRequest } from "./data"
import { PayoutDetailsDrawer, RejectPayoutDrawer } from "./drawers"
import { PayoutStats } from "./stats"
import { PayoutsTable } from "./table"
import {
  useAdminPayoutApprove,
  useAdminPayoutReject,
  useAdminPayoutsList,
  type AdminPayoutListStatusParam,
} from "@/services/useAdminPayouts"

const ITEMS_PER_PAGE = 10

/** Value "" = all statuses; otherwise sent as `status` on GET /admin/payouts */
const PAYOUT_STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "failed", label: "Failed" },
]

function isPendingLike(s: PayoutRequest["status"]) {
  return s === "Pending" || s === "Processing"
}

function isApprovedLike(s: PayoutRequest["status"]) {
  return s === "Approved" || s === "Completed"
}

function isRejectedLike(s: PayoutRequest["status"]) {
  return s === "Rejected" || s === "Failed"
}

function axiosMessage(error: unknown): string {
  const err = error as { response?: { data?: { message?: string; responseMessage?: string } } }
  return (
    err.response?.data?.message ??
    err.response?.data?.responseMessage ??
    (error instanceof Error ? error.message : "Request failed")
  )
}

export function PayoutsManagement() {
  const [statusFilter, setStatusFilter] = useState<"" | AdminPayoutListStatusParam>("")
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null)
  const [rejectDrawerOpen, setRejectDrawerOpen] = useState(false)
  const [rejectPayout, setRejectPayout] = useState<PayoutRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const approveMutation = useAdminPayoutApprove()
  const rejectMutation = useAdminPayoutReject()

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter])

  const apiStatus: AdminPayoutListStatusParam | undefined = statusFilter === "" ? undefined : statusFilter

  const {
    data: listData,
    isLoading,
    isError,
    error,
  } = useAdminPayoutsList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    status: apiStatus,
  })

  const payouts = listData?.payouts ?? []
  const meta = listData?.meta
  const total = meta?.total ?? 0
  const totalPages = Math.max(1, meta?.totalPages ?? 1)
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + payouts.length

  const pageStats = useMemo(() => {
    let pendingAmount = 0
    let approvedAmount = 0
    let rejectedAmount = 0
    let pendingCount = 0
    let approvedCount = 0
    let rejectedCount = 0
    for (const p of payouts) {
      if (isPendingLike(p.status)) {
        pendingAmount += p.amount
        pendingCount += 1
      } else if (isApprovedLike(p.status)) {
        approvedAmount += p.amount
        approvedCount += 1
      } else if (isRejectedLike(p.status)) {
        rejectedAmount += p.amount
        rejectedCount += 1
      }
    }
    return {
      pendingAmount,
      approvedAmount,
      rejectedAmount,
      pendingCount,
      approvedCount,
      rejectedCount,
    }
  }, [payouts])

  const openRejectDrawer = (payout: PayoutRequest) => {
    setSelectedPayout(null)
    setTimeout(() => {
      setRejectPayout(payout)
      setRejectDrawerOpen(true)
    }, 200)
  }

  const closeRejectDrawer = () => {
    setRejectDrawerOpen(false)
    setRejectPayout(null)
    setRejectionReason("")
  }

  const handleApprovePayout = (payoutId: string) => {
    approveMutation.mutate(payoutId, {
      onSuccess: () => {
        toast.success("Payout approved successfully")
        setSelectedPayout(null)
      },
      onError: (e) => {
        toast.error("Could not approve payout", { description: axiosMessage(e) })
      },
    })
  }

  const handleRejectPayout = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }
    if (!rejectPayout) return

    rejectMutation.mutate(
      { payoutId: rejectPayout.id, reason: rejectionReason.trim() },
      {
        onSuccess: () => {
          toast.success("Payout rejected")
          closeRejectDrawer()
          setSelectedPayout(null)
        },
        onError: (e) => {
          toast.error("Could not reject payout", { description: axiosMessage(e) })
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Payouts Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">Manage vendor payout requests and disbursements</p>
      </header>

      <PayoutStats
        pendingAmount={pageStats.pendingAmount}
        approvedAmount={pageStats.approvedAmount}
        totalPayoutRecords={total}
        rejectedAmount={pageStats.rejectedAmount}
        pendingCount={pageStats.pendingCount}
        approvedCount={pageStats.approvedCount}
        rejectedCount={pageStats.rejectedCount}
        showPageScopeNote={total > ITEMS_PER_PAGE || totalPages > 1}
      />

      <section className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 sm:max-w-xs">
          <span className="font-unageo text-xs font-semibold text-secondary-000">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              const v = e.target.value
              setStatusFilter(v === "" ? "" : (v as AdminPayoutListStatusParam))
            }}
            className="rounded-lg border border-border bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
          >
            {PAYOUT_STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-unageo text-sm text-red-800">
          {error instanceof Error ? error.message : "Could not load payouts. Try again."}
        </div>
      ) : null}

      <PayoutsTable
        payouts={payouts}
        isLoading={isLoading}
        filteredCount={total}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onViewDetails={setSelectedPayout}
      />

      {selectedPayout ? (
        <PayoutDetailsDrawer
          payoutId={selectedPayout.id}
          summaryPayout={selectedPayout}
          isApproveSubmitting={approveMutation.isPending}
          onClose={() => setSelectedPayout(null)}
          onApprove={handleApprovePayout}
          onReject={openRejectDrawer}
        />
      ) : null}

      {rejectDrawerOpen && rejectPayout ? (
        <RejectPayoutDrawer
          payout={rejectPayout}
          reason={rejectionReason}
          isSubmitting={rejectMutation.isPending}
          onReasonChange={setRejectionReason}
          onClose={closeRejectDrawer}
          onConfirm={handleRejectPayout}
        />
      ) : null}
    </div>
  )
}
