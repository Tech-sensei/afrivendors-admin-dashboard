/** GET /admin/reviews & GET /admin/reviews/breakdown
 *  List query: page, limit, customerName?, vendorName?, rating?
 */

export type AdminReviewPersonApi = {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type AdminReviewApiItem = {
  id: number
  rating: number
  comment: string
  isHidden: boolean
  isFlagged: boolean
  createdAt: string
  updatedAt: string
  vendor: AdminReviewPersonApi
  customer: AdminReviewPersonApi
}

export type AdminReviewsListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminReviewsListResponse = {
  data: AdminReviewApiItem[]
  meta: AdminReviewsListMeta
}

export type AdminReviewsBreakdown = {
  totalReviews: number
  hiddenReviews: number
  flaggedReviews: number
}

export type AdminReviewRatingParam = 1 | 2 | 3 | 4 | 5
