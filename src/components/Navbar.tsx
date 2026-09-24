"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Activity,
  Bed,
  Pill,
  Receipt,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useMediCore } from "@/context/MediCoreContext";

export function Navbar() {
  const pathname = usePathname();
  const { patients, beds } = useMediCore();

  const resuscitationCount = patients.filter((p) => p.triageLevel === "RESUSCITATION" && p.status === "ADMITTED").length;
  const occupiedBeds = beds.filter((b) => b.status === "OCCUPIED").length;
  const occupancyRate = Math.round((occupiedBeds / beds.length) * 100) || 0;

  const navLinks = [
    { href: "/", label: "Pusat Komando IGD", icon: HeartPulse },
    { href: "/triage", label: "Triase & Alokasi Bed", icon: Bed },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#060a14]/90 backdrop-blur-md sticky top-0 z-50 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-wider">MEDICORE OS</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                HOSPITAL ERP
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Clinical Triage & Bed Management System</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#090f1e] p-1 rounded-2xl border border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Stats & Hub Link */}
        <div className="flex items-center gap-3">
          {resuscitationCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{resuscitationCount} Kritis (Merah)</span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1326] border border-slate-800 text-[11px]">
            <Bed className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Bed Occupancy:</span>
            <strong className="text-cyan-400">{occupancyRate}% ({occupiedBeds}/{beds.length})</strong>
          </div>

          <a
            href="https://olyxmintabansos-byte.github.io/olyx-portfolio/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#11192e] border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Hub Utama</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>

      </div>
    </header>
  );
}
