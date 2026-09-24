export type TriageLevel = "RESUSCITATION" | "EMERGENT" | "URGENT" | "NON_URGENT";

export type WardType = "IGD" | "ICU" | "ISOLASI" | "RAWAT_INAP_MELATI";

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";

export interface VitalSigns {
  heartRate: number; // bpm
  systolic: number; // mmHg
  diastolic: number; // mmHg
  spo2: number; // %
  respiratoryRate: number; // /min
  temperature: number; // Celsius
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number (e.g. RM-2026-089)
  nik: string;
  name: string;
  age: number;
  gender: "Laki-laki" | "Perempuan";
  bloodType: "A+" | "B+" | "AB+" | "O+" | "A-" | "B-" | "AB-" | "O-";
  allergies: string[];
  chiefComplaint: string;
  triageLevel: TriageLevel;
  ward: WardType;
  bedNumber?: string;
  admissionDate: string;
  vitals: VitalSigns;
  doctorInCharge: string;
  insuranceType: "BPJS Kesehatan" | "Asuransi Swasta" | "Umum / Mandiri";
  status: "ADMITTED" | "OBSERVATION" | "DISCHARGED";
}

export interface BedAsset {
  id: string;
  bedNumber: string;
  ward: WardType;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  lastSanitized: string;
}

export interface DrugItem {
  id: string;
  code: string;
  name: string;
  category: "Antibiotik" | "Analgesik" | "Kardiovaskular" | "Cairan Infus" | "Emergency Ampul";
  stock: number;
  unit: string;
  pricePerUnit: number;
  contraindications: string[];
}

export interface PrescriptionOrder {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  medicineName: string;
  dosage: string;
  instructions: string;
  status: "PENDING" | "DISPENSED";
  hasInteractionRisk: boolean;
  interactionWarning?: string;
  totalCost: number;
  createdAt: string;
}

export interface MedicalInvoice {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  nik: string;
  ward: string;
  inacbgCode: string; // ICD-10 based tariff
  diagnosisDescription: string;
  hospitalRealCost: number;
  inacbgTariffCovered: number;
  patientOutOfPocket: number;
  insuranceType: "BPJS Kesehatan" | "Asuransi Swasta" | "Umum / Mandiri";
  status: "LUNAS" | "MENUNGGU_VERIFIKASI";
  issuedDate: string;
  doctorName: string;
}
