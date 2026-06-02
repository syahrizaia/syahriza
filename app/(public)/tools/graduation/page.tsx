/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, User, BookOpen, School, Calendar, FileText, Music, Send, Copy, Check, Sparkles, ArrowRight, Upload, ImageIcon, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function GraduationCardCreator() {
  const [formData, setFormData] = useState({
    graduate_name: "",
    degree_title: "",
    university: "",
    major: "",
    sender_name: "",
    special_message: "",
    song_url: "",
    graduation_year: 2026,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Perubahan Input Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "graduation_year" ? parseInt(value) || 2026 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi format file harus gambar
    if (!file.type.startsWith("image/")) {
      setErrorMessage("File harus berupa gambar (JPG, JPEG, PNG, atau WEBP)!");
      return;
    }

    // Validasi ukuran file (contoh: maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar terlalu besar! Maksimal 2MB ya.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit Data ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Validasi Sederhana
    if (!formData.graduate_name || !formData.university || !formData.sender_name || !formData.special_message) {
      setErrorMessage("Mohon lengkapi kolom-kolom utama ya!");
      setIsSubmitting(false);
      return;
    }

    try {
      let finalPhotoUrl = "";

      if (imageFile) {
        setIsSubmitting(true);
        const fileExt = imageFile.name.split(".").pop();
        // Buat nama file acak yang unik agar tidak saling tumpang tindih
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("graduation-photos") // Nama bucket Supabase Anda
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Ambil Public URL untuk disimpan ke database table
        const { data: publicUrlData } = supabase.storage
          .from("graduation-photos")
          .getPublicUrl(filePath);

        finalPhotoUrl = publicUrlData.publicUrl;
      }

      const payloadData = {
        ...formData,
        photo_url: finalPhotoUrl || null,
      };

      const { data, error } = await supabase
        .from("graduation_cards")
        .insert([payloadData])
        .select("id")
        .single();

      if (error) throw error;

      if (data) {
        setGeneratedId(data.id);
      }
    } catch (err: any) {
      console.error("Supabase Error Details:", {
        Pesan: err.message,
        Detail: err.details,
        Petunjuk: err.hint,
        Status: err.statusCode || err.code,
        ObjekAsli: err
      });
      setErrorMessage(err.message || "Gagal mengunggah gambar atau menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Salin Tautan ke Clipboard
  const copyToClipboard = () => {
    if (!generatedId) return;
    const shareableUrl = `${window.location.origin}/tools/graduation/${generatedId}`;
    navigator.clipboard.writeText(shareableUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 md:px-8 pt-16 selection:bg-amber-500/30">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 my-8">
        <AnimatePresence mode="wait">
          {!generatedId ? (
            
            /* ================= FORM INPUT UTAMA ================= */
            <motion.div 
              key="creator-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-2xl text-amber-400">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight">Graduation Card Builder</h1>
                  <p className="text-xs text-slate-400">Kirim ucapan kelulusan interaktif nan mewah</p>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* BAGIAN 1: DATA WISUDAWAN */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400/80 font-bold flex items-center gap-1.5">
                    <Sparkles size={12}/> Informasi Kelulusan
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" name="graduate_name" placeholder="Nama Wisudawan" required
                        value={formData.graduate_name} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="text" name="degree_title" placeholder="Gelar (S.Kom.)" required
                        value={formData.degree_title} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <School size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" name="university" placeholder="Universitas / Kampus" required
                        value={formData.university} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" name="major" placeholder="Jurusan / Program Studi" required
                        value={formData.major} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="number" name="graduation_year" placeholder="Tahun Kelulusan (Contoh: 2026)"
                      value={formData.graduation_year} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <ImageIcon size={12} /> Foto Wisudawan (Opsional)
                    </label>
                    
                    {!imagePreview ? (
                      // Wadah Dropzone Input File
                      <label className="flex flex-col items-center justify-center w-full h-28 bg-slate-950/40 border border-dashed border-white/10 hover:border-amber-500/30 rounded-xl cursor-pointer transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center px-4">
                          <Upload size={18} className="text-slate-500 group-hover:text-amber-400 transition-colors mb-1.5" />
                          <p className="text-xs text-slate-400 font-medium">Klik untuk pilih atau unggah gambar</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">PNG, JPG, JPEG (Maks. 2MB)</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    ) : (
                      // Wadah Preview Ketika Foto Berhasil Dipilih
                      <div className="relative flex items-center gap-4 p-3 bg-slate-950/60 border border-white/10 rounded-xl overflow-hidden">
                        <Image
                          src={imagePreview} 
                          alt="Preview wisudawan" 
                          className="w-16 h-16 object-cover rounded-lg border border-white/10"
                          width={64}
                          height={64}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-300 truncate">{imageFile?.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{(imageFile!.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={removeSelectedImage}
                          className="p-1.5 bg-white/5 border border-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all text-slate-400 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                <hr className="border-white/5 my-2" />

                {/* BAGIAN 2: DATA PENGIRIM & PESAN */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    💌 Pesan & Doa Anda
                  </h3>
                  
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" name="sender_name" placeholder="Nama Anda (Pengirim)" required
                      value={formData.sender_name} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <FileText size={14} className="absolute left-3.5 top-4 text-slate-500" />
                    <textarea 
                      name="special_message" rows={4} placeholder="Tulis ucapan selamat, doa tulus, dan harapan terbaikmu untuk masa depan mereka..." required
                      value={formData.special_message} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <hr className="border-white/5 my-2" />

                {/* BAGIAN 3: BACKING TRACK */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                    <Music size={12}/> Lagu Latar Belakang (Opsional)
                  </h3>
                  <div className="relative">
                    <Music size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="url" name="song_url" placeholder="https://domain.com/lagu-wisuda.mp3"
                      value={formData.song_url} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal pl-1">
                    💡 Disarankan link direct file berakhiran <b>.mp3</b>. Jika dikosongkan atau tautan rusak, sistem akan otomatis memutar instrumen kelulusan default.
                  </p>
                </div>

                {/* TOMBOL GENERATE */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black font-mono text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    "Mendaftarkan di Mimbar..."
                  ) : (
                    <>
                      Simpan & Buat Link <Send size={13} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            
            /* ================= HALAMAN SUKSES & COPY LINK ================= */
            <motion.div 
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                <Check size={28} />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white">Kartu Ucapan Siap Dikirim!</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Surat digital kelulusan untuk <b>{formData.graduate_name}, {formData.degree_title}</b> sukses dibuat. Salin tautan di bawah ini dan bagikan kepadanya.
                </p>
              </div>

              {/* Tampilan Link Box */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-950/80 border border-white/5 rounded-2xl font-mono text-xs text-slate-300">
                <span className="truncate flex-1 text-left pl-2 select-all">
                  {`${window.location.origin}/tools/graduation/${generatedId}`}
                </span>
                <button 
                  onClick={copyToClipboard}
                  className={`p-3 rounded-xl flex items-center gap-1.5 font-bold font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    isCopied ? "bg-emerald-500 text-slate-950" : "bg-white text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {isCopied ? (
                    <> Tersalin! <Check size={12} /> </>
                  ) : (
                    <> Salin <Copy size={12} /> </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href={`/tools/graduation/${generatedId}`}
                  target="_blank"
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  Lihat Hasil Preview <ArrowRight size={12}/>
                </Link>
                <button 
                  onClick={() => {
                    setGeneratedId(null);
                    setImageFile(null);
                    setFormData({
                      graduate_name: "",
                      degree_title: "",
                      university: "",
                      major: "",
                      sender_name: "",
                      special_message: "",
                      song_url: "",
                      graduation_year: 2026,
                    });
                  }}
                  className="px-5 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-mono tracking-wider transition-all cursor-pointer"
                >
                  Buat Baru Lagi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}