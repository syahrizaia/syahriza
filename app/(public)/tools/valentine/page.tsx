/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  Heart, 
  Mail, 
  Sparkles, 
  RefreshCw, 
  User, 
  Copy, 
  Check, 
  Send,
  Smile
} from "lucide-react";

// Generator Partikel Hati Mengambang
const generateHearts = (count = 30) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 4 + 4,
    size: Math.random() * 16 + 8,
    rotate: Math.random() * 40 - 20,
    opacity: Math.random() * 0.4 + 0.3,
  }));
};

function ValentineContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  const [inputName, setInputName] = useState("");
  const [targetName, setTargetName] = useState("");
  const [isSurprised, setIsSurprised] = useState(false);
  
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const [heartParticles, setHeartParticles] = useState<any[]>([]);
  
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // 1. Deteksi otomatis param URL (?name=Luna)
  useEffect(() => {
    if (nameParam) {
      setTargetName(nameParam);
      setIsSurprised(true);
    }
  }, [nameParam]);

  // 2. Aktifkan efek hujan hati jika halaman kejutan terbuka
  useEffect(() => {
    if (isSurprised) {
      setHeartParticles(generateHearts(35));
    }
  }, [isSurprised]);

  const valentineWishes = [
    // --- BAHASA INDONESIA (4) ---
    `Di antara ratusan baris kode dan rumitnya algoritma, kamulah satu-satunya fungsi yang paling indah dan tak pernah menghasilkan error di hatiku. Happy Valentine's Day! 💻💖`,
    `Selamat Hari Valentine, ${targetName}! Terima kasih sudah menjadi alasan di balik senyumanku hari ini dan seterusnya. Kamu benar-benar berharga. 🌹✨`,
    `Happy Valentine's Day! Semoga harimu selalu penuh kehangatan, kenyamanan, dan tawa yang manis, semanis kehadiranmu di hidupku. 🥰🍫`,
    `Teruntuk ${targetName}, tetaplah menjadi dirimu yang luar biasa. Berada di dekatmu atau sekadar memikirkanmu selalu membuat duniaku terasa jauh lebih cerah. 🎈❤️`,

    // --- BAHASA INGGRIS (2) ---
    `Happy Valentine's Day, ${targetName}! Of all the beautiful things in the world, your smile is still my absolute favorite. Thank you for being you. ✨`,
    `Wishing you a day as sweet, lovely, and wonderful as you are, ${targetName}. You mean more to me than words can ever express. 🚀💖`,

    // --- BAHASA PRANCIS (2) ---
    `Joyeuse Saint-Valentin, ${targetName}! Tu es mon coup de cœur, la plus belle chose qui m'soit arrivée di dalam hidup ini. 🌹`,
    `Mon cœur t'appartient, ${targetName}. Terima kasih telah membawa begitu banyak cinta, kedamaian, dan warna baru di hari-hariku. 🌙❤️`,

    // --- BAHASA JEPANG & KOREA (2) ---
    `ハッピーバレンタイン、${targetName}! (Happī Barentain!) Semoga hari ini membawa banyak kebahagiaan dan kasih sayang yang tulus untukmu. 🌸`,
    `해피 발렌타인데이, ${targetName}! (Haepi ballentaindei!) Semoga harimu seindah senyumanmu, selalu sehat, dan dipenuhi kejutan manis! 🌟`
  ];

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Gagal menyalin link", err);
    }
  };

  const handleNextWish = () => {
    setWishIndex((prev) => (prev + 1) % valentineWishes.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND BLOW */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[140px]" />
      </div>

      {/* FLOATING HEARTS ANIMATION */}
      {isSurprised && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {heartParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute text-rose-500/30 select-none"
              style={{ left: `${p.x}%`, bottom: "-10%" }}
              animate={{
                y: ["0vh", "-115vh"],
                x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
                rotate: [p.rotate, p.rotate + 360],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            >
              <Heart size={p.size} className="fill-rose-500/20" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-20 max-w-xl w-full">
        <AnimatePresence mode="wait">
          
          {/* ================= FASE 1: GENERATOR LINK (PENGIRIM) ================= */}
          {!isSurprised ? (
            <motion.div
              key="input-stage"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-md space-y-6 text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
                <Send size={22} className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-rose-300 to-pink-400">
                  Valentine Letter Builder
                </h1>
                <p className="text-sm text-slate-400">
                  Ketik nama seseorang yang ingin kamu kirimi surat cinta/ucapan manis digital, lalu bagikan tautannya.
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
                    placeholder="Masukkan nama doi (misal: Syahriza)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-500/10 transition-all cursor-pointer"
                >
                  Buat Surat Valentine kustom
                </button>
              </form>

              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-left space-y-2"
                >
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Tautan Siap Dikirim:</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full bg-transparent text-xs font-mono text-rose-400 focus:outline-none select-all truncate"
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
                  {isCopied && (
                    <p className="text-[11px] text-emerald-400 font-medium pt-1 animate-pulse">
                      ✨ Berhasil disalin! Sekarang berikan link ini ke {inputName}.
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            
            // ================= FASE 2: DISPLAY SURPRISE (PENERIMA) =================
            <motion.div
              key="celebration-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 14 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono tracking-wider uppercase"
                >
                  <Sparkles size={12} className="animate-spin" /> Khusus Untukmu Hari Ini
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-rose-300 to-pink-400">
                  Happy Valentine, <br />
                  <span className="text-white drop-shadow-[0_0_15px_rgba(244,63,94,0.2)]">{targetName}! 💖</span>
                </h1>
              </div>

              {/* INTERAKSI UTAMA: AMPLOP / KADO SURAT CINTA */}
              <div className="perspective-1000">
                <motion.div
                  layout
                  className={`w-full min-h-[240px] rounded-3xl bg-slate-900/40 border p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 backdrop-blur-sm ${
                    isLetterOpen ? "border-rose-500/30 shadow-2xl shadow-rose-500/5" : "border-white/10 hover:border-white/20 cursor-pointer"
                  }`}
                  onClick={() => !isLetterOpen && setIsLetterOpen(true)}
                >
                  <AnimatePresence mode="wait">
                    {!isLetterOpen ? (
                      
                      /* Amplop Tertutup */
                      <motion.div
                        key="letter-closed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-4 flex flex-col items-center"
                      >
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="w-16 h-16 rounded-2xl bg-linear-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20"
                        >
                          <Mail size={28} className="stroke-[1.5]" />
                        </motion.div>
                        <div>
                          <h4 className="text-base font-bold">Kamu menerima sebuah surat rahasia</h4>
                          <p className="text-xs text-slate-400">Klik segel amplop untuk membuka untaian kata manis</p>
                        </div>
                      </motion.div>
                    ) : (
                      
                      /* Amplop Terbuka (Isi Teks Ucapan) */
                      <motion.div
                        key="letter-open"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col items-center w-full"
                      >
                        <div className="flex items-center gap-2 text-pink-400 bg-pink-500/5 border border-pink-500/10 px-3 py-1 rounded-full text-xs font-mono">
                          <Heart size={12} className="fill-pink-400/30 animate-pulse" /> Valentine Wishes Unlocked
                        </div>

                        <div className="min-h-[80px] flex items-center justify-center px-2">
                          <motion.p
                            key={wishIndex}
                            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                            className="text-slate-200 text-sm md:text-base leading-relaxed italic font-light max-w-md"
                          >
                            &quot;{valentineWishes[wishIndex]}&quot;
                          </motion.p>
                        </div>

                        {/* Tombol Acak Ucapan */}
                        <div className="pt-4 border-t border-white/5 w-full flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Mencegah pemicu klik kontainer luar
                              handleNextWish();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                          >
                            <RefreshCw size={12} /> Buka Lembar Selanjutnya
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Reset Perayaan (Opsi Pembuat) */}
              {isLetterOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-mono text-slate-600 flex justify-center gap-4 pt-2"
                >
                  <span className="flex items-center gap-1"><Smile size={12} /> Spread <span className="text-rose-400">love</span> everywhere!</span>
                  {nameParam && (
                    <>
                      <span>•</span>
                      <button 
                        onClick={() => {
                          setIsSurprised(false);
                          setIsLetterOpen(false);
                          setInputName("");
                          window.history.pushState({}, "", window.location.pathname);
                        }} 
                        className="text-rose-400 hover:underline underline-offset-4 cursor-pointer"
                      >
                        Buat Surat Baru
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Wrapper Utama dengan Batas Safeguard Suspense Next.js
export default function ValentinePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-500 font-mono text-xs flex items-center justify-center">
        Menghidupkan Suasana Romantis...
      </div>
    }>
      <ValentineContent />
    </Suspense>
  );
}