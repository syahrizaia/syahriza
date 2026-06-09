/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Gauge, Zap, Award, Sliders, Play, RotateCcw, ShieldAlert, Sparkles, Flame } from "lucide-react";

type UpgradeType = "ENGINE" | "TURBO" | "TIRES";
type BodykitType = "CARBON_AERO" | "NEON_GLOW" | "WIDE_BODY";

export default function GrandThemeMotorsportGameplay() {
  const router = useRouter();

  // GAME STATES
  const [gameState, setGameState] = useState<"GARAGE" | "RACE_START" | "RACING" | "VICTORY" | "DEFEAT">("GARAGE");

  // GARAGE & MODIFICATION STATES
  const [credits, setCredits] = useState(25000);
  const [upgrades, setUpgrades] = useState({ ENGINE: 1, TURBO: 1, TIRES: 1 });
  const [selectedBodykit, setSelectedBodykit] = useState<BodykitType>("NEON_GLOW");

  // RACING TELEMETRY METRICS
  const [speed, setSpeed] = useState(0); // km/h
  const [rpm, setRpm] = useState(1000); // 1000 - 8000 RPM
  const [gear, setGear] = useState(1); // 1 - 6
  const [distance, setDistance] = useState(0); // Target: 2000 meter
  const [rivalDistance, setRivalDistance] = useState(0);
  const [nitroCharge, setNitroCharge] = useState(100); // 0 - 100%
  const [isNitroActive, setIsNitroActive] = useState(false);
  
  // CORNERING & DRIFT EVENT STATES
  const [cornerAlert, setCornerAlert] = useState(false);
  const [cornerSuccess, setCornerSuccess] = useState<"PERFECT" | "GOOD" | "BAD" | null>(null);

  // LOG BALAPAN SINEMATIK
  const [raceLogs, setRaceLogs] = useState<string[]>(["[GARAGE]: Mobil siap dikonfigurasi."]);

  const raceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Audio Synthesizer untuk Simulasi Suara Mesin & NOS
  const playEngineSound = (frequency: number, duration: number, type: OscillatorType = "sawtooth") => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context browser fall protection
    }
  };

  // KONTROL UPGRADE PERFORMA JERUAN MESIN
  const buyUpgrade = (type: UpgradeType, cost: number) => {
    if (credits >= cost && upgrades[type] < 5) {
      setCredits((prev) => prev - cost);
      setUpgrades((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      playEngineSound(300, 0.2, "sine");
      setRaceLogs((prev) => [...prev, `[UPGRADE]: Komponen ${type} ditingkatkan ke Level ${upgrades[type] + 1}.`]);
    }
  };

  // INISIASI START BALAPAN MALAM HARI
  const startRace = () => {
    setSpeed(0);
    setRpm(1000);
    setGear(1);
    setDistance(0);
    setRivalDistance(20); // Rival mulai sedikit di depan
    setNitroCharge(100);
    setIsNitroActive(false);
    setCornerAlert(false);
    setCornerSuccess(null);
    setGameState("RACING");
    setRaceLogs(["🟢 [LAUNCH]: Balapan dimulai! Injak gas dalam-dalam!"]);
    playEngineSound(440, 0.5, "sawtooth");
  };

  // SIMULASI AKSI FISIKA DRIVING LOOP
  useEffect(() => {
    if (gameState !== "RACING") return;

    raceIntervalRef.current = setInterval(() => {
      // Perhitungan Stat Berdasarkan Level Upgrade Garasi
      const maxSpeed = 220 + upgrades.ENGINE * 25 + (isNitroActive ? 50 : 0);
      const acceleration = (8 + upgrades.TURBO * 3) * (isNitroActive ? 2.5 : 1);
      const handlingFactor = upgrades.TIRES;

      // 1. Pergerakan RPM Mesin Otomatis Naik Seiring Akselerasi
      setRpm((prevRpm) => {
        if (prevRpm >= 7800) {
          // Limiter mesin bergetar jika telat ganti gigi
          playEngineSound(120, 0.05, "square");
          return 7800;
        }
        const rpmGain = (acceleration * 150) / gear;
        return Math.min(8000, prevRpm + rpmGain);
      });

      // 2. Kalkulasi Kecepatan (Speed km/h) Berdasarkan Posisi Gigi & RPM
      setSpeed((prevSpeed) => {
        const targetSpeed = (rpm / 8000) * maxSpeed * (gear / 6);
        const nextSpeed = prevSpeed + (targetSpeed - prevSpeed) * 0.15;
        return Math.floor(Math.min(maxSpeed, nextSpeed));
      });

      // 3. Kalkulasi Jarak Tempuh Sirkuit Kota
      setDistance((prevDist) => {
        const nextDist = prevDist + speed * 0.07;
        if (nextDist >= 2000) {
          // Finish Line Check
          setGameState(nextDist >= rivalDistance ? "VICTORY" : "DEFEAT");
          if (nextDist >= rivalDistance) setCredits((c) => c + 45000); // Hadiah Menang
          clearInterval(raceIntervalRef.current!);
        }

        // Trigger Event Tikungan / Drift Cornering acak di jarak tertentu
        if (Math.floor(nextDist) % 600 > 550 && !cornerAlert) {
          setCornerAlert(true);
          setCornerSuccess(null);
        }

        return nextDist;
      });

      // 4. Pergerakan AI Rival Pembalap Liar Lain
      setRivalDistance((prevRival) => {
        const rivalBaseSpeed = 240 + Math.sin(Date.now() / 2000) * 30; // Kecepatan dinamis rival
        return prevRival + rivalBaseSpeed * 0.068;
      });

      // 5. Konsumsi Bahan Bakar Nitro (NOS)
      if (isNitroActive) {
        setNitroCharge((prev) => {
          if (prev <= 2) {
            setIsNitroActive(false);
            return 0;
          }
          return prev - 8;
        });
        playEngineSound(800, 0.1, "triangle");
      }

    }, 120);

    return () => { if (raceIntervalRef.current) clearInterval(raceIntervalRef.current); };
  }, [gameState, gear, rpm, speed, isNitroActive, upgrades, rivalDistance, cornerAlert]);

  // MEKANIK 1: PERFECT SHIFT GEAR CONTROL (Up Shifting)
  const executeShiftGear = () => {
    if (gameState !== "RACING") return;

    if (rpm >= 6200 && rpm <= 7400) {
      // Perfect Shift Zone
      setGear((g) => Math.min(6, g + 1));
      setRpm(3500); // RPM turun setelah ganti gigi atas
      setSpeed((s) => s + 15);
      setRaceLogs((prev) => [...prev.slice(-3), `⚡ [SHIFT]: Perfect Gear Shift! Naik ke Gigi ${Math.min(6, gear + 1)}.`]);
      playEngineSound(580, 0.1, "sine");
    } else if (rpm > 4000 && rpm < 6200) {
      // Good Shift Zone
      setGear((g) => Math.min(6, g + 1));
      setRpm(3000);
      setRaceLogs((prev) => [...prev.slice(-3), `👍 [SHIFT]: Good Shift di Gigi ${Math.min(6, gear + 1)}.`]);
      playEngineSound(400, 0.1, "sine");
    } else {
      // Bad Shift (Terlalu cepat atau telat Over-rev)
      setSpeed((s) => Math.max(10, s - 25));
      setRpm(2000);
      setRaceLogs((prev) => [...prev.slice(-3), "❌ [SHIFT]: Bad Timing Shift! Kehilangan momentum akselerasi mesin."]);
      playEngineSound(150, 0.3, "sawtooth");
    }
  };

  // MEKANIK 2: DRIFT CORNERING EXECUTION
  const executeDrift = () => {
    if (!cornerAlert || gameState !== "RACING") return;

    const driftRoll = Math.random() * 10 + upgrades.TIRES; // Semakin bagus ban, semakin mudah drift
    if (driftRoll > 9) {
      setCornerSuccess("PERFECT");
      setSpeed((s) => s + 20);
      setRaceLogs((prev) => [...prev.slice(-3), "🔥 [DRIFT]: Apex Cornering Sempurna! Kecepatan meningkat keluar tikungan."]);
      playEngineSound(600, 0.2, "triangle");
    } else if (driftRoll > 5) {
      setCornerSuccess("GOOD");
      setRaceLogs((prev) => [...prev.slice(-3), "💨 [DRIFT]: Drift berhasil mengitari sirkuit kota malam."]);
    } else {
      setCornerSuccess("BAD");
      setSpeed((s) => Math.max(40, s - 45)); // Spin out pelan
      setRaceLogs((prev) => [...prev.slice(-3), "⚠️ [CRASH]: Kehilangan kendali ban belakang! Menabrak pembatas jalan."]);
      playEngineSound(100, 0.4, "square");
    }
    setCornerAlert(false);
  };

  // MEKANIK 3: NITROUS OXIDE SYSTEM (NOS) BURST
  const triggerNitro = () => {
    if (nitroCharge > 10 && !isNitroActive && gameState === "RACING") {
      setIsNitroActive(true);
      setRaceLogs((prev) => [...prev.slice(-3), "🚀 [NITRO]: Menyuntikkan N2O! Kecepatan menembus batas maksimal."]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0712] text-zinc-100 p-4 flex flex-col items-center justify-center font-sans relative overflow-hidden select-none">
      
      {/* FULL REAL-TIME RAY TRACING GLOW SIMULATION (NEON BACKGROUND) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* TOP HEADER CONSOLE CONTEXT */}
      <div className="w-full max-w-xl flex justify-between items-center mb-3 bg-black/40 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs backdrop-blur-md">
        <button 
          onClick={() => router.back()}
          className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer uppercase text-zinc-400"
        >
          <ArrowLeft size={13} /> Exit Game
        </button>
        <div className="flex items-center gap-4 font-mono">
          <span className="text-amber-400 font-bold flex items-center gap-1">🎮 CONSOLE_MODE</span>
          <span className="text-emerald-400 font-bold tracking-wide">🏆 CREDITS: {credits.toLocaleString("id-ID")} CR</span>
        </div>
      </div>

      {/* MAIN GAMEFRAME HUD MONITOR */}
      <div className="w-full max-w-xl bg-gradient-to-b from-[#13101f] to-[#0c0a14] border-2 border-zinc-800 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <AnimatePresence mode="wait">
          
          {/* INTERFACE A: GARASI MODIFIKASI EXTREM & CUSTOMIZATION */}
          {gameState === "GARAGE" && (
            <motion.div key="garage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 uppercase flex items-center justify-center gap-1.5">
                  <Sliders size={18} className="text-amber-400" /> APEX PERFORMANCE GARAGE
                </h2>
                <p className="text-xs text-zinc-400 font-sans">Sesuaikan jeroan mesin sport sebelum menaklukkan sirkuit malam.</p>
              </div>

              {/* STATS UPGRADE TUNING ROW */}
              <div className="space-y-2.5 bg-black/40 border border-zinc-800/80 p-3.5 rounded-xl font-mono text-xs">
                {/* UPGRADE ITEM 1 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-200">Blok Mesin Sport (Engine)</p>
                    <p className="text-[10px] text-zinc-500">Meningkatkan Kecepatan Maksimum (+km/h)</p>
                  </div>
                  <button 
                    onClick={() => buyUpgrade("ENGINE", upgrades.ENGINE * 5000)}
                    disabled={upgrades.ENGINE >= 5 || credits < upgrades.ENGINE * 5000}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-black font-bold rounded-lg transition-all text-[11px] cursor-pointer"
                  >
                    {upgrades.ENGINE >= 5 ? "MAXED" : `LVL ${upgrades.ENGINE + 1} | ${(upgrades.ENGINE * 5000).toLocaleString()} CR`}
                  </button>
                </div>
                {/* UPGRADE ITEM 2 */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
                  <div>
                    <p className="font-bold text-zinc-200">Sistem Twin-Turbo (Acceleration)</p>
                    <p className="text-[10px] text-zinc-500">Meningkatkan Akselerasi Putaran RPM Gasingan</p>
                  </div>
                  <button 
                    onClick={() => buyUpgrade("TURBO", upgrades.TURBO * 6000)}
                    disabled={upgrades.TURBO >= 5 || credits < upgrades.TURBO * 6000}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-black font-bold rounded-lg transition-all text-[11px] cursor-pointer"
                  >
                    {upgrades.TURBO >= 5 ? "MAXED" : `LVL ${upgrades.TURBO + 1} | ${(upgrades.TURBO * 6000).toLocaleString()} CR`}
                  </button>
                </div>
                {/* UPGRADE ITEM 3 */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
                  <div>
                    <p className="font-bold text-zinc-200">Ban Slick Kompon Lunak (Handling)</p>
                    <p className="text-[10px] text-zinc-500">Mereduksi Resiko Slip Saat Manuver Drift Extreme</p>
                  </div>
                  <button 
                    onClick={() => buyUpgrade("TIRES", upgrades.TIRES * 4000)}
                    disabled={upgrades.TIRES >= 5 || credits < upgrades.TIRES * 4000}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-black font-bold rounded-lg transition-all text-[11px] cursor-pointer"
                  >
                    {upgrades.TIRES >= 5 ? "MAXED" : `LVL ${upgrades.TIRES + 1} | ${(upgrades.TIRES * 4000).toLocaleString()} CR`}
                  </button>
                </div>
              </div>

              {/* VISUAL BODYKIT COSMETIC SELECTION */}
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1"><Sparkles size={13}/> Estetika Visual Bodykit:</p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(["CARBON_AERO", "NEON_GLOW", "WIDE_BODY"] as BodykitType[]).map((kit) => (
                    <button
                      key={kit}
                      onClick={() => setSelectedBodykit(kit)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer text-center ${selectedBodykit === kit ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" : "bg-black/20 border-zinc-800 text-zinc-400"}`}
                    >
                      {kit.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* LAUNCH TO RACE BUTTON */}
              <button
                onClick={startRace}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono font-black text-sm uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_15px_rgba(245,158,11,0.2)]"
              >
                <Play size={16} fill="black" /> Masuk Sirkuit Kota Malam
              </button>
            </motion.div>
          )}

          {/* INTERFACE B: MAIN RACING GAMEPLAY PANEL */}
          {gameState === "RACING" && (
            <motion.div key="racing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              
              {/* VIRTUAL SCREEN SHOWING NIGHT CIRCUIT ENVIRONMENT WITH RAY TRACING STYLES */}
              <div className="relative bg-[#050409] aspect-[16/9] rounded-xl border border-zinc-800 p-4 overflow-hidden flex flex-col justify-between shadow-inner">
                {/* Neon Streetlights Track Overlay Effect */}
                <div className="absolute inset-x-0 top-12 h-0.5 bg-gradient-to-r from-cyan-500 via-transparent to-pink-500 opacity-40" />
                <div className={`absolute inset-0 bg-amber-500/5 transition-opacity duration-700 pointer-events-none ${isNitroActive ? "opacity-100" : "opacity-0"}`} />

                {/* TRACK PROGRESS HEAD-TO-HEAD METER */}
                <div className="w-full bg-black/60 p-2 border border-zinc-800 rounded-lg font-mono text-[10px] space-y-1.5 z-10">
                  <div className="flex justify-between text-zinc-400">
                    <span>Sirkuit Kota Malam (Sprint Track)</span>
                    <span className="text-white font-bold">{Math.floor(distance)}m / 2000m</span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full relative overflow-hidden">
                    {/* Player Icon Indicator */}
                    <div className="absolute h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(distance / 2000) * 100}%` }} />
                    {/* Rival Icon Indicator */}
                    <div className="absolute h-full bg-red-600/40 rounded-full transition-all" style={{ width: `${(rivalDistance / 2000) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span className="text-amber-400">● Posisimu</span>
                    <span className="text-red-500">● Rival</span>
                  </div>
                </div>

                {/* VISUAL REALTIME CONSOLE HUD OVERLAY */}
                <div className="my-auto text-center z-10 flex flex-col items-center justify-center">
                  <AnimatePresence>
                    {/* ALERT DRIFT TIKUNGAN TAJAM */}
                    {cornerAlert && (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-red-950/90 border border-red-500 px-4 py-2 rounded-xl text-center space-y-1.5 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
                        <p className="text-xs font-mono font-black text-red-400 flex items-center justify-center gap-1 uppercase"><ShieldAlert size={14}/> Tikungan Tajam Depan!</p>
                        <button 
                          onClick={executeDrift}
                          className="px-4 py-1 bg-red-500 hover:bg-red-400 text-black font-mono font-bold text-[11px] rounded-md uppercase tracking-wider cursor-pointer"
                        >
                          Klik Sini Pas Drift Corner 💨
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* DRIFT SUCCESS RESPONSE FEEDBACK */}
                  {!cornerAlert && cornerSuccess && (
                    <span className={`text-xs font-mono font-black tracking-widest uppercase px-3 py-1 bg-black/60 rounded border ${cornerSuccess === "PERFECT" ? "text-cyan-400 border-cyan-500" : cornerSuccess === "GOOD" ? "text-green-400 border-green-500" : "text-red-500 border-red-500"}`}>
                      {cornerSuccess} DRIFTING!
                    </span>
                  )}

                  {/* REALTIME RENDERING CAR PREVIEW STYLING CONTAINER */}
                  <div className="mt-2 text-3xl tracking-widest filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-bounce">
                    🏎️💨
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase bg-black/30 px-1.5 py-0.5 rounded border border-zinc-900 mt-1">Kit Kosmetik: {selectedBodykit}</span>
                </div>

                {/* TELEMETRY ENGINE LOGGER SCREEN */}
                <div className="bg-black/80 rounded-lg p-2 border border-zinc-900 text-[9px] font-mono text-amber-300 space-y-0.5 h-12 overflow-hidden flex flex-col justify-end">
                  {raceLogs.map((log, i) => (
                    <div key={i} className="truncate tracking-tight">{log}</div>
                  ))}
                </div>

              </div>

              {/* DRIVER DASHBOARD TELEMETRY SYSTEMS CONTROLS */}
              <div className="grid grid-cols-3 gap-3 bg-black/30 border border-zinc-800 p-3 rounded-xl font-mono">
                {/* CLUSTER A: SPEEDOMETER */}
                <div className="text-center flex flex-col justify-center items-center bg-black/40 border border-zinc-900 p-2 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-0.5"><Gauge size={12}/> Speed</span>
                  <span className="text-2xl font-black text-white tracking-tighter">{speed}</span>
                  <span className="text-[9px] text-zinc-400">KM/H</span>
                </div>

                {/* CLUSTER B: TACHOMETER (RPM MONITOR) */}
                <div className="text-center flex flex-col justify-center bg-black/40 border border-zinc-900 p-2 rounded-lg relative overflow-hidden">
                  <span className="text-[10px] text-zinc-500 uppercase">Engine RPM</span>
                  <span className={`text-xl font-black tracking-tight ${rpm >= 6200 && rpm <= 7400 ? "text-emerald-400 animate-pulse" : rpm > 7400 ? "text-red-500" : "text-zinc-200"}`}>
                    {Math.floor(rpm)}
                  </span>
                  {/* RPM Visual Progress Arc Bar */}
                  <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${rpm > 7400 ? "bg-red-600" : rpm >= 6200 ? "bg-emerald-500" : "bg-cyan-500"}`} style={{ width: `${(rpm / 8000) * 100}%` }} />
                  </div>
                  <span className="text-[8px] text-zinc-500 mt-0.5">Shift Zone: 6200-7400</span>
                </div>

                {/* CLUSTER C: CURRENT TRANSMISSION GEAR */}
                <div className="text-center flex flex-col justify-center items-center bg-black/40 border border-zinc-900 p-2 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">Gearbox</span>
                  <span className="text-2xl font-black text-amber-400">{gear}</span>
                  <span className="text-[9px] text-zinc-500">TRANSMISSION</span>
                </div>
              </div>

              {/* COCKPIT TACTICAL INPUT BUTTONS */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* GEAR UP SHIFT TRIGGER */}
                <button
                  onClick={executeShiftGear}
                  className="col-span-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center shadow"
                >
                  <span>GANTI GIGI (SHIFT GEAR ↑)</span>
                  <span className="text-[9px] opacity-70 font-sans font-normal mt-0.5">Klik di Garis Hijau RPM untuk Perfect Shift</span>
                </button>

                {/* NITRO TRIGGER BUTTON */}
                <button
                  onClick={triggerNitro}
                  disabled={nitroCharge < 10 || isNitroActive}
                  className={`py-3.5 font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${nitroCharge >= 10 && !isNitroActive ? "bg-cyan-600 text-white hover:bg-cyan-500 cursor-pointer shadow-[0_4px_10px_rgba(6,182,212,0.2)]" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
                >
                  <span className="flex items-center gap-1"><Zap size={12}/> NITRO NOS</span>
                  <span className="text-[9px] font-sans font-normal">{nitroCharge}% CHARGE</span>
                </button>
              </div>

            </motion.div>
          )}

          {/* INTERFACE C: RACE VICTORY SCREEN */}
          {gameState === "VICTORY" && (
            <motion.div key="victory" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 text-xl mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black font-mono tracking-widest text-emerald-400 uppercase">PODIUM FIRST PLACE</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
                  Sirkuit kota malam takluk! Anda memenangkan balapan liar legal ini dan mendapatkan reputasi sirkuit tertinggi beserta hadiah <span className="text-emerald-400 font-bold">+45.000 CR</span>.
                </p>
              </div>
              <button
                onClick={() => setGameState("GARAGE")}
                className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-amber-400 font-mono font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw size={13}/> Kembali Ke Garasi Modifikasi
              </button>
            </motion.div>
          )}

          {/* INTERFACE D: RACE DEFEAT SCREEN */}
          {gameState === "DEFEAT" && (
            <motion.div key="defeat" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-red-950 border border-red-500 rounded-full flex items-center justify-center text-red-500 text-xl mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                🏁
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black font-mono tracking-widest text-red-500 uppercase">RIVAL OUTRUNNED YOU</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
                  Mobil sport rival melewati garis finish terlebih dahulu. Perlu performa mesin yang lebih galak atau perpindahan gigi yang lebih akurat!
                </p>
              </div>
              <button
                onClick={() => setGameState("GARAGE")}
                className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-amber-400 font-mono font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw size={13}/> Tuning Ulang di Garasi
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* FOOTER ENGINE SYSTEM INFO */}
      <div className="mt-3.5 text-center text-[10px] font-mono text-zinc-600 flex items-center gap-1 tracking-widest uppercase">
        <Flame size={12} className="text-zinc-700" /> APEX OVERDRIVE // POLYPHONY GLOBAL // FULL RAY TRACING ENGINE V2.5
      </div>
    </div>
  );
}