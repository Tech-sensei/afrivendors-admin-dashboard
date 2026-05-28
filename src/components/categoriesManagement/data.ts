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
