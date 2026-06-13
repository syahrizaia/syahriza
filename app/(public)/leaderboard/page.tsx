"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Zap, Sparkles, ArrowLeft, Crown, 
  Flame, Ghost, Target, Star, Gift, ShieldCheck, 
  Award, Loader2
} from "lucide-react";

interface GiverData {
  giver_name: string;
  total_spent: number;
  total_gifts: number;
  is_anonymous: boolean;
}

export default function AdvancedLeaderboard() {
  const router = useRouter();
  const [timeTab, setTimeTab] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  
  // State Utama Integrasi Supabase
  const [currentList, setCurrentList] = useState<GiverData[]>([]);
  const [currentGlobalHypePool, setCurrentGlobalHypePool] = useState<number>(0);
  const [communityHero, setCommunityHero] = useState<string>("Mencari...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const targetHypeGoal = 5000000; // Target Crowdfunding Rp 5 Juta
  const progressPercent = Math.min(100, (currentGlobalHypePool / targetHypeGoal) * 100);

  // FETCH DATA DARI SUPABASE VIA BACKEND API
  useEffect(() => {
    async function fetchLeaderboardData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?timeframe=${timeTab}`);
        const data = await response.json();
        
        if (response.ok) {
          setCurrentList(data.leaderboard || []);
          setCurrentGlobalHypePool(data.globalHypePool || 0);
          setCommunityHero(data.communityHero || "Belum Ada");
        }
      } catch (error) {
        console.error("Gagal memuat data dari node server:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboardData();
  }, [timeTab]);

  const renderGiverBadge = (user: GiverData, index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded-md font-bold font-mono shadow-[0_0_8px_rgba(234,179,8,0.1)] animate-pulse">
          <Crown size={10} className="fill-yellow-400" /> 👑 Sultan Komplek
        </span>
      );
    }
    if (user.is_anonymous) {
      return (
        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-purple-950/40 border border-purple-800/40 text-purple-400 rounded-md font-mono">
          <Ghost size={10} /> Ghost Spender
        </span>
      );
    }
    if (user.total_gifts >= 8) {
      return (
        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-rose-950/40 border border-rose-800/40 text-rose-400 rounded-md font-mono font-semibold">
          <Flame size={10} className="fill-rose-500" /> Combo King
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md font-mono">
        <Star size={10} /> Donatur Aktif
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 p-4 flex flex-col items-center justify-start font-sans relative overflow-x-hidden pt-24">
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-stream {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-stream:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-pink-600/5 to-purple-600/0 rounded-full filter blur-[120px] pointer-events-none" />

      {/* 1. LIVE BROADCAST TICKER */}
      <div className="w-full max-w-xl bg-gradient-to-r from-pink-950/30 via-slate-950 to-pink-950/30 border border-pink-900/30 rounded-xl py-2 px-3 overflow-hidden shadow-lg mb-4 flex items-center gap-2">
        <span className="bg-pink-600 text-white font-mono font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-widest animate-pulse shrink-0 shadow-md">
          LIVE FEED
        </span>
        <div className="w-full overflow-hidden whitespace-nowrap relative text-xs font-mono text-pink-300">
          <div className="animate-marquee-stream inline-block pl-4">
            🚀 <span className="text-white font-bold">Sultan_Ancol</span> mengirim 👑 <span className="text-yellow-400 underline font-bold">Server Takeover</span>! Notifikasi disebar! • 
            🤖 <span className="text-white font-bold">GhostSpender_99</span> mengirim ⚡ <span className="text-cyan-400">Overclock Engine</span>! • 
            ☕ <span className="text-white font-bold">RianKoding</span> melakukan combo x5 <span className="text-amber-400">Kopi Koding</span>!
          </div>
        </div>
      </div>

      {/* BACK NAVIGATION BAR */}
      <div className="w-full max-w-xl flex justify-between items-center mb-4 bg-slate-900/40 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-md">
        <button 
          onClick={() => router.back()}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={13} /> HUB_DASHBOARD
        </button>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-yellow-500 font-bold tracking-wider bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">
          <Sparkles size={12} /> SUPABASE_CONNECTED_V2
        </div>
      </div>

      {/* 2. GLOBAL HYPE METER (CROWDFUNDING) */}
      <div className="w-full max-w-xl bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-3 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-slate-800 pointer-events-none">
          <Target size={60} strokeWidth={1} />
        </div>
        
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold font-mono tracking-wide text-slate-300 flex items-center gap-1.5">
              <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-bounce" /> Global Community Progress Meter
            </h3>
            <p className="text-[10px] text-slate-500">Misi bersama bulan ini untuk membuka modul perkakas premium berikutnya.</p>
          </div>
          <span className="text-xs font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            {progressPercent.toFixed(0)}% UNLOCKED
          </span>
        </div>

        <div className="w-full h-3 bg-slate-900 border border-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 rounded-full relative"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:10px_10px] animate-pulse" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] font-mono border-t border-slate-900">
          <div>
            <span className="text-slate-500 block text-[10px]">Pool Kas Bulan Ini</span>
            <span className="text-emerald-400 font-bold">Rp {currentGlobalHypePool.toLocaleString("id-ID")}</span> 
            <span className="text-slate-600 text-[10px]"> / {targetHypeGoal.toLocaleString("id-ID")}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">🏆 Pahlawan Bulan Ini</span>
            <span className="text-yellow-400 font-bold flex items-center justify-end gap-1">
               {communityHero} <Award size={12} />
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-950/20 to-slate-950 p-2 rounded-xl border border-purple-900/30 text-[10px] font-sans text-purple-300 flex items-center gap-2">
          <ShieldCheck size={14} className="text-purple-400 shrink-0" />
          <span>Bila penuh, otomatis rilis gratis: <strong className="text-white underline">&quot;WhatsApp Fake Chat Simulator&quot;</strong>.</span>
        </div>
      </div>

      {/* CORE LEADERBOARD CONTAINER */}
      <div className="w-full max-w-xl bg-slate-900/10 border border-slate-800/70 rounded-2xl p-4 mt-4 backdrop-blur-md space-y-4 shadow-xl">
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Trophy size={16} className="fill-yellow-500/20" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider font-mono text-white uppercase">Hall of Fame</h2>
              <p className="text-[10px] text-slate-500 font-mono">LIVE_DATABASE_NODE</p>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex p-0.5 bg-slate-950 border border-slate-900 rounded-lg text-[10px] font-mono">
            {(["daily", "weekly", "monthly", "yearly"] as const).map((mode) => (
              <button
                key={mode}
                disabled={isLoading}
                onClick={() => setTimeTab(mode)}
                className={`px-2.5 py-1 rounded-md uppercase font-bold transition-all cursor-pointer disabled:opacity-50 ${
                  timeTab === mode 
                    ? "bg-slate-900 text-yellow-400 border border-slate-800 shadow" 
                    : "text-slate-600 hover:text-slate-300"
                }`}
              >
                {mode === "daily" ? "Hari" : mode === "weekly" ? "Pekan" : mode === "monthly" ? "Bulan" : "Tahun"}
              </button>
            ))}
          </div>
        </div>

        {/* LIST RENDER */}
        <div className="space-y-2.5 min-h-[150px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-slate-500 text-xs font-mono gap-2"
              >
                <Loader2 size={18} className="animate-spin text-pink-500" />
                Mengkalkulasi Data Semburan Supabase...
              </motion.div>
            ) : currentList.length > 0 ? (
              <motion.div
                key={timeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 w-full"
              >
                {currentList.map((user, idx) => (
                  <div 
                    key={idx}
                    className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                      idx === 0 
                        ? "bg-gradient-to-r from-yellow-500/10 via-amber-600/5 to-transparent border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.03)]" 
                        : "bg-slate-950/50 border-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-black ${
                        idx === 0 
                          ? "bg-gradient-to-tr from-yellow-500 to-amber-400 text-black shadow" 
                          : idx === 1 
                          ? "bg-slate-400 text-black" 
                          : idx === 2 
                          ? "bg-amber-700 text-white" 
                          : "bg-slate-950 border border-slate-800 text-slate-500"
                      }`}>
                        {idx + 1}
                      </span>

                      <div className="space-y-1">
                        <div className="text-xs font-bold font-mono text-slate-200 flex flex-wrap items-center gap-2">
                          <span>{user.giver_name}</span>
                          {renderGiverBadge(user, idx)}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Gift size={10} /> Akumulasi Semburan: {user.total_gifts} Kado
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className={`text-xs font-bold ${idx === 0 ? "text-yellow-400 text-sm font-black" : "text-emerald-400"}`}>
                        Rp {user.total_spent.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[9px] block text-slate-600 uppercase tracking-widest text-right">CONTRIBUTED</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-slate-950/20 border border-slate-900/50 border-dashed rounded-2xl text-slate-600 text-xs font-mono"
              >
                ⚠️ Node Kosong: Belum ada semburan gift pada periode ini.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <div className="mt-6 text-center text-[9px] font-mono text-slate-700 tracking-widest uppercase">
        AUTHENTIC METRICS CORE // ENKRIPSI ID REAL-TIME DATA
      </div>

    </div>
  );
}