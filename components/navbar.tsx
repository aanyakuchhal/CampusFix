"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "./icons";

export function Navbar() { const [open, setOpen] = useState(false); return <header className="border-b bg-white/90"><div className="shell flex h-18 items-center justify-between py-4"><Link href="/" className="text-xl font-bold tracking-tight">Campus<span className="text-moss-600">Fix</span></Link><nav className="hidden items-center gap-7 text-sm font-medium sm:flex"><Link href="/" className="hover:text-moss-600">Home</Link><Link href="/complaints" className="hover:text-moss-600">My Reports</Link><Link href="/report" className="btn-primary !px-4 !py-2.5">Report an Issue</Link></nav><button className="sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Menu className="h-6 w-6" /></button></div>{open && <nav className="shell flex flex-col gap-4 border-t py-5 text-sm font-medium sm:hidden"><Link onClick={() => setOpen(false)} href="/">Home</Link><Link onClick={() => setOpen(false)} href="/complaints">My Reports</Link><Link onClick={() => setOpen(false)} href="/report" className="btn-primary">Report an Issue</Link></nav>}</header>; }
