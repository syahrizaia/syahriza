"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AudioPlayer() {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // LOGIKA UTAMA: Mengatur otomatisasi putar/jeda antar halaman
  useEffect(() => {
    if (!audioRef.current) return;

    if (pathname.startsWith("/tools") || pathname === "/tools") {
      // Jika masuk ke /tools, paksa jeda lagunya
      audioRef.current.pause();
    } else {
      // Jika keluar dari /tools ke halaman lain, putar kembali HANYA JIKA:
      // - User memang ingin menyalakan lagu (isPlaying)
      // - User sudah melewati gerbang WELCOME (!showOverlay)
      // - Lagunya saat ini memang sedang terjeda (audioRef.current.paused)
      if (isPlaying && !showOverlay && audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.error("Gagal memutar ulang audio otomatis:", err);
        });
      }
    }
  }, [pathname, isPlaying, showOverlay]); // Tambahkan dependency agar sinkron

  // Inisialisasi Audio saat pertama kali web dimuat
  useEffect(() => {
    audioRef.current = new Audio("/bg-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 1;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fungsi untuk tombol "Enter Site"
  const startExperience = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Autoplay diblokir:", err);
      });
    }
    setShowOverlay(false);
  };

  // Fungsi untuk tombol pause/play melayang
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Komponen disembunyikan secara visual di halaman /tools, namun state-nya tetap terjaga
  if (pathname.startsWith("/tools")) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-widest">
                WELCOME
              </h1>
              <p className="text-slate-400 mb-8 font-mono text-sm">
                Pengalaman ini menggunakan audio latar.
              </p>
              
              <button
                onClick={startExperience}
                className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500 text-white font-bold tracking-widest transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:-translate-y-1 cursor-pointer"
              >
                ENTER SITE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showOverlay && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={togglePlay}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-pointer"
          aria-label="Toggle Background Music"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
      )}
    </>
  );
}