"use client"

import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronRight,
  DollarSign,
  FileEdit,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Star,
  Store,
  Users,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface AdminSidebarProps {
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "vendors", label: "Vendors", href: "/vendors", icon: Store },
  { id: "customers", label: "Customers", href: "/customers", icon: Users },
  { id: "bookings", label: "Bookings / Appointments", href: "/bookings", icon: Calendar },
  { id: "payments", label: "Payments & Wallet", href: "/payments", icon: Wallet },
  { id: "payouts", label: "Vendor Payouts", href: "/payouts", icon: DollarSign },
  { id: "reviews", label: "Reviews & Ratings", href: "/reviews", icon: Star },
  { id: "rfs", label: "RFS Requests", href: "/rfs", icon: FileText, badge: 8 },
  { id: "services", label: "Services Management", href: "/services", icon: Package },
  {
    id: "disputes",
    label: "Disputes & Support",
    href: "/disputes",
    icon: MessageSquare,
    badge: 3,
  },
  { id: "analytics", label: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
  { id: "cms", label: "Content Management", href: "/cms", icon: FileEdit },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
  { id: "admin-accounts", label: "Admin Accounts & Roles", href: "/admin-accounts", icon: Shield },
]

function getActiveId(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0] ?? "dashboard"
  return seg
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()
  const activePanel = getActiveId(pathname)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    toast.success("Admin logged out successfully!")
    setTimeout(() => {
      onLogout()
    }, 300)
  }

  return (
    <aside className="no-scrollbar fixed left-0 top-0 z-30 hidden h-dvh w-[280px] flex-col overflow-y-auto border-r border-border bg-white lg:flex">
      <div className="shrink-0 border-b border-border px-5 py-6">
        <div>
          <Link
            href="/dashboard"
            className="flex w-full cursor-pointer items-center justify-start bg-transparent p-0"
          >
            <Image
              src="/assets/images/Logo.svg"
              alt="Afrivendor"
              width={160}
              height={24}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto py-5 font-unageo no-scrollbar">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activePanel === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative mb-1 flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border-none py-3 pl-4 pr-4 text-left no-underline transition-colors duration-150",
                  isActive
                    ? "bg-primary-100 text-white"
                    : "text-secondary-000 hover:bg-secondary-800",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-white" : "text-accent-80",
                    )}
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm",
                      isActive
                        ? "font-semibold text-white"
                        : "font-medium text-secondary-000",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white",
                      isActive ? "bg-white/25" : "bg-destructive",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-white" />}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-5 font-unageo">
        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex w-full cursor-pointer items-center gap-3 rounded-[10px] border-none py-3 pl-4 font-semibold text-destructive transition-colors duration-150 hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="text-sm">Logout</span>
        </button>
      </div>

      {showLogoutConfirm && (
        <>
          <div
            role="presentation"
            onClick={() => setShowLogoutConfirm(false)}
            className="fixed inset-0 z-100 cursor-default bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed left-1/2 top-1/2 z-101 w-[90%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 font-unageo shadow-2xl">
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
                className="focus-visible:ring-ring flex-1 cursor-pointer rounded-[10px] border border-border bg-transparent py-3 text-sm font-semibold text-accent-80 transition-colors hover:bg-secondary-800 focus-visible:outline-none focus-visible:ring-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 cursor-pointer rounded-[10px] border-none bg-destructive py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
