import { DisputesManagement } from "@/components/disputesManagement/disputes-management"

export default function DisputesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-unbounded text-2xl font-bold text-secondary-000">
          Disputes & Support
        </h1>
        <p className="mt-1 font-unageo text-sm text-accent-70">
          Review open disputes and release funds to the vendor or refund the customer.
        </p>
      </div>
      <DisputesManagement />
    </div>
  )
}
