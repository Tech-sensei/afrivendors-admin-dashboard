"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { BookingFilters, type BookingStatusFilter } from "./filters"
import { BookingStats } from "./stats"
import { BookingsTable } from "./table"
import { BookingDetailsDrawer } from "./drawers"
import type { Booking } from "./data"
import type { AdminAppointmentListStatusParam } from "@/types/admin-appointments"
import {
  ADMIN_APPOINTMENTS_BREAKDOWN_QUERY_KEY,
  ADMIN_APPOINTMENTS_LIST_QUERY_KEY,
  useAdminAppointmentsBreakdown,
  useAdminAppointmentsList,
} from "@/services/useAdminAppointments"

const ITEMS_PER_PAGE = 10

function statusFilterToApiParam(filter: BookingStatusFilter): AdminAppointmentListStatusParam | undefined {
  if (filter === "All") return undefined
  const map: Record<Exclude<BookingStatusFilter, "All">, AdminAppointmentListStatusParam> = {
    Pending: "pending",
    Accepted: "accepted",
    Rejected: "rejected",
    Canceled: "canceled",
    Completed: "completed",
  }
  return map[filter]
}

export function BookingsManagement() {
  const queryClient = useQueryClient()
  const {
    data: appointmentBreakdown,
    isLoading: breakdownLoading,
    isError: breakdownError,
  } = useAdminAppointmentsBreakdown()

  const [vendorNameInput, setVendorNameInput] = useState("")
  const [debouncedVendorName, setDebouncedVendorName] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedVendorName(vendorNameInput.trim()), 400)
    return () => window.clearTimeout(t)
  }, [vendorNameInput])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedVendorName, statusFilter])

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useAdminAppointmentsList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    status: statusFilterToApiParam(statusFilter),
    vendorName: debouncedVendorName || undefined,
  })

  useEffect(() => {
    if (!listError) return
    const message =
      (listErr as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Could not load appointments."
    toast.error("Failed to load appointments", { description: String(message) })
  }, [listError, listErr])

  const bookings = listData?.bookings ?? []
  const meta = listData?.meta
  const total = meta?.total ?? 0
  const totalPages = Math.max(1, meta?.totalPages ?? 1)
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + bookings.length

  useEffect(() => {
    if (!meta?.totalPages || meta.totalPages < 1) return
    if (currentPage > meta.totalPages) setCurrentPage(meta.totalPages)
  }, [meta?.totalPages, currentPage])

  const invalidateAppointments = () => {
    void queryClient.invalidateQueries({ queryKey: [...ADMIN_APPOINTMENTS_LIST_QUERY_KEY] })
    void queryClient.invalidateQueries({ queryKey: [...ADMIN_APPOINTMENTS_BREAKDOWN_QUERY_KEY] })
  }

  const handleCancelBooking = (bookingId: string) => {
    toast.info("Cancel not synced", {
      description: `No admin cancel API wired yet (booking ${bookingId}). List will refresh when available.`,
    })
    setSelectedBooking(null)
    invalidateAppointments()
  }

  const handleCompleteBooking = (bookingId: string) => {
    toast.info("Complete not synced", {
      description: `No admin complete API wired yet (booking ${bookingId}). List will refresh when available.`,
    })
    setSelectedBooking(null)
    invalidateAppointments()
  }

  const handleContactCustomer = (email: string) => {
    toast.info("Email client", {
      description: `Opening email client to contact ${email}`,
    })
  }

  const handleContactVendor = (email: string) => {
    toast.info("Email client", {
      description: `Opening email client to contact ${email}`,
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Bookings & Appointments</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">Monitor and manage all platform bookings</p>
      </header>

      <BookingStats breakdown={appointmentBreakdown} isLoading={breakdownLoading} isError={breakdownError} />

      <BookingFilters
        vendorNameQuery={vendorNameInput}
        onVendorNameQueryChange={setVendorNameInput}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <BookingsTable
        bookings={bookings}
        isLoading={listLoading}
        filteredCount={total}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetails={setSelectedBooking}
      />

      {selectedBooking ? (
        <BookingDetailsDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={handleCancelBooking}
          onComplete={handleCompleteBooking}
          onContactCustomer={handleContactCustomer}
          onContactVendor={handleContactVendor}
        />
      ) : null}
    </div>
  )
}
