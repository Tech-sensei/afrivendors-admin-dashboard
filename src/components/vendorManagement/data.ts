export type VendorStatus = "Active" | "Pending" | "Suspended"

export interface VendorDocument {
  name: string
  status: "Approved" | "Under Review"
  uploadedDate: string
}

export interface VendorService {
  id: string
  name: string
  price: number
  duration: number
  status: "Active" | "Draft"
}

export interface Vendor {
  id: string
  name: string
  category: string
  country: string
  email: string
  phone: string
  status: VendorStatus
  verified: boolean
  bookingsCompleted: number
  rating: number
  owner: string
  address: string
  website: string
  openingHours: string
  description: string
  joinedDate: string
  completionRate: number
  totalRevenue: number
  documents: VendorDocument[]
  kycStatus: "Verified" | "Pending"
  services: VendorService[]
  /** From vendor profile when available (list API). */
  currency?: string | null
}

export const mockVendors: Vendor[] = [
  {
    id: "V-2024",
    name: "Ubuntu Beauty Lounge",
    category: "Beauty & Hair",
    country: "Nigeria",
    email: "info@ubuntubeauty.ng",
    phone: "+234 803 456 7890",
    status: "Active",
    verified: true,
    bookingsCompleted: 342,
    rating: 4.8,
    owner: "Amara Johnson",
    address: "45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    website: "www.ubuntubeauty.ng",
    openingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: Closed",
    description: "Premium beauty salon offering African hair braiding and natural hair care.",
    joinedDate: "2024-03-15",
    completionRate: 98,
    totalRevenue: 28450,
    documents: [
      { name: "Business License", status: "Approved", uploadedDate: "2024-03-15" },
      { name: "Tax ID Certificate", status: "Approved", uploadedDate: "2024-03-15" },
      { name: "Owner ID", status: "Approved", uploadedDate: "2024-03-15" },
    ],
    kycStatus: "Verified",
    services: [
      { id: "S1", name: "Box Braids", price: 120, duration: 240, status: "Active" },
      { id: "S2", name: "Cornrows", price: 80, duration: 150, status: "Active" },
    ],
  },
  {
    id: "V-2023",
    name: "Serengeti Cafe",
    category: "Food & Beverage",
    country: "Kenya",
    email: "hello@serengeticafe.co.ke",
    phone: "+254 712 345 678",
    status: "Active",
    verified: true,
    bookingsCompleted: 589,
    rating: 4.9,
    owner: "David Kimani",
    address: "12 Riverside Drive, Westlands, Nairobi, Kenya",
    website: "www.serengeticafe.co.ke",
    openingHours: "Mon-Sun: 8:00 AM - 10:00 PM",
    description: "Authentic East African cuisine using fresh local ingredients.",
    joinedDate: "2024-01-20",
    completionRate: 99,
    totalRevenue: 45800,
    documents: [
      { name: "Business License", status: "Approved", uploadedDate: "2024-01-20" },
      { name: "Health Permit", status: "Approved", uploadedDate: "2024-01-20" },
      { name: "Owner ID", status: "Approved", uploadedDate: "2024-01-20" },
    ],
    kycStatus: "Verified",
    services: [{ id: "S5", name: "Nyama Choma Platter", price: 45, duration: 60, status: "Active" }],
  },
  {
    id: "V-2025",
    name: "Kente Fashion Studio",
    category: "Fashion & Design",
    country: "Ghana",
    email: "contact@kentefashion.gh",
    phone: "+233 24 567 8901",
    status: "Pending",
    verified: false,
    bookingsCompleted: 0,
    rating: 0,
    owner: "Kwame Mensah",
    address: "78 Oxford Street, Osu, Accra, Ghana",
    website: "www.kentefashion.com",
    openingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    description: "Bespoke fashion studio blending Ghanaian heritage and modern design.",
    joinedDate: "2025-11-26",
    completionRate: 0,
    totalRevenue: 0,
    documents: [
      { name: "Business License", status: "Under Review", uploadedDate: "2025-11-26" },
      { name: "Tax ID Certificate", status: "Under Review", uploadedDate: "2025-11-26" },
      { name: "Owner ID", status: "Under Review", uploadedDate: "2025-11-26" },
    ],
    kycStatus: "Pending",
    services: [{ id: "S8", name: "Custom Kente Dress", price: 250, duration: 0, status: "Draft" }],
  },
  {
    id: "V-2022",
    name: "Zanzibar Spa Retreat",
    category: "Wellness & Spa",
    country: "Tanzania",
    email: "info@zanzibarspa.tz",
    phone: "+255 777 123 456",
    status: "Active",
    verified: true,
    bookingsCompleted: 456,
    rating: 4.7,
    owner: "Fatima Hassan",
    address: "Stone Town, Zanzibar, Tanzania",
    website: "www.zanzibarspa.com",
    openingHours: "Mon-Sun: 9:00 AM - 8:00 PM",
    description: "Spa services inspired by African wellness rituals and natural ingredients.",
    joinedDate: "2024-02-10",
    completionRate: 96,
    totalRevenue: 32600,
    documents: [
      { name: "Business License", status: "Approved", uploadedDate: "2024-02-10" },
      { name: "Health Permit", status: "Approved", uploadedDate: "2024-02-10" },
      { name: "Owner ID", status: "Approved", uploadedDate: "2024-02-10" },
    ],
    kycStatus: "Verified",
    services: [{ id: "S10", name: "Traditional Massage", price: 85, duration: 90, status: "Active" }],
  },
  {
    id: "V-2026",
    name: "Marrakech Events Co",
    category: "Events & Planning",
    country: "Morocco",
    email: "contact@marrakechevents.ma",
    phone: "+212 6 12 34 56 78",
    status: "Suspended",
    verified: true,
    bookingsCompleted: 124,
    rating: 4.2,
    owner: "Youssef Alami",
    address: "Gueliz, Marrakech, Morocco",
    website: "www.marrakechevents.ma",
    openingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    description: "Event planning company for weddings, corporate and cultural events.",
    joinedDate: "2024-05-12",
    completionRate: 88,
    totalRevenue: 18200,
    documents: [
      { name: "Business License", status: "Approved", uploadedDate: "2024-05-12" },
      { name: "Tax ID Certificate", status: "Approved", uploadedDate: "2024-05-12" },
      { name: "Owner ID", status: "Approved", uploadedDate: "2024-05-12" },
    ],
    kycStatus: "Verified",
    services: [{ id: "S12", name: "Wedding Planning", price: 1200, duration: 0, status: "Active" }],
  },
  {
    id: "V-2027",
    name: "Accra Auto Services",
    category: "Automotive",
    country: "Ghana",
    email: "info@accraautocenter.gh",
    phone: "+233 30 456 7890",
    status: "Active",
    verified: true,
    bookingsCompleted: 267,
    rating: 4.6,
    owner: "Kofi Asante",
    address: "34 Independence Avenue, Accra, Ghana",
    website: "www.accraautocenter.gh",
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    description: "Automotive repair and maintenance services with certified technicians.",
    joinedDate: "2024-04-18",
    completionRate: 94,
    totalRevenue: 21300,
    documents: [
      { name: "Business License", status: "Approved", uploadedDate: "2024-04-18" },
      { name: "Tax ID Certificate", status: "Approved", uploadedDate: "2024-04-18" },
      { name: "Owner ID", status: "Approved", uploadedDate: "2024-04-18" },
    ],
    kycStatus: "Verified",
    services: [{ id: "S14", name: "Oil Change", price: 45, duration: 60, status: "Active" }],
  },
  {
    id: "V-2031",
    name: "Addis Tech Repairs",
    category: "Technology",
    country: "Ethiopia",
    email: "support@addistech.et",
    phone: "+251 11 234 5678",
    status: "Pending",
    verified: false,
    bookingsCompleted: 0,
    rating: 0,
    owner: "Samuel Tadesse",
    address: "Bole Road, Addis Ababa, Ethiopia",
    website: "www.addistechrepairs.et",
    openingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    description: "Laptop and mobile repair center with fast turnaround.",
    joinedDate: "2025-11-25",
    completionRate: 0,
    totalRevenue: 0,
    documents: [
      { name: "Business License", status: "Under Review", uploadedDate: "2025-11-25" },
      { name: "Tax ID Certificate", status: "Under Review", uploadedDate: "2025-11-25" },
      { name: "Owner ID", status: "Under Review", uploadedDate: "2025-11-25" },
    ],
    kycStatus: "Pending",
    services: [{ id: "S22", name: "Laptop Repair", price: 80, duration: 120, status: "Draft" }],
  },
  {
    id: "V-2032",
    name: "Dakar Music Academy",
    category: "Education",
    country: "Senegal",
    email: "info@dakarmusicacademy.sn",
    phone: "+221 33 456 7890",
    status: "Active",
    verified: true,
    bookingsCompleted: 156,
    rating: 4.9,
    owner: "Mamadou Diop",
    address: "Plateau, Dakar, Senegal",
    website: "www.dakarmusicacademy.sn",
    openingHours: "Mon-Fri: 2:00 PM - 8:00 PM",
    description: "Music school focused on African instruments and modern training.",
    joinedDate: "2024-03-22",
    completionRate: 98,
    totalRevenue: 15600,
    documents: [
      { name: "Business License", status: "Approved", uploadedDate: "2024-03-22" },
      { name: "Tax ID Certificate", status: "Approved", uploadedDate: "2024-03-22" },
      { name: "Owner ID", status: "Approved", uploadedDate: "2024-03-22" },
    ],
    kycStatus: "Verified",
    services: [{ id: "S24", name: "Drum Lessons", price: 50, duration: 60, status: "Active" }],
  },
]
