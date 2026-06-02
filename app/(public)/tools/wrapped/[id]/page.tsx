/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Calendar, Flame, MessageCircle, Play, Volume2, VolumeX, ChevronRight, ChevronLeft, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface WrappedData {
  creator_name: string;
  partner_name: string;
  wrapped_year: number;
  days_together: number;
  fight_count: number;
  inside_joke: string;
  song_title_1: string;
  song_url_1: string;
  song_title_2: string;
  song_url_2: string;
  song_title_3: string;
  song_url_3: string;
  special_message: string;
}

const SLIDE_DURATION = 6000; // 6 detik per slide

export default function WrappedViewer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [useTrack3Fallback, setUseTrack3Fallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const activeTrackRef = useRef<string>("");

  // Ambil Data dari Supabase
  useEffect(() => {
    async function fetchData() {
      const { data: wrappedData, error } = await supabase
        .from("relationship_wrapped")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error && wrappedData) setData(wrappedData);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  // Logika Jalannya Progress Bar & Auto-Next Slide
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

  // Efek Pergantian Musik Latar di Slide Tertentu
  useEffect(() => {
    if (!hasStarted || !audioRef.current || !data) return;

    let targetTrack = data.song_url_1;
    if (currentSlide === 1 || currentSlide === 2 || currentSlide === 3) {
      targetTrack = data.song_url_3;
    }
    if (currentSlide === 4 || currentSlide === 5) {
      targetTrack = data.song_url_2;
    }

    if (useTrack3Fallback) {
      targetTrack = data.song_url_3;
    }

    if (activeTrackRef.current !== targetTrack) {
      activeTrackRef.current = targetTrack;
      audioRef.current.src = targetTrack;
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.log("Gagal memutar lagu, beralih ke lagu ketiga sebagai cadangan resmi:", err);
        // Jika gagal play dan target lagu saat ini bukan lagu ketiga, aktifkan master fallback
        if (targetTrack !== data.song_url_3) {
          setUseTrack3Fallback(true);
        }
      });
    }
  }, [currentSlide, hasStarted, data, useTrack3Fallback]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-500 font-mono text-xs flex items-center justify-center">Membaca arsip memori...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-slate-950 text-red-400 font-mono text-xs flex items-center justify-center">Arsip memori tidak ditemukan. ❌</div>;
  }

  const handleNext = () => {
    if (currentSlide < 5) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // Loop kembali atau berhenti di akhir slide
      setProgress(100);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  const startWrapped = () => {
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

  // Setup Lembar Slide Konten
  const slides = [
    // Slide 1: Welcome Intro
    <div key="s1" className="bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-4">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="p-4 rounded-3xl bg-white/5 border border-white/10"><Heart size={44} className="text-pink-500 fill-pink-500" /></motion.div>
      <h2 className="text-3xl font-black leading-tight tracking-tight">Kilas Balik<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Kisah Kita</span></h2>
      <p className="text-sm text-slate-400 leading-relaxed font-light">Hai {data.partner_name}, {data.creator_name} menyusun rangkuman kilas balik perjalanan kalian di tahun {data.wrapped_year} khusus buatmu.</p>
    </div>,

    // Slide 2: Top Tracks / Soundtrack
    <div key="s2" className="bg-gradient-to-b from-cyan-950 via-slate-900 to-fuchsia-950 flex flex-col justify-center p-8 h-full space-y-6">
      <div className="text-center space-y-1">
        <Music size={32} className="text-fuchsia-400 mx-auto" />
        <h4 className="text-xl font-extrabold">Soundtrack Kebersamaan</h4>
        <p className="text-xs text-slate-400">Lagu yang paling menggambarkan kita:</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-3.5 bg-white/5 rounded-xl border border-white/5">
          <span className="text-xs font-mono font-bold text-fuchsia-400">#1</span>
          <div><p className="text-sm font-bold truncate max-w-[200px]">{data.song_title_1}</p><p className="text-[10px] text-slate-500 font-mono">Top Anthems</p></div>
        </div>
        <div className="flex items-center gap-4 p-3.5 bg-white/5 rounded-xl border border-white/5">
          <span className="text-xs font-mono font-bold text-slate-400">#2</span>
          <div><p className="text-sm font-bold truncate max-w-[200px]">{data.song_title_2 || "Lagu Kenangan"}</p><p className="text-[10px] text-slate-500 font-mono">On Repeat</p></div>
        </div>
        <div className="flex items-center gap-4 p-3.5 bg-white/5 rounded-xl border border-white/5">
          <span className="text-xs font-mono font-bold text-slate-400">#3</span>
          <div><p className="text-sm font-bold truncate max-w-[200px]">{data.song_title_3 || "Lagu Pelengkap"}</p><p className="text-[10px] text-slate-500 font-mono">Vibe Check</p></div>
        </div>
      </div>
    </div>,

    // Slide 3: Drama / Berantem Lucu
    <div key="s3" className="bg-gradient-to-b from-emerald-950 via-slate-900 to-amber-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-4">
      <Flame size={40} className="text-amber-500" />
      <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Keributan Lucu</p>
      <h3 className="text-6xl font-black text-amber-500">{data.fight_count}x</h3>
      <p className="text-lg font-bold">Berantem Karena Hal Sepele</p>
      <p className="text-sm text-slate-400 leading-relaxed font-light italic">&quot;Mulai dari bingung mau makan apa, salah paham ketikan, sampai perkara telat bales chat.&quot;</p>
    </div>,

    // Slide 4: Kamus Kata / Inside Joke
    <div key="s4" className="bg-gradient-to-b from-amber-950 via-slate-900 to-cyan-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-4">
      <MessageCircle size={40} className="text-cyan-400" />
      <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Kamus Kata Terpopuler</p>
      <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xl font-bold tracking-wide font-serif text-cyan-300">
        &quot;{data.inside_joke}&quot;
      </div>
      <p className="text-sm text-slate-400 leading-relaxed font-light">Kata/kalimat di atas resmi dinobatkan sebagai frasa yang paling sering kita lempar tahun ini!</p>
    </div>,

    // Slide 5: Hari Bersama
    <div key="s5" className="bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-4">
      <Calendar size={40} className="text-emerald-400" />
      <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Waktu yang Terlewati</p>
      <motion.h3 initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl font-black text-emerald-400">{data.days_together}</motion.h3>
      <p className="text-lg font-bold">Hari Luar Biasa!</p>
      <p className="text-sm text-slate-400 leading-relaxed font-light">Sejauh ini kita berhasil melewati banyak suka duka bersama tanpa menyerah.</p>
    </div>,

    // Slide 6: Pesan Penutup / Outro
    <div key="s6" className="bg-gradient-to-b from-fuchsia-950 via-slate-900 to-purple-950 flex flex-col justify-center items-center text-center p-8 h-full space-y-4">
      <Award size={40} className="text-pink-400 animate-bounce" />
      <h4 className="text-2xl font-black">Terima Kasih, ya!</h4>
      <p className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line max-w-sm italic">
        &quot;{data.special_message}&quot;
      </p>
      <div className="text-[10px] text-slate-500 font-mono pt-4 border-t border-white/5 w-full">
        - Signed with <span className="text-pink-400">love</span> by {data.creator_name} -
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20 md:p-6 lg:p-24 relative">
      <audio 
        ref={audioRef} 
        loop 
        preload="auto" 
        onError={() => {
          if (data && activeTrackRef.current !== data.song_url_3) {
            console.log("Decoder audio mendeteksi file rusak, memicu fallback ke lagu 3.");
            setUseTrack3Fallback(true);
          }
        }}
      />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          
          /* ================= TOMBOL GERBANG AWAL (BYPASS AUTOPLAY) ================= */
          <motion.div key="intro-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 max-w-sm px-6">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto shadow-inner"><Heart size={28} className="fill-pink-500/20" /></div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Wrapped Selesai Dibuat!</h1>
              <p className="text-xs text-slate-400 leading-relaxed">Ketuk tombol di bawah untuk menyalakan audio dan melihat kilas balik perjalanan cerita dari <b>{data.creator_name}</b>.</p>
            </div>
            <button onClick={startWrapped} className="w-full py-4 bg-white text-slate-950 font-bold font-mono text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
              <Play size={14} className="fill-slate-950" /> Buka Kilas Balik
            </button>
          </motion.div>
        ) : (
          
          /* ================= CANVAS UTAMA SLIDESHOW FRAME (MOBILE FIRST) ================= */
          <motion.div key="story-canvas" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[420px] h-screen md:h-[80vh] md:rounded-[36px] bg-slate-900 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Navigasi Sentuh Layar Kiri/Kanan & Kontrol Mute */}
            <div className="absolute inset-0 z-30 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
              <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
            </div>

            {/* Top Bar: Progress Indicator & Mute Button */}
            <div className="absolute top-0 inset-x-0 p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent z-40 space-y-3 pointer-events-none">
              <div className="flex gap-1.5 px-1">
                {slides.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-75"
                      style={{ 
                        width: idx === currentSlide ? `${progress}%` : idx < currentSlide ? "100%" : "0%" 
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono tracking-wider font-bold text-white/60">OUR MEMORIES</span>
                <button onClick={toggleMute} className="pointer-events-auto text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>

            {/* Tombol Panah Pendukung Desktop */}
            <button onClick={handlePrev} disabled={currentSlide === 0} className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 z-40 transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={handleNext} disabled={currentSlide === 5} className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 z-40 transition-colors"><ChevronRight size={18} /></button>

            {/* Kontainer Slide dengan Transisi */}
            <div className="flex-1 z-20 h-full">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="h-full">
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