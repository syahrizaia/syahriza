/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Inbox, 
  User, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Eye, 
  Lock,
  Calendar
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SecretBoxPage() {
  const [activeTab, setActiveTab] = useState<"send" | "inbox">("send");
  
  // State Form Pengirim
  const [senderName, setSenderName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // State Form Penerima
  const [myPhone, setMyPhone] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [hasCheckedInbox, setHasCheckedInbox] = useState(false);

  // Reset status sukses setelah beberapa detik
  useEffect(() => {
    if (sendSuccess) {
      const timer = setTimeout(() => setSendSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [sendSuccess]);

  // Fungsi Mengirim Pesan ke Supabase
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim() || !messageText.trim()) return;

    setIsSending(true);
    const { error } = await supabase.from("anonymous_messages").insert([
      {
        sender_name: senderName.trim() || "Anonim",
        recipient_phone: recipientPhone.trim(),
        message: messageText.trim(),
      },
    ]);

    setIsSending(false);
    if (!error) {
      setSendSuccess(true);
      setSenderName("");
      setRecipientPhone("");
      setMessageText("");
    } else {
      alert("Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  // Fungsi Mengambil Pesan Berdasarkan Nomor Telepon Penerima
  const handleFetchInbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myPhone.trim()) return;

    setIsLoadingInbox(true);
    setHasCheckedInbox(true);

    const { data, error } = await supabase
      .from("anonymous_messages")
      .select("*")
      .eq("recipient_phone", myPhone.trim())
      .order("created_at", { ascending: false });

    setIsLoadingInbox(false);
    if (!error && data) {
      setMessages(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Efek Cahaya Latar Belakang */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full space-y-8">
        
        {/* Header Judul */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono">
            <Lock size={12} /> End-to-End Anonymous Routing
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-300 to-fuchsia-400">
            WhisperBox
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Kirim pesan rahasia atau periksa kotak masukmu hanya menggunakan nomor telepon tujuan tanpa sebar link WhatsApp.
          </p>
        </div>

        {/* Tombol Navigasi Tab */}
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 flex gap-2 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex-1 py-3 rounded-xl font-medium text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "send" 
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/10" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Send size={14} /> Kirim Pesan
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 py-3 rounded-xl font-medium text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "inbox" 
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/10" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Inbox size={14} /> Kotak Masuk
          </button>
        </div>

        {/* Area Konten Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "send" ? (
            
            /* ================= TAB 1: FORM KIRIM PESAN ================= */
            <motion.div
              key="send-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-900/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl space-y-5"
            >
              <h2 className="text-lg font-bold flex items-center gap-2 text-violet-400">
                <Sparkles size={18} /> Kirim Surat Rahasia
              </h2>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Nama Samaran (Opsional)</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Misal: Pengagum Rahasiamu, Teman Sekelas"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Nomor WhatsApp Penerima</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Isi Pesan Jujur / Pengakuan</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-4 top-4 text-slate-500" />
                    <textarea
                      required
                      rows={4}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Tuliskan keluh kesah, rindu, kekaguman, atau kritik jujurmu di sini secara bebas..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-600 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                >
                  {isSending ? "Mengirim Bisikan..." : "Kirim Secara Anonim 🚀"}
                </button>
              </form>

              <AnimatePresence>
                {sendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-medium text-center"
                  >
                    ✨ Pesan berhasil disimpan ke dalam sistem! Beritahu dia untuk mengecek WhisperBox menggunakan nomor teleponnya.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            
            /* ================= TAB 2: DASHBOARD KOTAK MASUK ================= */
            <motion.div
              key="inbox-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Form Input Nomor Sendiri */}
              <div className="bg-slate-900/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-fuchsia-400">
                  <Eye size={18} /> Lihat Pesan Rahasiamu
                </h2>
                
                <form onSubmit={handleFetchInbox} className="flex gap-2 items-end">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Masukkan Nomor WhatsApp-mu</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={myPhone}
                        onChange={(e) => setMyPhone(e.target.value)}
                        placeholder="Masukkan nomor untuk cek pesan"
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 transition-colors placeholder-slate-600"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoadingInbox}
                    className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider disabled:opacity-50 cursor-pointer h-[46px]"
                  >
                    {isLoadingInbox ? "Memuat..." : "Buka"}
                  </button>
                </form>
              </div>

              {/* Tampilan Grid Kartu Pesan */}
              <div className="space-y-4">
                {isLoadingInbox ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs animate-pulse">
                    Membongkar brankas surat rahasia...
                  </div>
                ) : hasCheckedInbox ? (
                  messages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/5 backdrop-blur-md shadow-md space-y-3 hover:border-violet-500/30 transition-all group"
                        >
                          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                            <span className="px-2.5 py-0.5 bg-violet-500/10 text-violet-300 rounded-full font-bold group-hover:bg-violet-500/20 transition-colors">
                              From: {msg.sender_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> {new Date(msg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line">
                            &quot;{msg.message}&quot;
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-slate-900/20 border border-dashed border-white/5 rounded-2xl text-slate-500 text-xs font-mono"
                    >
                      Belum ada pesan misterius untuk nomor ini. 📭
                    </motion.div>
                  )
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}