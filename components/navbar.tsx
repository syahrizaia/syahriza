"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Certificates", href: "/certificates" },
    { name: "Blogs", href: "/blogs" },
    { name: "Tools", href: "/tools" },
    { name: "Games", href: "/games" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
    >
      {/* 🔮 CONTAINER UTAMA: LIQUID GLASS KAPSUL */}
      <div className="relative flex items-center justify-between w-full max-w-4xl px-6 py-3 rounded-full bg-gradient-to-b from-white/[0.07] via-white/[0.01] to-white/[0.04] backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.18] border-l-white/[0.12] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_12px_40px_-12px_rgba(0,0,0,0.7)]">
        
        {/* Logo/Brand dengan efek glow tipis */}
        <Link href="/" className="font-bold text-cyan-400 tracking-wider hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all">
          SYAHRIZA
        </Link>

        {/* Menu Navigasi Kanan */}
        <div className="flex items-center gap-4">
          {/* Tombol Contact Me dengan Gaya Liquid Glass Tombol */}
          <Link 
            href="/contact" 
            className="px-4 py-1.5 rounded-full bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 text-cyan-300 border border-cyan-400/30 text-xs md:text-sm font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:from-cyan-500/30 hover:to-cyan-500/10 hover:border-cyan-400/50 transition-all duration-300"
          >
            Contact Me
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none cursor-pointer transition-transform active:scale-90">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 🔮 DROPDOWN MENU: LIQUID GLASS PANEL */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              // Menggunakan transisi spring agar animasi terasa membal dan cair (fluid)
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="absolute top-full right-6 mt-4 p-6 px-10 rounded-[2rem] bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/85 backdrop-blur-2xl border border-white/[0.06] border-t-white/[0.15] border-l-white/[0.10] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-center items-center gap-4 w-fit min-w-[200px]"
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-slate-300 hover:text-cyan-400 transition-all w-full text-center py-1 rounded-xl hover:bg-white/[0.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
}