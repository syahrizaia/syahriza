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
    { name: "About", href: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
    >
      {/* Container Utama */}
      <div className="flex items-center justify-between gap-12 lg:gap-0 w-fit lg:w-full max-w-4xl px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        
        {/* Logo/Brand */}
        <Link href="/" className="font-bold text-cyan-400">SYAHRIZA</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-sm font-semibold hover:bg-cyan-500/40 transition-all">
            Contact Me
          </Link>
        </div>

        {/* Mobile Hamburger & Contact */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/contact" className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-xs font-semibold">
            Contact Me
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 right-14 p-6 px-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-center items-center gap-4 md:hidden w-fit"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-cyan-400"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}