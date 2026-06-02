/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Award, BookOpen, Sparkles, Play, Volume2, VolumeX, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface GraduationData {
  graduate_name: string;
  degree_title: string; // Contoh: S.Kom., S.T., M.B.A.
  university: string;
  major: string;
  sender_name: string;
  special_message: string;
  song_url: string; // Tautan audio latar belakang (.mp3)
  graduation_year: number;
  photo_url?: string;
}

interface ThrownCap {
  id: number;
  startX: number;
  peakY: number;
  endX: number;
  duration: number;
  rotation: number;
  scale: number;
}

const SLIDE_DURATION = 6000; // 6 detik per slide biar sempat baca pesan

export default function GraduationCardViewer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<GraduationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [caps, setCaps] = useState<ThrownCap[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Fungsi Mekanisme Pelemparan Topi Wisuda
  const throwCapsSelebrasi = () => {
    const newCaps = Array.from({ length: 15 }).map((_, i) => {
      const startX = Math.random() * 300 - 150; // Posisi horizontal acak awal (-150px sampai 150px dari tengah)
      const driftX = Math.random() * 160 - 80;   // Efek tertiup angin saat melayang ke kiri/kanan
      return {
        id: Date.now() + i,
        startX: startX,
        peakY: -(Math.random() * 250 + 350),     // Tinggi lambungan topi ke atas (-350px sampai -600px)
        endX: startX + driftX,
        duration: Math.random() * 1.2 + 1.8,     // Durasi melayang (1.8s sampai 3s)
        rotation: Math.random() * 720 - 360,     // Putaran derajat spin topi
        scale: Math.random() * 0.4 + 0.8,        // Ukuran variasi topi (perspektif jauh dekat)
      };
    });

    setCaps((prev) => [...prev, ...newCaps]);

    // Bersihkan state topi lama setelah selesai jatuh agar tidak membebani memori browser
    setTimeout(() => {
      setCaps((prev) => prev.filter((cap) => !newCaps.find((n) => n.id === cap.id)));
    }, 3200);
  };

  // Ambil data kartu ucapan dari Supabase
  useEffect(() => {
    async function fetchGraduationData() {
      const { data: cardData, error } = await supabase
        .from("graduation_cards")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error && cardData) setData(cardData);
      setLoading(false);
    }
    fetchGraduationData();
  }, [id]);

  // Logika Jalannya Progress Bar & Auto-Next
  useEffect(() => {
    if (!hasStarted || !data) return;

    setProgress(0);
    const startTime = Date.now();

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= SLIDE_DURATION) {
        clearInterval(progressInterval.current!);
        handleNext();
      }
    }, 40);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [hasStarted, currentSlide, data]);

  // Otomatis lempar topi ketika user menyentuh slide terakhir (Slide Index 4)
  useEffect(() => {
    if (currentSlide === 4 && hasStarted) {
      // Kasih delay tipis 300ms setelah transisi slide selesai agar animasi tampak dramatis
      const timer = setTimeout(() => {
        throwCapsSelebrasi();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, hasStarted]);

  // Pengontrol Audio Otomatis (Menggunakan sistem Fallback jika tautan rusak)
  useEffect(() => {
    if (!hasStarted || !audioRef.current || !data) return;

    // Jika audioError true karena link input salah/bukan .mp3, gunakan musik instrumen kelulusan default
    const standardAudio = "/graduation-song.mp3"; 
    const targetTrack = audioError ? standardAudio : (data.song_url || standardAudio);

    if (audioRef.current.src !== targetTrack) {
      audioRef.current.src = targetTrack;
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.log("Pemutaran audio diblokir atau format salah, mencoba fallback...", err);
        setAudioError(true);
      });
    }
  }, [hasStarted, data, audioError]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-amber-400 font-mono text-xs flex items-center justify-center tracking-widest animate-pulse">MENYIAPKAN PANGGUNG KELULUSAN...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-slate-950 text-red-400 font-mono text-xs flex items-center justify-center">Kartu ucapan wisuda tidak ditemukan. ❌</div>;
  }

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setProgress(100); // Berhenti di akhir slide
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  const startViewer = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Lembar Slide Konten Kartu Ucapan
  const slides = [
    // Slide 1: Sampul Selebrasi Utama
    <div key="g1" className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-6 relative overflow-hidden">
      <div className="absolute top-10 opacity-10 animate-spin-[spin_20s_linear_infinite]"><Sparkles size={200} className="text-amber-400" /></div>
      <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-5 rounded-full bg-amber-500/10 border-2 border-amber-400/30 shadow-lg shadow-amber-500/5">
        <GraduationCap size={56} className="text-amber-400 animate-bounce" />
      </motion.div>
      <div className="space-y-2 z-10">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400 font-bold">Happy Graduation</p>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-white px-2">
          Selamat Atas Kelulusanmu!
        </h2>
      </div>
      <p className="text-sm text-slate-400 max-w-xs font-light leading-relaxed">Hari yang dinanti telah tiba. Mari kita lihat kilas balik perjuangan akademismu yang luar biasa.</p>
    </div>,

    // Slide 2: Profil & Gelar Baru
    <div key="g2" className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-5">
      <Award size={44} className="text-emerald-400" />
      <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Menyambut Gelar Baru</p>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative w-28 h-28 rounded-full border-2 border-emerald-400/40 p-1 bg-slate-950/50 shadow-xl shadow-emerald-500/10 overflow-hidden"
      >
        {data.photo_url ? (
          <Image
            src={data.photo_url} 
            alt={data.graduate_name} 
            fill
            className="w-full h-full object-cover rounded-full pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-emerald-500/10 rounded-full flex items-center justify-center text-3xl pointer-events-none">
            👨‍🎓
          </div>
        )}
      </motion.div>
      
      <div className="space-y-1 py-4 px-2 w-full">
        <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400">
          {data.graduate_name}
        </motion.h3>
        <p className="text-sm font-mono font-bold text-emerald-400 tracking-wider bg-emerald-500/10 py-1 px-3 rounded-full inline-block border border-emerald-500/20">
          {data.degree_title}
        </p>
      </div>

      <div className="space-y-1 text-slate-300 font-light text-sm border-t border-white/5 pt-4 w-full max-w-[260px]">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <BookOpen size={13} /> {data.major}
        </div>
        <p className="font-medium text-xs text-slate-300 truncate">{data.university}</p>
      </div>
    </div>,

    // Slide 3: Pesan Utama / Ucapan Hangat
    <div key="g3" className="bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 flex flex-col justify-center p-8 h-full space-y-4">
      <div className="space-y-1">
        <p className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">A Special Message</p>
        <h4 className="text-lg font-bold text-white">Untaian Doa & Harapan</h4>
      </div>
      
      {/* Box Pesan dibuat rapi dan scrollable tipis jika teks terlalu panjang */}
      <div className="flex-1 max-h-[50%] overflow-y-auto bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner backdrop-blur-sm scrollbar-none">
        <p className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line italic">
          &quot;{data.special_message}&quot;
        </p>
      </div>
      
      <div className="text-right text-xs text-slate-400 font-mono">
        — Ditulis dengan bangga oleh <span className="text-white font-bold">{data.sender_name}</span>
      </div>
    </div>,

    // Slide 4: Motivasi Masa Depan
    <div key="g4" className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-6">
      <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 animate-pulse">
        <Sparkles size={28} />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">Petualangan Baru Dimulai</p>
        <h4 className="text-xl font-black text-white">The Sky Has No Limit</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed font-light max-w-xs">
        Gelar di tanganmu adalah bukti nyata ketangguhanmu. Dunia kerja, karya, dan impian besar berikutnya sudah menantangmu untuk ditaklukkan. Jangan pernah berhenti belajar!
      </p>
    </div>,

    // Slide 5: Penutup Kartu Ucapan + INTERAKSI LEMPAR TOPI
    <div key="g5" className="bg-gradient-to-b from-blue-950 via-slate-950 to-slate-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-6 relative">
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-4xl pointer-events-none">🎓</motion.div>
      <div className="space-y-1 pointer-events-none">
        <h4 className="text-2xl font-black text-white tracking-tight">Sekali Lagi, Selamat!</h4>
        <p className="text-xs text-slate-400 font-light px-4">Sukses selalu dalam setiap langkah, karir, dan takdir indah yang menantimu di masa depan.</p>
      </div>
      
      {/* TOMBOL INTERAKTIF: Pemicu animasi pelemparan topi wisuda */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Biar tidak memicu fungsi slide-next auto
          throwCapsSelebrasi();
        }}
        className="pointer-events-auto px-5 py-2.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 z-50 cursor-pointer flex items-center gap-2"
      >
        Lempar Topi Lagi! 🎓
      </button>

      <div className="pt-4 border-t border-white/5 w-full max-w-[240px] pointer-events-none">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-amber-400/60 font-mono tracking-widest uppercase">
          Class of {data.graduation_year || 2026}
        </div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20 md:p-6 lg:p-24 relative select-none selection:bg-transparent">
      
      {/* Pengaman Elemen Audio */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto" 
        onError={() => {
          console.log("Error loading audio track, switching to system default.");
          setAudioError(true);
        }}
      />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          /* ================= GERBANG LINK BUKA KARTU (BYPASS AUTOPLAY BROWSER) ================= */
          <motion.div key="grad-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 max-w-sm px-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto shadow-xl"><GraduationCap size={36} /></div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">Ada Surat Untukmu!</h1>
              <p className="text-xs text-slate-400 leading-relaxed px-2">Sebuah kartu ucapan wisuda digital spesial telah dikirimkan oleh <b>{data.sender_name}</b> untuk merayakan kelulusanmu.</p>
            </div>
            <button onClick={startViewer} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black font-mono text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer">
              <Play size={14} className="fill-slate-950" /> Buka Kartu Ucapan
            </button>
          </motion.div>
        ) : (
          /* ================= CANVAS UTAMA SLIDESHOW (MOBILE-FIRST CARD FRAME) ================= */
          <motion.div key="grad-canvas" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[420px] h-screen md:h-[82vh] md:rounded-[32px] bg-slate-900 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Navigasi Sentuh Layar Kiri/Kanan */}
            <div className="absolute inset-0 z-20 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
              <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
            </div>

            {/* 🎓 KANVAS ANIMASI: Render Topi-topi Wisuda yang Dilemparkan */}
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
              <AnimatePresence>
                {caps.map((cap) => (
                  <motion.div
                    key={cap.id}
                    initial={{ x: cap.startX, y: 550, rotate: 0, opacity: 0 }}
                    animate={{
                      x: [cap.startX, (cap.startX + cap.endX) / 2, cap.endX],
                      y: [550, cap.peakY, 650], // Gerakan Parabola: Mulai dari bawah -> Naik Melambung -> Jatuh Lagi ke bawah layar
                      rotate: cap.rotation,
                      opacity: [0, 1, 1, 0], // Memudar saat baru muncul dan saat mau keluar layar bawah
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: cap.duration,
                      ease: [0.25, 0.46, 0.45, 0.94], // Kurva gravitasi yang halus
                    }}
                    style={{ scale: cap.scale }}
                    className="absolute left-1/2 bottom-0 text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                  >
                    🎓
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Top Bar Indicator (Garis Progress Berjalan Atas) */}
            <div className="absolute top-0 inset-x-0 p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent z-40 space-y-3 pointer-events-none">
              <div className="flex gap-1.5 px-1">
                {slides.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-75"
                      style={{ 
                        width: idx === currentSlide ? `${progress}%` : idx < currentSlide ? "100%" : "0%" 
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-mono tracking-[0.2em] font-black text-amber-400/70 flex items-center gap-1"><Sparkles size={10}/> GRADUATION CARD</span>
                <button onClick={toggleMute} className="pointer-events-auto text-white/50 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>

            {/* Tombol Panah Navigasi Layar Lebar (Desktop) */}
            <button onClick={handlePrev} disabled={currentSlide === 0} className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-10 z-40 transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={handleNext} disabled={currentSlide === 4} className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-10 z-40 transition-colors"><ChevronRight size={18} /></button>

            {/* Kontainer Render Slide Aktif */}
            <div className="flex-1 z-30 h-full pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} className="h-full">
                  {slides[currentSlide]}
                </motion.div>
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}