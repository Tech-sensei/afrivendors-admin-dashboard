import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Store,
  Users,
  Wallet,
} from "lucide-react"

export const revenueData = [
  { id: "rev-1", month: "Jan", revenue: 45000 },
  { id: "rev-2", month: "Feb", revenue: 52000 },
  { id: "rev-3", month: "Mar", revenue: 48000 },
  { id: "rev-4", month: "Apr", revenue: 61000 },
  { id: "rev-5", month: "May", revenue: 55000 },
  { id: "rev-6", month: "Jun", revenue: 67000 },
]

export const vendorsCustomersData = [
  { id: "vc-1", month: "Jan", vendors: 24, customers: 145 },
  { id: "vc-2", month: "Feb", vendors: 32, customers: 168 },
  { id: "vc-3", month: "Mar", vendors: 28, customers: 189 },
  { id: "vc-4", month: "Apr", vendors: 41, customers: 223 },
  { id: "vc-5", month: "May", vendors: 37, customers: 256 },
  { id: "vc-6", month: "Jun", vendors: 45, customers: 289 },
]

export const bookingsData = [
  { id: "book-1", day: "Mon", bookings: 45 },
  { id: "book-2", day: "Tue", bookings: 52 },
  { id: "book-3", day: "Wed", bookings: 48 },
  { id: "book-4", day: "Thu", bookings: 61 },
  { id: "book-5", day: "Fri", bookings: 55 },
  { id: "book-6", day: "Sat", bookings: 67 },
  { id: "book-7", day: "Sun", bookings: 43 },
]

export const revenueByCategoryData = [
  { category: "Beauty", revenue: 28500 },
  { category: "Wellness", revenue: 22000 },
  { category: "Fashion", revenue: 18000 },
  { category: "Food", revenue: 15500 },
  { category: "Events", revenue: 12000 },
]

export type Booking = {
  id: string
  customer: string
  vendor: string
  service: string
  amount: number
  date: string
  status: "Completed" | "Confirmed" | "Pending"
}

export const recentBookings: Booking[] = [
  {
    id: "BK-1001",
    customer: "Amara Johnson",
    vendor: "Elegance Hair Salon",
    service: "Braiding Service",
    amount: 85,
    date: "2025-11-27",
    status: "Completed",
  },
  {
    id: "BK-1002",
    customer: "Kofi Mensah",
    vendor: "Afro Wellness Spa",
    service: "Full Body Massage",
    amount: 120,
    date: "2025-11-27",
    status: "Confirmed",
  },
  {
    id: "BK-1003",
    customer: "Zainab Ali",
    vendor: "Sahara Fashion House",
    service: "Custom Tailoring",
    amount: 200,
    date: "2025-11-26",
    status: "Pending",
  },
  {
    id: "BK-1004",
    customer: "Malik Davis",
    vendor: "Savanna Events Co.",
    service: "Wedding Planning",
    amount: 1500,
    date: "2025-11-26",
    status: "Completed",
  },
  {
    id: "BK-1005",
    customer: "Fatoumata Diop",
    vendor: "Jollof Kitchen",
    service: "Catering Service",
    amount: 450,
    date: "2025-11-25",
    status: "Confirmed",
  },
]

export type Vendor = {
  id: string
  name: string
  category: string
  location: string
  joinedDate: string
  status: string
  email: string
  phone: string
  description: string
  services: string[]
  openingHours: string
}

export const recentVendors: Vendor[] = [
  {
    id: "V-2024",
    name: "Ubuntu Beauty Lounge",
    category: "Beauty",
    location: "Lagos, Nigeria",
    joinedDate: "2025-11-27",
    status: "Pending Approval",
    email: "info@ubuntubeauty.ng",
    phone: "+234 803 456 7890",
    description:
      "Premium beauty salon offering authentic African hair braiding and natural hair care.",
    services: ["Box Braids", "Cornrows", "Twists", "Natural Hair Care"],
    openingHours: "Mon-Sat: 9:00 AM - 7:00 PM",
  },
  {
    id: "V-2023",
    name: "Serengeti Cafe",
    category: "Food & Beverage",
    location: "Nairobi, Kenya",
    joinedDate: "2025-11-27",
    status: "Pending Approval",
    email: "hello@serengeticafe.co.ke",
    phone: "+254 712 345 678",
    description: "Authentic East African cuisine with locally sourced ingredients.",
    services: ["Nyama Choma", "Pilau", "Chapati", "Coffee & Tea"],
    openingHours: "Mon-Sun: 8:00 AM - 10:00 PM",
  },
  {
    id: "V-2022",
    name: "Kente Fashion Studio",
    category: "Fashion & Design",
    location: "Accra, Ghana",
    joinedDate: "2025-11-26",
    status: "Pending Approval",
    email: "contact@kentefashion.gh",
    phone: "+233 24 567 8901",
    description: "Bespoke African fashion studio using traditional Kente cloth.",
    services: ["Custom Tailoring", "Wedding Attire", "Alterations"],
    openingHours: "Tue-Sat: 10:00 AM - 6:00 PM",
  },
]

