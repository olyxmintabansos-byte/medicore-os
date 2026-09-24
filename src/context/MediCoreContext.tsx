"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Patient,
  BedAsset,
  DrugItem,
  PrescriptionOrder,
  MedicalInvoice,
  TriageLevel,
  WardType,
} from "@/types/medicore";

export const MASTER_DRUGS: DrugItem[] = [
  { id: "dr-1", code: "MED-CLP", name: "Clopidogrel 75mg", category: "Kardiovaskular", stock: 120, unit: "Tablet", pricePerUnit: 18500, contraindications: ["Aspirin"] },
  { id: "dr-2", code: "MED-ATV", name: "Atorvastatin 40mg", category: "Kardiovaskular", stock: 95, unit: "Tablet", pricePerUnit: 22000, contraindications: [] },
  { id: "dr-3", code: "MED-PCT", name: "Paracetamol 500mg IV", category: "Analgesik", stock: 48, unit: "Vial Infus", pricePerUnit: 35000, contraindications: [] },
  { id: "dr-4", code: "MED-RL", name: "Ringer Lactate 500ml", category: "Cairan Infus", stock: 240, unit: "Kolf", pricePerUnit: 14000, contraindications: [] },
  { id: "dr-5", code: "MED-CTX", name: "Ceftriaxone 1g Injeksi", category: "Antibiotik", stock: 65, unit: "Vial", pricePerUnit: 45000, contraindications: ["Penicillin"] },
  { id: "dr-6", code: "MED-EPI", name: "Epinephrine 1mg/ml", category: "Emergency Ampul", stock: 30, unit: "Ampul", pricePerUnit: 28000, contraindications: [] },
];

interface MediCoreContextType {
  patients: Patient[];
  beds: BedAsset[];
  drugs: DrugItem[];
  prescriptions: PrescriptionOrder[];
  invoices: MedicalInvoice[];
  admitPatient: (patient: Omit<Patient, "id" | "mrn" | "admissionDate" | "status">) => void;
  dischargePatient: (patientId: string) => void;
  allocateBed: (bedId: string, patientId: string) => void;
  releaseBed: (bedId: string) => void;
  createPrescription: (order: Omit<PrescriptionOrder, "id" | "status" | "createdAt">) => void;
  dispensePrescription: (prescriptionId: string) => void;
  payInvoice: (invoiceId: string) => void;
  selectedWard: WardType | "ALL";
  setSelectedWard: (w: WardType | "ALL") => void;
}

const MediCoreContext = createContext<MediCoreContextType | undefined>(undefined);

