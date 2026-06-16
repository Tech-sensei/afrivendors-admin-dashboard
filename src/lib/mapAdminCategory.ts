import type { CategoryItem } from "@/components/categoriesManagement/data"
import type { AdminCategoryApi } from "@/types/categories"

export function mapAdminCategoryApiToItem(api: AdminCategoryApi): CategoryItem {
  return {
    id: api.id,
    name: api.name,
    iconName: api.iconName,
    vendorCount: api.vendorCount ?? 0,
  }
}
