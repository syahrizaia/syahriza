/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  Moon, 
  Sparkles, 
  Mail, 
  RefreshCw, 
  User, 
  Copy, 
  Check, 
  Compass, 
  Smile,
  Heart,
  VolumeX,
  Volume2
} from "lucide-react";

// Generator Partikel Bintang Malam Syawal
const generateStars = (count = 35) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 4 + 4,
    size: Math.random() * 6 + 3,
    opacity: Math.random() * 0.5 + 0.3,
  }));
};

function EidContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  const [inputName, setInputName] = useState("");
  const [targetName, setTargetName] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const [isLanternLit, setIsLanternLit] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const [starParticles, setStarParticles] = useState<any[]>([]);
  
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const [hijriYear, setHijriYear] = useState("1447");

  // Deteksi otomatis param URL (?name=Syahriza)
  useEffect(() => {
    if (nameParam) {
      setTargetName(nameParam);
      setIsCelebrating(true);
    }
  }, [nameParam]);

  // Siapkan efek malam berbintang jika fase perayaan aktif
  useEffect(() => {
    if (isCelebrating) {
      setStarParticles(generateStars(40));
    }
  }, [isCelebrating]);

  useEffect(() => {
    const playAudio = () => {
      if (isCelebrating && audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay diblokir browser, musik akan aktif setelah ketukan pertama.");
        });
      }
    };

    playAudio();

    const handleFirstTap = () => {
      if (isCelebrating && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      // Bersihkan listener setelah interaksi pertama terjadi
      window.removeEventListener("click", handleFirstTap);
      window.removeEventListener("touchstart", handleFirstTap);
    };

    if (isCelebrating) {
      window.addEventListener("click", handleFirstTap);
      window.addEventListener("touchstart", handleFirstTap);
    }

    return () => {
      window.removeEventListener("click", handleFirstTap);
      window.removeEventListener("touchstart", handleFirstTap);
    };
  }, [isCelebrating]);

  // Fungsi Toggle Mute Manual
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // Mengambil tahun Hijriah secara otomatis berdasarkan tanggal saat ini
    const formattedYear = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { year: 'numeric' })
      .formatToParts(new Date())
      .find(part => part.type === 'year')?.value;

    if (formattedYear) {
      setHijriYear(formattedYear);
    }
  }, []);

  const eidWishes = [
    // --- BAHASA INDONESIA (4) ---
    `Selamat Hari Raya Idul Fitri ${hijriYear} H, ${targetName}! Di hari yang suci ini, semoga segala 'error' di masa lalu dihapus, dan hidup kita kembali di-deploy bersih dengan penuh berkah. Mohon maaf lahir & batin! 💻🌙`,
    `Taqabbalallahu minna wa minkum. Selamat Lebaran, ${targetName}! Semoga kebahagiaan, kedamaian hati, dan kelimpahan rezeki selalu menyertai langkahmu serta keluarga besar. 🤲✨`,
    `Matahari Syawal telah terbit membawa kesucian. Selamat Idul Fitri, ${targetName}! Mari bersihkan hati, ulurkan tangan, dan rajut kembali tali silaturahmi dengan keikhlasan yang tulus. 💚🎉`,
    `Selamat Hari Raya Idul Fitri, ${targetName}! Terima kasih sudah selalu menjadi sosok yang menginspirasi. Selamat berkumpul, menikmati ketupat, dan merayakan kemenangan ini! 🍲⭐`,

    // --- BAHASA INGGRIS (2) ---
    `Eid Mubarak, ${targetName}! May this blessed day fill your life with endless joy, peace of mind, and immense prosperity. Wishing you a wonderful celebration with your family! ✨`,
    `Happy Eid al-Fitr, ${targetName}! May Allah's divine blessings light up your path, wash away all worries, and bring your heart closer to your biggest dreams. 🚀🕌`,

    // --- BAHASA ARAB (2) ---
    `عيد مبارك يا ${targetName}! (Eid Mubarak!) تقبل الله منا ومنكم صالح الأعمال. Semoga Allah menerima segala amal ibadah kita dan melimpahkan rahmat-Nya di hari yang suci ini. 🌙`,
    `كل عام وأنت بخير يا ${targetName}! (Kullu 'am wa anta/anti bikhair!) Selamat Hari Raya, semoga engkau senantiasa berada dalam kebaikan, kedamaian, dan kebahagiaan di setiap tahunnya. 🤲✨`,

    // --- BAHASA DAERAH & LAINNYA (2) ---
    `Wilujeng Boboran Siyam Idul Fitri, ${targetName}! Neda tawakuf tina samudaya kalepatan, bilih aya saur anu teu kaukur atanapi laku anu teu merenah. Kedaling rasa ikhlas tina jero manah. 🌾💚`,
    `Mete Hanedanlığı Bayramınız Mübarek Olsun, ${targetName}! (Ramazan Bayramınız Mübarek Olsun!) Semoga kedamaian dan kehangatan berkah Idul Fitri menyelimuti harimu sepanjang tahun. 🌟`
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
    setWishIndex((prev) => (prev + 1) % eidWishes.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6 text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* ELEMEN AUDIO TERSEMBUNYI */}
      <audio
        ref={audioRef}
        src="/eid-song.mp3" 
        loop
        preload="auto"
      />

      {/* TOMBOL MUTE ELEGAN MENGAMBANG */}
      {isCelebrating && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMute}
          className="fixed top-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-white hover:text-rose-400 hover:border-rose-500/40 shadow-xl cursor-pointer transition-all flex items-center justify-center"
          title={isMuted ? "Putar Musik" : "Senapkan Musik"}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-rose-500 animate-pulse" />
          ) : (
            <Volume2 size={20} className="text-pink-400 animate-bounce" />
          )}
        </motion.button>
      )}
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[150px]" />
      </div>

      {/* AMINASI BINTANG MENGAMBANG */}
      {isCelebrating && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {starParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bg-amber-300 rounded-full"
              style={{ left: `${p.x}%`, top: "-5%", width: p.size, height: p.size }}
              animate={{
                y: ["0vh", "105vh"],
                opacity: [0, p.opacity, p.opacity, 0],
                scale: [1, 1.3, 1],
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
          
          {/* ================= FASE 1: GENERATOR LINK (PENGIRIM) ================= */}
          {!isCelebrating ? (
            <motion.div
              key="generator-form"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="rounded-3xl bg-slate-900/40 border border-white/10 p-8 shadow-2xl backdrop-blur-md space-y-6 text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Compass size={24} className="animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-emerald-300 to-amber-400">
                  Idul Fitri Wish Builder
                </h1>
                <p className="text-sm text-slate-400">
                  Buat tautan kartu ucapan selamat Lebaran digital khusus. Ketik nama kerabat atau teman, lalu bagikan link-nya!
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
                    placeholder="Masukkan nama penerima (misal: Ayah & Bunda)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                >
                  Generate Kartu Lebaran
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
                      className="w-full bg-transparent text-xs font-mono text-emerald-400 focus:outline-none select-all truncate"
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
                      ✨ Tautan berhasil disalin! Silakan kirimkan ke {inputName}.
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            
            // ================= FASE 2: HALAMAN UTAMA (PENERIMA) =================
            <motion.div
              key="eid-celebration"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 95, damping: 14 }}
              className="space-y-8 text-center mt-6"
            >
              <div className="space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase"
                >
                  <Moon size={12} className="animate-pulse text-amber-400" /> 1 Syawal {hijriYear} H
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-emerald-300 to-amber-300">
                  Selamat Idul Fitri, <br />
                  <span className="text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">{targetName}! 🌙</span>
                </h1>
              </div>

              {/* INTERAKSI 1: LENTERA MALAM TAKBIRAN */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 flex flex-col items-center justify-center gap-4 shadow-xl backdrop-blur-sm"
              >
                <div className="relative">
                  <AnimatePresence>
                    {isLanternLit && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className={`p-5 rounded-2xl transition-all duration-500 ${isLanternLit ? "bg-slate-800 text-amber-400 border border-amber-500/30" : "bg-slate-950 text-slate-700 border border-transparent"}`}>
                    <Sparkles size={36} className={`${isLanternLit ? "animate-spin" : ""}`} style={{ animationDuration: '12s' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    {isLanternLit ? "Lentera Kemenangan Menyala ✨" : "Lentera Redup"}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    {isLanternLit ? "Lampu hiasan takbir menyala terang, memancarkan kedamaian dan kehangatan fitrah di malam hari." : "Ketuk tombol untuk menyalakan kembali cahaya hangat Idul Fitri."}
                  </p>
                </div>

                <button
                  onClick={() => setIsLanternLit(!isLanternLit)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isLanternLit 
                      ? "bg-slate-800 text-slate-400 hover:text-white border border-white/5" 
                      : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20"
                  }`}
                >
                  {isLanternLit ? "Matikan Lentera" : "Nyalakan Lentera 💡"}
                </button>
              </motion.div>

              {/* INTERAKSI 2: AMPLOP KARTU UCAPAN LEBARAN */}
              <div className="perspective-1000">
                <motion.div
                  layout
                  className={`w-full min-h-[230px] rounded-3xl bg-slate-900/40 border p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 backdrop-blur-sm ${
                    isCardOpen ? "border-emerald-500/30 shadow-2xl shadow-emerald-500/5" : "border-white/10 hover:border-white/20 cursor-pointer"
                  }`}
                  onClick={() => !isCardOpen && setIsCardOpen(true)}
                >
                  <AnimatePresence mode="wait">
                    {!isCardOpen ? (
                      
                      /* Amplop Tertutup */
                      <motion.div
                        key="card-closed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-3 flex flex-col items-center"
                      >
                        <motion.div 
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"
                        >
                          <Mail size={26} className="stroke-[1.5]" />
                        </motion.div>
                        <div>
                          <h4 className="text-base font-bold">Ada pesan silaturahmi masuk</h4>
                          <p className="text-xs text-slate-400">Klik amplop hijau untuk membuka jalinan doa terbaik</p>
                        </div>
                      </motion.div>
                    ) : (
                      
                      /* Amplop Terbuka (Isi Doa Lebaran) */
                      <motion.div
                        key="card-open"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col items-center w-full"
                      >
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-full text-xs font-mono">
                          <Heart size={12} className="fill-amber-400/20 animate-pulse" /> Maaf Lahir Batin Terbuka
                        </div>

                        <div className="min-h-[70px] flex items-center justify-center px-2">
                          <motion.p
                            key={wishIndex}
                            initial={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
                            className="text-slate-200 text-sm md:text-base leading-relaxed italic font-light max-w-md"
                          >
                            &quot;{eidWishes[wishIndex]}&quot;
                          </motion.p>
                        </div>

                        {/* Tombol Siklus Ucapan */}
                        <div className="pt-4 border-t border-white/5 w-full flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Amankan dari pemicu klik kontainer luar
                              handleNextWish();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                          >
                            <RefreshCw size={12} /> Buka Lembar Berikutnya
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* FIX LINK & CLEAN STATE: TOMBOL BUAT SURAT BARU */}
              {isCardOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-mono text-slate-600 flex justify-center gap-4 pt-2"
                >
                  <span className="flex items-center gap-1"><Smile size={12} /> Taqabbalallahu minna wa minkum.</span>
                  {nameParam && (
                    <>
                      <span>•</span>
                      <button 
                        onClick={() => {
                          setIsCelebrating(false); // Balik ke form awal
                          setIsLanternLit(true);   // Reset state lampion
                          setIsCardOpen(false);    // Tutup amplop kado
                          setInputName("");        // Bersihkan input
                          setTargetName("");       // Bersihkan target nama
                          
                          // Bersihkan parameter query url (?name=...) agar tidak ke-lock saat di-refresh
                          window.history.pushState({}, "", window.location.pathname);
                        }} 
                        className="text-emerald-400 hover:underline underline-offset-4 cursor-pointer"
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

// Pembungkus Utama dengan Sistem Batas Safeguard Suspense Next.js
export default function EidPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-500 font-mono text-xs flex items-center justify-center">
        Menggemakan Gema Takbiran Suci...
      </div>
    }>
      <EidContent />
    </Suspense>
  );
}