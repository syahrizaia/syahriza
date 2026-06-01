/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  Cake, 
  Gift, 
  Heart, 
  RefreshCw, 
  PartyPopper, 
  Flame, 
  Link2, 
  User,
  Copy,
  Check
} from "lucide-react";

// Generator Partikel Konfeti
const generateConfetti = (count = 40) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 3,
    size: Math.random() * 8 + 4,
    color: ["bg-cyan-400", "bg-indigo-400", "bg-pink-500", "bg-amber-400", "bg-emerald-400"][
      Math.floor(Math.random() * 5)
    ],
  }));
};

function BirthdayContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  const [inputName, setInputName] = useState("");
  const [targetName, setTargetName] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const [confettiParticles, setConfettiParticles] = useState<any[]>([]);
  
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // 1. Deteksi otomatis jika ada nama di URL (?name=Yunita)
  useEffect(() => {
    if (nameParam) {
      setTargetName(nameParam);
      setIsCelebrating(true);
    }
  }, [nameParam]);

  // 2. Siapkan efek konfeti jika pesta dimulai
  useEffect(() => {
    if (isCelebrating) {
      setConfettiParticles(generateConfetti(45));
    }
  }, [isCelebrating]);

  const birthdayWishes = [
    // --- BAHASA INDONESIA (4) ---
    `Semoga di usia yang baru ini, setiap baris kode kehidupan ${targetName} selalu sukses tanpa bug, dilimpahkan kebahagiaan, dan segala urusan dipermudah harian. 💻🎂`,
    `Selamat ulang tahun, ${targetName}! Semoga harimu penuh dengan kejutan indah, tawa yang tak henti, dan pencapaian luar biasa di masa depan. 🎉🎁`,
    `Barakallah fii umrik ${targetName}. Semoga sisa umurmu menjadi berkah, dilancarkan segala urusan, dan semakin didekatkan dengan impian-impian besarmu. 🤲🎈`,
    `Selamat hari menetas! Teruslah bersinar, tetap menjadi inspirasi bagi orang-orang di sekitarmu, dan nikmati setiap momen berharga ini, ${targetName}! 🥳⭐`,

    // --- BAHASA INGGRIS (2) ---
    `Happy birthday, ${targetName}! May your life be filled with endless joy, love, and bright success in every amazing path you take. ✨`,
    `Wishing you the happiest of birthdays, ${targetName}! Keep shining, keep writing your wonderful story, and may all your biggest dreams come true. 🚀`,

    // --- BAHASA ARAB (2) ---
    `عيد ميلاد سعيد يا ${targetName}! (Eid Milad Sa'eed!) Semoga panjang umur, selalu sehat, dan dipenuhi keberkahan serta kebahagiaan di setiap langkah barumu. 🌙`,
    `كل عام وأنت بخير يا ${targetName}! (Kullu 'am wa anta/anti bikhair!) Semoga setiap tahunnya selalu membawa kebaikan, kedamaian, dan kelancaran untuk segala urusanmu. 🤲`,

    // --- BAHASA MANDARIN (2) ---
    `祝 ${targetName} 生日快乐！(Zhù nǐ shēngrì kuàilè!) Semoga hari-harimu selalu dipenuhi kebahagiaan, tawa yang ceria, dan semua keinginan baikmu segera dikabulkan. 🌸`,
    `祝 ${targetName} 生日快乐，万事如意！Semoga di usia yang baru ini kamu selalu diberikan kesehatan, dilancarkan segala hal, dan terus bersinar terang! 🌟`
  ];

  // Fungsi membuat tautan khusus
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const fullUrl = `${origin}${pathname}?name=${encodeURIComponent(inputName.trim())}`;
      setGeneratedLink(fullUrl);
      setIsCopied(false);
    }
  };

  // Fungsi salin tautan ke clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Gagal menyalin tautan", err);
    }
  };

  const handleNextWish = () => {
    setWishIndex((prev) => (prev + 1) % birthdayWishes.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[160px]" />
      </div>

      {/* ANIMASI KONFETI HUJAN */}
      {isCelebrating && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {confettiParticles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute rounded-full opacity-75 ${p.color}`}
              style={{ left: `${p.x}%`, top: "-5%", width: p.size, height: p.size }}
              animate={{
                y: ["0vh", "105vh"],
                x: [`${p.x}%`, `${p.x + (Math.random() * 12 - 6)}%`],
                rotate: [0, 360],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 max-w-xl w-full">
        <AnimatePresence mode="wait">
          
          {/* ================= FASE 1: GENERATOR LINK (UNTUK KAMU) ================= */}
          {!isCelebrating ? (
            <motion.div
              key="generator-stage"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-md space-y-6 text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Link2 size={24} className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-400">
                  Ulang Tahun Generator
                </h1>
                <p className="text-sm text-slate-400">
                  Buat tautan kejutan kustom. Ketik nama target, salin link-nya, lalu kirimkan ke dia!
                </p>
              </div>

              <form onSubmit={handleGenerateLink} className="space-y-4 text-left">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Masukkan nama (misal: Yunita)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider rounded-2xl shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
                >
                  Generate Tautan Kejutan
                </button>
              </form>

              {/* Tampilan Output Link Hasil Generate */}
              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-left space-y-2"
                >
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Siap Dikirim:</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full bg-transparent text-xs font-mono text-cyan-400 focus:outline-none select-all truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                        isCopied 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 font-medium flex items-center gap-1.5 pt-1">
                    {isCopied && <> Berhasil disalin! Sekarang berikan link tersebut ke {inputName}.</>}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            
            // ================= FASE 2: HALAMAN UTAMA (UNTUK YUNITA) =================
            <motion.div
              key="celebration-stage"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="space-y-8 text-center mt-6"
            >
              <div className="space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-wider uppercase"
                >
                  <PartyPopper size={12} className="animate-bounce" /> Kejutan Spesial Hari Ini
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-cyan-400 to-indigo-400">
                  Happy Birthday, <br />
                  <span className="text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">{targetName}! ✨</span>
                </h1>
              </div>

              {/* INTERAKSI: KUE & TIUP LILIN */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 flex flex-col items-center justify-center gap-4 shadow-xl backdrop-blur-sm"
              >
                <div className="relative">
                  <AnimatePresence>
                    {isCandleLit && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: [1, 1.15, 1] }}
                        exit={{ opacity: 0, y: -10, scale: 0 }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="absolute -top-5 left-1/2 -translate-x-1/2 text-amber-400"
                      >
                        <Flame size={28} className="fill-amber-500 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className={`p-5 rounded-2xl transition-all duration-500 ${isCandleLit ? "bg-slate-800 text-cyan-400 border border-white/10" : "bg-slate-950 text-slate-600 border border-transparent"}`}>
                    <Cake size={36} className="stroke-[1.5]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    {isCandleLit ? "Lilin Ulang Tahun Menyala! 🎂" : "Hore! Lilin Berhasil Ditiup! 🎉"}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    {isCandleLit ? "Tarik napas dalam-dalam, buat doa terbaikmu, lalu tekan tombol tiup di bawah!" : "Semoga permohonan dan impian yang kamu langitkan segera diwujudkan."}
                  </p>
                </div>

                <button
                  onClick={() => setIsCandleLit(!isCandleLit)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isCandleLit 
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20" 
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {isCandleLit ? "💨 Tiup Lilin Ini" : "🔥 Nyalakan Kembali"}
                </button>
              </motion.div>

              {/* INTERAKSI: KADO SURAT UCAPAN */}
              <div className="perspective-1000">
                <motion.div
                  layout
                  className={`w-full min-h-[220px] rounded-3xl bg-slate-900/40 border p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                    isGiftOpen ? "border-cyan-500/30 shadow-2xl shadow-cyan-500/5" : "border-white/10 hover:border-white/20 cursor-pointer"
                  }`}
                  onClick={() => !isGiftOpen && setIsGiftOpen(true)}
                >
                  <AnimatePresence mode="wait">
                    {!isGiftOpen ? (
                      <motion.div
                        key="gift-closed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-3 flex flex-col items-center"
                      >
                        <motion.div 
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          className="w-14 h-14 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                        >
                          <Gift size={26} className="stroke-[1.5]" />
                        </motion.div>
                        <div>
                          <h4 className="text-base font-bold">Ada kado amplop digital</h4>
                          <p className="text-xs text-slate-400">Ketuk kotak kado untuk membaca baris teks ucapan</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="gift-open"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col items-center w-full"
                      >
                        <div className="flex items-center gap-2 text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-1 rounded-full text-xs font-mono">
                          <Heart size={12} className="fill-rose-400/20" /> Letter Opened
                        </div>

                        <div className="min-h-[60px] flex items-center justify-center px-2">
                          <motion.p
                            key={wishIndex}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-slate-300 text-sm md:text-base leading-relaxed italic font-light"
                          >
                            &quot;{birthdayWishes[wishIndex]}&quot;
                          </motion.p>
                        </div>

                        <div className="pt-4 border-t border-white/5 w-full flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Mencegah pemicu pembukaan kado ulang
                              handleNextWish();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                          >
                            <RefreshCw size={12} /> Lihat Doa Lainnya
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Opsi penutup tambahan jika dibuka dari parameter rute */}
              {isGiftOpen && nameParam && (
                <p className="text-[11px] font-mono text-slate-600 animate-pulse">
                  Created with love using Syahriza Portfolio Tools Ecosystem
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Komponen Utama yang mengekspor Router Suspense Safeguard
export default function BirthdayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-400 font-mono text-xs flex items-center justify-center">
        Menyiapkan Panggung Perayaan...
      </div>
    }>
      <BirthdayContent />
    </Suspense>
  );
}