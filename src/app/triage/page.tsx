"use client";

import React, { useState } from "react";
import {
  Bed,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  User,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { useMediCore } from "@/context/MediCoreContext";
import { WardType, TriageLevel } from "@/types/medicore";

export default function TriagePage() {
  const {
    patients,
    beds,
    admitPatient,
    releaseBed,
    dischargePatient,
    selectedWard,
    setSelectedWard,
  } = useMediCore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    age: 30,
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    bloodType: "O+" as any,
    allergies: "",
    chiefComplaint: "",
    triageLevel: "EMERGENT" as TriageLevel,
    ward: "IGD" as WardType,
    bedNumber: "",
    heartRate: 85,
    systolic: 120,
    diastolic: 80,
    spo2: 98,
    respiratoryRate: 18,
    temperature: 36.8,
    doctorInCharge: "dr. Pratama Sp.EM",
    insuranceType: "BPJS Kesehatan" as any,
  });

  const availableBeds = beds.filter((b) => b.status === "AVAILABLE");
  const filteredBeds = selectedWard === "ALL" ? beds : beds.filter((b) => b.ward === selectedWard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.chiefComplaint) return;

    admitPatient({
      nik: formData.nik || "3171000000000000",
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      bloodType: formData.bloodType,
      allergies: formData.allergies ? formData.allergies.split(",").map((s) => s.trim()) : [],
      chiefComplaint: formData.chiefComplaint,
      triageLevel: formData.triageLevel,
      ward: formData.ward,
      bedNumber: formData.bedNumber || undefined,
      vitals: {
        heartRate: Number(formData.heartRate),
        systolic: Number(formData.systolic),
        diastolic: Number(formData.diastolic),
        spo2: Number(formData.spo2),
        respiratoryRate: Number(formData.respiratoryRate),
        temperature: Number(formData.temperature),
      },
      doctorInCharge: formData.doctorInCharge,
      insuranceType: formData.insuranceType,
    });

    setIsModalOpen(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 font-mono text-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Bed className="w-5 h-5 text-emerald-400" />
            <span>CLINICAL TRIAGE & BED ALLOCATION MATRIX</span>
          </h1>
          <p className="text-slate-400 mt-1">Pemetaan ketersediaan bed IGD, ICU, Isolasi, dan Rawat Inap Melati</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrasi Pasien Gawat Darurat</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {(["ALL", "IGD", "ICU", "ISOLASI", "RAWAT_INAP_MELATI"] as const).map((ward) => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
              selectedWard === ward
                ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20"
                : "bg-[#090f1d] border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {ward === "RAWAT_INAP_MELATI" ? "Melati Inpatient" : ward}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
              bed.status === "OCCUPIED"
                ? "bg-[#0d1424] border-red-500/30"
                : bed.status === "AVAILABLE"
                ? "bg-[#07131e] border-emerald-500/30"
                : "bg-[#0d1017] border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-base">{bed.bedNumber}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                  bed.status === "OCCUPIED"
                    ? "bg-red-500/10 border-red-500/40 text-red-400"
                    : bed.status === "AVAILABLE"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/40 text-amber-400"
                }`}
              >
                {bed.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Ruang / Ward:</span>
              <span className="font-bold text-slate-300">{bed.ward}</span>
            </div>

            {bed.currentPatientName ? (
              <div className="p-2.5 bg-[#080d19] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 block uppercase">Pasien On-Bed:</span>
                <span className="font-bold text-white text-xs block truncate">{bed.currentPatientName}</span>
                <button
                  onClick={() => releaseBed(bed.id)}
                  className="w-full mt-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-bold text-[10px] transition-all cursor-pointer"
                >
                  Kosongkan Bed
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-[#080d19] border border-slate-800/80 rounded-xl text-center text-slate-500 text-[10px]">
                Bed Siap Dihuni
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f1f] border border-emerald-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <span>Registrasi Pasien Gawat Darurat & Triase</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                X
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nama Pasien:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">NIK (16 Digit):</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Usia (Tahun):</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Jenis Kelamin:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Golongan Darah:</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value as any })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Keluhan Utama (Chief Complaint):</label>
                <textarea
                  required
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  rows={2}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Level Triase Kegawatdaruratan:</label>
                  <select
                    value={formData.triageLevel}
                    onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value as any })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="RESUSCITATION">Resusitasi (Merah - Cito)</option>
                    <option value="EMERGENT">Emergent (Kuning - Gawat)</option>
                    <option value="URGENT">Urgent (Kuning Muda)</option>
                    <option value="NON_URGENT">Non-Urgent (Hijau)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pilih Bed Tersedia:</label>
                  <select
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="">-- Pilih Bed Nanti --</option>
                    {availableBeds.map((b) => (
                      <option key={b.id} value={b.bedNumber}>
                        {b.bedNumber} ({b.ward})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Heart Rate (bpm):</label>
                  <input
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">SpO2 (%):</label>
                  <input
                    type="number"
                    value={formData.spo2}
                    onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tekanan Darah (TD):</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={formData.systolic}
                      onChange={(e) => setFormData({ ...formData, systolic: Number(e.target.value) })}
                      className="w-full bg-[#050811] border border-slate-700 rounded-xl px-2 py-2 text-white text-center"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={formData.diastolic}
                      onChange={(e) => setFormData({ ...formData, diastolic: Number(e.target.value) })}
                      className="w-full bg-[#050811] border border-slate-700 rounded-xl px-2 py-2 text-white text-center"
                    />
                  </div>
                </div>
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
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                >
                  Simpan & Daftarkan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
