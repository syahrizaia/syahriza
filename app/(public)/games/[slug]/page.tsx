/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Star, Monitor, Tv, ArrowLeft, Heart, ShieldCheck, Calendar, HardDrive, Users, Sparkles 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GiConsoleController } from "react-icons/gi";

const GAMES_DATABASE: Record<string, any> = {
  "cyberpunk-neo-bekasi": {
    id: "1",
    title: "Cyberpunk: Neo Bekasi",
    description: "Jelajahi kota metropolitan masa depan yang dipenuhi distopia neon, polusi siber, korporasi raksasa, dan kearifan lokal yang kental. Bertahan hidup sebagai tentara bayaran di jalanan Kalimalang yang keras.",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    genre: "RPG / Open World",
    rating: 4.8,
    price: 0,
    platforms: ["PC", "Console"],
    isTrending: true,
    developer: "Syahriza",
    publisher: "Syah Tech",
    releaseDate: "12 Februari 2026",
    features: ["Peta Skala 1:1 Kalimalang - Cyber Bekasi", "Modifikasi Tubuh Implan Siber", "Bahasa & Dubbing Lokal", "Ray Tracing Ultra Nyata"],
    requirements: {
      minimum: "OS: Windows 10/11 | Processor: Intel i5-10400 | RAM: 16 GB | Graphics: GTX 1660 Super | Storage: 70 GB SSD",
      recommended: "OS: Windows 11 | Processor: Intel i7-12700K | RAM: 32 GB | Graphics: RTX 4060 Ti | Storage: 70 GB NVMe SSD"
    }
  },
  "valorous-tactics": {
    id: "2",
    title: "Valorous Tactics",
    description: "Game penembak taktis 5v5 berbasis karakter dengan kemampuan magis yang intens. Koordinasikan strategi tim Anda, kuasai mekanik bidikan jitu, dan gunakan keahlian unik setiap agen untuk mengamankan kemenangan di medan tempur kompetitif.",
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop",
    genre: "Action / Tactical Shooter",
    rating: 4.5,
    price: 0,
    platforms: ["PC"],
    isTrending: true,
    developer: "Syahriza",
    publisher: "Syah Tech",
    releaseDate: "24 Oktober 2025",
    features: ["Mode Kompetitif Berperingkat (Ranked)", "20+ Agen Unik dengan Lore Mendalam", "Sistem Anti-Cheat Tingkat Kernel (Vanguardian)", "Server Lokal Latensi Rendah (Ping < 10ms)"],
    requirements: {
      minimum: "OS: Windows 10 64-bit | Processor: Intel i3-4150 | RAM: 8 GB | Graphics: GT 730 (2GB) | Storage: 30 GB HDD",
      recommended: "OS: Windows 10/11 64-bit | Processor: Intel i5-9400F | RAM: 16 GB | Graphics: GTX 1060 (6GB) | Storage: 30 GB SSD"
    }
  },
  "shadow-realm-elden-ring": {
    id: "3",
    title: "Shadow Realm: Elden Ring",
    description: "Kalahkan bos-bos legendaris dalam dunia fantasi gelap yang menantang batas kesabaran Anda. Jelajahi Lands Between yang kini diselimuti kegelapan baru, temukan rahasia pecahan kutukan kuno, dan raih kembali takhta Elden Lord dengan gaya bertarung pilihan Anda.",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    genre: "RPG / Souls-like",
    rating: 4.9,
    price: 0,
    platforms: ["PC", "Console"],
    developer: "Syahriza",
    publisher: "Syah Tech",
    releaseDate: "21 Juni 2025",
    features: ["Dunia Terbuka Luas nan Misterius", "Pertarungan Bos Masif & Menantang Adrenalin", "Ratusan Senjata, Perisai, dan Sihir Kuno", "Fitur Multiplayer Co-op & Invasi PvP"],
    requirements: {
      minimum: "OS: Windows 10 | Processor: Intel i5-8400 | RAM: 12 GB | Graphics: GTX 1060 (3GB) | Storage: 60 GB SSD",
      recommended: "OS: Windows 11 | Processor: Intel i7-10700K | RAM: 16 GB | Graphics: RTX 3060 (12GB) | Storage: 60 GB NVMe SSD"
    }
  },
  "harvest-simulator-2026": {
    id: "4",
    title: "Harvest Simulator 2026",
    description: "Bangun ladang impian, beternak lele organik, dan temukan jodoh ideal di desa virtual. Nikmati simulasi kehidupan pedesaan yang santai namun adiktif, lengkap dengan festival musiman lokal, sistem perdagangan pasar tradisional, dan mekanik bercocok tanam modern.",
    thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop",
    genre: "Simulation / Cozy Life-sim",
    rating: 4.3,
    price: 0,
    platforms: ["PC", "Mobile"],
    developer: "Syahriza",
    publisher: "Syah Tech",
    releaseDate: "5 Januari 2026",
    features: ["Sistem Manajemen Kebun & Kolam Terintegrasi", "Simulasi Hubungan Sosial & Pernikahan", "Siklus Cuaca Dinamis Iklim Tropis", "Dukungan Penuh Cross-play PC & Smartphone"],
    requirements: {
      minimum: "OS: Windows 7/10 atau Android 9.0+ | Processor: Intel Dual Core / Snapdragon 680 | RAM: 4 GB | Graphics: Intel HD Graphics / Adreno 610 | Storage: 5 GB Luang",
      recommended: "OS: Windows 10/11 atau Android 12+ | Processor: Intel i3-8100 / Snapdragon 870 | RAM: 8 GB | Graphics: GTX 1050 / Adreno 650 | Storage: 5 GB SSD"
    }
  },
  "grand-theft-motorsport": {
    id: "5",
    title: "Grand Theft Motorsport",
    description: "Aksi balapan liar legal di jalanan malam perkotaan dengan grafis ultra-realistis full ray tracing. Modifikasi mobil sport impianmu secara ekstrem dari jeroan mesin hingga estetika visual bodykit, lalu taklukkan sirkuit kota demi reputasi tertinggi.",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    genre: "Racing / Arcade Sports",
    rating: 4.6,
    price: 0,
    platforms: ["Console"],
    developer: "Syahriza",
    publisher: "Syah Tech",
    releaseDate: "18 November 2025",
    features: ["Visual Next-Gen dengan Real-Time Ray Tracing", "Lebih dari 150 Mobil Sport Berlisensi Resmi", "Kustomisasi Fisika Mengemudi & Kosmetik Mendalam", "Mode Karir dengan Alur Cerita Sinematik"],
    requirements: {
      minimum: "Konsol: PlayStation 5 / Xbox Series X|S | Target Performa: 60 FPS pada resolusi dinamis 4K.",
      recommended: "Sangat disarankan menggunakan kabel HDMI 2.1 dan monitor/TV yang mendukung HDR serta Refresh Rate 120Hz."
    }
  },
  "pixel-dungeon-quest": {
    id: "6",
    title: "Pixel Dungeon Quest",
    description: "Rogue-like RPG kasual bergaya piksel retro, sangat cocok dimainkan saat istirahat kerja atau waktu luang Anda. Jelajahi labirin bawah tanah yang diacak secara prosedural setiap kali Anda bermain, kumpulkan harta karun langka, dan kalahkan raja kegelapan.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    genre: "Indie / Rogue-like",
    rating: 4.2,
    price: 0,
    platforms: ["Mobile"],
    developer: "Syahriza",
    publisher: "Syah Tech",
    releaseDate: "1 Maret 2026",
    features: ["Prosedural Dungeon (Peta Selalu Berubah)", "Seni Piksel 16-Bit Nostalgia yang Cantik", "Dapat Dimainkan 100% Secara Offline (Tanpa Internet)", "Kontrol Navigasi Satu Tangan yang Responsif"],
    requirements: {
      minimum: "OS: Android 7.0 (Nougat) / iOS 12.0 | RAM: 2 GB | Storage: 500 MB Ruang Penyimpanan Luang",
      recommended: "OS: Android 11.0+ / iOS 15.0+ | RAM: 4 GB | Storage: 500 MB Ruang Penyimpanan Luang"
    }
  }
};

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  // Mengambil data berdasarkan slug URL
  const game = GAMES_DATABASE[slug];

  const [activeTab, setActiveTab] = useState<"tentang" | "spesifikasi">("tentang");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Jika game tidak ditemukan di database
  if (!game) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold font-mono text-red-400">404 - Game Tidak Ditemukan 🚫</h2>
        <button onClick={() => router.push("/games")} className="mt-4 text-xs font-mono text-indigo-400 hover:underline">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // Format Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Efek Cahaya Ambient Neon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* ================= HERO BACKDROP BANNER ================= */}
      <div className="relative h-[280px] md:h-[450px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
        <Image 
          fill
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover opacity-60 filter brightness-90"
        />
        
        {/* Tombol Kembali */}
        <div className="absolute top-24 left-4 md:left-12 z-20">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/70 border border-white/10 text-xs font-mono rounded-xl backdrop-blur-md transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </div>

      {/* ================= KONTEN UTAMA LAYER ATAS ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-20 md:-mt-32 relative z-20 space-y-8">
        
        {/* Layout Grid: Kiri (Detail) | Kanan (Beli/Transaksi) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI: Judul & Informasi Game */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20 uppercase">
                  {game.genre}
                </span>
                {game.isTrending && (
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 uppercase flex items-center gap-1">
                    <Sparkles size={10} /> Populer
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {game.title}
              </h1>

              {/* Meta singkat: Rating & Platform */}
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={14} className="fill-amber-400" /> {game.rating.toFixed(1)}
                </div>
                <div className="w-1 h-1 bg-slate-700 rounded-full" />
                <div className="flex items-center gap-2">
                  {game.platforms.includes("PC") && <span className="flex items-center gap-1"><Monitor size={12} /> PC</span>}
                  {game.platforms.includes("Console") && <span className="flex items-center gap-1"><Tv size={12} /> Console</span>}
                </div>
              </div>
            </div>

            {/* Navigasi Tab */}
            <div className="flex border-b border-white/5 gap-6 text-sm font-mono">
              <button 
                onClick={() => setActiveTab("tentang")}
                className={`pb-3 transition-colors relative cursor-pointer ${activeTab === "tentang" ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
              >
                Tentang Game
                {activeTab === "tentang" && <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
              </button>
              <button 
                onClick={() => setActiveTab("spesifikasi")}
                className={`pb-3 transition-colors relative cursor-pointer ${activeTab === "spesifikasi" ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
              >
                Spesifikasi Sistem
                {activeTab === "spesifikasi" && <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
              </button>
            </div>

            {/* Isi Konten Tab */}
            <div className="bg-slate-900/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md min-h-[200px]">
              {activeTab === "tentang" ? (
                <div className="space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed font-light">{game.description}</p>
                  
                  {/* Fitur Utama List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Fitur Utama Game:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                      {game.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* Tab Spesifikasi */
                <div className="space-y-4 font-mono text-xs text-slate-300">
                  <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    <h4 className="text-red-400 font-bold uppercase mb-1">Spesifikasi Minimum:</h4>
                    <p className="leading-relaxed text-slate-400">{game.requirements.minimum}</p>
                  </div>
                  <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    <h4 className="text-emerald-400 font-bold uppercase mb-1">Spesifikasi Rekomendasi:</h4>
                    <p className="leading-relaxed text-slate-400">{game.requirements.recommended}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Kotak Transaksi / Pembelian */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 sticky top-28">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Harga Berlangganan</span>
              <div className="text-2xl font-mono font-black text-white">
                {formatPrice(game.price)}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link href={"/games/play/" + params.slug} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black font-mono text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-[0.99] transition-all">
                <GiConsoleController size={14} /> Main Sekarang
              </Link>
              
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-3 border rounded-xl font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isWishlisted 
                    ? "bg-pink-500/10 border-pink-500 text-pink-400" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Heart size={14} className={isWishlisted ? "fill-pink-500 text-pink-500" : ""} />
                {isWishlisted ? "Di Wishlist" : "Tambah ke Wishlist"}
              </button>
            </div>

            {/* Informasi Metadata Game */}
            <div className="border-t border-white/5 pt-4 space-y-2.5 font-mono text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Calendar size={12}/> Rilis</span>
                <span className="text-slate-300 font-medium">{game.releaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Users size={12}/> Developer</span>
                <Link href={"https://syahriza.vercel.app"} target="_blank" className="text-cyan-400 font-medium truncate max-w-[150px]">{game.developer}</Link>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><HardDrive size={12}/> Publisher</span>
                <Link href={"https://syahtech.vercel.app"} target="_blank" className="text-cyan-400 font-medium truncate max-w-[150px]">{game.publisher}</Link>
              </div>
            </div>

            {/* Jaminan Proteksi */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 flex items-start gap-2">
              <ShieldCheck size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-500 leading-normal font-mono">
                Pembelian aman terverifikasi. Lisensi digital resmi langsung ditambahkan ke akun Anda setelah pembayaran sukses.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}