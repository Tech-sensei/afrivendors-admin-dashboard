import { ChevronLeft, ChevronRight, CreditCard, Eye, Wallet } from "lucide-react"
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
  if (!payments.length) {
    return <Empty icon={CreditCard} title="No payment transactions found" />
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Transaction ID", "Customer", "Vendor", "Amount", "Method", "Date", "Status", "Actions"].map((head) => (
                <th
                  key={head}
                  className={`px-4 py-3 text-left font-unageo text-[11px] font-semibold uppercase tracking-wide text-accent-70 ${head === "Actions" ? "text-right" : ""}`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} onClick={() => onViewDetails(payment)} className="cursor-pointer border-b border-border transition hover:bg-secondary-800/60">
                <td className="px-4 py-3 font-unageo text-sm font-semibold text-primary-100">{payment.transactionRef}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{payment.customerName}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{payment.vendorName}</td>
                <td className="px-4 py-3 font-unageo text-sm font-semibold text-secondary-000">${payment.amount}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{payment.paymentMethod}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{formatShortDate(payment.date)}</td>
                <td className="px-4 py-3">{paymentStatusBadge(payment.status)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onViewDetails(payment)
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        filteredCount={filteredCount}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
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
  if (!wallets.length) {
    return <Empty icon={Wallet} title="No wallet transactions found" />
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px]">
          <thead>
            <tr className="border-b border-border bg-secondary-800/50">
              {["Transaction ID", "User", "Type", "Amount", "Balance After", "Date", "Actions"].map((head) => (
                <th
                  key={head}
                  className={`px-4 py-3 text-left font-unageo text-[11px] font-semibold uppercase tracking-wide text-accent-70 ${head === "Actions" ? "text-right" : ""}`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id} onClick={() => onViewDetails(wallet)} className="cursor-pointer border-b border-border transition hover:bg-secondary-800/60">
                <td className="px-4 py-3 font-unageo text-sm font-semibold text-primary-100">{wallet.transactionRef}</td>
                <td className="px-4 py-3">
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{wallet.userName}</p>
                  <p className="mt-0.5 font-unageo text-xs text-accent-70">
                    {wallet.userType} • {wallet.userId}
                  </p>
                </td>
                <td className="px-4 py-3">{walletTypeBadge(wallet.type)}</td>
                <td className={`px-4 py-3 font-unageo text-sm font-semibold ${wallet.type === "Credit" || wallet.type === "Top-up" ? "text-chart-2" : "text-destructive"}`}>
                  {wallet.type === "Credit" || wallet.type === "Top-up" ? "+" : "-"}${wallet.amount}
                </td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">${wallet.balanceAfter}</td>
                <td className="px-4 py-3 font-unageo text-sm text-secondary-000">{formatShortDate(wallet.date)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onViewDetails(wallet)
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        filteredCount={filteredCount}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  )
}

function Empty({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <section className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
      <Icon className="mx-auto h-10 w-10 text-accent-60" />
      <h3 className="mt-4 font-unbounded text-xl font-semibold text-secondary-000">{title}</h3>
      <p className="mt-1 font-unageo text-sm text-accent-70">Try adjusting your filters or search query</p>
    </section>
  )
}

function Pagination({
  filteredCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
}: {
  filteredCount: number
  startIndex: number
  endIndex: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
      <p className="font-unageo text-sm text-accent-70">
        Showing {startIndex + 1} to {endIndex} of {filteredCount} transactions
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "h-8 min-w-8 rounded-md bg-primary-100 px-2 font-unageo text-xs font-semibold text-white"
                : "h-8 min-w-8 rounded-md border border-border px-2 font-unageo text-xs font-semibold text-secondary-000"
            }
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
