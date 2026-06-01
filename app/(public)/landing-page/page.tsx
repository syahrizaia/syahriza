"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function LandingPage() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*');

      if (error) {
        console.error("Error fetching from Supabase:", error);
        return;
      }
      
      setProjects((data as Project[]) || []);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-cyan-500/30">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-cyan-400 pointer-events-none z-50 mix-blend-difference"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Kilat Layar Global (Screen Flash) */}
        <motion.div 
          animate={{ opacity: [0, 0, 0.05, 0, 0, 0.1, 0] }}
          transition={{ duration: 7, repeat: Infinity, times: [0, 0.5, 0.52, 0.55, 0.85, 0.87, 0.9] }}
          className="absolute inset-0 bg-cyan-400 mix-blend-overlay"
        />
        
        {/* Listrik Menjalar (Garis Horizontal) */}
        {[20, 50, 80].map((top, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute h-[2px] w-full bg-cyan-300 shadow-[0_0_15px_3px_#06b6d4,0_0_30px_5px_#3b82f6]"
            style={{ top: `${top}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: [0, 1, 0], 
              opacity: [0, 1, 0], 
              originX: i % 2 === 0 ? [0, 0, 1] : [1, 1, 0] // Bergantian arah dari kiri/kanan
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              delay: (i * 1.5) % 5 + i * 2,
              ease: "linear", 
              repeatDelay: (i * 1.2) % 4 + 2
            }}
          />
        ))}

        {/* Listrik Menjalar (Garis Vertikal) */}
        {[15, 45, 75, 90].map((left, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-[2px] h-full bg-cyan-300 shadow-[0_0_15px_3px_#06b6d4,0_0_30px_5px_#3b82f6]"
            style={{ left: `${left}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: [0, 1, 0], 
              opacity: [0, 1, 0], 
              originY: i % 2 === 0 ? [0, 0, 1] : [1, 1, 0] // Bergantian arah atas/bawah
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: (i * 1.3) % 5 + i * 1.5,
              ease: "linear", 
              repeatDelay: (i * 1.5) % 3 + 2
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Tambahan efek flicker pada h1 */}
          <motion.h1 
            animate={{ opacity: [1, 0.8, 1, 1, 0.5, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2, 0.8, 0.9, 1] }}
            className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-cyan-500 mb-6 tracking-tighter"
          >
            FUTURE DEV.
          </motion.h1>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative group mb-10"
          >
            {/* Efek Aura Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
            
            {/* Foto dengan Border futuristik */}
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
                <Image
                  src="/my-photo.png"
                  alt="Syahriza"
                  fill
                  className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-center relative z-10">
                Membangun pengalaman web digital yang imersif dengan teknologi mutakhir.
              </p>
            </div>

            {/* Floating Badge */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="absolute -bottom-4 -right-4 bg-slate-900 px-4 py-2 rounded-lg border border-cyan-500/50 shadow-xl"
            >
              <span className="text-cyan-400 font-mono text-sm shadow-[0_0_10px_#06b6d4]">Fullstack Dev</span>
            </motion.div>
          </motion.div>
          
          <div className="flex gap-6 justify-center relative z-10">
            {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2, rotate: 10, boxShadow: "0 0 15px #06b6d4" }}
                className="p-4 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 transition-all duration-300"
              >
                <Icon size={24} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Floating Elements (Futuristic Vibe) */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Tech Stack Ticker */}
      <div className="relative z-10 py-10 border-y border-white/5 overflow-hidden bg-slate-950/50 backdrop-blur-xs">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex gap-16 whitespace-nowrap opacity-30 font-mono text-xl"
        >
          {["REACT", "NEXT.JS", "TYPESCRIPT", "SUPABASE", "TAILWIND", "FRAMER MOTION", "POSTGRESQL", "DOCKER"].map((tech) => (
            <span key={tech}>{tech} &#47;&#47;</span>
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Projects Done", val: "15+" },
          { label: "Happy Clients", val: "10+" },
          { label: "Coffee Cups", val: "999+" },
          { label: "Years Exp", val: "3+" },
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10, borderColor: "#06b6d4", boxShadow: "0 0 20px rgba(6,182,212,0.2)" }}
            className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/5 text-center transition-all duration-300"
          >
            <h3 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">{item.val}</h3>
            <p className="text-slate-500 text-sm mt-2">{item.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Projects Preview (Simple) */}
      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Featured Work</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {["KaryaMandiri", "Library Web App"].map((i) => (
            <div key={i} className="group p-1 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 hover:border-cyan-500 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <div className="h-40 bg-slate-950 rounded-xl mb-4 flex items-center justify-center text-slate-700 font-mono italic overflow-hidden relative">
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                [Project Preview {i}]
              </div>
              <div className="p-4 relative z-10">
                <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{i}</h4>
                <p className="text-slate-400 text-sm">KaryaMandiri menghubungkan bisnis dengan ribuan talenta digital lokal untuk menyelesaikan verifikasi data, pelabelan AI, riset pasar, hingga tugas lapangan secara instan dan transparan.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">What I Can Do</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Frontend", desc: "Pixel-perfect interface dengan React & Next.js." },
            { title: "Backend", desc: "Database secure dengan PostgreSQL & Supabase." },
            { title: "UI/UX Design", desc: "Desain antarmuka modern yang user-centric." }
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(6,182,212,0.15)" }}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg mb-6 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                <div className="w-6 h-6 border-2 border-current rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 bg-slate-900/30 border-y border-white/5 backdrop-blur-xs">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl md:text-3xl font-light italic text-slate-300 relative"
          >
            <span className="absolute -left-8 -top-8 text-6xl text-cyan-500/20 font-serif">&quot;</span>
            Koding adalah seni mengubah logika rumit menjadi pengalaman yang sederhana dan memuaskan bagi pengguna.
            <span className="absolute -right-8 -bottom-8 text-6xl text-cyan-500/20 font-serif">&quot;</span>
          </motion.blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-0.5 bg-cyan-500 drop-shadow-[0_0_5px_#06b6d4]" />
            <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm drop-shadow-[0_0_5px_#06b6d4]">Syahriza</span>
          </div>
        </div>
      </section>

      {/* Dekorasir Background Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 100, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        />
      </div>
    </main>
  );
}