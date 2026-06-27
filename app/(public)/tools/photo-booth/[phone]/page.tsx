/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tools/photo-booth/[phone]/page.tsx
import { supabase } from "@/lib/supabase";
import { Camera, Download, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface GalleryPageProps {
  params: Promise<{
    phone: string;
  }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const phone = resolvedParams.phone;

  // Ambil data foto dari Supabase berdasarkan nomor telepon
  const { data: snaps, error } = await supabase
    .from("photobooth_snaps")
    .select("*")
    .eq("phone_number", phone)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono p-4">
        <p className="text-red-400">Gagal memuat galeri: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 font-mono p-6 pt-24 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Tombol Kembali Atas */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/tools/photo-booth"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 border border-white/5 bg-slate-900/40 px-3 py-2 rounded-xl transition-colors backdrop-blur-sm cursor-pointer"
        >
          <ArrowLeft size={14} /> Kembali ke Photo Booth
        </Link>
      </div>

      <header className="max-w-4xl mx-auto text-center mb-8 space-y-2">
        <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          ✨ WHISPERBOOTH ALBUM ✨
        </h1>
        <p className="text-xs text-slate-400">
          Menampilkan memori keseruan untuk nomor: <span className="text-cyan-400">+{phone}</span>
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {snaps && snaps.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {snaps.map((snap: any) => {
              const shareText = encodeURIComponent(
                `Lihat foto strip keseruan dari album WhisperBooth milikku di sini ✨:\n\n${snap.image_url}`
              );
              const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

              return (
                <div key={snap.id} className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex flex-col items-center space-y-4 shadow-xl">
                  <div className="p-1.5 bg-slate-950 rounded-xl border border-white/5 max-w-[200px]">
                    <img 
                      src={snap.image_url} 
                      alt="Photo Strip" 
                      className="w-full h-auto rounded-lg shadow-inner"
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 w-full text-center">
                    {new Date(snap.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                  
                  {/* Container Tombol Aksi */}
                  <div className="flex gap-2 w-full">
                    {/* Tombol Unduh */}
                    <a
                      href={snap.image_url}
                      download={`whisperbooth-${snap.id}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-2 transition-colors cursor-pointer text-slate-100"
                    >
                      <Download size={14} /> Unduh
                    </a>

                    {/* Tombol Bagikan */}
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/30 rounded-xl text-xs font-bold text-cyan-400 text-center inline-flex items-center justify-center transition-colors cursor-pointer"
                      title="Bagikan ke WhatsApp"
                    >
                      <Share2 size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 space-y-3">
            <Camera size={40} className="mx-auto text-slate-800" />
            <p className="text-sm">Belum ada foto yang tersimpan untuk nomor ini.</p>
            <p className="text-[10px] text-slate-600 max-w-xs mx-auto">
              Pastikan nomor <code className="text-slate-400">{phone}</code> di URL sama persis dengan string yang tertulis di kolom <code className="text-slate-400">phone_number</code> database Supabase Anda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}