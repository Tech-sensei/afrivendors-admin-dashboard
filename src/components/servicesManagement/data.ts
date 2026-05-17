export type Status = "Active" | "Inactive"

export interface CategoryItem {
  id: string
  name: string
  description: string
  serviceCount: number
  vendorCount: number
  status: Status
  createdDate: string
  lastUpdated: string
}

export interface ServiceItem {
  id: string
  name: string
  categoryId: string
  categoryName: string
  description: string
  basePrice: number
  duration: number
  vendorCount: number
  bookingCount: number
  status: Status
  createdDate: string
  lastUpdated: string
}

export interface VendorAssignment {
  id: string
  name: string
  owner: string
  rating: number
  categoryIds: string[]
}

export const initialCategories: CategoryItem[] = [
  { id: "CAT-001", name: "Hair Styling", description: "Professional hair styling, braiding, weaving, and hair care services", serviceCount: 12, vendorCount: 45, status: "Active", createdDate: "2024-01-15", lastUpdated: "2025-11-20" },
  { id: "CAT-002", name: "Beauty & Makeup", description: "Makeup artistry, skincare treatments, facials, and beauty consultations", serviceCount: 18, vendorCount: 38, status: "Active", createdDate: "2024-01-15", lastUpdated: "2025-11-18" },
  { id: "CAT-003", name: "Home Services", description: "Cleaning, plumbing, electrical work, and general home maintenance", serviceCount: 25, vendorCount: 67, status: "Active", createdDate: "2024-01-20", lastUpdated: "2025-11-15" },
  { id: "CAT-004", name: "Event Planning", description: "Complete event planning, coordination, decoration, and management services", serviceCount: 15, vendorCount: 29, status: "Active", createdDate: "2024-02-01", lastUpdated: "2025-11-10" },
  { id: "CAT-005", name: "Tech Services", description: "Computer repair, software development, IT support, and technical assistance", serviceCount: 20, vendorCount: 34, status: "Active", createdDate: "2024-02-10", lastUpdated: "2025-11-05" },
  { id: "CAT-006", name: "Fitness & Wellness", description: "Personal training, yoga, massage therapy, and wellness coaching", serviceCount: 14, vendorCount: 28, status: "Active", createdDate: "2024-02-15", lastUpdated: "2025-10-30" },
  { id: "CAT-007", name: "Photography", description: "Professional photography and videography for events, portraits, and commercial work", serviceCount: 10, vendorCount: 22, status: "Active", createdDate: "2024-03-01", lastUpdated: "2025-10-25" },
  { id: "CAT-008", name: "Catering", description: "Food catering, meal prep, private chef services, and culinary experiences", serviceCount: 16, vendorCount: 41, status: "Active", createdDate: "2024-03-10", lastUpdated: "2025-10-20" },
  { id: "CAT-009", name: "Transportation", description: "Ride services, car rentals, logistics, and delivery services", serviceCount: 8, vendorCount: 19, status: "Inactive", createdDate: "2024-03-20", lastUpdated: "2025-09-15" },
]

