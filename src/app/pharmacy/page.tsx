"use client";

import React, { useState } from "react";
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Clock,
  ShieldAlert,
  Search,
  Check,
} from "lucide-react";
import { useMediCore } from "@/context/MediCoreContext";
import { formatRupiah } from "@/lib/utils";

export default function PharmacyPage() {
  const { patients, drugs, prescriptions, createPrescription, dispensePrescription } = useMediCore();
  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [selectedMedicineName, setSelectedMedicineName] = useState(drugs[0]?.name || "");
  const [dosage, setDosage] = useState("3x1 tablet sesudah makan");
  const [instructions, setInstructions] = useState("Habiskan sesuai dosis klinis");

  const pendingRx = prescriptions.filter((rx) => rx.status === "PENDING");
  const dispensedRx = prescriptions.filter((rx) => rx.status === "DISPENSED");

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedDrug = drugs.find((d) => d.name === selectedMedicineName);

  const hasAllergyConflict = selectedPatient && selectedDrug
    ? selectedPatient.allergies.some((al) =>
        selectedDrug.contraindications.map((c) => c.toLowerCase()).includes(al.toLowerCase()) ||
        selectedDrug.name.toLowerCase().includes(al.toLowerCase())
      )
    : false;

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedDrug) return;

    createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      mrn: selectedPatient.mrn,
      doctorName: selectedPatient.doctorInCharge,
      medicineName: selectedDrug.name,
      dosage,
      instructions,
      hasInteractionRisk: hasAllergyConflict,
      interactionWarning: hasAllergyConflict
        ? `PERINGATAN ALERGI: Pasien tercatat alergi terhadap ${selectedPatient.allergies.join(", ")}. Konfirmasi DPJP diperlukan.`
        : undefined,
      totalCost: selectedDrug.pricePerUnit * 10,
    });

    setIsModalOpen(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 font-mono text-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-amber-400" />
            <span>SMART PHARMACY & E-RESEP DISPENSING</span>
          </h1>
          <p className="text-slate-400 mt-1">Dispensing obat terintegrasi rekam medis dengan deteksi kontraindikasi alergi otomatis</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat E-Resep Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#080d1a] border border-amber-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Antrean Resep Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingRx.length} Resep</div>
          <div className="text-[10px] text-slate-500 mt-1">Menunggu Dispensing Apoteker</div>
        </div>

        <div className="bg-[#080d1a] border border-emerald-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Resep Selesai Dispensed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{dispensedRx.length} Resep</div>
          <div className="text-[10px] text-slate-500 mt-1">Diserahkan ke Pasien / Perawat</div>
        </div>

        <div className="bg-[#080d1a] border border-cyan-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Item Obat Master</span>
            <Pill className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{drugs.length} Formula</div>
          <div className="text-[10px] text-slate-500 mt-1">Stok Farmasi Rumah Sakit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-black text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>ANTREAN E-RESEP ELEKTRONIK</span>
          </h3>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className={`p-5 rounded-2xl border transition-all ${
                  rx.status === "PENDING"
                    ? "bg-[#0c1222] border-amber-500/40"
                    : "bg-[#080d1a] border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{rx.patientName}</span>
                      <span className="text-[10px] text-slate-400">({rx.mrn})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">DPJP: {rx.doctorName} • Waktu: {rx.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        rx.status === "PENDING"
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                          : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      }`}
                    >
                      {rx.status}
                    </span>

                    {rx.status === "PENDING" && (
                      <button
                        onClick={() => dispensePrescription(rx.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer transition-all shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Dispense Obat</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-cyan-300 text-xs">{rx.medicineName}</h4>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5">{rx.dosage} — {rx.instructions}</p>
                    </div>
                    <span className="font-bold text-white text-xs">{formatRupiah(rx.totalCost)}</span>
                  </div>

                  {rx.hasInteractionRisk && rx.interactionWarning && (
                    <div className="p-2.5 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center gap-2 text-red-300 text-[10px]">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{rx.interactionWarning}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
            <Pill className="w-4 h-4 text-cyan-400" />
            <span>STOK FORMULARIUM OBAT</span>
          </h3>

          <div className="space-y-2.5">
            {drugs.map((drug) => (
              <div key={drug.id} className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{drug.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{drug.code}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Kategori: {drug.category}</span>
                  <span className="text-emerald-400 font-bold">{drug.stock} {drug.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f1f] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-400" />
                <span>Buat Resep Elektronik (E-Prescription)</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                X
              </button>
            </div>

            <form onSubmit={handleCreateRx} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">Pilih Pasien Rawat Aktif:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) — Alergi: {p.allergies.join(", ") || "Nihil"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Pilih Obat Formularium:</label>
                <select
                  value={selectedMedicineName}
                  onChange={(e) => setSelectedMedicineName(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {drugs.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.category}) — {formatRupiah(d.pricePerUnit)}
                    </option>
                  ))}
                </select>
              </div>

              {hasAllergyConflict && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-300 text-[11px] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    PERINGATAN: Pasien memiliki riwayat alergi yang bertentangan dengan obat ini!
                  </span>
                </div>
              )}

              <div>
                <label className="text-slate-400 block mb-1">Signa / Dosis Pemakaian:</label>
                <input
                  type="text"
                  required
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Instruksi Tambahan:</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  Kirim Resep ke Apotek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
