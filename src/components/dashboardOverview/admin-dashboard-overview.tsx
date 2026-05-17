"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DashboardCharts } from "./charts"
import {
  disputes,
  kpiCards,
  recentActivities,
  recentBookings,
  recentVendors,
  supportTickets,
  systemAlerts,
  type Vendor,
} from "./data"
import { DashboardDetailDrawer, type DrawerContent } from "./drawers"
import { DashboardLists } from "./lists"
import { AlertStrip, DashboardHeader, KpiCardItem } from "./ui"

export function AdminDashboardOverview() {
  const router = useRouter()
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("weekly")
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null)

  const openDrawer = (type: "booking" | "vendor" | "ticket" | "dispute", data: unknown) => {
    setDrawerContent({ type, data } as DrawerContent)
  }

  const closeDrawer = () => setDrawerContent(null)

  const handleApproveVendor = (vendor: Vendor) => {
    setDrawerContent(null)
    toast.success("Vendor Approved", {
      description: `${vendor.name} has been successfully approved.`,
    })
  }

  const handleRejectVendor = (vendor: Vendor) => {
    setDrawerContent(null)
    toast.error("Vendor Rejected", {
      description: `${vendor.name} application has been rejected.`,
    })
  }

  return (
    <div className="space-y-8 px-2 pb-6">
      <DashboardHeader />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map((card) => (
          <KpiCardItem key={card.label} card={card} />
        ))}
      </section>

      <AlertStrip
        alerts={systemAlerts}
        onAction={(action) => {
          toast.info("Action Required", { description: `Redirecting to ${action.toLowerCase()} page...` })
        }}
      />

      <DashboardCharts chartPeriod={chartPeriod} onPeriodChange={setChartPeriod} />

      <DashboardLists
        recentBookings={recentBookings}
        recentActivities={recentActivities as DashboardListsProps["recentActivities"]}
        recentVendors={recentVendors}
        supportTickets={supportTickets}
        disputes={disputes}
        onOpen={openDrawer}
        onViewAllTickets={() => router.push("/disputes")}
        onViewAllDisputes={() => router.push("/disputes")}
      />

      <DashboardDetailDrawer
        open={Boolean(drawerContent)}
        content={drawerContent}
        onClose={closeDrawer}
        onApproveVendor={handleApproveVendor}
        onRejectVendor={handleRejectVendor}
      />
    </div>
  )
}

type DashboardListsProps = Parameters<typeof DashboardLists>[0]
