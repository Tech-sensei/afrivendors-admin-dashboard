"use client"

import { Lock, Percent, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAdminCommissionSettings } from "@/services/useAdminCommissionSettings"
import { CommissionSettings } from "./commission-settings"
import { PasswordSettings } from "./password-settings"
import { ProfileSettings } from "./profile-settings"

type SettingsTab = "profile" | "security" | "commission"

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "commission", label: "Commission", icon: Percent },
]

export function SettingsManagement() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const {
    globalRate,
    rows,
    isLoading,
    isError,
    saveGlobalRate,
    saveCategoryRate,
    isSavingGlobal,
    isSavingCategory,
  } = useAdminCommissionSettings()

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Settings</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">
          Manage your admin profile, security, and platform commission rates
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 font-unageo text-sm font-semibold transition-colors",
                isActive ? "border-primary-100 text-primary-100" : "border-transparent text-accent-70 hover:text-secondary-000",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "profile" ? <ProfileSettings /> : null}

      {activeTab === "security" ? <PasswordSettings /> : null}

      {activeTab === "commission" ? (
        <CommissionSettings
          globalRate={globalRate}
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          onSaveGlobalRate={saveGlobalRate}
          onSaveCategoryRate={saveCategoryRate}
          isSavingGlobal={isSavingGlobal}
          isSavingCategory={isSavingCategory}
        />
      ) : null}
    </div>
  )
}
