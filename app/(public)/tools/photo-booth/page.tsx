/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Inbox, Sparkles } from "lucide-react";
import CaptureTab from "@/components/photobooth/CaptureTab";
import GalleryTab from "@/components/photobooth/GalleryTab";

// Fungsi standardisasi nomor telepon
const normalizePhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("6208")) cleaned = "628" + cleaned.slice(4);
  else if (cleaned.startsWith("08")) cleaned = "62" + cleaned.slice(1);
  else if (cleaned.startsWith("8")) cleaned = "62" + cleaned;
  return cleaned;
};

export default function PhotoBoothPage() {
  const [activeTab, setActiveTab] = useState<"capture" | "gallery">("capture");

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4 flex flex-col items-center relative overflow-hidden">
      
      {/* Efek Latar Belakang Gradasi */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <Sparkles size={12} /> Proportional Landscape 4-Cut Studio
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-300 to-blue-400">
            WhisperBooth
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ambil tiap pose terbaikmu secara manual, tambahkan aneka ragam hiasan stiker estetik, lalu kirim instan ke WA Anda.
          </p>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 flex gap-2 backdrop-blur-md max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("capture")}
            className={`flex-1 py-2.5 rounded-xl font-medium text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "capture" ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <Camera size={14} /> Ambil Foto
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 py-2.5 rounded-xl font-medium text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "gallery" ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <Inbox size={14} /> Galeri Foto WA
          </button>
        </div>

        {/* Pemanggilan Komponen Berdasarkan Status Tab Aktif */}
        <AnimatePresence mode="wait">
          {activeTab === "capture" ? (
            <motion.div key="cap" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <CaptureTab normalizePhoneNumber={normalizePhoneNumber} />
            </motion.div>
          ) : (
            <motion.div key="gal" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <GalleryTab normalizePhoneNumber={normalizePhoneNumber} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}