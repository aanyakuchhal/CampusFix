import Link from "next/link";
import { Complaint } from "@/lib/mock-data";
import { PriorityBadge, StatusBadge } from "./badges";
import { ArrowRight, Pin } from "./icons";

const symbols: Record<string, string> = { Plumbing: "💧", Technology: "⌁", Electrical: "◉" };
export function ComplaintCard({ complaint }: { complaint: Complaint }) { return <Link href={`/complaints/${complaint.id}`} className="card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-moss-500 sm:p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-moss-50 text-lg">{symbols[complaint.category] ?? "!"}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{complaint.title}</h2><PriorityBadge priority={complaint.priority} /></div><div className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Pin className="h-3.5 w-3.5" />{complaint.location}</div><p className="mt-2 text-xs text-slate-400">{complaint.createdAt}</p></div><div className="hidden text-right sm:block"><StatusBadge status={complaint.status} /></div><ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-moss-600" /></Link>; }
