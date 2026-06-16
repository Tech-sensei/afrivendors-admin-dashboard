"use client"

import { useState } from "react"
import type { CategoryCommissionRow } from "@/types/commission"

const MAX_PERCENT = 100

export function CategoryCommissionModal({
  category,
  defaultRate,
  saving,
  onClose,
  onSave,
}: {
  category: CategoryCommissionRow
  defaultRate: number
  saving?: boolean
  onClose: () => void
  onSave: (rate: number, useDefault: boolean) => void | Promise<void>
}) {
  const [useDefault, setUseDefault] = useState(category.usesDefault)
  const [rate, setRate] = useState(
    category.usesDefault ? defaultRate : (category.customPercent ?? category.rate),
  )

  const sliderFill = (value: number) =>
    `linear-gradient(to right, var(--color-primary-100) 0%, var(--color-primary-100) ${value}%, rgb(229 231 235) ${value}%, rgb(229 231 235) 100%)`

  return (
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center bg-secondary-000/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-unbounded text-lg font-semibold text-secondary-000">Edit Commission</h4>
        <p className="mt-1 font-unageo text-sm text-accent-70">{category.name}</p>

        <label className="mt-5 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={useDefault}
            onChange={(e) => {
              setUseDefault(e.target.checked)
              if (e.target.checked) setRate(defaultRate)
            }}
          />
          <span className="font-unageo text-sm text-secondary-000">Use default global rate ({defaultRate}%)</span>
        </label>

        {!useDefault ? (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-unageo text-sm font-semibold text-secondary-000">Custom rate</span>
              <span className="font-unbounded text-lg font-semibold text-primary-100">{rate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={MAX_PERCENT}
              step={1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full accent-primary-100"
              style={{
                background: sliderFill((rate / MAX_PERCENT) * 100),
              }}
            />
            <div className="mt-1 flex justify-between font-unageo text-xs text-accent-70">
              <span>0%</span>
              <span>{MAX_PERCENT}%</span>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 font-unageo text-sm font-semibold text-secondary-000 hover:bg-secondary-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onSave(rate, useDefault)}
            disabled={saving}
            className="flex-1 rounded-lg bg-primary-100 px-4 py-2.5 font-unageo text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
