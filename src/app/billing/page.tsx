"use client";

import React, { useState } from "react";
import {
  Receipt,
  Printer,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  User,
  CreditCard,
} from "lucide-react";
import { useMediCore } from "@/context/MediCoreContext";
import { formatRupiah, formatDate } from "@/lib/utils";
import { MedicalInvoice } from "@/types/medicore";

export default function BillingPage() {
  const { invoices, payInvoice } = useMediCore();
  const [selectedInvoice, setSelectedInvoice] = useState<MedicalInvoice | null>(invoices[0] || null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 font-mono text-xs print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>KASIR KEUANGAN & KLAIM CASEMIX INA-CBG</span>
          </h1>
          <p className="text-slate-400 mt-1">Rekonsiliasi tarif paket BPJS Kesehatan & cetak kuitansi rincian biaya resmi A4</p>
        </div>

        {selectedInvoice && (
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Invoice Resmi A4</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        <div className="space-y-3 print:hidden">
          <h3 className="font-bold text-white text-xs border-b border-slate-800 pb-2">
            DAFTAR TAGIHAN & KLAIM PASIEN
          </h3>

          <div className="space-y-2.5">
            {invoices.map((inv) => (
              <button
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedInvoice?.id === inv.id
                    ? "bg-[#0d162b] border-emerald-500/60 shadow-md shadow-emerald-950/20"
                    : "bg-[#080d1a] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-white text-sm">{inv.patientName}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                      inv.status === "LUNAS"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 truncate">{inv.inacbgCode}</p>

                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500">{inv.insuranceType}</span>
                  <strong className="text-emerald-400">{formatRupiah(inv.hospitalRealCost)}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedInvoice ? (
            <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 print:p-0 print:shadow-none print:rounded-none">
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-emerald-700" />
                    <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                      RSUP MEDICORE HEALTH TOWER
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Jl. Jenderal Sudirman Kav. 52-53, Kawasan Bisnis SCBD, Jakarta Selatan 12190
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Telp: (021) 555-MEDICORE • Izin Kemenkes RI No: YK.02.01/IV/2026
                  </p>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-[10px] text-slate-500 block">KUITANSI PEMBAYARAN RESMI</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedInvoice.id}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Tanggal: {formatDate(selectedInvoice.issuedDate)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">NAMA PASIEN / NO RM:</span>
                  <strong className="text-sm text-slate-950">{selectedInvoice.patientName}</strong>
                  <span className="block text-slate-600 text-[11px]">{selectedInvoice.mrn} • NIK: {selectedInvoice.nik}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RUANG RAWAT / DPJP:</span>
                  <strong className="text-slate-900 block">{selectedInvoice.ward}</strong>
                  <span className="text-slate-600 text-[11px]">{selectedInvoice.doctorName}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold font-mono text-slate-700 text-[11px] uppercase tracking-wider block">
                  Klasifikasi Casemix & ICD-10 Diagnosis:
                </span>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                  <div className="font-bold text-slate-900">{selectedInvoice.inacbgCode}</div>
                  <p className="text-slate-600 font-sans text-xs">{selectedInvoice.diagnosisDescription}</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[11px]">
                    <tr>
                      <th className="p-3">Uraian Komponen Biaya Perawatan</th>
                      <th className="p-3 text-right">Jumlah Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 text-[11px]">
                    <tr>
                      <td className="p-3">Akomodasi Kamar Rawat & Visite Harian DPJP</td>
                      <td className="p-3 text-right">{formatRupiah(selectedInvoice.hospitalRealCost * 0.45)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Tindakan Medis Operatif / Emergency Triage Resusitasi</td>
                      <td className="p-3 text-right">{formatRupiah(selectedInvoice.hospitalRealCost * 0.35)}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Farmasi E-Resep & Bahan Medis Habis Pakai (BMHP)</td>
                      <td className="p-3 text-right">{formatRupiah(selectedInvoice.hospitalRealCost * 0.20)}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-slate-950">
                      <td className="p-3">Total Biaya Riil Rumah Sakit (Billing Bruto)</td>
                      <td className="p-3 text-right">{formatRupiah(selectedInvoice.hospitalRealCost)}</td>
                    </tr>
                    <tr className="text-emerald-700 font-bold bg-emerald-50">
                      <td className="p-3">Dijamin Penjamin ({selectedInvoice.insuranceType})</td>
                      <td className="p-3 text-right">- {formatRupiah(selectedInvoice.inacbgTariffCovered)}</td>
                    </tr>
                    <tr className="bg-slate-950 text-white font-black text-sm">
                      <td className="p-3">Total Beban Pasien (Iur Bayar / Co-Payment)</td>
                      <td className="p-3 text-right">{formatRupiah(selectedInvoice.patientOutOfPocket)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-6 flex items-end justify-between text-xs font-mono">
                <div className="space-y-2">
                  <div className="w-28 h-12 border-2 border-emerald-600 rounded-lg flex items-center justify-center text-emerald-700 font-black text-xs rotate-[-6deg] tracking-widest">
                    LUNAS
                  </div>
                  <span className="text-[10px] text-slate-500 block">Status: Telah Direkonsiliasi</span>
                </div>

                <div className="text-right space-y-12">
                  <span className="text-slate-600 block text-[11px]">Petugas Kasir & Verifikator Klaim,</span>
                  <div>
                    <strong className="block text-slate-950 text-xs underline">Ns. Hendra Kurniawan S.Kep</strong>
                    <span className="text-[10px] text-slate-500">NIP: 19890212 201503 1 002</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs border border-slate-800 rounded-3xl">
              Pilih salah satu invoice pada daftar di sebelah kiri untuk melihat dokumen kuitansi.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