export const initialServices: ServiceItem[] = [
  { id: "SRV-001", name: "Box Braids", categoryId: "CAT-001", categoryName: "Hair Styling", description: "Traditional box braids in various sizes and lengths", basePrice: 150, duration: 240, vendorCount: 32, bookingCount: 245, status: "Active", createdDate: "2024-01-20", lastUpdated: "2025-11-20" },
  { id: "SRV-002", name: "Cornrows", categoryId: "CAT-001", categoryName: "Hair Styling", description: "Intricate cornrow patterns and styles", basePrice: 80, duration: 180, vendorCount: 28, bookingCount: 198, status: "Active", createdDate: "2024-01-20", lastUpdated: "2025-11-18" },
  { id: "SRV-003", name: "Hair Weaving", categoryId: "CAT-001", categoryName: "Hair Styling", description: "Professional weave installation with various hair types", basePrice: 200, duration: 300, vendorCount: 25, bookingCount: 167, status: "Active", createdDate: "2024-01-20", lastUpdated: "2025-11-15" },
  { id: "SRV-004", name: "Bridal Makeup", categoryId: "CAT-002", categoryName: "Beauty & Makeup", description: "Complete bridal makeup package including trial session", basePrice: 250, duration: 180, vendorCount: 29, bookingCount: 156, status: "Active", createdDate: "2024-01-25", lastUpdated: "2025-11-10" },
  { id: "SRV-005", name: "Facial Treatment", categoryId: "CAT-002", categoryName: "Beauty & Makeup", description: "Deep cleansing facial with skincare consultation", basePrice: 120, duration: 90, vendorCount: 22, bookingCount: 289, status: "Active", createdDate: "2024-01-25", lastUpdated: "2025-11-05" },
  { id: "SRV-006", name: "Home Cleaning - Deep Clean", categoryId: "CAT-003", categoryName: "Home Services", description: "Comprehensive deep cleaning of entire home", basePrice: 180, duration: 240, vendorCount: 45, bookingCount: 512, status: "Active", createdDate: "2024-02-01", lastUpdated: "2025-11-01" },
  { id: "SRV-007", name: "Plumbing Repair", categoryId: "CAT-003", categoryName: "Home Services", description: "General plumbing repairs and installations", basePrice: 100, duration: 120, vendorCount: 38, bookingCount: 334, status: "Active", createdDate: "2024-02-01", lastUpdated: "2025-10-28" },
  { id: "SRV-008", name: "Wedding Planning - Full Service", categoryId: "CAT-004", categoryName: "Event Planning", description: "Complete wedding planning from start to finish", basePrice: 2500, duration: 480, vendorCount: 18, bookingCount: 89, status: "Active", createdDate: "2024-02-05", lastUpdated: "2025-10-25" },
  { id: "SRV-009", name: "Birthday Party Planning", categoryId: "CAT-004", categoryName: "Event Planning", description: "Birthday event planning and coordination", basePrice: 800, duration: 240, vendorCount: 24, bookingCount: 176, status: "Active", createdDate: "2024-02-05", lastUpdated: "2025-10-20" },
  { id: "SRV-010", name: "Website Development", categoryId: "CAT-005", categoryName: "Tech Services", description: "Custom website design and development", basePrice: 1500, duration: 720, vendorCount: 21, bookingCount: 98, status: "Active", createdDate: "2024-02-10", lastUpdated: "2025-10-15" },
  { id: "SRV-011", name: "Computer Repair", categoryId: "CAT-005", categoryName: "Tech Services", description: "Hardware and software troubleshooting and repair", basePrice: 80, duration: 90, vendorCount: 27, bookingCount: 267, status: "Active", createdDate: "2024-02-10", lastUpdated: "2025-10-10" },
  { id: "SRV-012", name: "Personal Training Session", categoryId: "CAT-006", categoryName: "Fitness & Wellness", description: "One-on-one personal training session", basePrice: 60, duration: 60, vendorCount: 26, bookingCount: 445, status: "Active", createdDate: "2024-02-15", lastUpdated: "2025-10-05" },
  { id: "SRV-013", name: "Massage Therapy", categoryId: "CAT-006", categoryName: "Fitness & Wellness", description: "Professional therapeutic massage session", basePrice: 100, duration: 90, vendorCount: 19, bookingCount: 312, status: "Active", createdDate: "2024-02-15", lastUpdated: "2025-09-30" },
  { id: "SRV-014", name: "Event Photography", categoryId: "CAT-007", categoryName: "Photography", description: "Professional event photography coverage", basePrice: 500, duration: 360, vendorCount: 20, bookingCount: 178, status: "Active", createdDate: "2024-03-01", lastUpdated: "2025-09-25" },
  { id: "SRV-015", name: "Portrait Session", categoryId: "CAT-007", categoryName: "Photography", description: "Studio or outdoor portrait photography session", basePrice: 150, duration: 120, vendorCount: 18, bookingCount: 234, status: "Active", createdDate: "2024-03-01", lastUpdated: "2025-09-20" },
  { id: "SRV-016", name: "Wedding Catering", categoryId: "CAT-008", categoryName: "Catering", description: "Full-service wedding catering for all guest counts", basePrice: 3000, duration: 480, vendorCount: 15, bookingCount: 67, status: "Active", createdDate: "2024-03-10", lastUpdated: "2025-09-15" },
  { id: "SRV-017", name: "Private Chef Service", categoryId: "CAT-008", categoryName: "Catering", description: "Personal chef for intimate dinners and events", basePrice: 400, duration: 240, vendorCount: 12, bookingCount: 89, status: "Active", createdDate: "2024-03-10", lastUpdated: "2025-09-10" },
  { id: "SRV-018", name: "Airport Transfer", categoryId: "CAT-009", categoryName: "Transportation", description: "Reliable airport pickup and drop-off service", basePrice: 50, duration: 60, vendorCount: 14, bookingCount: 201, status: "Inactive", createdDate: "2024-03-20", lastUpdated: "2025-09-05" },
]

export const mockVendors: VendorAssignment[] = [
  { id: "V-2024", name: "Ubuntu Beauty Lounge", owner: "Amara Johnson", rating: 4.8, categoryIds: ["CAT-001", "CAT-002"] },
  { id: "V-2031", name: "Afro Styles Studio", owner: "Zainab Musa", rating: 4.9, categoryIds: ["CAT-001"] },
  { id: "V-2045", name: "Sparkle Clean Services", owner: "Tunde Adebayo", rating: 4.6, categoryIds: ["CAT-003"] },
  { id: "V-2051", name: "FitLife Studios", owner: "Mary Wambui", rating: 4.7, categoryIds: ["CAT-006"] },
  { id: "V-2029", name: "Tech Fix Kenya", owner: "Peter Wanjiru", rating: 4.7, categoryIds: ["CAT-005"] },
  { id: "V-2037", name: "Luxe Events Co", owner: "Grace Okafor", rating: 4.9, categoryIds: ["CAT-004"] },
  { id: "V-2042", name: "Flash Photography", owner: "David Mensah", rating: 4.8, categoryIds: ["CAT-007"] },
  { id: "V-2058", name: "Taste of Africa Catering", owner: "Fatima Hassan", rating: 4.9, categoryIds: ["CAT-008"] },
]
