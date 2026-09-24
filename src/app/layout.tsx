import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MediCoreProvider } from "@/context/MediCoreContext";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediCore OS — Hospital ERP & Clinical Triage System",
  description: "Enterprise Clinical Triage, Bed Management & Electronic Medical Records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#030712] text-slate-100`}>
        <MediCoreProvider>
          <Navbar />
          {children}
        </MediCoreProvider>
      </body>
    </html>
  );
}
