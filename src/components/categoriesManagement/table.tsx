"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Edit2, Eye, Tag } from "lucide-react"
import { useMemo } from "react"
import { AdminDataTable } from "@/components/adminShared/AdminDataTable"
import { AdminTableEmpty } from "@/components/adminShared/AdminTableEmpty"
import { getCategoryIconComponent } from "@/lib/categoryIcons"
import type { CategoryItem } from "./data"

export function CategoriesTable({
  categories,
  isLoading,
  onView,
  onEdit,
}: {
  categories: CategoryItem[]
  isLoading?: boolean
  onView: (category: CategoryItem) => void
  onEdit: (category: CategoryItem) => void
}) {
  const columns = useMemo<ColumnDef<CategoryItem, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => (
          <div>
            <p className="font-unageo text-sm font-semibold text-secondary-000">{row.original.name}</p>
            <p className="mt-0.5 font-unageo text-xs text-accent-70">ID: {row.original.id}</p>
          </div>
        ),
      },
      {
        id: "icon",
        header: "Icon",
        enableSorting: false,
        cell: ({ row }) => {
          const Icon = getCategoryIconComponent(row.original.iconName)
          return (
            <div className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100/10 text-primary-100">
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-unageo text-sm text-accent-70">{row.original.iconName ?? "—"}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "vendorCount",
        header: "Vendors",
        cell: ({ getValue }) => (
          <span className="font-unageo text-sm text-secondary-000">{String(getValue() ?? 0)}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onView(row.original)
              }}
              className="rounded-md border border-border px-2.5 py-1.5 text-secondary-000"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onEdit(row.original)
              }}
              className="rounded-md border border-border px-2.5 py-1.5 text-secondary-000"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onView],
  )

  return (
    <AdminDataTable
      data={categories}
      columns={columns}
      isLoading={isLoading}
      resourceLabel="categories"
      minWidth="720px"
      getRowId={(row) => String(row.id)}
      onRowClick={onView}
      emptyState={
        <AdminTableEmpty
          icon={Tag}
          title="No categories found"
          description="Try adjusting your search or add a new category"
        />
      }
    />
  )
}
