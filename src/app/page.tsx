"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  Bed,
  Pill,
  Receipt,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { useMediCore } from "@/context/MediCoreContext";
import { ECGWaveform } from "@/components/ECGWaveform";
import { TriageLevel } from "@/types/medicore";

export default function MediCoreDashboard() {
  const { patients, beds, prescriptions, invoices } = useMediCore();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pt-1");

  const activePatients = patients.filter((p) => p.status !== "DISCHARGED");
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || activePatients[0];

  const getTriageBadge = (level: TriageLevel) => {
    switch (level) {
      case "RESUSCITATION":
        return "bg-red-500/10 border-red-500/50 text-red-400 font-black animate-pulse";
      case "EMERGENT":
        return "bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold";
      case "URGENT":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-400 font-bold";
      case "NON_URGENT":
        return "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold";
    }
  };

  const occupiedBeds = beds.filter((b) => b.status === "OCCUPIED").length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans pb-24">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#080d1a] border border-red-500/40 p-4 rounded-2xl neon-glow-red">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Triase Kritis (Merah)</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400">
            {patients.filter((p) => p.triageLevel === "RESUSCITATION" && p.status === "ADMITTED").length} Pasien
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Resusitasi Cito Segera</div>
        </div>

        <div className="bg-[#080d1a] border border-cyan-500/40 p-4 rounded-2xl neon-glow-cyan">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Bed Occupancy</span>
            <Bed className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {Math.round((occupiedBeds / beds.length) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{occupiedBeds} dari {beds.length} Bed Terisi</div>
        </div>

        <div className="bg-[#080d1a] border border-emerald-500/40 p-4 rounded-2xl neon-glow-emerald">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Pasien Rawat Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{activePatients.length} Pasien</div>
          <div className="text-[10px] text-slate-500 mt-1">IGD, ICU & Melati</div>
        </div>

        <div className="bg-[#080d1a] border border-amber-500/40 p-4 rounded-2xl neon-glow-amber">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>E-Resep Farmasi</span>
            <Pill className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{prescriptions.length} Resep</div>
          <div className="text-[10px] text-slate-500 mt-1">Dispensing Otomatis</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient && (
            <ECGWaveform
              heartRate={selectedPatient.vitals.heartRate}
              spo2={selectedPatient.vitals.spo2}
              systolic={selectedPatient.vitals.systolic}
              diastolic={selectedPatient.vitals.diastolic}
            />
          )}

          {selectedPatient && (
            <div className="bg-[#080d1a] border border-slate-800 rounded-3xl p-6 space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#11192e] border border-slate-700 flex items-center justify-center font-bold text-white">
                    {selectedPatient.gender === "Laki-laki" ? "LK" : "PR"}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">{selectedPatient.name}</h3>
                    <span className="text-[11px] text-slate-400">{selectedPatient.mrn} • NIK: {selectedPatient.nik}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] ${getTriageBadge(selectedPatient.triageLevel)}`}>
                    LEVEL: {selectedPatient.triageLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-[10px]">
                    {selectedPatient.ward} ({selectedPatient.bedNumber || "NO BED"})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b101f] border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Keluhan Utama (Chief Complaint):</span>
                  <p className="text-white text-[11px] font-sans">{selectedPatient.chiefComplaint}</p>
                </div>

                <div className="bg-[#0b101f] border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Alergi Obat:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded-md bg-red-950/40 border border-red-500/40 text-red-400 text-[10px] font-bold">
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">Tidak ada riwayat alergi</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                <span>Dokter DPJP: <strong className="text-white">{selectedPatient.doctorInCharge}</strong></span>
                <span>Penjamin: <strong className="text-emerald-400">{selectedPatient.insuranceType}</strong></span>
                <span>Masuk: <strong className="text-slate-300">{selectedPatient.admissionDate}</strong></span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>DAFTAR PASIEN GAWAT DARURAT</span>
            </h3>
            <Link
              href="/triage"
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Semua Bed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {activePatients.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedPatient?.id === p.id
                    ? "bg-[#0e162b] border-emerald-500/60 shadow-md shadow-emerald-950/20"
                    : "bg-[#080d1a] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-white text-sm">{p.name}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getTriageBadge(p.triageLevel)}`}>
                    {p.triageLevel}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                  {p.chiefComplaint}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                  <span>{p.ward} • {p.bedNumber || "Menunggu Bed"}</span>
                  <span className="text-emerald-400 font-bold">{p.vitals.heartRate} bpm</span>
                </div>
              </button>
            ))}
          </div>

          <Link
            href="/triage"
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrasi Pasien & Alokasi Bed</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
