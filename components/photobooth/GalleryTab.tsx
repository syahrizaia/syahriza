/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Phone, ArrowRight } from "lucide-react";

interface GalleryTabProps {
  normalizePhoneNumber: (phone: string) => string;
}

export default function GalleryTab({ normalizePhoneNumber }: GalleryTabProps) {
  const router = useRouter();
  const [searchPhone, setSearchPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirectToGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;

    setIsLoading(true);
    
    // Normalisasi nomor telepon agar format string seragam
    const cleanPhone = normalizePhoneNumber(searchPhone);

    // Langsung arahkan ke halaman galeri dinamis berbasis nomor WA
    router.push(`/tools/photo-booth/${cleanPhone}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-900/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
          <Eye size={18} /> Brankas Riwayat Cetak Foto
        </h2>
        
        <form onSubmit={handleRedirectToGallery} className="flex gap-2 items-end">
          <div className="space-y-1.5 flex-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Masukkan Nomor WhatsApp Anda
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Contoh: 082114487163"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-slate-600"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchPhone.trim()}
            className="px-5 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider text-white flex items-center gap-2 cursor-pointer h-[46px]"
          >
            {isLoading ? "Membuka..." : (
              <>
                Buka <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center py-6 text-[11px] font-mono text-slate-500 max-w-md mx-auto leading-relaxed">
        Sistem akan mencocokkan nomor Anda dan menampilkan seluruh arsip digital photo strip yang pernah dicetak di WhisperBooth.
      </div>
    </div>
  );
}