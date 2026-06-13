/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const GIFT_ITEMS = [
  { id: 1, name: "Kopi Koding", price: 2000, icon: "☕" },
  { id: 2, name: "Overclock Engine", price: 10000, icon: "⚡" },
  { id: 3, name: "Kartu Uno Reverse", price: 35000, icon: "🃏" },
  { id: 4, name: "Satelit Mata-Mata", price: 75000, icon: "🛰️" },
  { id: 5, name: "Server Takeover", price: 250000, icon: "👑" },
];

export default function GlobalGiftWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendGift = async () => {
    if (!senderName.trim() || selectedGift === null) return;
    
    setIsLoading(true);

    try {
      const response = await fetch("/api/gifts/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giverName: senderName,
          giftId: selectedGift,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengirim kado");
      }

      const targetedGift = GIFT_ITEMS.find(g => g.id === selectedGift);
      
      // 👑 TOAST BERHASIL (STYLE KUSTOM GELAP)
      toast.success(
        `🎉 BERHASIL! ${senderName} mengirim ${targetedGift?.icon} ${targetedGift?.name}. Data masuk ke Leaderboard!`,
        {
          duration: 5000,
          style: {
            background: "#020617",
            color: "#f8fafc",
            border: "1px solid #1e293b",
            fontSize: "12px",
            fontFamily: "monospace",
          },
          iconTheme: {
            primary: "#ec4899",
            secondary: "#fff",
          },
        }
      );
      
      // Reset form dan tutup widget
      setSenderName("");
      setSelectedGift(null);
      setIsOpen(false);
    } catch (error: any) {
      // ⚠️ TOAST ERROR (STYLE KUSTOM GELAP)
      toast.error(`⚠️ Error: ${error.message}`, {
        duration: 4000,
        style: {
          background: "#020617",
          color: "#fca5a5",
          border: "1px solid #27272a",
          fontSize: "12px",
          fontFamily: "monospace",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* TOMBOL UTAMA FLOATING */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-pink-600 to-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer border border-pink-400"
      >
        {isOpen ? <X size={24} /> : <Gift size={24} className="animate-pulse" />}
      </motion.button>

      {/* POPUP MODAL PILIHAN GIFT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-18 right-0 w-80 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="border-b border-slate-900 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1">
                <Sparkles size={12}/> Dukung Kreator & Dominasi Web
              </h4>
            </div>

            {/* INPUT NAMA GIVER */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono">Nama Samaran / Sultan:</label>
              <input
                type="text"
                placeholder="E.g., Hamba Tuhan / Cyber King"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs focus:outline-none focus:border-pink-500 text-slate-100 disabled:opacity-50"
              />
            </div>

            {/* GRID SELECTION ITEM */}
            <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {GIFT_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setSelectedGift(item.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between aspect-video disabled:opacity-50 ${
                    selectedGift === item.id
                      ? "bg-pink-950/40 border-pink-500 text-white"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold text-slate-200 leading-tight truncate">{item.name}</p>
                    <p className="text-[9px] font-mono text-emerald-400 font-bold">Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* TOMBOL KIRIM */}
            <button
              onClick={handleSendGift}
              disabled={!senderName.trim() || selectedGift === null || isLoading}
              className="w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 disabled:from-slate-800 disabled:to-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Menyimpan ke Database...
                </>
              ) : (
                <>
                  <Send size={12} /> Kirim Gift Sekarang
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}