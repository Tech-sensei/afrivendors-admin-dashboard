"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminCustomRequestMessageDrawer,
  type AdminMessageTarget,
} from "@/components/messages/AdminCustomRequestMessageDrawer";
import { RfsDetailsDrawer } from "./drawers";
import { RfsFilters, type RfsStatusFilter } from "./filters";
import { RfsStats } from "./stats";
import { RfsTable } from "./table";
import type { RfsRequest } from "./data";
import { rfsSearchMatch } from "./shared";
import type { AdminCustomRequestListStatusParam } from "@/types/admin-custom-requests";
import {
  useAdminCustomRequestDetail,
  useAdminCustomRequestsBreakdown,
  useAdminCustomRequestsList,
} from "@/services/useAdminCustomRequests";

const ITEMS_PER_PAGE = 10;

function statusFilterToApiParam(filter: RfsStatusFilter): AdminCustomRequestListStatusParam | undefined {
  if (filter === "All") return undefined;
  const map: Record<Exclude<RfsStatusFilter, "All">, AdminCustomRequestListStatusParam> = {
    Pending: "pending",
    Accepted: "accepted",
    Rejected: "rejected",
    Cancelled: "cancelled",
    Completed: "completed",
  };
  return map[filter];
}

export function RfsManagement() {
  const { data: breakdown, isLoading: breakdownLoading, isError: breakdownError } = useAdminCustomRequestsBreakdown();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RfsStatusFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RfsRequest | null>(null);
  const [messageTarget, setMessageTarget] = useState<AdminMessageTarget | null>(null);
  const [messageRequest, setMessageRequest] = useState<RfsRequest | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useAdminCustomRequestsList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    status: statusFilterToApiParam(statusFilter),
  });

  const { data: selectedDetail, isLoading: detailLoading } = useAdminCustomRequestDetail(
    selectedRequest ? Number(selectedRequest.id) : null,
    selectedRequest != null,
  );

  useEffect(() => {
    if (!listError) return;
    const message =
      (listErr as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not load custom requests.";
    toast.error("Failed to load custom requests", { description: String(message) });
  }, [listError, listErr]);

  const requests = useMemo(() => {
    const rows = listData?.requests ?? [];
    if (!searchQuery.trim()) return rows;
    return rows.filter((request) => rfsSearchMatch(request, searchQuery));
  }, [listData?.requests, searchQuery]);

  const meta = listData?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + requests.length;

  useEffect(() => {
    if (!meta?.totalPages || meta.totalPages < 1) return;
    if (currentPage > meta.totalPages) setCurrentPage(meta.totalPages);
  }, [meta?.totalPages, currentPage]);

  const handleContactCustomer = (email: string) => {
    toast.info("Email client", {
      description: `Opening email client to contact ${email}`,
    });
  };

  const handleContactVendor = (email: string) => {
    toast.info("Email client", {
      description: `Opening email client to contact ${email}`,
    });
  };

  const openMessageDrawer = (request: RfsRequest, target: AdminMessageTarget) => {
    setMessageRequest(request);
    setMessageTarget(target);
  };

  const closeMessageDrawer = () => {
    setMessageTarget(null);
    setMessageRequest(null);
  };

  const selectedLive = selectedDetail ?? selectedRequest;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-unbounded text-3xl font-semibold text-secondary-000">Custom Requests</h2>
        <p className="mt-2 font-unageo text-base text-accent-70">
          Monitor and manage custom requests across the platform
        </p>
      </header>

      <RfsStats breakdown={breakdown} isLoading={breakdownLoading} isError={breakdownError} />

      <RfsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <RfsTable
        requests={requests}
        isLoading={listLoading}
        filteredCount={searchQuery.trim() ? requests.length : total}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetails={setSelectedRequest}
      />

      {selectedLive ? (
        <RfsDetailsDrawer
          request={selectedLive}
          isLoading={detailLoading && !selectedDetail}
          onClose={() => setSelectedRequest(null)}
          onContactCustomer={handleContactCustomer}
          onContactVendor={handleContactVendor}
          onMessageCustomer={(request) => openMessageDrawer(request, "customer")}
          onMessageVendor={(request) => openMessageDrawer(request, "vendor")}
        />
      ) : null}

      <AdminCustomRequestMessageDrawer
        request={messageRequest}
        target={messageTarget}
        isOpen={messageTarget != null && messageRequest != null}
        onClose={closeMessageDrawer}
      />
    </div>
  );
}
