"use client";

import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-white relative overflow-hidden">
      
      {/* Efek Pendaran Cahaya Latar */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto space-y-6">
        
        {/* Ikon Animasi Mengambang */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="p-4 rounded-3xl bg-slate-900/50 border border-white/10 text-cyan-400 shadow-xl shadow-cyan-500/5"
          >
            <AlertCircle size={40} className="stroke-[1.5]" />
          </motion.div>
        </motion.div>

        {/* Kode Eror & Judul Utama */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500">
            404
          </h1>
          <h2 className="text-xl font-bold tracking-tight">
            Jalur Tidak Ditemukan
          </h2>
        </motion.div>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 text-sm leading-relaxed"
        >
          Maaf, halaman yang Anda tuju tidak ada, telah dihapus, atau jalurnya mengalami perubahan tautan sistem.
        </motion.p>

        {/* Tombol Kembali ke Halaman Sebelumnya (CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="pt-4"
        >
          <button 
            onClick={() => router.back()} // Fungsi bawaan untuk kembali ke history sebelumnya
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/10 group hover:-translate-y-0.5 cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Kembali
          </button>
        </motion.div>

      </div>
    </div>
  );
}