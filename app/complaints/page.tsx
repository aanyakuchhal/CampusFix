
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ComplaintCard } from "@/components/complaint-card";
import { Complaint, ComplaintStatus } from "@/lib/mock-data";

const filters: { label: string; value: "ALL" | ComplaintStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
];

const validStatuses: ComplaintStatus[] = [
  "SUBMITTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "ESCALATED",
];

const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function ComplaintsPage() {
  const [active, setActive] = useState<"ALL" | ComplaintStatus>("ALL");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadComplaints() {
      try {
        setLoading(true);
        setError("");

        const { data: rows, error: fetchError } = await supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const { data: departments, error: departmentError } =
          await supabase.from("departments").select("id, name");

        if (departmentError) throw departmentError;

        const departmentNames = new Map(
          (departments ?? []).map((department) => [
            department.id,
            department.name,
          ])
        );

        const mapped: Complaint[] = (rows ?? []).map((row) => {
          const rawPriority = String(row.priority ?? "MEDIUM");
          const priority = (
            rawPriority === "URGENT"
              ? "CRITICAL"
              : validPriorities.includes(rawPriority)
                ? rawPriority
                : "MEDIUM"
          ) as Complaint["priority"];

          const rawStatus = String(row.status ?? "SUBMITTED");
          const status = validStatuses.includes(rawStatus as ComplaintStatus)
            ? (rawStatus as ComplaintStatus)
            : "SUBMITTED";

          return {
            id: row.id,
            title: row.title ?? "Untitled complaint",
            description: row.description ?? "",
            category: row.category ?? "Other",
            subcategory: row.subcategory ?? "",
            priority,
            location: row.location ?? "Location not provided",
            department: departmentNames.get(row.department_id) ?? "Unassigned",
            status,
            createdAt: row.created_at
              ? new Date(row.created_at).toLocaleString()
              : "Unknown date",
            updatedAt: row.updated_at
              ? new Date(row.updated_at).toLocaleString()
              : "Unknown date",
            imageUrl: row.image_url ?? undefined,
          };
        });

        setComplaints(mapped);
      } catch (err) {
        console.error("Could not load complaints:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading complaints."
        );
      } finally {
        setLoading(false);
      }
    }

    loadComplaints();
  }, []);

  const shown =
    active === "ALL"
      ? complaints
      : complaints.filter((complaint) => complaint.status === active);

  return (
    <>
      <Navbar />
      <main className="shell max-w-5xl py-12 sm:py-16">
        <PageHeader
          title="Your reports"
          subtitle="Keep track of everything you've reported on campus."
        />

        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          <StatCard value={complaints.length} label="Total Reports" />
          <StatCard
            value={complaints.filter((c) => c.status === "IN_PROGRESS").length}
            label="In Progress"
            accent="text-amber-600"
          />
          <StatCard
            value={complaints.filter((c) => c.status === "RESOLVED").length}
            label="Resolved"
            accent="text-emerald-600"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActive(filter.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                active === filter.value
                  ? "bg-ink text-white"
                  : "border bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {loading && (
            <div className="card py-14 text-center text-slate-500">
              Loading your reports...
            </div>
          )}

          {!loading && error && (
            <div className="card py-8 text-center">
              <p className="font-semibold">Could not load reports</p>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            shown.map((complaint) => (
              <ComplaintCard complaint={complaint} key={complaint.id} />
            ))}

          {!loading && !error && shown.length === 0 && (
            <div className="card py-14 text-center">
              <p className="font-semibold">No reports here yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another filter to see your other reports.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
