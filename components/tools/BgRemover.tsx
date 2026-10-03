"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Download, ImageUp, LoaderCircle } from "lucide-react";

export default function BgRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  useEffect(() => () => { requestId.current += 1; }, []);

  async function processFile(nextFile: File) {
    if (!nextFile.type.startsWith("image/")) {
      setError("Pilih file gambar yang valid.");
      return;
    }

    const currentRequest = ++requestId.current;
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResultUrl(null);
    setError("");
    setIsProcessing(true);

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const result = await removeBackground(nextFile, {
        model: "isnet",
        output: { format: "image/png", quality: 1 },
      });
      if (currentRequest === requestId.current) {
        setResultUrl(URL.createObjectURL(result));
      }
    } catch {
      if (currentRequest === requestId.current) {
        setError("Latar belakang gagal dihapus. Periksa koneksi internet saat pemuatan model pertama, lalu coba lagi.");
      }
    } finally {
      if (currentRequest === requestId.current) setIsProcessing(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) void processFile(selected);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const selected = event.dataTransfer.files[0];
    if (selected) void processFile(selected);
  }

  function downloadResult() {
    if (!file || !resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${file.name.replace(/\.[^.]+$/, "")}-tanpa-latar.png`;
    link.click();
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Penghapus Latar Belakang</h1>
        <p className="mt-2 text-sm text-slate-400">Unggah gambar untuk menghapus latarnya. Hasil PNG transparan dapat diunduh pada resolusi asli gambar.</p>
      </div>

      <div
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? "border-cyan-400 bg-cyan-400/10" : "border-white/20 bg-slate-950/40 hover:border-cyan-400/50"}`}
      >
        <ImageUp className="mx-auto mb-3 text-cyan-400" size={32} aria-hidden="true" />
        <p className="mb-3 text-sm text-slate-300">Tarik dan lepas gambar di sini, atau</p>
        <label htmlFor="bg-remover-upload" className="inline-flex cursor-pointer rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400">
          Pilih Gambar
        </label>
        <input id="bg-remover-upload" type="file" accept="image/*" onChange={handleChange} className="sr-only" />
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}
      {isProcessing && (
        <div role="status" className="mt-6 flex items-center justify-center gap-2 text-sm text-cyan-300">
          <LoaderCircle className="animate-spin" size={20} aria-hidden="true" /> Menghapus latar belakang...
        </div>
      )}

      {previewUrl && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {(["Sebelum", "Sesudah"] as const).map((label, index) => (
              <div key={label} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                <p className="border-b border-white/10 px-4 py-3 text-sm font-medium text-slate-300">{label}</p>
                <div className="relative aspect-square bg-slate-800">
                  {(index === 0 || resultUrl) && <Image src={index === 0 ? previewUrl : resultUrl!} alt={index === 0 ? "Gambar asli" : "Gambar dengan latar belakang transparan"} fill unoptimized sizes="(max-width: 640px) 100vw, 50vw" className="object-contain" />}
                </div>
              </div>
            ))}
          </div>
          {resultUrl && (
            <button type="button" onClick={downloadResult} className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400">
              <Download size={17} aria-hidden="true" /> Unduh PNG Resolusi Asli
            </button>
          )}
        </div>
      )}
    </div>
  );
}
