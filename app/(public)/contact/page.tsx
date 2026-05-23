"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulasi pengiriman
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500">
            Mari Terhubung
          </h1>
          <p className="text-slate-400">Punya proyek menarik atau sekadar ingin menyapa? Kirimkan pesan!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Sisi Kiri: Kontak Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10"><Mail className="text-cyan-400" /></div>
              <span>syahrizaalsistani@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10"><MapPin className="text-cyan-400" /></div>
              <span>Bekasi, Indonesia</span>
            </div>
            
            <div className="flex gap-4 mt-8">
              <a href="https://github.com/syahrizaia" target="_blank" className="p-4 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500 transition-all"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/syahriza-ikhsan-alsistani" target="_blank" className="p-4 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500 transition-all"><FaLinkedin /></a>
            </div>
          </div>

          {/* Sisi Kanan: Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-white/10 space-y-4"
          >
            <input 
              type="text" 
              placeholder="Nama Anda" 
              className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 focus:border-cyan-500 outline-none transition-all"
            />
            <input 
              type="email" 
              placeholder="Email Anda" 
              className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 focus:border-cyan-500 outline-none transition-all"
            />
            <textarea 
              rows={4}
              placeholder="Pesan Anda" 
              className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 focus:border-cyan-500 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold flex items-center justify-center gap-2 transition-all"
            >
              {status === "sending" ? "Mengirim..." : (status === "success" ? "Terkirim!" : "Kirim Pesan")}
              <Send size={18} />
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}