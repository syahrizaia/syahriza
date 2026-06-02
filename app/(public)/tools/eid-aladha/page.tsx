/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  Moon, 
  Mail, 
  RefreshCw, 
  User, 
  Copy, 
  Check, 
  Flame, 
  Smile,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";

// Generator Partikel Bara Api Keikhlasan (Floating Embers)
const generateEmbers = (count = 30) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 4,
    size: Math.random() * 5 + 2,
    opacity: Math.random() * 0.6 + 0.4,
  }));
};

function EidAdhaContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  const [inputName, setInputName] = useState("");
  const [targetName, setTargetName] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const [isEmberHot, setIsEmberHot] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const [emberParticles, setEmberParticles] = useState<any[]>([]);
  
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [hijriYear, setHijriYear] = useState("1447");

  // Deteksi otomatis param URL (?name=Syahriza)
  useEffect(() => {
    if (nameParam) {
      setTargetName(nameParam);
      setIsCelebrating(true);
    }
  }, [nameParam]);

  // Siapkan efek bara mengambang jika perayaan aktif
  useEffect(() => {
    if (isCelebrating) {
      setEmberParticles(generateEmbers(35));
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

  const handleOpenCard = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Autoplay diblokir:", err));
    }
  };

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

  const adhaWishes = [
    // --- BAHASA INDONESIA (4) ---
    `Selamat Hari Raya Idul Adha ${hijriYear} H, ${targetName}! Semoga semangat pengorbanan Nabi Ibrahim AS menginspirasi kita untuk terus membersihkan hati, berbagi kebahagiaan, dan memperkuat keikhlasan di setiap baris perjalanan hidup kita. 🕋🐑`,
    `Selamat Lebaran Haji, ${targetName}! Di hari yang penuh berkah ini, semoga sate dan gulai qurbanmu melimpah, begitu pula dengan aliran pahala, kesehatan, serta kebahagiaan untukmu dan keluarga. 🥩✨`,
    `Kurban lebih dari sekadar berbagi daging; ia adalah simbol ketulusan menyerahkan yang terbaik. Selamat Idul Adha, ${targetName}! Semoga Allah menerima seluruh amal ibadah dan kurban kita tahun ini. 🤲💚`,
    `Selamat Hari Raya Idul Adha, ${targetName}! Semoga kehangatan momen kumpul keluarga, gema takbir yang mengangkasa, dan berkah ampunan senantiasa menyelimuti harimu. Merdeka dalam berbagi! 🌾🌟`,

    // --- BAHASA INGGRIS (2) ---
    `Eid al-Adha Mubarak, ${targetName}! May the divine blessings of Allah bring you immense hope, pure happiness, and infinite peace on this festival of sacrifice. Have a wonderful feast! 🐏✨`,
    `Happy Eid al-Adha, ${targetName}! Wishing you a day filled with laughter, delicious meals, and the warm company of your loved ones. May your sacrifices be appreciated by the Almighty. 🚀🕌`,

    // --- BAHASA ARAB (2) ---
    `عيد أضحى مبارك يا ${targetName}! (Eid Adha Mubarak!) تقبل الله منا ومنكم صالح الأعمال. Semoga Allah melimpahkan rahmat, pengampunan, dan kebahagiaan yang berlipat ganda untukmu. 🌙`,
    `كل عام وأنت بخير بمناسبة عيد الأضحى يا ${targetName}! (Kullu 'am wa anta/anti bikhair!) Semoga setiap tahunnya membawamu semakin dekat dengan impian besar dan ketakwaan yang hakiki. 🤲🔥`,

    // --- BAHASA DAERAH & LAINNYA (2) ---
    `Wilujeng Mapag Boboran Agung Idul Adha, ${targetName}! Mugi Allah SWT maparin kakiatan, kabarokahan, jalaran keikhlasan kurban urang sadaya janten amal soleh anu nyalametkeun di dunya sareng akhirat. 🌾💚`,
    `Kurban Bayramınız Mübarek Olsun, ${targetName}! Semoga berkah kedamaian, persaudaraan, dan kehangatan hidangan Idul Adha menyertai setiap langkah hidupmu ke depan. 🌟`
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
    setWishIndex((prev) => (prev + 1) % adhaWishes.length);
  };

  return (
    <>
      {!isOpen ? (
        /* ================= TAMPILAN TOMBOL PEMBUKA (SPLASH SCREEN) ================= */
        /* Layar ini yang bertugas memancing interaksi user agar browser mengizinkan audio berputar */
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-6 text-center">
          <div className="space-y-2 mb-6">
            <h1 className="text-xl font-bold text-white">Ada kiriman surat spesial untukmu! ✉️</h1>
            <p className="text-xs text-slate-400">Ketuk tombol di bawah untuk membuka kartu ucapan.</p>
          </div>
          <button 
            onClick={handleOpenCard}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black font-mono text-xs uppercase tracking-widest rounded-xl shadow-xl active:scale-95 hover:brightness-110 transition-all cursor-pointer"
          >
            Lihat Kartu & Putar Musik 🎵
          </button>
        </div>
      ) : (
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
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[150px]" />
          </div>

          {/* ANIMASI BARA API MENGAMBANG */}
          {isCelebrating && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              {emberParticles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"
                  style={{ left: `${p.x}%`, bottom: "-5%", width: p.size, height: p.size }}
                  animate={{
                    y: ["0vh", "-110vh"],
                    x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
                    opacity: [0, p.opacity, p.opacity, 0],
                    scale: [1, 1.4, 0.6],
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
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Flame size={24} className="animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-emerald-300 to-orange-400">
                      Idul Adha Wish Builder
                    </h1>
                    <p className="text-sm text-slate-400">
                      Buat kartu ucapan selamat merayakan qurban kustom untuk sahabat, rekan tim, atau kerabat dekat Anda.
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
                        placeholder="Masukkan nama penerima (misal: Om & Tante)"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs font-mono uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/10 transition-all cursor-pointer"
                    >
                      Generate Surat Berkah Qurban
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
                          className="w-full bg-transparent text-xs font-mono text-orange-400 focus:outline-none select-all truncate"
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
                          ✨ Tautan berhasil disalin! Kirimkan ke {inputName} sekarang juga.
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                
                // ================= FASE 2: HALAMAN UTAMA (PENERIMA) =================
                <motion.div
                  key="adha-celebration"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 95, damping: 14 }}
                  className="space-y-8 text-center mt-6"
                >
                  <div className="space-y-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono tracking-wider uppercase"
                    >
                      <Moon size={12} className="animate-pulse text-amber-400" /> 10 Dzulhijjah {hijriYear} H
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-emerald-300 to-orange-400">
                      Selamat Idul Adha, <br />
                      <span className="text-white drop-shadow-[0_0_15px_rgba(249,115,22,0.15)]">{targetName}! 🥩</span>
                    </h1>
                  </div>

                  {/* INTERAKSI 1: BARA API KEIKHLASAN */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 flex flex-col items-center justify-center gap-4 shadow-xl backdrop-blur-sm"
                  >
                    <div className="relative">
                      <AnimatePresence>
                        {isEmberHot && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: [1, 1.15, 1] }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                      
                      <div className={`p-5 rounded-2xl transition-all duration-500 ${isEmberHot ? "bg-slate-800 text-orange-400 border border-orange-500/30" : "bg-slate-950 text-slate-700 border border-transparent"}`}>
                        <Flame size={36} className={`${isEmberHot ? "animate-bounce" : ""}`} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold">
                        {isEmberHot ? "Bara Semangat Berbagi Menyala 🔥" : "Bara Meredup"}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                        {isEmberHot ? "Percikan keikhlasan berqurban menyala hangat, melambangkan kebersamaan dan kenikmatan hidangan hari raya." : "Ketuk tombol untuk memicu kembali kehangatan bara pesta qurban."}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsEmberHot(!isEmberHot)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isEmberHot 
                          ? "bg-slate-800 text-slate-400 hover:text-white border border-white/5" 
                          : "bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-lg shadow-orange-500/20"
                      }`}
                    >
                      {isEmberHot ? "Redupkan Bara" : "Tiup Kobarkan Bara 💨"}
                    </button>
                  </motion.div>

                  {/* INTERAKSI 2: AMPLOP KARTU UCAPAN DIGITAL */}
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
                              className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20"
                            >
                              <Mail size={26} className="stroke-[1.5]" />
                            </motion.div>
                            <div>
                              <h4 className="text-base font-bold">Pesan Tulus Keikhlasan</h4>
                              <p className="text-xs text-slate-400">Klik amplop hijau untuk membaca rangkaian untaian doa lebaran</p>
                            </div>
                          </motion.div>
                        ) : (
                          
                          /* Amplop Terbuka (Isi Ucapan) */
                          <motion.div
                            key="card-open"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 flex flex-col items-center w-full"
                          >
                            <div className="flex items-center gap-2 text-amber-400 bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-full text-xs font-mono">
                              <Heart size={12} className="fill-amber-400/20 animate-pulse" /> Qurban Wish Unlocked
                            </div>

                            <div className="min-h-[70px] flex items-center justify-center px-2">
                              <motion.p
                                key={wishIndex}
                                initial={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
                                className="text-slate-200 text-sm md:text-base leading-relaxed italic font-light max-w-md"
                              >
                                &quot;{adhaWishes[wishIndex]}&quot;
                              </motion.p>
                            </div>

                            {/* Tombol Siklus Ucapan */}
                            <div className="pt-4 border-t border-white/5 w-full flex justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Amankan dari bubbling klik pembungkus luar
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

                  {/* FITUR RESET PARAMS & STATE AMAN */}
                  {isCardOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-mono text-slate-600 flex justify-center gap-4 pt-2"
                    >
                      <span className="flex items-center gap-1"><Smile size={12} /> Selamat merayakan kelimpahan berqurban.</span>
                      {nameParam && (
                        <>
                          <span>•</span>
                          <button 
                            onClick={() => {
                              setIsCelebrating(false); // Kembalikan ke Fase 1 (Form)
                              setIsEmberHot(true);     // Reset animasi bara api
                              setIsCardOpen(false);    // Tutup amplop
                              setInputName("");        // Bersihkan input teks
                              setTargetName("");       // Bersihkan target
                              
                              // Bersihkan query URL ?name= agar tidak terkunci saat direfresh
                              window.history.pushState({}, "", window.location.pathname);
                            }} 
                            className="text-orange-400 hover:underline underline-offset-4 cursor-pointer"
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
      )}

      <audio ref={audioRef} src="/lagu-ulang-tahun.mp3" loop preload="auto" />
    </>
  );
}

// Komponen Utama Ekspor Terproteksi Struktur Suspense Next.js
export default function EidAdhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-500 font-mono text-xs flex items-center justify-center">
        Menghidupkan Bara Gema Takbir Raya...
      </div>
    }>
      <EidAdhaContent />
    </Suspense>
  );
}