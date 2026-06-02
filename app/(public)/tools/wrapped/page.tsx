"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Calendar, Music } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function WrappedBuilder() {
  const [formData, setFormData] = useState({
    creator_name: "",
    partner_name: "",
    wrapped_year: new Date().getFullYear(),
    days_together: "",
    fight_count: "",
    inside_joke: "",
    song_title_1: "",
    song_url_1: "",
    song_title_2: "",
    song_url_2: "",
    song_title_3: "",
    song_url_3: "",
    special_message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("relationship_wrapped")
      .insert([
        {
          ...formData,
          days_together: parseInt(formData.days_together) || 0,
          fight_count: parseInt(formData.fight_count) || 0,
          // Fallback audio jika kosong agar langsung berfungsi
          song_url_1: formData.song_url_1.trim() || "/wrapped-song.mp3",
          song_url_2: formData.song_url_2.trim() || "/wrapped-song.mp3",
          song_url_3: formData.song_url_3.trim() || "/wrapped-song.mp3",
        },
      ])
      .select();

    setIsSubmitting(false);

    if (!error && data) {
      const origin = window.location.origin;
      setGeneratedLink(`${origin}/tools/wrapped/${data[0].id}`);
    } else {
      alert("Gagal membuat Wrapped. Coba periksa kembali jaringan Anda.");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6 flex flex-col items-center relative overflow-x-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Sparkles size={12} className="animate-pulse" /> 2026 Stories Generator
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-300 to-pink-400">
            Relationship Wrapped
          </h1>
          <p className="text-sm text-slate-400">
            Bikin kilas balik perjalanan hubungan atau pertemanan kalian dalam format slideshow musik interaktif yang estetik!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Nama Kamu</label>
              <input type="text" name="creator_name" required value={formData.creator_name} onChange={handleInputChange} placeholder="E.g. Syahriza" className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Nama Doi / Sahabat</label>
              <input type="text" name="partner_name" required value={formData.partner_name} onChange={handleInputChange} placeholder="E.g. Ikhsan" className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5"><Calendar size={14} /> Statistik Lucu Hubungan</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400">Berapa Hari Bersama? (Hari)</label>
                <input type="number" name="days_together" required value={formData.days_together} onChange={handleInputChange} placeholder="E.g. 365" className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400">Total Berantem Sepele (Kali)</label>
                <input type="number" name="fight_count" required value={formData.fight_count} onChange={handleInputChange} placeholder="E.g. 48" className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400">Inside Joke / Kata yang Sering Diucapkan</label>
              <input type="text" name="inside_joke" required value={formData.inside_joke} onChange={handleInputChange} placeholder="E.g. 'Terserah', 'Kamu tuh ya...'" className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1.5"><Music size={14} /> Soundtrack Kebersamaan (Gunakan URL .mp3)</h3>
            <div className="space-y-3">
              <input type="text" name="song_title_1" required value={formData.song_title_1} onChange={handleInputChange} placeholder="Judul Lagu 1 (E.g. Akad)" className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-pink-500" />
              <input type="url" name="song_url_1" value={formData.song_url_1} onChange={handleInputChange} placeholder="URL Link Direct MP3 Lagu 1 (Kosongkan jika pakai default)" className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-mono text-slate-500" />
              
              <input type="text" name="song_title_2" required value={formData.song_title_2} onChange={handleInputChange} placeholder="Judul Lagu 2" className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-pink-500" />
              <input type="url" name="song_url_2" value={formData.song_url_2} onChange={handleInputChange} placeholder="URL Link Direct MP3 Lagu 2" className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-mono text-slate-500" />
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Pesan Spesial Penutup (Slide Akhir)</label>
            <textarea name="special_message" required rows={3} value={formData.special_message} onChange={handleInputChange} placeholder="Tulis ungkapan terima kasih atau harapanmu untuk kalian ke depannya..." className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-pink-500 hover:opacity-90 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-pink-500/10">
            {isSubmitting ? "Generating Story..." : "Buat Wrapped Hubungan 🎬"}
          </button>
        </form>

        <AnimatePresence>
          {generatedLink && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-emerald-500/30 p-5 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block">✨ Tautan Cerita Siap Dikirim:</span>
              <div className="flex gap-2 items-center">
                <input type="text" readOnly value={generatedLink} className="w-full bg-slate-950 px-4 py-2.5 border border-white/5 rounded-xl text-xs font-mono text-pink-400 select-all focus:outline-none truncate" />
                <button onClick={handleCopy} className={`p-3 rounded-xl border transition-all cursor-pointer ${isCopied ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-950 border-white/10 text-slate-400"}`}>
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              {isCopied && <p className="text-[11px] text-emerald-400 text-center animate-pulse">Berhasil disalin! Berikan tautan ini ke pasangan/sahabatmu.</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}