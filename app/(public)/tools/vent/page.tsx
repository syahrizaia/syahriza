/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Flame, CloudRain, ShieldAlert, Smile, RefreshCw, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

const EMOTIONS = [
  { label: "Lelah", icon: CloudRain, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { label: "Marah", icon: Flame, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  { label: "Cemas", icon: ShieldAlert, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { label: "Sedih", icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
  { label: "Tenang", icon: Smile, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
];

const TREND_RANGES = [
  { key: "hari", label: "Hari Ini", hours: 24 },
  { key: "pekan", label: "Pekan Ini", hours: 24 * 7 },
  { key: "bulan", label: "Bulan Ini", hours: 24 * 30 },
  { key: "tahun", label: "Tahun Ini", hours: 24 * 365 },
];

interface VentItem {
  text: string;
  emotion: string;
  count: number;
  timestamp: number;
}

export default function VentingPage() {
  const [inputText, setInputText] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("Lelah");
  const [trendRange, setTrendRange] = useState("hari");
  const [vents, setVents] = useState<VentItem[]>([]);
  const [latestText, setLatestText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi mengambil data dari Supabase berdasarkan filter jangka waktu
  const fetchVents = async () => {
    setIsLoading(true);
    const activeRange = TREND_RANGES.find((r) => r.key === trendRange);
    const hoursOffset = activeRange ? activeRange.hours : 24;

    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - hoursOffset);

    try {
      const { data, error } = await supabase
        .from("vents")
        .select("text, emotion, created_at")
        .gte("created_at", timeLimit.toISOString());

      if (error) throw error;

      const aggregatedMap: { [key: string]: VentItem } = {};

      (data || []).forEach((row) => {
        const cleanText = row.text.trim();
        const key = cleanText.toLowerCase();
        const rowTime = new Date(row.created_at).getTime();

        if (aggregatedMap[key]) {
          aggregatedMap[key].count += 1;
          if (rowTime > aggregatedMap[key].timestamp) {
            aggregatedMap[key].timestamp = rowTime;
            aggregatedMap[key].emotion = row.emotion;
          }
        } else {
          aggregatedMap[key] = {
            text: cleanText,
            emotion: row.emotion,
            count: 1,
            timestamp: rowTime,
          };
        }
      });

      const finalArray = Object.values(aggregatedMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 40);

      setVents(finalArray);
    } catch (err) {
      console.error("Gagal memuat data emosi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVents();
  }, [trendRange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const formattedText = inputText.trim();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("vents").insert([
        { text: formattedText, emotion: selectedEmotion },
      ]);

      if (error) throw error;

      setLatestText(formattedText);
      setInputText("");
      
      await fetchVents();

      setTimeout(() => setLatestText(null), 4000);
    } catch (err: any) {
      alert(`Gagal mengirimkan luapan emosi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const emotionStats = EMOTIONS.map((emo) => {
    const totalCount = vents
      .filter((v) => v.emotion === emo.label)
      .reduce((sum, item) => sum + item.count, 0);
    return { ...emo, totalCount };
  });

  // 💡 OPTIMASI TYPOGRAPHY RESPONSIF: Mengecilkan font di mobile agar tidak merusak lebar layar saat kalimat panjang membesar
  const getDynamicStyle = (item: VentItem) => {
    const isLatest = item.text.toLowerCase() === latestText?.toLowerCase();
    const weight = item.count;

    if (isLatest) {
      return "text-lg md:text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10 animate-pulse text-center break-words max-w-full";
    }
    if (weight > 8) return "text-base md:text-2xl font-extrabold text-slate-100 opacity-100 drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] text-center break-words max-w-full";
    if (weight > 4) return "text-sm md:text-lg font-bold text-slate-300 opacity-90 text-center break-words max-w-full";
    if (weight > 1) return "text-xs md:text-sm font-semibold text-slate-400 opacity-70 text-center break-words max-w-full";
    return "text-[11px] md:text-xs font-medium text-slate-500 opacity-40 text-center break-words max-w-full";
  };

  return (
    // 💡 DIUBAH: Ditambahkan 'w-full max-w-full overflow-x-hidden' pada container paling luar
    <div className="min-h-screen bg-slate-950 p-4 text-white pt-24 selection:bg-cyan-500/30 w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
        
        {/* ================= LEFT COLUMN: INPUT BOX ================= */}
        <div className="lg:col-span-1 space-y-6 w-full max-w-full">
          <div className="bg-slate-900/40 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-white/10 shadow-xl w-full box-border">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
              Ruang Pelepasan 🍂
            </h1>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Ketik apa pun yang mengganjal di pikiranmu secara anonim. Biarkan beban itu menguap bersama baris kata.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Perasaanmu Hari Ini:
                </label>
                {/* 💡 DIUBAH: Menggunakan 'grid-cols-2 sm:grid-cols-3' agar tombol emosi tidak terkompresi paksa di layar sempit */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {EMOTIONS.map((emo) => {
                    const EmoIcon = emo.icon;
                    const isSelected = selectedEmotion === emo.label;
                    return (
                      <button
                        key={emo.label}
                        type="button"
                        onClick={() => setSelectedEmotion(emo.label)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer truncate ${
                          isSelected
                            ? `${emo.bg} ${emo.border} ${emo.color} scale-102 font-bold`
                            : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <EmoIcon size={12} className="shrink-0" />
                        <span className="truncate">{emo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tulis Masalahmu:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik beban pikiranmu di sini..."
                  rows={4}
                  maxLength={100}
                  className="w-full p-4 bg-slate-950 rounded-2xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none placeholder-slate-600 box-border"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-1">
                  <span>Maksimal 100 karakter</span>
                  <span>{inputText.length}/100</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 active:scale-98 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/10 transition-all"
              >
                <Send size={12} /> {isSubmitting ? "Melepaskan..." : "Lepaskan Beban"}
              </button>
            </form>
          </div>

          {/* Mood Board Hasil Query Rentang Waktu Aktif */}
          <div className="bg-slate-900/20 backdrop-blur-sm p-5 rounded-3xl border border-white/5 w-full box-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} /> Energi Kondisi (Tren Saat Ini)
            </h3>
            <div className="space-y-2.5">
              {emotionStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300 min-w-0">
                      <Icon size={12} className={`${stat.color} shrink-0`} />
                      <span className="truncate">{stat.label}</span>
                    </div>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 shrink-0 ${stat.color}`}>
                      {stat.totalCount} entri
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: TEXT CLOUD WALL ================= */}
        <div className="lg:col-span-2 flex flex-col space-y-4 w-full max-w-full overflow-hidden">
          
          {/* Kelompok Navigasi Tren Waktu */}
          {/* 💡 DIUBAH: Tombol padding ('px-2.5') disesuaikan di mobile agar pas berkumpul mendatar tanpa keluar layar */}
          <div className="flex bg-slate-900/40 border border-white/10 p-1.5 rounded-2xl gap-1 self-center lg:self-start max-w-full overflow-x-auto no-scrollbar">
            {TREND_RANGES.map((range) => (
              <button
                key={range.key}
                onClick={() => setTrendRange(range.key)}
                className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  trendRange === range.key
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar size={11} className="shrink-0" /> {range.label}
              </button>
            ))}
          </div>

          {/* Area Kontainer Cloud Wall */}
          {/* 💡 DIUBAH: Ditambahkan 'max-w-full overflow-hidden p-4 md:p-6' */}
          <div className="flex-1 bg-slate-900/20 backdrop-blur-md border border-white/10 rounded-3xl p-4 md:p-6 min-h-[450px] flex flex-col justify-between max-w-full overflow-hidden box-border">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4 w-full gap-2">
              <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase flex items-center gap-1.5 min-w-0 truncate">
                🌌 Mind Vacuum Cloud <span className="hidden sm:inline">({TREND_RANGES.find(r => r.key === trendRange)?.label})</span>
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-md shrink-0 whitespace-nowrap">
                {vents.length} Isu Unik
              </span>
            </div>

            {/* Render Pemrosesan Teks Dinamis */}
            {/* 💡 DIUBAH: Menyesuaikan celah gap agar lebih rapat di mobile ('gap-x-3 gap-y-2.5 md:gap-x-5 md:gap-y-4') */}
            <div className="flex-1 flex flex-wrap gap-x-3 gap-y-2.5 md:gap-x-5 md:gap-y-4 items-center justify-center content-center p-2 md:p-4 min-h-[300px] select-none max-w-full overflow-hidden">
              {isLoading ? (
                <div className="text-slate-500 text-xs font-mono flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-cyan-500" /> Sinkronisasi Pikiran...
                </div>
              ) : vents.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-500 italic">Belum ada energi luapan pada rentang waktu ini.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {vents.map((item, index) => {
                    const emoConfig = EMOTIONS.find((e) => e.label === item.emotion);
                    return (
                      <motion.span
                        layout
                        key={`${item.text}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 120, damping: 14 }}
                        // 💡 DIUBAH: Ditambahkan aturan penanganan pembungkusan kata otomatis ('break-words max-w-full block-inline') 
                        className={`inline-block transition-all duration-300 break-words max-w-full ${getDynamicStyle(item)}`}
                        title={`Disebut ${item.count} kali`}
                      >
                        <span className={item.text.toLowerCase() === latestText?.toLowerCase() ? "text-cyan-400" : emoConfig?.color}>
                          {item.text}
                        </span>
                        {item.count > 1 && (
                          <sub className="text-[9px] md:text-[10px] opacity-40 font-mono ml-0.5 whitespace-nowrap">+{item.count}</sub>
                        )}
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            <div className="border-t border-white/5 pt-3 mt-4 text-center">
              <p className="text-[10px] text-slate-500 italic">
                *Teks di atas dikelompokkan otomatis. Semakin sering disuarakan dalam rentang waktu terpilih, ukuran huruf akan semakin dominan.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}