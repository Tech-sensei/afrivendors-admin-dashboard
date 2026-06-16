"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { CreditCard, Eye, Wallet } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import type { PaymentTransaction, WalletTransaction } from "./data"
import { formatShortDate, paymentStatusBadge, walletTypeBadge } from "./shared"

export function PaymentsTable({
  payments,
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: {
  payments: PaymentTransaction[]
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (transaction: PaymentTransaction) => void
}) {
  const columns = useMemo<ColumnDef<PaymentTransaction, unknown>[]>(
    () => [
      {
        accessorKey: "transactionRef",
        header: "Transaction ID",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-primary-100">{row.original.transactionRef}</span>
        ),
      },
      { accessorKey: "customerName", header: "Customer" },
      { accessorKey: "vendorName", header: "Vendor" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-secondary-000">${row.original.amount}</span>
        ),
      },
      { accessorKey: "paymentMethod", header: "Method" },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatShortDate(row.original.date),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => paymentStatusBadge(row.original.status),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onViewDetails(row.original)
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        ),
      },
    ],
    [onViewDetails],
  )

  return (
    <AdminDataTable
      data={payments}
      columns={columns}
      resourceLabel="payment transactions"
      minWidth="1120px"
      getRowId={(row) => row.id}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty icon={CreditCard} title="No payment transactions found" description="Try adjusting your filters or search query" />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} transactions`,
              currentPage,
              totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  )
}

export function WalletTable({
  wallets,
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: {
  wallets: WalletTransaction[]
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (transaction: WalletTransaction) => void
}) {
  const columns = useMemo<ColumnDef<WalletTransaction, unknown>[]>(
    () => [
      {
        accessorKey: "transactionRef",
        header: "Transaction ID",
        cell: ({ row }) => (
          <span className="font-unageo text-sm font-semibold text-primary-100">{row.original.transactionRef}</span>
        ),
      },
      {
        id: "user",
        header: "User",
        accessorFn: (row) => row.userName,
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.userName}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">
              {row.original.userType} • {row.original.userId}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        enableSorting: false,
        cell: ({ row }) => walletTypeBadge(row.original.type),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span
            className={`font-unageo text-sm font-semibold ${row.original.type === "Credit" || row.original.type === "Top-up" ? "text-chart-2" : "text-destructive"}`}
          >
            {row.original.type === "Credit" || row.original.type === "Top-up" ? "+" : "-"}${row.original.amount}
          </span>
        ),
      },
      {
        accessorKey: "balanceAfter",
        header: "Balance After",
        cell: ({ row }) => `$${row.original.balanceAfter}`,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatShortDate(row.original.date),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onViewDetails(row.original)
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        ),
      },
    ],
    [onViewDetails],
  )

  return (
    <AdminDataTable
      data={wallets}
      columns={columns}
      resourceLabel="wallet transactions"
      minWidth="1120px"
      getRowId={(row) => row.id}
      onRowClick={onViewDetails}
      emptyState={
        <AdminTableEmpty icon={Wallet} title="No wallet transactions found" description="Try adjusting your filters or search query" />
      }
      pagination={
        filteredCount > 0
          ? {
              summary: `Showing ${startIndex + 1} to ${endIndex} of ${filteredCount} transactions`,
              currentPage,
              totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  )
}