export type SupportTicket = {
  id: string
  subject: string
  customer?: string
  vendor?: string
  category: string
  priority: "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Resolved"
  created: string
  description: string
}

export const supportTickets: SupportTicket[] = [
  {
    id: "TKT-4521",
    customer: "Aisha Mohammed",
    subject: "Payment Issue",
    category: "Payment & Billing",
    priority: "High",
    status: "Open",
    created: "2h ago",
    description:
      "Customer reports duplicate charge for booking BK-1001 and requests a refund.",
  },
  {
    id: "TKT-4520",
    vendor: "Sahara Spa",
    subject: "Profile Update Request",
    category: "Account & Profile",
    priority: "Medium",
    status: "In Progress",
    created: "5h ago",
    description:
      "Vendor cannot save business hours updates. Error shown on save action.",
  },
  {
    id: "TKT-4519",
    customer: "David Okafor",
    subject: "Booking Cancellation",
    category: "Bookings & Reservations",
    priority: "Low",
    status: "Resolved",
    created: "1d ago",
    description: "Cancellation for BK-1003 was processed and refunded.",
  },
]

export type Dispute = {
  id: string
  bookingId: string
  customer: string
  vendor: string
  service: string
  amount: number
  issue: string
  status: string
  priority: "High" | "Medium" | "Low"
  created: string
}

export const disputes: Dispute[] = [
  {
    id: "DIS-3021",
    bookingId: "BK-0987",
    customer: "Fatima Hassan",
    vendor: "Afro Wellness Spa",
    service: "Deep Tissue Massage",
    amount: 95,
    issue: "Service Not Provided as Described",
    status: "Under Review",
    priority: "High",
    created: "3h ago",
  },
  {
    id: "DIS-3020",
    bookingId: "BK-0956",
    customer: "Emmanuel Adeyemi",
    vendor: "Ubuntu Beauty Lounge",
    service: "Box Braids Installation",
    amount: 120,
    issue: "Unsatisfactory Service Quality",
    status: "Awaiting Vendor Response",
    priority: "Medium",
    created: "1d ago",
  },
]

export const systemAlerts = [
  { type: "verification", message: "12 vendors pending verification", action: "Review" },
  { type: "suspicious", message: "3 accounts flagged for suspicious activity", action: "Investigate" },
  { type: "payout", message: "8 payouts pending approval", action: "Process" },
]

export const recentActivities = [
  { user: "Amara Johnson", action: "made a booking", target: "Elegance Hair Salon", time: "5 min ago", type: "booking" },
  { user: "Kente Fashion Studio", action: "updated profile", target: "Business hours", time: "12 min ago", type: "profile" },
  { user: "Kofi Mensah", action: "left a review", target: "Afro Wellness Spa", time: "24 min ago", type: "review" },
  { user: "System", action: "processed payout", target: "$1,250 to Jollof Kitchen", time: "2h ago", type: "payout" },
]

export type KpiCard = {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  tone: "primary" | "chart2" | "chart5" | "destructive"
}

export const kpiCards: KpiCard[] = [
  { label: "Total Vendors", value: "1,247", change: "+12%", trend: "up", icon: Store, tone: "primary" },
  { label: "Total Customers", value: "8,932", change: "+18%", trend: "up", icon: Users, tone: "chart2" },
  { label: "Total Appointments", value: "3,456", change: "+8%", trend: "up", icon: Calendar, tone: "chart5" },
  { label: "Pending custom requests", value: "23", change: "-5%", trend: "down", icon: FileText, tone: "destructive" },
  { label: "Total Revenue", value: "$348,500", change: "+15%", trend: "up", icon: DollarSign, tone: "primary" },
  { label: "Total Payouts", value: "$264,200", change: "+10%", trend: "up", icon: Wallet, tone: "chart2" },
]

export const chartColors = {
  primary: "var(--color-primary-100)",
  chart2: "var(--color-chart-2)",
  chart5: "var(--color-chart-5)",
  border: "var(--color-border)",
  muted: "var(--color-accent-70)",
  bg: "var(--color-background)",
}
