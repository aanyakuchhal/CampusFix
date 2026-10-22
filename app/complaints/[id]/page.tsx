
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { Timeline } from "@/components/timeline";
import { ArrowRight, Pin } from "@/components/icons";
import { Complaint, ComplaintStatus } from "@/lib/mock-data";

type ComplaintDetail = Complaint & {
  aiSummary: string;
  suggestedAction: string;
};


type TimelineEvent = {
  id: string;
  status: string | null;
  comment: string | null;
  created_at: string | null;
};


const validStatuses: ComplaintStatus[] = [
  "SUBMITTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "ESCALATED",
];

const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function formatTime(value: string | null) {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updates, setUpdates] = useState<TimelineEvent[]>([]);


  useEffect(() => {
    async function loadComplaint() {
      try {
        setLoading(true);
        setError("");
        const uuidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuidPattern.test(id)) {
            setComplaint(null);
            return;
        }

        const { data: row, error: fetchError } = await supabase
          .from("complaints")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!row) {
          setComplaint(null);
          return;
        }
        
        const { data: updateRows, error: updatesError } = await supabase
            .from("complaint_updates")
            .select("id, status, comment, created_at")
            .eq("complaint_id", id)
            .order("created_at", { ascending: true });

        console.log("Complaint ID:", id);
        console.log("Timeline rows:", updateRows);
        console.log("Timeline query error:", updatesError);

        if (updatesError) throw updatesError;

        setUpdates(updateRows ?? []);


        let department = "Unassigned";

        if (row.department_id) {
          const { data: departmentRow, error: departmentError } =
            await supabase
              .from("departments")
              .select("name")
              .eq("id", row.department_id)
              .maybeSingle();

          if (departmentError) throw departmentError;
          department = departmentRow?.name ?? "Unassigned";
        }

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

        setComplaint({
          id: row.id,
          title: row.title ?? "Untitled complaint",
          description: row.description ?? "",
          category: row.category ?? "Other",
          subcategory: row.subcategory ?? "",
          priority,
          location: row.location ?? "Location not provided",
          department,
          status,
          createdAt: formatTime(row.created_at),
          updatedAt: formatTime(row.updated_at),
          imageUrl: row.image_url ?? undefined,
          aiSummary: row.ai_summary ?? "",
          suggestedAction: row.ai_suggested_action ?? "",
        });
      } catch (err) {
        console.error("Could not load complaint:", err);
        setError(
          err instanceof Error ? err.message : "Could not load this complaint."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) loadComplaint();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="shell py-16">
          <p className="text-slate-500">Loading complaint details...</p>
        </main>
      </>
    );
  }

  if (error || !complaint) {
    return (
      <>
        <Navbar />
        <main className="shell max-w-5xl py-16">
          <Link
            href="/complaints"
            className="text-sm font-medium text-slate-500 hover:text-moss-600"
          >
            ← Back to reports
          </Link>
          <div className="card mt-6 p-6">
            <h1 className="text-xl font-bold">
              {error ? "Could not load complaint" : "Complaint not found"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {error || "This complaint ID does not exist in the database."}
            </p>
          </div>
        </main>
      </>
    );
  }

  const isResolved = complaint.status === "RESOLVED";
  const isInProgress = complaint.status === "IN_PROGRESS";
  const isSubmitted = complaint.status === "SUBMITTED";


const timeline = updates.map((event, index) => ({
    title: event.status
        ? event.status.replace(/_/g, " ")
        : "Status update",
    time: `${formatTime(event.created_at)}${
        event.comment ? ` — ${event.comment}` : ""
    }`,
    state:
        index === updates.length - 1 && complaint.status !== "RESOLVED"
        ? ("active" as const)
        : ("done" as const),
    }));

  let nextMessage = "Your report has been submitted and is awaiting progress.";
  if (complaint.status === "ASSIGNED") {
    nextMessage = "Your report has been assigned to the relevant department.";
  } else if (isInProgress) {
    nextMessage = "The complaint is marked as in progress.";
  } else if (isResolved) {
    nextMessage = "This complaint is marked as resolved.";
  } else if (complaint.status === "ESCALATED") {
    nextMessage = "This complaint has been escalated for further attention.";
  }

  return (
    <>
      <Navbar />
      <main className="shell max-w-5xl py-10 sm:py-14">
        <Link
          href="/complaints"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-moss-600"
        >
          ← Back to reports
        </Link>

        <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row">
          <div>
            <p className="eyebrow">Complaint {complaint.id}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {complaint.title}
            </h1>
            <p className="mt-3 flex items-center gap-1 text-slate-600">
              <Pin className="h-4 w-4" />
              {complaint.location}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-6">
            <div className="card overflow-hidden">
              {complaint.imageUrl ? (
                <img
                  src={complaint.imageUrl}
                  alt={`Photo for ${complaint.title}`}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="grid h-32 place-items-center bg-moss-50 text-4xl">
                  📋
                </div>
              )}

              <div className="grid grid-cols-2 gap-y-5 p-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Priority
                  </p>
                  <div className="mt-2">
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Category
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {complaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Department
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {complaint.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>
              </div>
            </div>

        
            <section className="card p-6">
            <h2 className="mb-6 text-lg font-bold">Status timeline</h2>
            {timeline.length > 0 ? (
                <Timeline steps={timeline} />
            ) : (
                <p className="text-sm text-slate-500">
                No status history recorded yet.
                </p>
            )}
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold">AI Summary</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {complaint.aiSummary || "No AI summary is available."}
              </p>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold">Suggested action</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {complaint.suggestedAction ||
                  "No suggested action is available."}
              </p>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold">What’s next?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {nextMessage}
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="card p-6">
              <h2 className="mb-6 text-lg font-bold">Status timeline</h2>
              <Timeline steps={timeline} />
            </section>

            <section className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Assigned to
              </p>
              <h2 className="mt-2 text-lg font-bold">
                {complaint.department}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Report created {complaint.createdAt}
              </p>
            </section>

            <Link href="/report" className="btn-secondary w-full">
              Report another issue <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </main>
    </>
  );
}
