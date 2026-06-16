/** GET /categories and GET /categories/:id */
export type AdminCategoryApi = {
  id: number
  name: string
  iconName: string | null
  vendorCount?: number
}

/** POST /categories and PATCH /categories/:id */
export type AdminCategoryPayload = {
  name: string
  iconName: string
}
