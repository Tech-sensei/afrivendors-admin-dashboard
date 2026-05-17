"use client"

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import type { CategoryItem, ServiceItem } from "./data"
import { initialCategories, initialServices, mockVendors } from "./data"
import {
  AssignVendorsDrawer,
  CategoryDetailsDrawer,
  CategoryFormDrawer,
  DeactivateCategoryModal,
  DeleteConfirmationModal,
  ServiceDetailsDrawer,
  ServiceFormDrawer,
} from "./drawers"
import { ServicesStats } from "./stats"
import { CategoriesTable, ServicesTable } from "./tables"

const ITEMS_PER_PAGE = 10

export function ServicesManagement() {
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [services, setServices] = useState(initialServices)
  const [categories, setCategories] = useState(initialCategories)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
  const [serviceDrawerOpen, setServiceDrawerOpen] = useState(false)
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [addServiceDrawerOpen, setAddServiceDrawerOpen] = useState(false)
  const [editServiceDrawerOpen, setEditServiceDrawerOpen] = useState(false)
  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
  const [editCategoryDrawerOpen, setEditCategoryDrawerOpen] = useState(false)
  const [assignVendorsDrawerOpen, setAssignVendorsDrawerOpen] = useState(false)
  const [deleteServiceModalOpen, setDeleteServiceModalOpen] = useState(false)
  const [deactivateCategoryDrawerOpen, setDeactivateCategoryDrawerOpen] = useState(false)
  const [categoryToToggle, setCategoryToToggle] = useState<CategoryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalServices = services.length
  const activeServices = services.filter((s) => s.status === "Active").length
  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.status === "Active").length
  const totalVendors = categories.reduce((sum, c) => sum + c.vendorCount, 0)
  const totalBookings = services.reduce((sum, s) => sum + s.bookingCount, 0)

  const filteredData = useMemo(() => {
    if (activeTab === "services") {
      return services.filter((service) => {
        const q = searchQuery.toLowerCase()
        const matchesSearch = service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q)
        const matchesStatus = filterStatus === "all" || service.status.toLowerCase() === filterStatus
        const matchesCategory = filterCategory === "all" || service.categoryId === filterCategory
        return matchesSearch && matchesStatus && matchesCategory
      })
    }
    return categories.filter((category) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = category.name.toLowerCase().includes(q) || category.description.toLowerCase().includes(q)
      const matchesStatus = filterStatus === "all" || category.status.toLowerCase() === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [activeTab, services, categories, searchQuery, filterStatus, filterCategory])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const resetAndSwitch = (tab: "services" | "categories") => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchQuery("")
    setFilterStatus("all")
    setFilterCategory("all")
  }

  const handleSaveService = (data: { name: string; categoryId: string; description: string; basePrice: number; duration: number }) => {
    const category = categories.find((c) => c.id === data.categoryId)
    const today = new Date().toISOString().split("T")[0]
    if (editServiceDrawerOpen && selectedService) {
      setServices((prev) => prev.map((s) => (s.id === selectedService.id ? { ...s, ...data, categoryName: category?.name ?? "", lastUpdated: today } : s)))
      toast.success(`Service "${data.name}" updated successfully`)
      setEditServiceDrawerOpen(false)
    } else {
      const newService: ServiceItem = {
        id: `SRV-${String(services.length + 1).padStart(3, "0")}`,
        name: data.name,
        categoryId: data.categoryId,
        categoryName: category?.name ?? "",
        description: data.description,
        basePrice: data.basePrice,
        duration: data.duration,
        vendorCount: 0,
        bookingCount: 0,
        status: "Active",
        createdDate: today,
        lastUpdated: today,
      }
      setServices((prev) => [newService, ...prev])
      toast.success(`Service "${data.name}" created successfully`)
      setAddServiceDrawerOpen(false)
    }
    setSelectedService(null)
  }

  const handleSaveCategory = (data: { name: string; description: string }) => {
    const today = new Date().toISOString().split("T")[0]
    if (editCategoryDrawerOpen && selectedCategory) {
      setCategories((prev) => prev.map((c) => (c.id === selectedCategory.id ? { ...c, ...data, lastUpdated: today } : c)))
      toast.success(`Category "${data.name}" updated successfully`)
      setEditCategoryDrawerOpen(false)
    } else {
      const newCategory: CategoryItem = { id: `CAT-${String(categories.length + 1).padStart(3, "0")}`, ...data, serviceCount: 0, vendorCount: 0, status: "Active", createdDate: today, lastUpdated: today }
      setCategories((prev) => [newCategory, ...prev])
      toast.success(`Category "${data.name}" created successfully`)
      setAddCategoryDrawerOpen(false)
    }
    setSelectedCategory(null)
  }

  const handleOpenToggleConfirmation = (category: CategoryItem) => {
    setCategoryToToggle(category)
    if (category.status === "Active") setDeactivateCategoryDrawerOpen(true)
    else handleConfirmToggleCategory(category)
  }

  const handleConfirmToggleCategory = (target?: CategoryItem) => {
    const category = target ?? categoryToToggle
    if (!category) return
    const newStatus = category.status === "Active" ? "Inactive" : "Active"
    const today = new Date().toISOString().split("T")[0]
    setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, status: newStatus, lastUpdated: today } : c)))
    toast.success(`Category "${category.name}" ${newStatus === "Active" ? "activated" : "deactivated"} successfully`)
    setDeactivateCategoryDrawerOpen(false)
    setCategoryToToggle(null)
  }

  const confirmDeleteService = () => {
    if (!selectedService) return
    setServices((prev) => prev.filter((s) => s.id !== selectedService.id))
    setDeleteServiceModalOpen(false)
    setServiceDrawerOpen(false)
    toast.success(`Service "${selectedService.name}" deleted successfully`)
    setSelectedService(null)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Services & Categories Management</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">Manage platform services, categories, and service catalog</p>
      </header>

      <ServicesStats
        totalServices={totalServices}
        activeServices={activeServices}
        totalCategories={totalCategories}
        activeCategories={activeCategories}
        totalVendors={totalVendors}
        totalBookings={totalBookings}
      />

      <section className="mb-2 flex gap-2 border-b border-border">
        <button type="button" onClick={() => resetAndSwitch("services")} className={`border-b-2 px-5 py-3 font-unageo text-sm font-semibold ${activeTab === "services" ? "border-primary-100 text-primary-100" : "border-transparent text-accent-70"}`}>Services</button>
        <button type="button" onClick={() => resetAndSwitch("categories")} className={`border-b-2 px-5 py-3 font-unageo text-sm font-semibold ${activeTab === "categories" ? "border-primary-100 text-primary-100" : "border-transparent text-accent-70"}`}>Categories</button>
      </section>

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-70" />
            <input type="text" placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }} className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100" />
          </div>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }} className="rounded-lg border border-border bg-white px-3 py-3 font-unageo text-sm text-secondary-000 outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {activeTab === "services" ? (
            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1) }} className="rounded-lg border border-border bg-white px-3 py-3 font-unageo text-sm text-secondary-000 outline-none">
              <option value="all">All Categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          ) : null}
          <button type="button" onClick={() => (activeTab === "services" ? setAddServiceDrawerOpen(true) : setAddCategoryDrawerOpen(true))} className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-3 font-unageo text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Add {activeTab === "services" ? "Service" : "Category"}
          </button>
        </div>
      </section>

      <p className="font-unageo text-sm text-accent-70">Showing {filteredData.length} {activeTab}</p>

      {activeTab === "services" ? (
        <ServicesTable
          services={paginatedData as ServiceItem[]}
          onView={(service) => { setSelectedService(service); setServiceDrawerOpen(true) }}
          onEdit={(service) => { setSelectedService(service); setServiceDrawerOpen(false); setEditServiceDrawerOpen(true) }}
          onAssignVendors={(service) => { setSelectedService(service); setServiceDrawerOpen(false); setAssignVendorsDrawerOpen(true) }}
        />
      ) : (
        <CategoriesTable
          categories={paginatedData as CategoryItem[]}
          onView={(category) => { setSelectedCategory(category); setCategoryDrawerOpen(true) }}
          onEdit={(category) => { setSelectedCategory(category); setCategoryDrawerOpen(false); setEditCategoryDrawerOpen(true) }}
          onToggleStatus={handleOpenToggleConfirmation}
        />
      )}

      {totalPages > 1 ? (
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-unageo text-sm text-accent-70">
            Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredData.length} {activeTab}
          </p>
          <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-unageo text-sm text-secondary-000 disabled:opacity-50">
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
          <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-unageo text-sm text-secondary-000 disabled:opacity-50">
            Next <ChevronRight className="h-4 w-4" />
          </button>
          </div>
        </div>
      ) : null}

      {serviceDrawerOpen && selectedService ? (
        <ServiceDetailsDrawer
          service={selectedService}
          onClose={() => { setServiceDrawerOpen(false); setSelectedService(null) }}
          onEdit={(service) => { setSelectedService(service); setServiceDrawerOpen(false); setEditServiceDrawerOpen(true) }}
          onDelete={(service) => { setSelectedService(service); setDeleteServiceModalOpen(true) }}
          onAssignVendors={(service) => { setSelectedService(service); setServiceDrawerOpen(false); setAssignVendorsDrawerOpen(true) }}
        />
      ) : null}

      {(addServiceDrawerOpen || editServiceDrawerOpen) ? (
        <ServiceFormDrawer
          service={editServiceDrawerOpen ? selectedService : null}
          categories={categories}
          onClose={() => { setAddServiceDrawerOpen(false); setEditServiceDrawerOpen(false); setSelectedService(null) }}
          onSave={handleSaveService}
          isEdit={editServiceDrawerOpen}
        />
      ) : null}

      {assignVendorsDrawerOpen && selectedService ? (
        <AssignVendorsDrawer
          service={selectedService}
          vendors={mockVendors.filter((vendor) => vendor.categoryIds.includes(selectedService.categoryId))}
          onClose={() => { setAssignVendorsDrawerOpen(false); setSelectedService(null) }}
          onSave={(ids) => {
            toast.success(`Assigned ${ids.length} vendors to "${selectedService.name}" successfully`)
            setAssignVendorsDrawerOpen(false)
            setSelectedService(null)
          }}
        />
      ) : null}

      {categoryDrawerOpen && selectedCategory ? (
        <CategoryDetailsDrawer
          category={selectedCategory}
          onClose={() => { setCategoryDrawerOpen(false); setSelectedCategory(null) }}
          onEdit={(category) => { setSelectedCategory(category); setCategoryDrawerOpen(false); setEditCategoryDrawerOpen(true) }}
          onToggleStatus={handleOpenToggleConfirmation}
        />
      ) : null}

      {(addCategoryDrawerOpen || editCategoryDrawerOpen) ? (
        <CategoryFormDrawer
          category={editCategoryDrawerOpen ? selectedCategory : null}
          onClose={() => { setAddCategoryDrawerOpen(false); setEditCategoryDrawerOpen(false); setSelectedCategory(null) }}
          onSave={handleSaveCategory}
          isEdit={editCategoryDrawerOpen}
        />
      ) : null}

      {deactivateCategoryDrawerOpen && categoryToToggle ? (
        <DeactivateCategoryModal category={categoryToToggle} onClose={() => { setDeactivateCategoryDrawerOpen(false); setCategoryToToggle(null) }} onConfirm={() => handleConfirmToggleCategory()} />
      ) : null}

      {deleteServiceModalOpen && selectedService ? (
        <DeleteConfirmationModal
          title="Delete Service"
          message={`Are you sure you want to delete "${selectedService.name}"? This action cannot be undone.`}
          onConfirm={confirmDeleteService}
          onCancel={() => { setDeleteServiceModalOpen(false); setSelectedService(null) }}
        />
      ) : null}
    </div>
  )
}
