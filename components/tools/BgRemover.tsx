"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Download, ImageUp, LoaderCircle } from "lucide-react";
import { removeSolidBackground } from "./removeSolidBackground";

type RemovalMode = "auto" | "white";

async function cleanTransparentEdges(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Canvas tidak tersedia di browser ini.");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = image;
  const { width, height } = canvas;
  const alpha = new Uint8Array(width * height);
  const horizontalMin = new Uint8Array(alpha.length);

  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];

  // Shrink the mask by two pixels to remove background color left on the edge.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minimum = 255;
      for (let offset = -2; offset <= 2; offset++) {
        minimum = Math.min(minimum, alpha[y * width + Math.max(0, Math.min(width - 1, x + offset))]);
      }
      horizontalMin[y * width + x] = minimum;
    }
  }

  let transparentPixels = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minimum = 255;
      for (let offset = -2; offset <= 2; offset++) {
        minimum = Math.min(minimum, horizontalMin[Math.max(0, Math.min(height - 1, y + offset)) * width + x]);
      }
      const refinedAlpha = Math.max(0, Math.min(255, Math.round((minimum - 30) * 255 / 190)));
      data[(y * width + x) * 4 + 3] = refinedAlpha;
      if (refinedAlpha === 0) transparentPixels++;
    }
  }

  if (transparentPixels === 0) throw new Error("Model tidak menemukan area latar yang bisa dihapus pada gambar ini.");
  context.putImageData(image, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("PNG transparan gagal dibuat."));
    }, "image/png");
  });
}

export default function BgRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<RemovalMode>("auto");
  const [error, setError] = useState("");
  const requestId = useRef(0);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  useEffect(() => () => { requestId.current += 1; }, []);

  async function processFile(nextFile: File, selectedMode: RemovalMode = mode) {
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
      let result = await removeSolidBackground(nextFile, selectedMode === "white" ? [255, 255, 255] : undefined);
      if (!result && selectedMode === "white") {
        throw new Error("Area putih tidak ditemukan. Pilih mode Otomatis untuk gambar ini.");
      }
      if (!result) {
        const { removeBackground } = await import("@imgly/background-removal");
        const aiResult = await removeBackground(nextFile, {
          model: "isnet",
          output: { format: "image/png", quality: 1 },
        });
        result = await cleanTransparentEdges(aiResult);
      }
      if (currentRequest === requestId.current) {
        setResultUrl(URL.createObjectURL(result));
      }
    } catch (error) {
      if (currentRequest === requestId.current) {
        setError(error instanceof Error && (error.message.includes("Model tidak menemukan") || error.message.includes("Canvas tidak tersedia") || error.message.includes("Area putih tidak ditemukan"))
          ? error.message
          : "Latar belakang gagal dihapus. Periksa koneksi internet saat pemuatan model pertama, lalu coba lagi.");
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
        <p className="mt-2 text-sm text-slate-400">Unggah gambar untuk menghapus latarnya. Untuk kumpulan logo dengan latar putih, pilih mode Latar putih. Hasil PNG transparan tetap beresolusi asli.</p>
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

      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Mode penghapusan latar">
        {([["auto", "Otomatis"], ["white", "Latar putih"]] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => {
              setMode(value);
              if (file) void processFile(file, value);
            }}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${mode === value ? "border-cyan-400 bg-cyan-400/15 text-cyan-200" : "border-white/15 text-slate-400 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "white" && <p className="mt-2 text-xs text-slate-400">Mode ini juga menghapus bagian logo yang berwarna putih sama seperti latarnya.</p>}

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
                <div
                  className="relative aspect-square bg-slate-800"
                  style={index === 1 ? {
                    backgroundImage: "conic-gradient(#cbd5e1 25%, #ffffff 0 50%, #cbd5e1 0 75%, #ffffff 0)",
                    backgroundSize: "24px 24px",
                  } : undefined}
                >
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
