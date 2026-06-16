/** GET /admin/commission/default */
export type AdminCommissionDefaultApi = {
  percent: number
}

/** PATCH /admin/commission/default */
export type AdminCommissionDefaultPayload = {
  percent: number
}

/** GET /admin/commission/categories item */
export type AdminCategoryCommissionApi = {
  mainCategoryId: number | string
  name?: string
  useDefault: boolean
  percent?: number | null
  customPercent?: number | null
  effectivePercent?: number
}

/** PUT /admin/commission/categories/{mainCategoryId} */
export type AdminCategoryCommissionPayload = {
  useDefault: boolean
  percent?: number
}

export type CategoryCommissionRow = {
  categoryId: number | string
  name: string
  rate: number
  usesDefault: boolean
  customPercent?: number | null
}
