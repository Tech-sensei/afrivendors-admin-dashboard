export type RfsRequestStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Cancelled"
  | "Completed"

export type RfsPaymentStatus =
  | "Unpaid"
  | "Paid"
  | "Released"
  | "Refunded"
  | "Disputed"
  | "Pending"

export interface RfsQuoteLineItem {
  description: string
  amount: number
}

export interface RfsAcceptedQuote {
  id: string
  vendorId: string
  vendorName: string
  totalAmount: number
  lineItems: RfsQuoteLineItem[]
  note?: string
  validUntil?: string
  status: string
  createdAt: string
}

export interface RfsRequest {
  id: string
  referenceId: string
  title: string
  description: string
  category: string
  customerName: string
  customerId: string
  customerUserId: number | null
  customerEmail: string
  vendorName: string
  vendorId: string
  vendorUserId: number | null
  vendorEmail: string
  budget: number
  agreedAmount: number
  amount: number
  preferredDate: string
  preferredTime: string
  location: string
  priority: string
  status: RfsRequestStatus
  paymentStatus: RfsPaymentStatus
  paymentMethod: string
  createdAt: string
  completedAt?: string
  quoteCount: number
  acceptedQuote?: RfsAcceptedQuote
  quotes: RfsAcceptedQuote[]
  imageUrl?: string
  fundsReleasedAt?: string
  hasDispute: boolean
}
