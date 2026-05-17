"use client"

import { CreditCard, Wallet } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PaymentDetailsDrawer, WalletDetailsDrawer } from "./drawers"
import { PaymentFilters, WalletFilters } from "./filters"
import {
  initialPaymentTransactions,
  initialWalletTransactions,
  type PaymentTransaction,
  type WalletTransaction,
} from "./data"
import { PaymentsStats } from "./stats"
import { PaymentsTable, WalletTable } from "./tables"
import { paymentMatchesSearch, walletMatchesSearch } from "./shared"

const ITEMS_PER_PAGE = 10

export function PaymentsManagement() {
  const [activeTab, setActiveTab] = useState<"payments" | "wallet">("payments")

  const [paymentTransactions, setPaymentTransactions] = useState(initialPaymentTransactions)
  const [paymentSearchQuery, setPaymentSearchQuery] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All")
  const [showPaymentFilters, setShowPaymentFilters] = useState(false)
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null)

  const [walletTransactions] = useState(initialWalletTransactions)
  const [walletSearchQuery, setWalletSearchQuery] = useState("")
  const [walletTypeFilter, setWalletTypeFilter] = useState("All")
  const [walletUserTypeFilter, setWalletUserTypeFilter] = useState("All")
  const [showWalletFilters, setShowWalletFilters] = useState(false)
  const [walletCurrentPage, setWalletCurrentPage] = useState(1)
  const [selectedWallet, setSelectedWallet] = useState<WalletTransaction | null>(null)

  const filteredPayments = useMemo(() => {
    return paymentTransactions.filter((transaction) => {
      const matchesSearch = !paymentSearchQuery || paymentMatchesSearch(transaction, paymentSearchQuery)
      const matchesStatus = paymentStatusFilter === "All" || transaction.status === paymentStatusFilter
      const matchesMethod = paymentMethodFilter === "All" || transaction.paymentMethod === paymentMethodFilter
      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [paymentTransactions, paymentSearchQuery, paymentStatusFilter, paymentMethodFilter])

  const filteredWallets = useMemo(() => {
    return walletTransactions.filter((transaction) => {
      const matchesSearch = !walletSearchQuery || walletMatchesSearch(transaction, walletSearchQuery)
      const matchesType = walletTypeFilter === "All" || transaction.type === walletTypeFilter
      const matchesUserType = walletUserTypeFilter === "All" || transaction.userType === walletUserTypeFilter
      return matchesSearch && matchesType && matchesUserType
    })
  }, [walletTransactions, walletSearchQuery, walletTypeFilter, walletUserTypeFilter])

  const paymentTotalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)
  const paymentStartIndex = (paymentCurrentPage - 1) * ITEMS_PER_PAGE
  const paymentEndIndex = Math.min(paymentStartIndex + ITEMS_PER_PAGE, filteredPayments.length)
  const currentPayments = filteredPayments.slice(paymentStartIndex, paymentEndIndex)

  const walletTotalPages = Math.ceil(filteredWallets.length / ITEMS_PER_PAGE)
  const walletStartIndex = (walletCurrentPage - 1) * ITEMS_PER_PAGE
  const walletEndIndex = Math.min(walletStartIndex + ITEMS_PER_PAGE, filteredWallets.length)
  const currentWallets = filteredWallets.slice(walletStartIndex, walletEndIndex)

  const totalRevenue = paymentTransactions.filter((t) => t.status === "Completed").reduce((sum, transaction) => sum + transaction.amount, 0)
  const platformEarnings = paymentTransactions.filter((t) => t.status === "Completed").reduce((sum, transaction) => sum + transaction.platformFee, 0)
  const pendingPayments = paymentTransactions.filter((t) => t.status === "Pending").reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalRefunds = paymentTransactions.filter((t) => t.status === "Refunded").reduce((sum, transaction) => sum + transaction.amount, 0)

  const handleIssueRefund = (transactionId: string) => {
    setPaymentTransactions((prev) => prev.map((txn) => (txn.id === transactionId ? { ...txn, status: "Refunded", type: "Refund" } : txn)))
    setSelectedPayment(null)
    toast.success("Refund Issued", { description: "The refund has been processed successfully." })
  }

  const handleMarkAsPaid = (transactionId: string) => {
    setPaymentTransactions((prev) => prev.map((txn) => (txn.id === transactionId ? { ...txn, status: "Completed" } : txn)))
    setSelectedPayment(null)
    toast.success("Payment Marked as Paid", { description: "The payment status has been updated to completed." })
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Payments & Wallet</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">Track payment transactions and wallet activity across the platform</p>
      </header>

      <PaymentsStats
        totalRevenue={totalRevenue}
        platformEarnings={platformEarnings}
        pendingPayments={pendingPayments}
        totalRefunds={totalRefunds}
      />

      <section>
        <div className="mb-4 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`inline-flex items-center gap-2 border-b-[3px] px-4 py-3 font-unageo text-sm font-semibold ${activeTab === "payments" ? "border-primary-100 text-primary-100" : "border-transparent text-accent-70"}`}
          >
            <CreditCard className="h-4 w-4" />
            Payment Transactions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wallet")}
            className={`inline-flex items-center gap-2 border-b-[3px] px-4 py-3 font-unageo text-sm font-semibold ${activeTab === "wallet" ? "border-primary-100 text-primary-100" : "border-transparent text-accent-70"}`}
          >
            <Wallet className="h-4 w-4" />
            Wallet Transactions
          </button>
        </div>

        {activeTab === "payments" ? (
          <div className="space-y-4">
            <PaymentFilters
              searchQuery={paymentSearchQuery}
              onSearchQueryChange={setPaymentSearchQuery}
              showFilters={showPaymentFilters}
              onToggleFilters={() => setShowPaymentFilters((state) => !state)}
              statusFilter={paymentStatusFilter}
              onStatusFilterChange={setPaymentStatusFilter}
              methodFilter={paymentMethodFilter}
              onMethodFilterChange={setPaymentMethodFilter}
            />
            <PaymentsTable
              payments={currentPayments}
              filteredCount={filteredPayments.length}
              startIndex={paymentStartIndex}
              endIndex={paymentEndIndex}
              currentPage={paymentCurrentPage}
              totalPages={paymentTotalPages}
              onPageChange={setPaymentCurrentPage}
              onViewDetails={setSelectedPayment}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <WalletFilters
              searchQuery={walletSearchQuery}
              onSearchQueryChange={setWalletSearchQuery}
              showFilters={showWalletFilters}
              onToggleFilters={() => setShowWalletFilters((state) => !state)}
              typeFilter={walletTypeFilter}
              onTypeFilterChange={setWalletTypeFilter}
              userTypeFilter={walletUserTypeFilter}
              onUserTypeFilterChange={setWalletUserTypeFilter}
            />
            <WalletTable
              wallets={currentWallets}
              filteredCount={filteredWallets.length}
              startIndex={walletStartIndex}
              endIndex={walletEndIndex}
              currentPage={walletCurrentPage}
              totalPages={walletTotalPages}
              onPageChange={setWalletCurrentPage}
              onViewDetails={setSelectedWallet}
            />
          </div>
        )}
      </section>

      {selectedPayment ? (
        <PaymentDetailsDrawer
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onIssueRefund={handleIssueRefund}
          onMarkAsPaid={handleMarkAsPaid}
        />
      ) : null}
      {selectedWallet ? (
        <WalletDetailsDrawer wallet={selectedWallet} onClose={() => setSelectedWallet(null)} />
      ) : null}
    </div>
  )
}
