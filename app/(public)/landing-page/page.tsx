"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function LandingPage() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from('projects').select('*');
      setProjects(data || []);
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
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-cyan-500/30">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-cyan-400 pointer-events-none z-50 mix-blend-difference"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-500 mb-6 tracking-tighter">
            FUTURE DEV.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Membangun pengalaman web digital yang imersif dengan teknologi mutakhir.
          </p>
          
          <div className="flex gap-6 justify-center">
            {[Github, Linkedin, Mail].map((Icon, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="p-4 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 transition-colors"
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
        className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
      />
    </main>
  );
}