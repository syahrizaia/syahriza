/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Smartphone, MapPin, Search, Lock, CreditCard, CheckCircle, AlertTriangle, Info } from "lucide-react";

// Deklarasi global agar TypeScript tidak komplain terhadap objek Snap dari Midtrans
declare global {
  interface Window {
    snap: any;
  }
}

export default function PhoneTrackerPremiumTool() {
  const router = useRouter();

  // STATES
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payStatus, setPayStatus] = useState<"IDLE" | "LOADING" | "WAITING_PAYMENT" | "SUCCESS" | "FAILED">("IDLE");
  const [orderId, setOrderId] = useState("");
  const [hlrData, setHlrData] = useState<any>(null);

  const PREMIUM_PRICE = 25000; // Harga Akses Modul Rp 25.000

  // Efek untuk memuat skrip Snap Midtrans Sandbox ke dalam DOM
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    // Cek jika skrip sudah ada
    let script = document.querySelector(`script[src="${midtransScriptUrl}"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = midtransScriptUrl;
      script.setAttribute("data-client-key", clientKey);
      document.body.appendChild(script);
    }

    return () => {
      // Pembersihan opsional jika diperlukan
    };
  }, []);

  // FUNGSI ANALISIS AWAL PREFIX NOMOR (SIMULASI HLR LOOKUP)
  const analyzeHlrPrefix = (num: string) => {
    let operator = "Tidak Dikenal";
    let region = "Indonesia";
    
    if (num.startsWith("0811") || num.startsWith("0812") || num.startsWith("0813") || num.startsWith("0821")) {
      operator = "Telkomsel (Simpati/Kartu Halo)";
      region = "DKI Jakarta / Jawa Barat";
    } else if (num.startsWith("0817") || num.startsWith("0818") || num.startsWith("0819") || num.startsWith("0877")) {
      operator = "XL Axiata";
      region = "Jawa Tengah / DI Yogyakarta";
    } else if (num.startsWith("0814") || num.startsWith("0815") || num.startsWith("0816") || num.startsWith("0856")) {
      operator = "Indosat Ooredoo (IM3)";
      region = "Jawa Timur / Surabaya";
    } else if (num.startsWith("0895") || num.startsWith("0896") || num.startsWith("0897")) {
      operator = "Three (3)";
      region = "Sumatera Utara / Medan";
    }

    return { operator, region, status: "Aktif / Terdaftar" };
  };

  // ACTION 1: PROSES PEMICU PEMBAYARAN MIDTRANS
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert("Masukkan nomor HP Indonesia yang valid!");
      return;
    }

    setPayStatus("LOADING");

    try {
      // 1. Ambil Snap Token dari API Backend kita
      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount: PREMIUM_PRICE }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membuat token");

      setOrderId(data.orderId);
      setPayStatus("WAITING_PAYMENT");

      // 2. Eksekusi Jendela Popup Snap Midtrans
      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          // Pembayaran Berhasil! Ekstrak data HLR dan buka konten premium
          const analyzed = analyzeHlrPrefix(phoneNumber);
          setHlrData(analyzed);
          setPayStatus("SUCCESS");
        },
        onPending: function (result: any) {
          setPayStatus("WAITING_PAYMENT");
          alert("Selesaikan pembayaran Anda di instruksi Midtrans!");
        },
        onError: function (result: any) {
          setPayStatus("FAILED");
          alert("Pembayaran gagal! Silakan coba lagi.");
        },
        onClose: function () {
          setPayStatus("IDLE");
        },
      });
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan koneksi sistem.");
      setPayStatus("IDLE");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 p-4 flex flex-col items-center justify-center font-sans relative">
      
      {/* ORNAMENT RADIAL BLUR BACKGROUND */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* HEADER UTILITY CONTEXT */}
      <div className="w-full max-w-xl flex justify-between items-center mb-4 bg-slate-900/40 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-sm shadow-md">
        <button 
          onClick={() => router.back()}
          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={13} /> BACK
        </button>
        <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
          Midtrans Sandbox Mode
        </span>
      </div>

      {/* MAIN CONTAINER INTERFACE */}
      <div className="w-full max-w-xl bg-slate-900/20 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        
        <AnimatePresence mode="wait">
          
          {/* INTERFACE A: FORM INPUT NOMOR & GERBANG BAYAR */}
          {(payStatus === "IDLE" || payStatus === "LOADING" || payStatus === "WAITING_PAYMENT" || payStatus === "FAILED") && (
            <motion.div key="checkout-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold tracking-tight text-white flex items-center justify-center gap-1.5 uppercase font-mono">
                  <Smartphone className="text-emerald-500" size={18} /> Premium HLR & Finder Hub
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Analisis data registrasi pusat kartu operator dan buka modul panduan taktis pelacakan satelit resmi Google / Apple.
                </p>
              </div>

              {/* PERINGATAN EDUKASI EDUKATIF */}
              <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-xl flex gap-2.5 items-start text-amber-400 text-[11px] leading-relaxed font-sans">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <span className="font-bold">Edukasi Transparansi:</span> Menurut regulasi privasi Indonesia, pelacakan koordinat GPS real-time pihak ketiga tanpa persetujuan target dilarang. Alat ini menyajikan modul <span className="underline">HLR Lookup</span> resmi dan langkah enkripsi satelit <span className="font-bold">Find My Device</span>.
                </div>
              </div>

              {/* FORM PAYOUT ACTION */}
              <form onSubmit={handleCheckout} className="space-y-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 font-mono flex items-center gap-1">
                    <Search size={12} /> Masukkan Nomor HP Target:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 081234567890"
                    disabled={payStatus === "LOADING" || payStatus === "WAITING_PAYMENT"}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm p-3 rounded-xl focus:outline-none transition-all font-mono tracking-wide text-slate-200 placeholder-slate-700"
                  />
                </div>

                {/* AREA HARGA */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1"><Lock size={12}/> Biaya Buka Modul:</span>
                  <span className="text-emerald-400 font-black text-sm">Rp {PREMIUM_PRICE.toLocaleString("id-ID")}</span>
                </div>

                {/* SUBMIT BUTTON TRIGGER */}
                <button
                  type="submit"
                  disabled={payStatus === "LOADING" || payStatus === "WAITING_PAYMENT"}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 disabled:from-slate-800 disabled:to-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {payStatus === "LOADING" ? (
                    "Menghubungi Server Midtrans..."
                  ) : payStatus === "WAITING_PAYMENT" ? (
                    <span className="flex items-center gap-1.5 animate-pulse text-amber-300"><CreditCard size={14}/> Selesaikan Transaksi di Jendela Virtual...</span>
                  ) : (
                    <>
                      <ShieldCheck size={15} /> Buka Modul Via Midtrans Snap
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* INTERFACE B: AREA PREMIUM UNLOCKED (JIKA STATUS BERHASIL / SUKSES BAYAR) */}
          {payStatus === "SUCCESS" && hlrData && (
            <motion.div key="premium-module" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4 font-sans">
              
              {/* SUCCESS BANNER */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3 text-emerald-400 text-xs">
                <CheckCircle size={22} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold uppercase font-mono tracking-wider">Akses Terverifikasi!</p>
                  <p className="text-[11px] text-slate-400 font-mono">Order ID: {orderId}</p>
                </div>
              </div>

              {/* HASIL 1: SIMULASI HLR VALIDATION OPERATOR */}
              <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800/80 space-y-2.5">
                <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={13} className="text-emerald-500" /> Hasil Pencarian Enkripsi HLR:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/30">
                    <span className="text-[10px] text-slate-500 block">Nomor Ponsel</span>
                    <span className="text-slate-200">{phoneNumber}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/30">
                    <span className="text-[10px] text-slate-500 block">Status Kartu</span>
                    <span className="text-emerald-400 font-bold">{hlrData.status}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/30">
                    <span className="text-[10px] text-slate-500 block">Provider / Operator</span>
                    <span className="text-slate-200">{hlrData.operator}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/30">
                    <span className="text-[10px] text-slate-500 block">Wilayah Registrasi</span>
                    <span className="text-slate-200">{hlrData.region}</span>
                  </div>
                </div>
              </div>

              {/* HASIL 2: MODUL INTERAKTIF FIND MY DEVICE DEEP-GUIDE */}
              <div className="space-y-2 bg-slate-950/40 p-3.5 border border-slate-800 rounded-xl">
                <p className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Info size={13} className="text-emerald-500" /> Modul Kendali Jarak Jauh Satelit:
                </p>
                
                {/* TABS PETUNJUK ANDROID VS APPLE */}
                <div className="space-y-3 pt-1 text-xs text-slate-300">
                  <div className="border-l-2 border-emerald-500 pl-2.5 space-y-1">
                    <p className="font-bold text-white flex items-center gap-1 font-mono">🤖 Jalur Android (Google Find My Device)</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Buka portal resmi <span className="text-emerald-400 font-mono underline">android.com/find</span>. Masukkan akun Google yang tertanam pada perangkat HP tersebut. Sistem satelit akan memetakan koordinat GPS terkini, membunyikan alarm meskipun disenyapkan, atau mengunci total ponsel dari jarak jauh.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-500 pl-2.5 space-y-1">
                    <p className="font-bold text-white flex items-center gap-1 font-mono">🍏 Jalur iOS Apple (Find My iPhone / iCloud)</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Akses ekosistem cloud melalui <span className="text-emerald-400 font-mono underline">icloud.com/find</span> menggunakan Apple ID korban/perangkatmu yang hilang. Manfaatkan fitur &quot;Mark As Lost&quot; untuk melacak riwayat perjalanan ponsel, membagikan posisi ke keluarga terdekat, atau menghapus data secara menyeluruh demi keamanan privasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* RE-TRY BUTTON RESET */}
              <button
                onClick={() => { setPayStatus("IDLE"); setHlrData(null); setPhoneNumber(""); }}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Cari Nomor Lain
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* FOOTER CORE SECURITY BRANDING */}
      <div className="mt-4 text-center text-[10px] font-mono text-slate-600 tracking-widest uppercase">
        SECURE INTEGRATION // MIDTRANS GATEWAY TERMINAL V2
      </div>
    </div>
  );
}