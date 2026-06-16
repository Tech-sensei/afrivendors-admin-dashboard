"use client"

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import type { CategoryItem } from "./data"
import { CategoryDetailsDrawer, CategoryFormDrawer } from "./drawers"
import { CategoryStats } from "./stats"
import { CategoriesTable } from "./table"
import {
  useAdminCategoriesList,
  useAdminCategoryDetail,
  useAdminCreateCategory,
  useAdminUpdateCategory,
} from "@/services/useAdminCategories"

const ITEMS_PER_PAGE = 10

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string; responseMessage?: string } } }).response?.data
    return res?.responseMessage || res?.message || fallback
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
  const [editCategoryDrawerOpen, setEditCategoryDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: categories = [], isLoading, isError, error } = useAdminCategoriesList()
  const { data: categoryDetail, isLoading: detailLoading } = useAdminCategoryDetail(
    selectedCategoryId,
    categoryDrawerOpen && selectedCategoryId != null,
  )
  const createCategory = useAdminCreateCategory()
  const updateCategory = useAdminUpdateCategory()

  const totalCategories = categories.length
  const totalVendors = categories.reduce((sum, c) => sum + c.vendorCount, 0)
  const categoriesWithIcons = categories.filter((c) => c.iconName).length

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return categories
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(q) ||
        String(category.id).includes(q) ||
        (category.iconName ?? "").toLowerCase().includes(q),
    )
  }, [categories, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length)
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  const selectedCategory =
    editCategoryDrawerOpen
      ? categories.find((c) => c.id === selectedCategoryId) ?? null
      : categoryDetail ?? categories.find((c) => c.id === selectedCategoryId) ?? null

  const handleSaveCategory = async (data: { name: string; iconName: string }) => {
    try {
      if (editCategoryDrawerOpen && selectedCategoryId != null) {
        await updateCategory.mutateAsync({ id: selectedCategoryId, payload: data })
        toast.success(`Category "${data.name}" updated successfully`)
        setEditCategoryDrawerOpen(false)
      } else {
        await createCategory.mutateAsync(data)
        toast.success(`Category "${data.name}" created successfully`)
        setAddCategoryDrawerOpen(false)
      }
      setSelectedCategoryId(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save category"))
    }
  }

  const isSaving = createCategory.isPending || updateCategory.isPending

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Category Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">
          Manage platform categories. Vendors create and manage their own services within these categories.
        </p>
      </header>

      <CategoryStats
        totalCategories={totalCategories}
        totalVendors={totalVendors}
        categoriesWithIcons={categoriesWithIcons}
      />

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100"
            />
          </div>
          <button
            type="button"
            onClick={() => setAddCategoryDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-3 font-unageo text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </section>

      {isError ? (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="font-unageo text-sm text-destructive">
            {getApiErrorMessage(error, "Failed to load categories")}
          </p>
        </section>
      ) : null}

      <CategoriesTable
        categories={paginatedCategories}
        isLoading={isLoading}
        onView={(category) => {
          setSelectedCategoryId(category.id)
          setCategoryDrawerOpen(true)
        }}
        onEdit={(category) => {
          setSelectedCategoryId(category.id)
          setCategoryDrawerOpen(false)
          setEditCategoryDrawerOpen(true)
        }}
      />

      {filteredCategories.length > 0 && totalPages > 1 ? (
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-unageo text-sm text-accent-70">
            Showing {startIndex + 1} to {endIndex} of {filteredCategories.length} categories
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-unageo text-sm text-secondary-000 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-unageo text-sm text-secondary-000 disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {categoryDrawerOpen && selectedCategoryId != null ? (
        <CategoryDetailsDrawer
          category={categoryDetail ?? categories.find((c) => c.id === selectedCategoryId) ?? null}
          isLoading={detailLoading && !categoryDetail}
          onClose={() => {
            setCategoryDrawerOpen(false)
            setSelectedCategoryId(null)
          }}
          onEdit={(category) => {
            setSelectedCategoryId(category.id)
            setCategoryDrawerOpen(false)
            setEditCategoryDrawerOpen(true)
          }}
        />
      ) : null}

      {(addCategoryDrawerOpen || editCategoryDrawerOpen) ? (
        <CategoryFormDrawer
          category={editCategoryDrawerOpen ? selectedCategory : null}
          isSaving={isSaving}
          onClose={() => {
            setAddCategoryDrawerOpen(false)
            setEditCategoryDrawerOpen(false)
            setSelectedCategoryId(null)
          }}
          onSave={handleSaveCategory}
          isEdit={editCategoryDrawerOpen}
        />
      ) : null}
    </div>
  )
}
