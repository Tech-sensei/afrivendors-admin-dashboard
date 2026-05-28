"use client"

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import type { CategoryItem } from "./data"
import { initialCategories } from "./data"
import { CategoryDetailsDrawer, CategoryFormDrawer, DeactivateCategoryModal } from "./drawers"
import { CategoryStats } from "./stats"
import { CategoriesTable } from "./table"

const ITEMS_PER_PAGE = 10

export function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [categories, setCategories] = useState(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
  const [editCategoryDrawerOpen, setEditCategoryDrawerOpen] = useState(false)
  const [deactivateCategoryModalOpen, setDeactivateCategoryModalOpen] = useState(false)
  const [categoryToToggle, setCategoryToToggle] = useState<CategoryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.status === "Active").length
  const inactiveCategories = categories.filter((c) => c.status === "Inactive").length
  const totalVendors = categories.reduce((sum, c) => sum + c.vendorCount, 0)
  const vendorServicesCount = categories.reduce((sum, c) => sum + c.serviceCount, 0)

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        category.name.toLowerCase().includes(q) || category.description.toLowerCase().includes(q)
      const matchesStatus = filterStatus === "all" || category.status.toLowerCase() === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [categories, searchQuery, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length)
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  const handleSaveCategory = (data: { name: string; description: string }) => {
    const today = new Date().toISOString().split("T")[0]
    if (editCategoryDrawerOpen && selectedCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCategory.id ? { ...c, ...data, lastUpdated: today } : c)),
      )
      toast.success(`Category "${data.name}" updated successfully`)
      setEditCategoryDrawerOpen(false)
    } else {
      const newCategory: CategoryItem = {
        id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
        ...data,
        serviceCount: 0,
        vendorCount: 0,
        status: "Active",
        createdDate: today,
        lastUpdated: today,
      }
      setCategories((prev) => [newCategory, ...prev])
      toast.success(`Category "${data.name}" created successfully`)
      setAddCategoryDrawerOpen(false)
    }
    setSelectedCategory(null)
  }

  const handleOpenToggleConfirmation = (category: CategoryItem) => {
    setCategoryToToggle(category)
    if (category.status === "Active") setDeactivateCategoryModalOpen(true)
    else handleConfirmToggleCategory(category)
  }

  const handleConfirmToggleCategory = (target?: CategoryItem) => {
    const category = target ?? categoryToToggle
    if (!category) return
    const newStatus = category.status === "Active" ? "Inactive" : "Active"
    const today = new Date().toISOString().split("T")[0]
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, status: newStatus, lastUpdated: today } : c)),
    )
    toast.success(`Category "${category.name}" ${newStatus === "Active" ? "activated" : "deactivated"} successfully`)
    setDeactivateCategoryModalOpen(false)
    setCategoryToToggle(null)
  }

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
        activeCategories={activeCategories}
        inactiveCategories={inactiveCategories}
        totalVendors={totalVendors}
        vendorServicesCount={vendorServicesCount}
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
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-lg border border-border bg-white px-3 py-3 font-unageo text-sm text-secondary-000 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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

      <CategoriesTable
        categories={paginatedCategories}
        onView={(category) => {
          setSelectedCategory(category)
          setCategoryDrawerOpen(true)
        }}
        onEdit={(category) => {
          setSelectedCategory(category)
          setCategoryDrawerOpen(false)
          setEditCategoryDrawerOpen(true)
        }}
        onToggleStatus={handleOpenToggleConfirmation}
      />

      {totalPages > 1 ? (
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-unageo text-sm text-accent-70">
            Showing {filteredCategories.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredCategories.length}{" "}
            categories
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

      {categoryDrawerOpen && selectedCategory ? (
        <CategoryDetailsDrawer
          category={selectedCategory}
          onClose={() => {
            setCategoryDrawerOpen(false)
            setSelectedCategory(null)
          }}
          onEdit={(category) => {
            setSelectedCategory(category)
            setCategoryDrawerOpen(false)
            setEditCategoryDrawerOpen(true)
          }}
          onToggleStatus={handleOpenToggleConfirmation}
        />
      ) : null}

      {(addCategoryDrawerOpen || editCategoryDrawerOpen) ? (
        <CategoryFormDrawer
          category={editCategoryDrawerOpen ? selectedCategory : null}
          onClose={() => {
            setAddCategoryDrawerOpen(false)
            setEditCategoryDrawerOpen(false)
            setSelectedCategory(null)
          }}
          onSave={handleSaveCategory}
          isEdit={editCategoryDrawerOpen}
        />
      ) : null}

      {deactivateCategoryModalOpen && categoryToToggle ? (
        <DeactivateCategoryModal
          category={categoryToToggle}
          onClose={() => {
            setDeactivateCategoryModalOpen(false)
            setCategoryToToggle(null)
          }}
          onConfirm={() => handleConfirmToggleCategory()}
        />
      ) : null}
    </div>
  )
}
