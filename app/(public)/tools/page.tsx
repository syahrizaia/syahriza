"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const toolsData = [
  {
    id: 1,
    name: "Generator Ucapan Selamat Ulang Tahun",
    category: "Kartu Ucapan",
    status: "Fun Project",
    desc: "Sebuah aplikasi web interaktif yang menyajikan ucapan ulang tahun dengan animasi dan efek visual yang meriah, cocok untuk merayakan momen spesial.",
    link: "birthday"
  },
  {
    id: 2,
    name: "Generator Ucapan Hari Valentine",
    category: "Kartu Ucapan",
    status: "Fun Project",
    desc: "Sebuah aplikasi web interaktif yang menyajikan ucapan hari valentine dengan animasi dan efek visual yang romantis, cocok untuk merayakan momen spesial.",
    link: "valentine"
  },
  {
    id: 3,
    name: "Generator Ucapan Selamat Idul Fitri",
    category: "Kartu Ucapan",
    status: "Fun Project",
    desc: "Sebuah aplikasi web interaktif yang menyajikan ucapan Idul Fitri dengan animasi dan efek visual yang meriah, cocok untuk merayakan momen spesial.",
    link: "eid-alfitr"
  },
  {
    id: 4,
    name: "Generator Ucapan Selamat Idul Adha",
    category: "Kartu Ucapan",
    status: "Fun Project",
    desc: "Sebuah aplikasi web interaktif yang menyajikan ucapan Idul Adha dengan animasi dan efek visual yang meriah, cocok untuk merayakan momen spesial.",
    link: "eid-aladha"
  },
  {
    id: 5,
    name: "Kotak Pesan Anonim (Custom Secreto / NGL Clone)",
    category: "Kotak Pesan",
    status: "Fun Project",
    desc: "Kirim pesan rahasia atau periksa kotak masukmu hanya menggunakan nomor telepon tujuan tanpa sebar link WhatsApp. Orang lain bisa membuka pesan itu untuk menerima pesan jujur atau pengakuan tanpa nama secara anonim.",
    link: "secret-box"
  },
  {
    id: 6,
    name: "Wrapped Versi Pertemanan atau Pasangan",
    category: "Wrapped",
    status: "Fun Project",
    desc: "Terinspirasi dari Spotify Wrapped, kamu bisa bikin rangkuman kilas balik perjalanan hubungan atau pertemanan dalam bentuk slideshow interaktif mirip Instagram Stories.",
    link: "wrapped"
  }
];

const categories = ["Semua", "Kartu Ucapan", "Kotak Pesan", "Wrapped"];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Logika Penyaringan Data
  const filteredTools = toolsData.filter((tool) => {
    const matchesCategory = activeCategory === "Semua" || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  })
  .sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-slate-950 py-24 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500">
            Katalog Alat
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Temukan berbagai alat dan aplikasi yang dapat membantu Anda dalam kegiatan sehari-hari.
          </p>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Navigasi Kategori */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide border transition-all ${
                  activeCategory === category
                    ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari perkakas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <motion.div
                layout
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-3xl bg-slate-900/50 border border-white/10 p-6 hover:border-cyan-500/50 transition-all hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 text-sm font-semibold">{tool.category}</span>
                    <span className="text-[10px] bg-slate-800/80 text-slate-400 px-2.5 py-0.5 rounded-full border border-white/5">
                      {tool.status}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold mt-3 mb-3 leading-tight group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{tool.desc}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-end">
                  <Link href={`/tools/${tool.link}`} className="flex items-center gap-1.5 text-slate-500 text-xs font-medium group-hover:text-cyan-400 transition-colors">
                    Gunakan Alat <ExternalLink size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* State Ketika Pencarian Kosong */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-sm text-slate-500">Tidak ada alat kerja yang cocok dengan filter atau pencarian Anda.</p>
          </div>
        )}

      </div>
    </div>
  );
}