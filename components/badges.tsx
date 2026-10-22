import { ComplaintStatus, Priority } from "@/lib/mock-data";

const priorityStyles: Record<Priority, string> = { LOW: "bg-slate-100 text-slate-600", MEDIUM: "bg-amber-50 text-amber-700", HIGH: "bg-red-50 text-red-700", CRITICAL: "bg-red-100 text-red-800" };
const statusStyles: Record<ComplaintStatus, string> = { SUBMITTED: "bg-blue-50 text-blue-700", ASSIGNED: "bg-violet-50 text-violet-700", IN_PROGRESS: "bg-amber-50 text-amber-700", RESOLVED: "bg-emerald-50 text-emerald-700", ESCALATED: "bg-red-50 text-red-700" };
export function PriorityBadge({ priority }: { priority: Priority }) { return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${priorityStyles[priority]}`}>{priority}</span>; }
export function StatusBadge({ status }: { status: ComplaintStatus }) { return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${statusStyles[status]}`}>{status.replace("_", " ")}</span>; }
