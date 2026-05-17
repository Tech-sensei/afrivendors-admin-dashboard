"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { type ReviewItem } from "./data"
import { ReviewDetailsDrawer } from "./drawers"
import { DeleteReviewModal, HideReviewModal } from "./modals"
import { ReviewsFilters, type ReviewRatingFilter } from "./filters"
import { ReviewsStats } from "./stats"
import { ReviewsTable } from "./table"
import type { AdminReviewRatingParam } from "@/types/admin-reviews"
import {
  ADMIN_REVIEWS_BREAKDOWN_QUERY_KEY,
  ADMIN_REVIEWS_LIST_QUERY_KEY,
  useAdminReviewSetHidden,
  useAdminReviewsBreakdown,
  useAdminReviewsList,
} from "@/services/useAdminReviews"

const ITEMS_PER_PAGE = 10

function ratingFilterToApiParam(filter: ReviewRatingFilter): AdminReviewRatingParam | undefined {
  if (filter === "All") return undefined
  return Number(filter) as AdminReviewRatingParam
}

export function ReviewsManagement() {
  const queryClient = useQueryClient()
  const {
    data: reviewBreakdown,
    isLoading: breakdownLoading,
    isError: breakdownError,
  } = useAdminReviewsBreakdown()

  const [customerNameInput, setCustomerNameInput] = useState("")
  const [vendorNameInput, setVendorNameInput] = useState("")
  const [debouncedCustomerName, setDebouncedCustomerName] = useState("")
  const [debouncedVendorName, setDebouncedVendorName] = useState("")
  const [selectedRating, setSelectedRating] = useState<ReviewRatingFilter>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null)
  const [hideReview, setHideReview] = useState<ReviewItem | null>(null)
  const [deleteReview, setDeleteReview] = useState<ReviewItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedCustomerName(customerNameInput.trim())
      setDebouncedVendorName(vendorNameInput.trim())
    }, 400)
    return () => window.clearTimeout(t)
  }, [customerNameInput, vendorNameInput])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedCustomerName, debouncedVendorName, selectedRating])

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useAdminReviewsList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    customerName: debouncedCustomerName || undefined,
    vendorName: debouncedVendorName || undefined,
    rating: ratingFilterToApiParam(selectedRating),
  })

  useEffect(() => {
    if (!listError) return
    const message =
      (listErr as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Could not load reviews."
    toast.error("Failed to load reviews", { description: String(message) })
  }, [listError, listErr])

  const reviews = listData?.reviews ?? []
  const meta = listData?.meta
  const total = meta?.total ?? 0
  const totalPages = Math.max(1, meta?.totalPages ?? 1)
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + reviews.length

  useEffect(() => {
    if (!meta?.totalPages || meta.totalPages < 1) return
    if (currentPage > meta.totalPages) setCurrentPage(meta.totalPages)
  }, [meta?.totalPages, currentPage])

  const { mutateAsync: setReviewHidden, isPending: isHidingReview } = useAdminReviewSetHidden()

  const handleToggleVisibility = async (notes: string) => {
    if (!hideReview || isHidingReview) return
    const willHide = hideReview.status === "Visible"
    if (willHide && !notes.trim()) {
      toast.error("Admin notes required", { description: "Please explain why this review is being hidden." })
      return
    }

    try {
      await setReviewHidden({ reviewId: hideReview.id, hidden: willHide })
      const newStatus = willHide ? "Hidden" : ("Visible" as const)
      toast.success(willHide ? "Review hidden" : "Review unhidden", {
        description: willHide
          ? "This review is no longer visible to customers and vendors."
          : "This review is visible again.",
      })

      if (selectedReview?.id === hideReview.id) {
        const now = new Date()
        const actionDate = now.toISOString().split("T")[0] ?? ""
        const actionTime = now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        const action = willHide ? "Review Hidden" : "Review Unhidden"
        setSelectedReview({
          ...hideReview,
          status: newStatus,
          adminNotes: notes.trim() || hideReview.adminNotes,
          history: [
            ...hideReview.history,
            { action, date: actionDate, time: actionTime, by: "Admin User" },
          ],
        })
      }

      setHideReview(null)
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not update review visibility."
      toast.error("Failed to update review", { description: String(message) })
    }
  }

  const handleDeleteReview = () => {
    if (!deleteReview) return
    toast.info("Delete not synced", {
      description: "Connect the admin review API when delete is available.",
    })
    if (selectedReview?.id === deleteReview.id) setSelectedReview(null)
    setDeleteReview(null)
    void queryClient.invalidateQueries({ queryKey: [...ADMIN_REVIEWS_LIST_QUERY_KEY] })
    void queryClient.invalidateQueries({ queryKey: [...ADMIN_REVIEWS_BREAKDOWN_QUERY_KEY] })
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Reviews & Ratings Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">Monitor and moderate customer reviews and ratings</p>
      </header>

      <ReviewsStats breakdown={reviewBreakdown} isLoading={breakdownLoading} isError={breakdownError} />

      <ReviewsFilters
        customerNameQuery={customerNameInput}
        onCustomerNameQueryChange={setCustomerNameInput}
        vendorNameQuery={vendorNameInput}
        onVendorNameQueryChange={setVendorNameInput}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((state) => !state)}
        selectedRating={selectedRating}
        onSelectedRatingChange={setSelectedRating}
      />

      <ReviewsTable
        reviews={reviews}
        isLoading={listLoading}
        filteredCount={total}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onViewDetails={setSelectedReview}
      />

      {selectedReview ? (
        <ReviewDetailsDrawer
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onToggleVisibility={setHideReview}
          onDelete={setDeleteReview}
        />
      ) : null}

      {hideReview ? (
        <HideReviewModal
          review={hideReview}
          isSubmitting={isHidingReview}
          onClose={() => setHideReview(null)}
          onConfirm={handleToggleVisibility}
        />
      ) : null}

      {deleteReview ? (
        <DeleteReviewModal
          review={deleteReview}
          onClose={() => setDeleteReview(null)}
          onConfirm={handleDeleteReview}
        />
      ) : null}
    </div>
  )
}