export function MediCoreProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<BedAsset[]>([]);
  const [drugs, setDrugs] = useState<DrugItem[]>(MASTER_DRUGS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>([]);
  const [invoices, setInvoices] = useState<MedicalInvoice[]>([]);
  const [selectedWard, setSelectedWard] = useState<WardType | "ALL">("ALL");

  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem("medicore_patients");
      const savedBeds = localStorage.getItem("medicore_beds");
      const savedDrugs = localStorage.getItem("medicore_drugs");
      const savedPrescriptions = localStorage.getItem("medicore_prescriptions");
      const savedInvoices = localStorage.getItem("medicore_invoices");

      if (savedPatients && savedBeds) {
        setPatients(JSON.parse(savedPatients));
        setBeds(JSON.parse(savedBeds));
        setDrugs(savedDrugs ? JSON.parse(savedDrugs) : MASTER_DRUGS);
        setPrescriptions(savedPrescriptions ? JSON.parse(savedPrescriptions) : []);
        setInvoices(savedInvoices ? JSON.parse(savedInvoices) : []);
      } else {
        // Initial Seed Patients
        const seedPatients: Patient[] = [
          {
            id: "pt-1",
            mrn: "RM-2026-001",
            nik: "3171012903840001",
            name: "Hendra Wijaya",
            age: 54,
            gender: "Laki-laki",
            bloodType: "O+",
            allergies: ["Penicillin", "Aspirin"],
            chiefComplaint: "Nyeri dada akut tembus ke punggung, sesak napas berat",
            triageLevel: "RESUSCITATION",
            ward: "ICU",
            bedNumber: "ICU-01",
            admissionDate: "2026-09-24 14:15",
            vitals: { heartRate: 118, systolic: 165, diastolic: 105, spo2: 91, respiratoryRate: 28, temperature: 37.8 },
            doctorInCharge: "dr. Aulia Sp.JP",
            insuranceType: "BPJS Kesehatan",
            status: "ADMITTED",
          },
          {
            id: "pt-2",
            mrn: "RM-2026-002",
            nik: "3275021208920003",
            name: "Siti Rahmawati",
            age: 32,
            gender: "Perempuan",
            bloodType: "A+",
            allergies: [],
            chiefComplaint: "Demam tinggi 4 hari, trombositopenia 68.000 /uL (DHF Grade II)",
            triageLevel: "EMERGENT",
            ward: "RAWAT_INAP_MELATI",
            bedNumber: "MEL-04",
            admissionDate: "2026-09-24 11:30",
            vitals: { heartRate: 88, systolic: 110, diastolic: 70, spo2: 98, respiratoryRate: 20, temperature: 39.2 },
            doctorInCharge: "dr. Bambang Sp.PD",
            insuranceType: "Asuransi Swasta",
            status: "ADMITTED",
          },
          {
            id: "pt-3",
            mrn: "RM-2026-003",
            nik: "3174092004780005",
            name: "Dimas Pratama",
            age: 26,
            gender: "Laki-laki",
            bloodType: "B+",
            allergies: ["Sulfa"],
            chiefComplaint: "Fraktur tertutup radius ulna sinistra pasca kecelakaan kerja",
            triageLevel: "URGENT",
            ward: "IGD",
            bedNumber: "IGD-03",
            admissionDate: "2026-09-24 15:00",
            vitals: { heartRate: 82, systolic: 125, diastolic: 85, spo2: 99, respiratoryRate: 18, temperature: 36.7 },
            doctorInCharge: "dr. Faisal Sp.OT",
            insuranceType: "BPJS Kesehatan",
            status: "ADMITTED",
          },
          {
            id: "pt-4",
            mrn: "RM-2026-004",
            nik: "3172081105010008",
            name: "Larasati Putri",
            age: 21,
            gender: "Perempuan",
            bloodType: "AB+",
            allergies: [],
            chiefComplaint: "Dispepsia akut, mual muntah frekuen",
            triageLevel: "NON_URGENT",
            ward: "IGD",
            bedNumber: "IGD-05",
            admissionDate: "2026-09-24 15:20",
            vitals: { heartRate: 76, systolic: 115, diastolic: 75, spo2: 99, respiratoryRate: 16, temperature: 36.5 },
            doctorInCharge: "dr. Nabila Sp.A",
            insuranceType: "Umum / Mandiri",
            status: "OBSERVATION",
          },
        ];

        const seedBeds: BedAsset[] = [
          { id: "b-1", bedNumber: "IGD-01", ward: "IGD", status: "AVAILABLE", lastSanitized: "15:00" },
          { id: "b-2", bedNumber: "IGD-02", ward: "IGD", status: "AVAILABLE", lastSanitized: "14:45" },
          { id: "b-3", bedNumber: "IGD-03", ward: "IGD", status: "OCCUPIED", currentPatientId: "pt-3", currentPatientName: "Dimas Pratama", lastSanitized: "15:00" },
          { id: "b-4", bedNumber: "IGD-04", ward: "IGD", status: "CLEANING", lastSanitized: "13:30" },
          { id: "b-5", bedNumber: "IGD-05", ward: "IGD", status: "OCCUPIED", currentPatientId: "pt-4", currentPatientName: "Larasati Putri", lastSanitized: "15:20" },
          { id: "b-6", bedNumber: "ICU-01", ward: "ICU", status: "OCCUPIED", currentPatientId: "pt-1", currentPatientName: "Hendra Wijaya", lastSanitized: "14:15" },
          { id: "b-7", bedNumber: "ICU-02", ward: "ICU", status: "AVAILABLE", lastSanitized: "12:00" },
          { id: "b-8", bedNumber: "ISO-01", ward: "ISOLASI", status: "AVAILABLE", lastSanitized: "11:00" },
          { id: "b-9", bedNumber: "ISO-02", ward: "ISOLASI", status: "MAINTENANCE", lastSanitized: "09:00" },
          { id: "b-10", bedNumber: "MEL-01", ward: "RAWAT_INAP_MELATI", status: "AVAILABLE", lastSanitized: "10:00" },
          { id: "b-11", bedNumber: "MEL-02", ward: "RAWAT_INAP_MELATI", status: "AVAILABLE", lastSanitized: "10:15" },
          { id: "b-12", bedNumber: "MEL-04", ward: "RAWAT_INAP_MELATI", status: "OCCUPIED", currentPatientId: "pt-2", currentPatientName: "Siti Rahmawati", lastSanitized: "11:30" },
        ];

        const seedPrescriptions: PrescriptionOrder[] = [
          {
            id: "rx-1",
            patientId: "pt-1",
            patientName: "Hendra Wijaya",
            mrn: "RM-2026-001",
            doctorName: "dr. Aulia Sp.JP",
            medicineName: "Clopidogrel 75mg + Atorvastatin 40mg",
            dosage: "1x1 tablet malam",
            instructions: "Protokol antiplatelet pasca infark miokard akut",
            status: "PENDING",
            hasInteractionRisk: true,
            interactionWarning: "Peringatan: Pasien memiliki alergi Aspirin. Clopidogrel aman sebagai terapi substitusi.",
            totalCost: 165000,
            createdAt: "14:30",
          },
          {
            id: "rx-2",
            patientId: "pt-2",
            patientName: "Siti Rahmawati",
            mrn: "RM-2026-002",
            doctorName: "dr. Bambang Sp.PD",
            medicineName: "Paracetamol 500mg IV + Ringer Lactate 500ml",
            dosage: "1 flash / 8 jam",
            instructions: "Demam DHF dan rehidrasi cairan intensif",
            status: "DISPENSED",
            hasInteractionRisk: false,
            totalCost: 98000,
            createdAt: "12:00",
          },
          {
            id: "rx-3",
            patientId: "pt-3",
            patientName: "Dimas Pratama",
            mrn: "RM-2026-003",
            doctorName: "dr. Faisal Sp.OT",
            medicineName: "Ketorolac 30mg Ampul + Ranitidine",
            dosage: "1 ampul IV extra cito",
            instructions: "Analgesik fraktur tulang tertutup",
            status: "DISPENSED",
            hasInteractionRisk: false,
            totalCost: 75000,
            createdAt: "15:15",
          },
        ];

        const seedInvoices: MedicalInvoice[] = [
          {
            id: "inv-1",
            patientId: "pt-1",
            patientName: "Hendra Wijaya",
            mrn: "RM-2026-001",
            nik: "3171012903840001",
            ward: "Intensive Care Unit (ICU)",
            inacbgCode: "I-4-10-I (Acute Myocardial Infarction Berat)",
            diagnosisDescription: "Infark Miokard Akut dengan Elevasi Segmen ST (STEMI Anteroseptal)",
            hospitalRealCost: 21850000,
            inacbgTariffCovered: 21850000,
            patientOutOfPocket: 0,
            insuranceType: "BPJS Kesehatan",
            status: "LUNAS",
            issuedDate: "2026-09-24",
            doctorName: "dr. Aulia Sp.JP",
          },
          {
            id: "inv-2",
            patientId: "pt-2",
            patientName: "Siti Rahmawati",
            mrn: "RM-2026-002",
            nik: "3275021208920003",
            ward: "Rawat Inap Melati - Kamar 04",
            inacbgCode: "A-4-11-I (Dengue Fever with Complications)",
            diagnosisDescription: "Demam Berdarah Dengue Grade II dengan Dehidrasi Sedang",
            hospitalRealCost: 5200000,
            inacbgTariffCovered: 4800000,
            patientOutOfPocket: 400000,
            insuranceType: "Asuransi Swasta",
            status: "LUNAS",
            issuedDate: "2026-09-24",
            doctorName: "dr. Bambang Sp.PD",
          },
          {
            id: "inv-3",
            patientId: "pt-3",
            patientName: "Dimas Pratama",
            mrn: "RM-2026-003",
            nik: "3174092004780005",
            ward: "Instalasi Gawat Darurat (Bed IGD-03)",
            inacbgCode: "M-4-15-I (Fracture of Forearm/Radius Ulna)",
            diagnosisDescription: "Fraktur Tertutup Radius Ulna Sinistra 1/3 Distal",
            hospitalRealCost: 3850000,
            inacbgTariffCovered: 3850000,
            patientOutOfPocket: 0,
            insuranceType: "BPJS Kesehatan",
            status: "MENUNGGU_VERIFIKASI",
            issuedDate: "2026-09-24",
            doctorName: "dr. Faisal Sp.OT",
          },
        ];

        setPatients(seedPatients);
        setBeds(seedBeds);
        setDrugs(MASTER_DRUGS);
        setPrescriptions(seedPrescriptions);
        setInvoices(seedInvoices);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem("medicore_patients", JSON.stringify(patients));
      localStorage.setItem("medicore_beds", JSON.stringify(beds));
      localStorage.setItem("medicore_drugs", JSON.stringify(drugs));
      localStorage.setItem("medicore_prescriptions", JSON.stringify(prescriptions));
      localStorage.setItem("medicore_invoices", JSON.stringify(invoices));
    }
  }, [patients, beds, drugs, prescriptions, invoices]);

  const admitPatient = (
    data: Omit<Patient, "id" | "mrn" | "admissionDate" | "status">
  ) => {
    const newId = `pt-${Date.now()}`;
    const newMrn = `RM-2026-${String(patients.length + 1).padStart(3, "0")}`;
    const newPatient: Patient = {
      ...data,
      id: newId,
      mrn: newMrn,
      admissionDate: new Date().toLocaleString("id-ID"),
      status: "ADMITTED",
    };

    setPatients((prev) => [newPatient, ...prev]);

    if (data.bedNumber) {
      setBeds((prev) =>
        prev.map((b) =>
          b.bedNumber === data.bedNumber
            ? { ...b, status: "OCCUPIED", currentPatientId: newId, currentPatientName: data.name }
            : b
        )
      );
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#06b6d4", "#f59e0b"],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const dischargePatient = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: "DISCHARGED" } : p))
    );
    setBeds((prev) =>
      prev.map((b) =>
        b.currentPatientId === patientId
          ? { ...b, status: "CLEANING", currentPatientId: undefined, currentPatientName: undefined }
          : b
      )
    );
  };

  const allocateBed = (bedId: string, patientId: string) => {
    const p = patients.find((pt) => pt.id === patientId);
    if (!p) return;

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: "OCCUPIED", currentPatientId: p.id, currentPatientName: p.name }
          : b
      )
    );

    setPatients((prev) =>
      prev.map((pt) =>
        pt.id === patientId ? { ...pt, bedNumber: beds.find((b) => b.id === bedId)?.bedNumber } : pt
      )
    );
  };

  const releaseBed = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: "AVAILABLE", currentPatientId: undefined, currentPatientName: undefined }
          : b
      )
    );
  };

  const createPrescription = (order: Omit<PrescriptionOrder, "id" | "status" | "createdAt">) => {
    const newRx: PrescriptionOrder = {
      ...order,
      id: `rx-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#f59e0b", "#10b981"],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const dispensePrescription = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === prescriptionId ? { ...rx, status: "DISPENSED" } : rx))
    );
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "LUNAS" } : inv))
    );
  };

  return (
    <MediCoreContext.Provider
      value={{
        patients,
        beds,
        drugs,
        prescriptions,
        invoices,
        admitPatient,
        dischargePatient,
        allocateBed,
        releaseBed,
        createPrescription,
        dispensePrescription,
        payInvoice,
        selectedWard,
        setSelectedWard,
      }}
    >
      {children}
    </MediCoreContext.Provider>
  );
}

export function useMediCore() {
  const context = useContext(MediCoreContext);
  if (!context) {
    throw new Error("useMediCore must be used within a MediCoreProvider");
  }
  return context;
}
