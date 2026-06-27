"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, Sparkles, Sliders } from "lucide-react";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

export default function BlurSnapPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null);
  const [isBlur, setIsBlur] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blurIntensity, setBlurIntensity] = useState(20); // Nilai default blur (px)

  // 1. Inisialisasi MediaPipe Gesture Recognizer
  useEffect(() => {
    async function initExtension() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });
        setGestureRecognizer(recognizer);
        setIsLoading(false);
      } catch (error) {
        console.error("Gagal memuat model AI:", error);
        setIsLoading(false);
      }
    }
    initExtension();
  }, []);

  // 2. Aktifkan Kamera & Mulai Deteksi Loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    let isLoopActive = true;

    async function startCamera() {
      if (!videoRef.current || !gestureRecognizer) return;

      try {
        // Menggunakan resolusi landscape ideal untuk desktop & mobile
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        
        if (!isLoopActive) return;
        
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);

        const predictLoop = (timestamp: number) => {
          if (!isLoopActive) return;

          if (
            videoRef.current &&
            videoRef.current.readyState >= 2 &&
            videoRef.current.videoWidth > 0 &&
            videoRef.current.videoHeight > 0
          ) {
            const nowInMs = Math.round(timestamp);

            try {
              const results = gestureRecognizer.recognizeForVideo(videoRef.current, nowInMs);

              if (results.gestures && results.gestures.length > 0) {
                const topGesture = results.gestures[0][0].categoryName;
                setIsBlur(topGesture === "Victory");
              } else {
                setIsBlur(false);
              }
            } catch (predictError) {
              console.warn("MediaPipe frame skipped:", predictError);
            }
          }
          
          animationFrameId = requestAnimationFrame(predictLoop);
        };

        animationFrameId = requestAnimationFrame(predictLoop);
      } catch (err) {
        console.error("Akses kamera ditolak atau eror:", err);
      }
    }

    if (gestureRecognizer) {
      startCamera();
    }

    return () => {
      isLoopActive = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [gestureRecognizer]);

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white pt-28 flex flex-col items-center w-full max-w-full overflow-x-hidden">
      <div className="max-w-3xl w-full text-center space-y-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center gap-2">
          <Sparkles className="text-cyan-400 animate-pulse" size={24} /> Blur Gesture Cam 📸
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Angkat tanganmu dan bentuk gestur <span className="text-cyan-400 font-bold">2 Jari (✌️)</span> di depan kamera untuk memicu efek blur otomatis secara instan.
        </p>
      </div>

      {/* Kontainer Utama Viewfinder Kamera */}
      {/* 💡 Perubahan: Ditambahkan `md:max-w-4xl` dan `md:aspect-video` agar melebar ke samping tanpa meninggi */}
      <div className="relative w-full max-w-md md:max-w-4xl aspect-[3/4] md:aspect-video bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-cyan-950/20 transition-all duration-500">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 gap-3 text-xs font-mono text-slate-400">
            <RefreshCw size={20} className="animate-spin text-cyan-500" />
            <span>Mengunduh AI Model (Sekali Saja)...</span>
          </div>
        )}

        {!cameraActive && !isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-6 text-center text-xs text-slate-500">
            <Camera size={32} className="text-slate-600 mb-2" />
            <span>Izinkan akses kamera untuk memulai pengalaman interaktif.</span>
          </div>
        )}

        {/* Elemen Video Utama */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1] transition-all duration-300"
          style={{
            filter: isBlur ? `blur(${blurIntensity}px)` : "blur(0px)",
          }}
          playsInline
          muted
        />

        {/* Indikator Status di Atas Layar Kamera */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isBlur ? "bg-cyan-500 animate-ping" : "bg-emerald-500"}`} />
          <span className="text-[10px] md:text-xs font-mono uppercase bg-slate-950/70 backdrop-blur-sm px-2 py-1 rounded-md tracking-wider">
            {isBlur ? "✌️ Gestur Terdeteksi: BLUR" : "Mencari Gestur 2 Jari..."}
          </span>
        </div>
      </div>

      {/* Panel Pengaturan Tambahan */}
      {/* 💡 Perubahan: Lebar disesuaikan juga menjadi `md:max-w-4xl` agar serasi dengan kamera */}
      <div className="w-full max-w-md md:max-w-4xl mt-6 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 space-y-3 transition-all duration-500">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sliders size={14} className="text-cyan-500" />
          <span>Intensitas Kekaburan (Blur)</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="5"
            max="50"
            value={blurIntensity}
            onChange={(e) => setBlurIntensity(Number(e.target.value))}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-xs md:text-sm text-cyan-400 font-bold min-w-[35px] text-right">
            {blurIntensity}px
          </span>
        </div>
      </div>
    </div>
  );
}