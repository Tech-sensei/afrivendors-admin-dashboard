"use client"

import { Edit2, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import type { CategoryCommissionRow } from "@/types/commission"
import { CategoryCommissionModal } from "./category-commission-modal"

const MAX_PERCENT = 100

export function CommissionSettings({
  globalRate,
  rows,
  isLoading,
  isError,
  onSaveGlobalRate,
  onSaveCategoryRate,
  isSavingGlobal,
  isSavingCategory,
}: {
  globalRate: number
  rows: CategoryCommissionRow[]
  isLoading: boolean
  isError: boolean
  onSaveGlobalRate: (rate: number) => Promise<number>
  onSaveCategoryRate: (input: {
    categoryId: number | string
    useDefault: boolean
    percent?: number
  }) => Promise<unknown>
  isSavingGlobal: boolean
  isSavingCategory: boolean
}) {
  const [draftGlobalRate, setDraftGlobalRate] = useState(globalRate)
  const [editingCategory, setEditingCategory] = useState<CategoryCommissionRow | null>(null)

  useEffect(() => {
    setDraftGlobalRate(globalRate)
  }, [globalRate])

  const sliderFill = (value: number) =>
    `linear-gradient(to right, var(--color-primary-100) 0%, var(--color-primary-100) ${value}%, rgb(229 231 235) ${value}%, rgb(229 231 235) 100%)`

  const handleSaveGlobal = async () => {
    await onSaveGlobalRate(draftGlobalRate)
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary-100" />
        <p className="mt-2 font-unageo text-sm text-accent-70">Loading commission settings...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="font-unageo text-sm text-destructive">Unable to load commission settings.</p>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-unbounded text-lg font-semibold text-secondary-000">Global Commission Rate</h3>
            <p className="mt-1 font-unageo text-sm text-accent-70">Default commission applied to all categories</p>
          </div>
          <span className="font-unbounded text-2xl font-semibold text-secondary-000">{draftGlobalRate}%</span>
        </div>

        <div className="mt-6">
          <input
            type="range"
            min={0}
            max={MAX_PERCENT}
            step={1}
            value={draftGlobalRate}
            onChange={(e) => setDraftGlobalRate(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-accent-40 accent-primary-100 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-100"
            style={{
              background: sliderFill((draftGlobalRate / MAX_PERCENT) * 100),
            }}
          />
          <div className="mt-1 flex justify-between font-unageo text-xs text-accent-70">
            <span>0%</span>
            <span>{MAX_PERCENT}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSaveGlobal()}
          disabled={isSavingGlobal || draftGlobalRate === globalRate}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-100 px-5 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSavingGlobal ? "Saving..." : "Save Global Rate"}
        </button>
      </section>

      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="font-unbounded text-lg font-semibold text-secondary-000">Category-Specific Commission Rates</h3>

        {rows.length === 0 ? (
          <p className="mt-4 font-unageo text-sm text-accent-70">No categories available yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {rows.map((row) => (
              <li
                key={String(row.categoryId)}
                className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-unageo text-sm font-semibold text-secondary-000">{row.name}</p>
                  <p className="font-unageo text-xs text-accent-70">
                    {row.usesDefault ? "Using default rate" : "Custom rate"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-unbounded text-lg font-semibold text-primary-100">{row.rate}%</span>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(row)}
                    disabled={isSavingCategory}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-unageo text-xs font-semibold text-secondary-000 hover:bg-secondary-800 disabled:opacity-50"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingCategory ? (
        <CategoryCommissionModal
          category={editingCategory}
          defaultRate={globalRate}
          saving={isSavingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={async (rate, useDefault) => {
            await onSaveCategoryRate({
              categoryId: editingCategory.categoryId,
              useDefault,
              percent: useDefault ? undefined : rate,
            })
            setEditingCategory(null)
          }}
        />
      ) : null}
    </div>
  )
}
