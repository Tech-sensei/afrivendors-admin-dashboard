"use client"

import type { LucideIcon } from "lucide-react"
import { FileText, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"

interface AdminProfileDropdownProps {
  onClose: () => void
  onNavigate: (panel: string) => void
  onLogout: () => void
}

type MenuItem = { id: string; label: string; icon: LucideIcon }

const menuItems: MenuItem[] = [
  { id: "profile", label: "View Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "system-logs", label: "System Logs", icon: FileText },
]

export function AdminProfileDropdown({ onClose, onNavigate, onLogout }: AdminProfileDropdownProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    onClose()
    onLogout()
  }

  return (
    <>
      <div
        className="absolute right-0 top-full z-50 mt-2 w-60 origin-top overflow-hidden rounded-xl border border-border bg-white p-2 font-unageo shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        role="menu"
      >
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                onClose()
              }}
              className="flex w-full items-center gap-3 rounded-lg border-none bg-transparent px-3.5 py-3 text-left text-sm font-medium text-secondary-000 transition-colors duration-150 hover:bg-secondary-800"
              role="menuitem"
            >
              <Icon className="h-[18px] w-[18px] shrink-0 text-accent-80" />
              <span>{item.label}</span>
            </button>
          )
        })}

        <div className="my-2 h-px bg-border" role="separator" />

        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex w-full items-center gap-3 rounded-lg border-none bg-transparent px-3.5 py-3 text-left text-sm font-semibold text-destructive transition-colors duration-150 hover:bg-destructive/10"
          role="menuitem"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      {showLogoutConfirm && (
        <>
          <div
            role="presentation"
            onClick={() => setShowLogoutConfirm(false)}
            className="fixed inset-0 z-[200] cursor-default bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed left-1/2 top-1/2 z-[201] w-[90%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 font-unageo shadow-2xl">
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <LogOut className="h-7 w-7 text-destructive" />
              </div>
            </div>
            <h3 className="mb-3 text-center font-unbounded text-[22px] font-semibold text-secondary-000">
              Logout Confirmation
            </h3>
            <p className="mb-7 text-center text-[15px] leading-relaxed text-accent-70">
              Are you sure you want to logout from the admin portal?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="focus-visible:ring-ring flex-1 cursor-pointer rounded-[10px] border border-border bg-transparent py-3 text-sm font-semibold text-accent-80 transition-colors duration-150 hover:bg-secondary-800 focus-visible:outline-none focus-visible:ring-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 cursor-pointer rounded-[10px] border-none bg-destructive py-3 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
