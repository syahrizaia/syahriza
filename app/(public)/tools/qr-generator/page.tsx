"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, QrCode, Download, Copy, Check, RefreshCw, Sliders, Link, Sparkles } from "lucide-react";

export default function QrCodeGeneratorTool() {
  const router = useRouter();
  
  // STATES
  const [textInput, setTextInput] = useState("");
  const [qrSize, setQrSize] = useState(250);
  const [qrColor, setQrColor] = useState("000000"); // Hex tanpa '#'
  const [bgColor, setBgColor] = useState("ffffff"); // Hex tanpa '#'
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // URL API Generator QR Code (Menggunakan QR Server API yang sangat stabil & cepat)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(
    textInput || " "
  )}&color=${qrColor}&bgcolor=${bgColor}&margin=10`;

  // ACTION 1: SALIN URL KODE QR
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrImageUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan", err);
    }
  };

  // ACTION 2: UNDUH KODE QR SEBAGAI PNG
  const handleDownloadQr = async () => {
    if (!textInput) return;
    setIsDownloaded(true);
    try {
      // Fetch gambar sebagai Blob untuk menghindari masalah CORS saat download langsung
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Gagal mengunduh QR Code:", error);
    } finally {
      setTimeout(() => setIsDownloaded(false), 2000);
    }
  };

  // ACTION 3: RESET FORM
  const handleReset = () => {
    setTextInput("");
    setQrSize(250);
    setQrColor("000000");
    setBgColor("ffffff");
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 px-4 py-20 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* BACKGROUND GLOW DECORATION */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4 bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md z-10 shadow-lg">
        <button 
          onClick={() => router.back()}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-semibold tracking-wider">
          <Sparkles size={14} /> TOOLKIT_UTILITY_2026
        </div>
      </div>

      {/* MAIN CONTAINER INTERFACE */}
      <div className="w-full max-w-2xl bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-xl shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* KIRI: INPUT & KUSTOMISASI KONTROL (7 KOLOM) */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <QrCode className="text-blue-500" size={20} /> Generator Kode QR Instan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Ubah tautan, teks, atau nomor telepon menjadi kode QR secara real-time.</p>
            </div>

            {/* TEXT INPUT FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Link size={12} /> Teks atau URL Sumber:
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Masukkan tautan atau teks di sini..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none font-mono"
              />
            </div>

            {/* ADVANCED SLIDERS & TUNING CONFIG */}
            <div className="bg-slate-950/60 border border-slate-800/60 p-3.5 rounded-xl space-y-3.5">
              <p className="text-xs font-bold font-mono text-slate-400 flex items-center gap-1">
                <Sliders size={12} /> Konfigurasi Desain:
              </p>

              {/* SLIDER UKURAN */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Resolusi Ukuran</span>
                  <span className="text-blue-400 font-bold">{qrSize} x {qrSize} px</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="500"
                  step="50"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* PILIHAN WARNA */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-mono">Warna QR (Fore)</label>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
                    <input
                      type="color"
                      value={`#${qrColor}`}
                      onChange={(e) => setQrColor(e.target.value.replace("#", ""))}
                      className="w-6 h-6 bg-transparent border-0 rounded cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-300 uppercase">#{qrColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-mono">Warna Latar (Back)</label>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
                    <input
                      type="color"
                      value={`#${bgColor}`}
                      onChange={(e) => setBgColor(e.target.value.replace("#", ""))}
                      className="w-6 h-6 bg-transparent border-0 rounded cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-300 uppercase">#{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON SYSTEM */}
          <button
            onClick={handleReset}
            className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={12} /> Bersihkan / Reset Form
          </button>
        </div>

        {/* KANAN: LIVE PREVIEW MONITOR VIEWPORT (5 KOLOM) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 text-center space-y-4 shadow-inner min-h-[280px]">
          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Live Dynamic Preview</p>
          
          {/* DISPLAY FRAME QR */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 relative group overflow-hidden shadow-md">
            <AnimatePresence mode="wait">
              {textInput.trim() ? (
                <motion.img
                  key={qrImageUrl}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={qrImageUrl}
                  alt="Generated QR Code"
                  className="w-44 h-44 rounded-lg object-contain bg-white"
                  loading="lazy"
                />
              ) : (
                <div className="w-44 h-44 flex flex-col items-center justify-center text-slate-600 text-xs font-mono border-2 border-dashed border-slate-800 rounded-lg p-2">
                  <span>⚠️</span>
                  <span className="mt-1">Menunggu Input Data...</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* DOWNLOAD & COPY ACTION TRIGGERS */}
          <div className="w-full space-y-2">
            <button
              onClick={handleDownloadQr}
              disabled={!textInput.trim()}
              className={`w-full py-2.5 rounded-xl font-medium text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all shadow ${
                textInput.trim()
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isDownloaded ? (
                <>
                  <Check size={14} className="text-green-300 animate-bounce" /> Berhasil Diunduh!
                </>
              ) : (
                <>
                  <Download size={14} /> Unduh File PNG
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              disabled={!textInput.trim()}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-900/20 border border-slate-800 disabled:border-slate-950 text-slate-300 disabled:text-slate-600 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check size={13} className="text-green-400" /> Tautan Terpenuhi!
                </>
              ) : (
                <>
                  <Copy size={13} /> Salin URL API Gambar
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER METRICS INFO */}
      <div className="mt-4 text-center text-[10px] font-mono text-slate-600 tracking-widest uppercase">
        © 2026 QR_ENGINE // MICROSERVICE AUTOMATION CORE
      </div>
    </div>
  );
}