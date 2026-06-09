"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Gamepad2, Star, Sparkles, ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GiGamepad } from "react-icons/gi";

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  genre: string;
  rating: number;
  price: number; // 0 berarti Gratis/Free to Play
  platforms: ("PC" | "Mobile" | "Console")[];
  isTrending?: boolean;
  link: string;
}

const MOCK_GAMES: Game[] = [
  {
    id: "1",
    title: "Cyberpunk: Neo Bekasi",
    description: "Jelajahi kota metropolitan masa depan yang dipenuhi distopia neon dan kearifan lokal.",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    genre: "RPG",
    rating: 4.8,
    price: 0,
    platforms: ["PC", "Console"],
    isTrending: true,
    link: "cyberpunk-neo-bekasi"
  },
  {
    id: "2",
    title: "Valorous Tactics",
    description: "Game penembak taktis 5v5 berbasis karakter dengan kemampuan magis yang intens.",
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    genre: "Action",
    rating: 4.5,
    price: 0,
    platforms: ["PC"],
    isTrending: true,
    link: "valorous-tactics"
  },
  {
    id: "3",
    title: "Shadow Realm: Elden Ring",
    description: "Kalahkan bos-bos legendaris dalam dunia fantasi gelap yang menantang kesabaran Anda.",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    genre: "RPG",
    rating: 4.9,
    price: 0,
    platforms: ["PC", "Console"],
    link: "shadow-realm-elden-ring"
  },
  {
    id: "4",
    title: "Harvest Simulator 2026",
    description: "Bangun ladang impian, beternak lele organik, dan temukan jodoh di desa virtual.",
    thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop",
    genre: "Simulation",
    rating: 4.3,
    price: 0,
    platforms: ["PC", "Mobile"],
    link: "harvest-simulator-2026"
  },
  {
    id: "5",
    title: "Grand Theft Motorsport",
    description: "Balapan liar legal di jalanan malam dengan grafis ultra-realistis ray tracing.",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    genre: "Racing",
    rating: 4.6,
    price: 0,
    platforms: ["Console"],
    link: "grand-theft-motorsport"
  },
  {
    id: "6",
    title: "Pixel Dungeon Quest",
    description: "Rogue-like RPG kasual bergaya piksel retro, cocok dimainkan saat istirahat kerja.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
    genre: "Indie",
    rating: 4.2,
    price: 0,
    platforms: ["Mobile"],
    link: "pixel-dungeon-quest"
  }
];

// Daftar Kategori Genre untuk Filter Filter
const GENRES = ["Semua", "Action", "RPG", "Simulation", "Racing", "Indie"];

export default function GamesCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Semua");

  // Fungsi memformat harga rupiah
  const formatPrice = (price: number) => {
    if (price === 0) return "Free to Play";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(price);
  };

  // Logika Filter & Pencarian Game
  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "Semua" || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 md:px-8 lg:px-16 pt-24 pb-16 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Ornamen Latar Belakang (Ambient Glow) */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 z-10 relative">
        
        {/* ================= HERO / HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] uppercase tracking-widest rounded-full">
              <GiGamepad size={12} /> Game Universe Center
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Katalog Game Pilihan
            </h1>
            <p className="text-sm text-slate-400 max-w-xl font-light">
              Temukan petualangan digital terbaikmu. Cari, saring berdasarkan genre favorit, dan temukan takdir bermainmu hari ini.
            </p>
          </div>
          
          <div className="text-xs font-mono text-slate-500 bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
            Total Koleksi: <span className="text-indigo-400 font-bold">{MOCK_GAMES.length} Judul</span>
          </div>
        </div>

        {/* ================= SEARCH & FILTERS BAR ================= */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
          
          {/* Kolom Pencarian */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari judul game atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/5 focus:border-indigo-500/50 focus:outline-none rounded-xl text-sm transition-colors text-slate-200"
            />
          </div>

          {/* Filter Tab Genre */}
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none snap-x">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide border transition-all cursor-pointer whitespace-nowrap snap-center ${
                  selectedGenre === genre
                    ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 font-bold"
                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* ================= GAMES GRID DISPLAY ================= */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-colors backdrop-blur-sm"
              >
                
                {/* Bagian Atas: Gambar Thumbnail & Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  
                  {/* Badge Trending */}
                  {game.isTrending && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-0.5">
                      <Sparkles size={10} className="fill-slate-950" /> Hot
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1 border border-white/5">
                    <Star size={11} className="fill-amber-400 text-amber-400" /> {game.rating.toFixed(1)}
                  </div>
                </div>

                {/* Bagian Tengah: Deskripsi Informasi */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">
                        {game.genre}
                      </span>
                      {/* Ikon Platform */}
                      <div className="flex gap-1 text-slate-500">
                        {game.platforms.includes("PC") && <Monitor size={12} />}
                        {game.platforms.includes("Mobile") && <Smartphone size={12} />}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Bagian Bawah: Harga & CTA Button */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Harga Resmi</span>
                      <span className={`text-xs font-mono font-black ${game.price === 0 ? "text-emerald-400 uppercase tracking-wide" : "text-slate-200"}`}>
                        {formatPrice(game.price)}
                      </span>
                    </div>

                    <Link href={`/games/${game.link}`} className="p-2.5 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center group/btn shadow-inner">
                      <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform" />
                    </Link>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ================= STATE KOSONG (JIKA NOT FOUND) ================= */}
        {filteredGames.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-slate-900/10"
          >
            <Gamepad2 size={40} className="text-slate-600 mx-auto mb-3 animate-pulse" />
            <h3 className="font-bold text-slate-300 text-sm">Game Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tidak ada judul game yang cocok dengan kata kunci &quot;{searchQuery}&quot; atau genre pilihan Anda.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}