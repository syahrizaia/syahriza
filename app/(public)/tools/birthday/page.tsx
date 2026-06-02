/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  Check,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react";

// Generator Partikel Konfeti yang Lebih Ramai & Bervariasi
const generateConfetti = (count = 60) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2.5, // Sedikit lebih cepat agar dinamis
    size: Math.random() * 10 + 4,
    color: [
      "bg-pink-500", 
      "bg-purple-500", 
      "bg-cyan-400", 
      "bg-amber-400", 
      "bg-emerald-400", 
      "bg-orange-500"
    ][Math.floor(Math.random() * 6)],
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Deteksi otomatis jika ada nama di URL (?name=Yunita)
  useEffect(() => {
    if (nameParam) {
      setTargetName(nameParam);
      setIsCelebrating(true);
    }
  }, [nameParam]);

  // Siapkan efek konfeti jika pesta dimulai
  useEffect(() => {
    if (isCelebrating) {
      setConfettiParticles(generateConfetti(65));
    }
  }, [isCelebrating]);

  useEffect(() => {
    const playAudio = () => {
      if (isCelebrating && audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay diblokir browser, musik akan menyala setelah klik pertama pengguna.");
        });
      }
    };

    // Coba langsung putar musik
    playAudio();

    // Fallback: Jika diblokir, pasang listener klik pertama di window
    const handleFirstUserInteraction = () => {
      if (isCelebrating && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      // Hapus listener setelah interaksi pertama berhasil didapatkan
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };

    if (isCelebrating) {
      window.addEventListener("click", handleFirstUserInteraction);
      window.addEventListener("touchstart", handleFirstUserInteraction);
    }

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, [isCelebrating]);

  // Handler fungsi mute/unmute manual
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const birthdayWishes = [
    // --- BAHASA INDONESIA ---
    `Semoga di usia yang baru ini, setiap baris kode kehidupan ${targetName} selalu sukses tanpa bug, dilimpahkan kebahagiaan, dan segala urusan dipermudah harian. 💻🎂`,
    `Selamat ulang tahun, ${targetName}! Semoga harimu penuh dengan kejutan indah, tawa yang tak henti, dan pencapaian luar biasa di masa depan. 🎉🎁`,
    `Barakallah fii umrik ${targetName}. Semoga sisa umurmu menjadi berkah, dilancarkan segala urusan, dan semakin didekatkan dengan impian-impian besarmu. 🤲🎈`,
    `Selamat hari menetas! Teruslah bersinar, tetap menjadi inspirasi bagi orang-orang di sekitarmu, dan nikmati setiap momen berharga ini, ${targetName}! 🥳⭐`,

    // --- BAHASA INGGRIS ---
    `Happy birthday, ${targetName}! May your life be filled with endless joy, love, and bright success in every amazing path you take. ✨`,
    `Wishing you the happiest of birthdays, ${targetName}! Keep shining, keep writing your wonderful story, and may all your biggest dreams come true. 🚀`,

    // --- BAHASA ARAB ---
    `عيد ميلاد سعيد يا ${targetName}! (Eid Milad Sa'eed!) Semoga panjang umur, selalu sehat, dan dipenuhi keberkahan serta kebahagiaan di setiap langkah barumu. 🌙`,
    `كل عام وأنت بخير يا ${targetName}! (Kullu 'am wa anta/anti bikhair!) Semoga setiap tahunnya selalu membawa kebaikan, kedamaian, dan kelancaran untuk segala urusanmu. 🤲`,

    // --- BAHASA MANDARIN ---
    `祝 ${targetName} 生日快乐！(Zhù nǐ shēngrì kuàilè!) Semoga hari-harimu selalu dipenuhi kebahagiaan, tawa yang ceria, dan semua keinginan baikmu segera dikabulkan. 🌸`,
    `祝 ${targetName} 生日快乐，万事如意！Semoga di usia yang baru ini kamu selalu diberikan kesehatan, dilancarkan segala hal, dan terus bersinar terang! 🌟`
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
      console.error("Gagal menyalin tautan", err);
    }
  };

  const handleNextWish = () => {
    setWishIndex((prev) => (prev + 1) % birthdayWishes.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6 text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* ELEMENT AUDIO (Sembunyi secara visual) */}
      <audio
        ref={audioRef}
        src="/birthday-song.mp3" 
        loop
        preload="auto"
      />

      {/* TOMBOL MUTE MENGAMBANG (Hanya muncul di fase penerima) */}
      {isCelebrating && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMute}
          className="fixed top-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-white hover:text-pink-400 hover:border-pink-500/40 shadow-xl cursor-pointer transition-all flex items-center justify-center"
          title={isMuted ? "Nyalakan Musik" : "Matikan Musik"}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-rose-500 animate-pulse" />
          ) : (
            <Volume2 size={20} className="text-emerald-400 animate-bounce" />
          )}
        </motion.button>
      )}
      
      {/* BACKGROUND AMBIENT GLOW MULTI-WARNA */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[380px] h-[380px] bg-cyan-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[130px]" />
      </div>

      {/* ANIMASI KONFETI HUJAN WARNA-WARNI */}
      {isCelebrating && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {confettiParticles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute rounded-full opacity-85 shadow-xs ${p.color}`}
              style={{ left: `${p.x}%`, top: "-5%", width: p.size, height: p.size }}
              animate={{
                y: ["0vh", "105vh"],
                x: [`${p.x}%`, `${p.x + (Math.random() * 16 - 8)}%`],
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
          
          {/* ================= FASE 1: GENERATOR LINK (WARNA-WARNI NEON) ================= */}
          {!isCelebrating ? (
            <motion.div
              key="generator-stage"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 shadow-2xl backdrop-blur-xl space-y-6 text-center shadow-purple-500/5"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-linear-to-tr from-pink-500 via-purple-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Link2 size={24} className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-pink-400 via-amber-300 via-cyan-400 to-emerald-400 animate-gradient">
                  Birthday Wish Builder
                </h1>
                <p className="text-sm text-slate-400">
                  Buat kejutan penuh warna! Ketik nama target kesayangan Anda, salin tautannya, lalu kirimkan ke dia.
                </p>
              </div>

              <form onSubmit={handleGenerateLink} className="space-y-4 text-left">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Masukkan nama (misal: Syahriza)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-purple-500/20 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-extrabold text-xs font-mono uppercase tracking-wider rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-[0.99] cursor-pointer"
                >
                  🎉 Generate Tautan Kejutan 🎉
                </button>
              </form>

              {/* Tampilan Output Link Hasil Generate */}
              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/20 text-left space-y-2"
                >
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">Siap Dikirim:</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full bg-transparent text-xs font-mono text-cyan-300 focus:outline-none select-all truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                        isCopied 
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" 
                          : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                    {isCopied && <>✨ Link sukses disalin! Kirimkan ke {inputName} sekarang.</>}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            
            // ================= FASE 2: HALAMAN PESTA (UNTUK PENERIMA) =================
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
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-purple-500/30 text-pink-300 text-xs font-mono tracking-wider uppercase font-bold shadow-xs"
                >
                  <PartyPopper size={12} className="animate-bounce text-amber-400" /> 🌟 Kejutan Spesial Untukmu 🌟
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-linear-to-r from-pink-400 via-purple-400 via-amber-300 via-cyan-400 to-emerald-400 filter drop-shadow-md">
                  Happy Birthday, <br />
                  <span className="text-white drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]">{targetName}! ✨</span>
                </h1>
              </div>

              {/* INTERAKSI: KUE & TIUP LILIN (GLOW AMBER & CYAN) */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 flex flex-col items-center justify-center gap-4 shadow-xl backdrop-blur-md"
              >
                <div className="relative">
                  <AnimatePresence>
                    {isCandleLit && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: [1, 1.2, 1] }}
                        exit={{ opacity: 0, y: -10, scale: 0 }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 z-10"
                      >
                        <Flame size={32} className="fill-orange-500 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className={`p-5 rounded-2xl transition-all duration-500 relative ${
                    isCandleLit 
                      ? "bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]" 
                      : "bg-slate-950 text-slate-600 border border-transparent shadow-none"
                  }`}>
                    <Cake size={40} className="stroke-[1.5]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-base font-bold transition-colors ${isCandleLit ? "text-amber-300" : "text-emerald-400"}`}>
                    {isCandleLit ? "Lilin Ulang Tahun Menyala! 🎂" : "Hore! Lilin Berhasil Ditiup! 🎉"}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    {isCandleLit ? "Tarik napas dalam-dalam, pikirkan doa terbaikmu, lalu tekan tombol tiup di bawah!" : "Semoga seluruh permohonan yang kamu langitkan segera dikabulkan oleh-Nya."}
                  </p>
                </div>

                <button
                  onClick={() => setIsCandleLit(!isCandleLit)}
                  className={`px-6 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    isCandleLit 
                      ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-orange-500/10" 
                      : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {isCandleLit ? "💨 Tiup Lilin Ini" : "🔥 Nyalakan Kembali"}
                </button>
              </motion.div>

              {/* INTERAKSI: KADO SURAT UCAPAN (GLOW PINK & PURPLE) */}
              <div className="perspective-1000">
                <motion.div
                  layout
                  className={`w-full min-h-[220px] rounded-3xl bg-slate-900/50 border p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 backdrop-blur-md ${
                    isGiftOpen 
                      ? "border-pink-500/30 shadow-2xl shadow-pink-500/10" 
                      : "border-white/10 hover:border-purple-500/30 cursor-pointer shadow-md"
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
                          animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="w-14 h-14 rounded-2xl bg-linear-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20"
                        >
                          <Gift size={26} className="stroke-[1.5]" />
                        </motion.div>
                        <div>
                          <h4 className="text-base font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-300 to-purple-300">Ada kado amplop spesial digital!</h4>
                          <p className="text-xs text-slate-400">Ketuk kotak kado untuk membaca baris ucapan selamat</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="gift-open"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col items-center w-full"
                      >
                        <div className="flex items-center gap-2 text-pink-400 bg-pink-500/5 border border-pink-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                          <Heart size={12} className="fill-pink-400/20 animate-pulse" /> Letter Opened
                        </div>

                        <div className="min-h-[60px] flex items-center justify-center px-2">
                          <motion.p
                            key={wishIndex}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="text-slate-200 text-sm md:text-base leading-relaxed italic font-medium max-w-md"
                          >
                            &quot;{birthdayWishes[wishIndex]}&quot;
                          </motion.p>
                        </div>

                        <div className="pt-4 border-t border-white/5 w-full flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Amankan dari pemicu klik kontainer luar
                              handleNextWish();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-pink-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                          >
                            <RefreshCw size={12} className="text-purple-400 animate-spin-slow" /> Lihat Doa Lainnya
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Opsi penutup tambahan jika dibuka dari parameter rute */}
              {isGiftOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-2"
                >
                  <span className="flex items-center gap-1 text-slate-400">
                    Created with <Heart size={10} className="text-pink-500 fill-pink-500" /> and <Sparkles size={10} className="text-amber-400" /> inside Ecosystem
                  </span>
                  {nameParam && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <button 
                        onClick={() => {
                          setIsCelebrating(false);
                          setIsCandleLit(true);
                          setIsGiftOpen(false);
                          setInputName("");
                          setTargetName("");
                          window.history.pushState({}, "", window.location.pathname);
                        }} 
                        className="text-cyan-400 hover:text-pink-400 font-bold hover:underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        🎁 Buat Ucapan Baru
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

// Komponen Utama dengan Router Suspense Safeguard
export default function BirthdayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-purple-400 font-mono text-xs flex items-center justify-center gap-2 animate-pulse">
        <Sparkles size={14} className="animate-spin text-pink-400" /> Menyiapkan Panggung Perayaan Penuh Warna...
      </div>
    }>
      <BirthdayContent />
    </Suspense>
  );
}