/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, RefreshCw, RotateCcw, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FRAME_OPTIONS, STICKER_THEMES, FrameColorId, StickerThemeId } from "./types";

interface CaptureTabProps {
  normalizePhoneNumber: (phone: string) => string;
}

export default function CaptureTab({ normalizePhoneNumber }: CaptureTabProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentShot, setCurrentShot] = useState(1);
  const [finalStrip, setFinalStrip] = useState<string | null>(null);

  const [phoneInput, setPhoneInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // States variasi hiasan
  const [selectedFrame, setSelectedFrame] = useState<FrameColorId>("dark");
  const [selectedSticker, setSelectedSticker] = useState<StickerThemeId>("none");

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Otomatis merender ulang susunan strip jika hiasan diubah setelah foto terkumpul
  useEffect(() => {
    if (capturedFrames.length === 4) {
      generatePhotoStrip();
    }
  }, [capturedFrames, selectedFrame, selectedSticker]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const triggerShotCountdown = () => {
    if (currentShot > 4 || isCounting) return;
    setSaveSuccess(false);
    setIsCounting(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (!isCounting) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      captureFrame();
      setIsCounting(false);
      setCurrentShot(prev => prev + 1);
    }
  }, [isCounting, countdown]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = 640;
    canvasRef.current.height = 480;

    ctx.translate(640, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const imageData = canvasRef.current.toDataURL("image/jpeg");
    setCapturedFrames(prev => [...prev, imageData]);
  };

  const resetPhotoSession = () => {
    setCapturedFrames([]);
    setFinalStrip(null);
    setCurrentShot(1);
    setIsCounting(false);
    setSaveSuccess(false);
  };

  // Generator Strip Foto + Logika Gambar Variasi Hiasan/Stiker Otomatis
  const generatePhotoStrip = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 700;
    canvas.height = 2160;

    const frameCfg = FRAME_OPTIONS.find(f => f.id === selectedFrame) || FRAME_OPTIONS[0];
    ctx.fillStyle = frameCfg.hexColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let loadedCount = 0;
    capturedFrames.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        const topOffsetY = 40 + idx * (480 + 30);
        
        // Gambar Foto Utama
        ctx.drawImage(img, 30, topOffsetY, 640, 480);

        // Suntik Variasi Hiasan/Stiker Berdasarkan Tema Pilihan
        ctx.save();
        if (selectedSticker === "love") {
          ctx.font = "30px Arial";
          ctx.fillText("🌸", 45, topOffsetY + 50);
          ctx.fillText("❤️", 600, topOffsetY + 50);
          ctx.fillText("✨", 50, topOffsetY + 440);
          ctx.fillText("🌸", 595, topOffsetY + 440);
        } else if (selectedSticker === "cyberpunk") {
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 2;
          ctx.strokeRect(35, topOffsetY + 5, 630, 470);
          ctx.font = "bold 12px monospace";
          ctx.fillStyle = "#f43f5e";
          ctx.fillText(`[ REC 0${idx + 1} ]`, 55, topOffsetY + 35);
          ctx.fillText("SYS_ACTIVE", 560, topOffsetY + 450);
        } else if (selectedSticker === "sparkle") {
          ctx.font = "28px Arial";
          ctx.fillText("✨", 40, topOffsetY + 45);
          ctx.fillText("⭐", 610, topOffsetY + 60);
          ctx.fillText("⭐", 45, topOffsetY + 430);
          ctx.fillText("✨", 600, topOffsetY + 425);
        } else if (selectedSticker === "vintage") {
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.font = "bold 14px Courier New";
          ctx.fillText(`ISO 400 - FRAME 0${idx + 1}`, 50, topOffsetY + 30);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(40, topOffsetY + 10, 620, 460);
        }
        ctx.restore();

        // Jika seluruh frame selesai dirangkai
        if (loadedCount === 4) {
          ctx.fillStyle = frameCfg.textColor;
          ctx.font = "bold 24px monospace";
          ctx.textAlign = "center";
          ctx.fillText("✨ WHISPER BOOTH 2026 ✨", canvas.width / 2, canvas.height - 50);

          // Output akhir menggunakan JPEG kompresi tinggi untuk mencegah timeout WhatsApp
          setFinalStrip(canvas.toDataURL("image/jpeg"));
        }
      };
    });
  };

  const handleSaveAndSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalStrip || !phoneInput.trim()) return;

    setIsSaving(true);
    const cleanPhone = normalizePhoneNumber(phoneInput);

    try {
      // Ambil data blob dari base64 JPEG canvas
      const res = await fetch(finalStrip);
      const blob = await res.blob();
      const fileName = `${cleanPhone}-${Date.now()}.jpg`;

      // Unggah berkas gambar ke Supabase Storage (Murni JPEG)
      const { error: storageErr } = await supabase.storage
        .from("photobooth")
        .upload(fileName, blob, { 
          contentType: "image/jpeg",
          upsert: true 
        });

      if (storageErr) throw storageErr;

      // Dapatkan Link URL Publik Gambar
      const { data: urlData } = supabase.storage
        .from("photobooth")
        .getPublicUrl(fileName);

      // Masukkan data catatan log riwayat ke database
      const { error: dbErr } = await supabase
        .from("photobooth_snaps")
        .insert([{ phone_number: cleanPhone, image_url: urlData.publicUrl }]);

      if (dbErr) throw dbErr;

      setSaveSuccess(true);
      setPhoneInput("");

      // KIRIM VIA API BACKEND (Proses otomatis di background)
      try {
        const response = await fetch("/api/send-whatsapp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetPhone: cleanPhone,
            imageUrl: urlData.publicUrl,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Gagal mengirim pesan WA");
        }
        
        alert("Foto berhasil disimpan dan dikirim langsung ke WhatsApp Anda! ✨");
      } catch (waErr: any) {
        console.error("Gagal mengirim via gateway:", waErr);
        alert("Foto tersimpan di brankas, namun gagal mengirim pesan WA otomatis.");
      }

    } catch (err: any) {
      alert("Gagal memproses data: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* SISI KIRI: Kamera & Tombol Bidik */}
      <div className="space-y-4">
        <div className="relative aspect-[4/3] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" playsInline muted autoPlay />
          
          <AnimatePresence>
            {isCounting && countdown > 0 && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs z-10">
                <span className="text-8xl font-black font-mono text-cyan-400 drop-shadow-md">{countdown}</span>
                <span className="text-xs font-mono text-white/70 uppercase mt-2 tracking-widest">Bersiap Foto Ke-{currentShot}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-center p-6 text-slate-500 text-xs">
              <RefreshCw size={24} className="animate-spin text-cyan-400 mb-3" />
              <span>Mengaktifkan lensa kamera digital...</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono border border-white/10 text-slate-300">
            Slot Terisi: {capturedFrames.length} / 4
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={triggerShotCountdown}
            disabled={isCounting || !stream || currentShot > 4}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:from-slate-800 disabled:to-slate-800 text-xs font-mono font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
          >
            {currentShot <= 4 ? `Ambil Pose Foto Ke-${currentShot} 📸` : "Semua Slot Terisi ✨"}
          </button>

          {capturedFrames.length > 0 && (
            <button
              onClick={resetPhotoSession}
              className="px-4 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-colors"
              title="Reset Sesi"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>

        {/* Thumbnail Foto Sementara */}
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="aspect-[4/3] bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center relative">
              {capturedFrames[idx] ? (
                <img src={capturedFrames[idx]} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-mono text-slate-700">#{idx + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* PANEL PILIHAN HIASAN */}
        <div className="bg-slate-900/40 p-4 rounded-3xl border border-white/5 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block">1. Pilih Vibe Warna Frame:</span>
            <div className="grid grid-cols-4 gap-2">
              {FRAME_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFrame(f.id)}
                  className={`py-1.5 rounded-xl text-[10px] font-mono border text-center transition-all ${
                    selectedFrame === f.id ? "border-cyan-400 bg-white/5 text-white" : "border-white/5 text-slate-500"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block">2. Tambahkan Tema Stiker/Hiasan:</span>
            <div className="grid grid-cols-2 gap-2">
              {STICKER_THEMES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSticker(s.id)}
                  className={`p-2 rounded-xl text-left border text-[11px] transition-all flex flex-col ${
                    selectedSticker === s.id ? "border-cyan-400 bg-cyan-950/20 text-white" : "border-white/5 text-slate-400"
                  }`}
                >
                  <span className="font-bold font-mono">{s.name}</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">{s.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: Preview Hasil & Simpan */}
      <div className="space-y-4">
        <div className="p-4 bg-slate-900/40 border border-white/10 rounded-3xl min-h-[440px] flex flex-col items-center justify-center text-center">
          {finalStrip ? (
            <div className="space-y-4 w-full flex flex-col items-center">
              <p className="text-xs font-mono text-emerald-400 font-bold">✨ Kompilasi Foto Strip Berhasil Dibuat!</p>
              <div className={`p-2.5 rounded-xl shadow-2xl max-w-[200px] ${FRAME_OPTIONS.find(f => f.id === selectedFrame)?.bgClass}`}>
                <img src={finalStrip} alt="Final strip" className="w-full h-auto rounded-md" />
              </div>
              <a
                href={finalStrip}
                download="whisperbooth-decorated-strip.jpg"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-xs font-mono transition-colors"
              >
                <Download size={14} /> Unduh Mentah JPG
              </a>
            </div>
          ) : (
            <div className="text-slate-500 text-xs p-6 font-mono space-y-3">
              <Camera size={32} className="mx-auto text-slate-800 mb-1" />
              <p>Kompilasi strip belum dimuat.</p>
              <p className="text-[10px] text-slate-600 max-w-xs leading-relaxed">
                Ambil 4 foto manual di sebelah kiri terlebih dahulu. Anda bebas mengganti opsi warna bingkai dan tema stiker kapan pun Anda mau!
              </p>
            </div>
          )}
        </div>

        {finalStrip && (
          <form onSubmit={handleSaveAndSendWhatsApp} className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 block tracking-wide">Nomor WhatsApp Pengambil Foto</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Misal: 08123456789..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-cyan-500 text-white placeholder-slate-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-slate-100 hover:bg-white text-slate-950 font-mono font-bold text-xs uppercase tracking-wide rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-lg"
            >
              {isSaving ? "Sedang Mengunggah & Mengirim WA..." : "Simpan & Kirim Ke WhatsApp 🚀"}
            </button>

            {saveSuccess && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 rounded-xl text-center">
                🎉 Tersimpan! Sistem memproses pengiriman file langsung ke WhatsApp Anda.
              </div>
            )}
          </form>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}