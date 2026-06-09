/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Cpu, Zap, ShieldAlert, Skull, Terminal, Crosshair, Wrench, Flame, RefreshCw } from "lucide-react";

// Definisikan Tipe Implan Siber yang tersedia
type ImplantType = "SANDEVISTAN" | "NETRUNNER_DECK" | "SUBDERMAL_ARMOR";

export default function CyberpunkNeoBekasiGameplay() {
  const router = useRouter();

  // SYSTEM LOG & HUD STATES
  const [gameState, setGameState] = useState<"CHOOSE_IMPLANT" | "INFILTRATION" | "SUCCESS" | "FLATLINED">("CHOOSE_IMPLANT");
  const [playerHp, setPlayerHp] = useState(100);
  const [playerRam, setPlayerRam] = useState(12); // Cyber-RAM untuk eksekusi Quickhacks
  const [euroRupiah, setEuroRupiah] = useState(1500); // Mata uang siber
  const [activeImplant, setActiveImplant] = useState<ImplantType>("NETRUNNER_DECK");

  // TARGET SECURITY ENFORCER METER
  const [enemyHp, setEnemyHp] = useState(600);
  const [iceTraceProgress, setIceTraceProgress] = useState(0); // Progress pelacakan AI musuh (0-100%)
  const [isOverclocked, setIsOverclocked] = useState(false);

  // LOG AKSI JALANAN KALIMALANG
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYS_INIT]: Terhubung dengan satelit siber Kalimalang...",
    "[MISSION]: Retas pangkalan data Sagara Cybernetics Node 02."
  ]);

  const loopRef = useRef<NodeJS.Timeout | null>(null);

  // Cyber Sound Generator (Web Audio API Synthesizer)
  const playCyberBeep = (freq: number, type: OscillatorType, duration: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context fall protection
    }
  };

  // CORE GAME LOOP (Berjalan saat infiltrasi aktif)
  useEffect(() => {
    if (gameState !== "INFILTRATION") return;

    loopRef.current = setInterval(() => {
      // 1. Regenerasi RAM Alami berkat implan siber
      setPlayerRam((prev) => Math.min(12, prev + (activeImplant === "NETRUNNER_DECK" ? 2 : 1)));

      // 2. ICE Trace Progress Musuh meningkat seiring waktu (Sistem Keamanan Melacak Player)
      setIceTraceProgress((prev) => {
        const increment = isOverclocked ? 4 : 2; // Overclock mempercepat pelacakan musuh
        if (prev + increment >= 100) {
          // Jika Trace 100%, musuh menembakkan siber-serangan fatal
          setPlayerHp((hp) => {
            const damage = activeImplant === "SUBDERMAL_ARMOR" ? 35 : 55;
            const nextHp = Math.max(0, hp - damage);
            if (nextHp <= 0) setGameState("FLATLINED");
            return nextHp;
          });
          setTerminalLogs((logs) => [...logs.slice(-4), "⚠️ [ALERT]: ICE TRACE 100%! Sistem pertahanan melemparkan serangan balasan fatal!"]);
          playCyberBeep(180, "square", 0.4);
          return 0; // Reset trace setelah menyerang
        }
        return prev + increment;
      });

      // 3. Serangan otomatis berkala dari Drone Korporat Sagara
      setPlayerHp((hp) => {
        const droneDamage = activeImplant === "SUBDERMAL_ARMOR" ? 4 : 8;
        const nextHp = Math.max(0, hp - droneDamage);
        if (nextHp <= 0) setGameState("FLATLINED");
        return nextHp;
      });

    }, 1500); // Tick rate per 1.5 detik

    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, [gameState, activeImplant, isOverclocked]);

  // ACTION 1: MEMULAI MISI SETELAH MEMILIH CYBERWARE IMPLAN
  const handleStartMission = (implant: ImplantType) => {
    setActiveImplant(implant);
    setPlayerHp(100);
    setPlayerRam(12);
    setEnemyHp(600);
    setIceTraceProgress(0);
    setIsOverclocked(false);
    setGameState("INFILTRATION");
    playCyberBeep(520, "sine", 0.15);
    setTerminalLogs([
      `[IMPLANT_ENGAGED]: Memasang Modifikasi ${implant}.`,
      "[LOCATION]: Jalanan Kalimalang, Samping Tol Becakayu Node.",
      "[OBJECTIVE]: Lumpuhkan Enforcer Korporat Sagara!"
    ]);
  };

  // ACTION 2: QUICKHACKS (PERETASAN CYBERWARE JARKOM)
  const triggerQuickhack = (hackType: "SHORT_CIRCUIT" | "OVERHEAT" | "SYNAPSE_BURST") => {
    if (gameState !== "INFILTRATION") return;

    let cost = 0;
    let damage = 0;
    let logText = "";

    if (hackType === "SHORT_CIRCUIT") {
      cost = 3;
      damage = 45;
      logText = "💾 [QUICKHACK]: Short Circuit berhasil dikirim ke implan saraf musuh. (-45 HP)";
    } else if (hackType === "OVERHEAT") {
      cost = 5;
      damage = 80;
      logText = "🔥 [QUICKHACK]: Overheat! Menginduksi suhu panas ekstrem ke sistem pendingin Drone Sagara. (-80 HP)";
    } else if (hackType === "SYNAPSE_BURST") {
      cost = 7;
      damage = 130;
      logText = "⚡ [QUICKHACK]: Synapse Burst mengeksploitasi celah RAM musuh! Korosif parah. (-130 HP)";
    }

    if (playerRam >= cost) {
      setPlayerRam((prev) => prev - cost);
      playCyberBeep(650, "sine", 0.1);
      setTerminalLogs((prevLogs) => [...prevLogs.slice(-4), logText]);
      
      setEnemyHp((prevEnemyHp) => {
        const nextEnemyHp = Math.max(0, prevEnemyHp - damage);
        if (nextEnemyHp <= 0) {
          setGameState("SUCCESS");
          setEuroRupiah((money) => money + 3500); // Hadiah uang siber kontrak selesai
        }
        return nextEnemyHp;
      });
    } else {
      setTerminalLogs((prevLogs) => [...prevLogs.slice(-4), "❌ [ERR]: Cyber-RAM tidak mencukupi untuk memicu hack ini!"]);
    }
  };

  // ACTION 3: SMART RIFLE FIRE (SERANGAN FISIK KONVENSIONAL)
  const triggerWeaponStrike = () => {
    if (gameState !== "INFILTRATION") return;

    // Kerusakan senjata meningkat jika menggunakan Sandevistan
    const weaponDmg = activeImplant === "SANDEVISTAN" ? 60 : 35;
    playCyberBeep(220, "sawtooth", 0.08);
    setTerminalLogs((prevLogs) => [...prevLogs.slice(-4), `🔫 [WEAPON]: Rentetan peluru Smart Rifle menerjang armor musuh (-${weaponDmg} HP)`]);

    setEnemyHp((prevEnemyHp) => {
      const nextEnemyHp = Math.max(0, prevEnemyHp - weaponDmg);
      if (nextEnemyHp <= 0) {
        setGameState("SUCCESS");
        setEuroRupiah((money) => money + 3500);
      }
      return nextEnemyHp;
    });
  };

  // ACTION 4: PAKAI ITEM CONSUMABLE (K_LOCAL WISDOM CONSUMABLE)
  const useEsTehOverclock = () => {
    if (gameState !== "INFILTRATION" || euroRupiah < 200) return;
    setEuroRupiah((prev) => prev - 200);
    setPlayerHp((hp) => Math.min(100, hp + 40));
    setPlayerRam((ram) => Math.min(12, ram + 4));
    setTerminalLogs((prevLogs) => [...prevLogs.slice(-4), "🥤 [CONSUMABLE]: Menenggak 'Es Teh Manis Overclock'. HP +40, RAM +4!"]);
    playCyberBeep(440, "sine", 0.2);
  };

  return (
    <div className="min-h-screen bg-[#07030c] text-pink-100 px-4 py-24 flex flex-col items-center justify-center font-sans relative overflow-hidden selection:bg-pink-600">
      
      {/* VAPORWAVE NEON GRID BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,20,147,0.03)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#000_95%)] pointer-events-none z-10" />

      {/* HEADER MERCENARY STATS STATUS */}
      <div className="w-full max-w-xl flex justify-between items-center mb-3 bg-[#130722] border border-pink-900/40 px-4 py-2 rounded-xl text-xs z-20 shadow-[0_0_15px_rgba(255,20,147,0.1)]">
        <button 
          onClick={() => router.back()}
          className="px-2.5 py-1 bg-black/60 hover:bg-pink-950/40 border border-pink-900/50 text-pink-400 rounded-lg text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer uppercase"
        >
          <ArrowLeft size={12} /> Abort Contract
        </button>
        <div className="flex items-center gap-4 font-mono">
          <span className="text-cyan-400 font-bold animate-pulse">⚡ BEKASI_NET_STREETS</span>
          <span className="text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-700/40">
            {euroRupiah.toLocaleString("id-ID")} €$ (eRupiah)
          </span>
        </div>
      </div>

      {/* MAIN NEON GAMEFRAME CONTAINER */}
      <div className="w-full max-w-xl bg-[#10061c] border-2 border-pink-500/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(255,0,128,0.15)] relative z-20">
        
        {/* ENEMY TARGET METRICS DATA BAR */}
        {gameState === "INFILTRATION" && (
          <div className="bg-black/60 border border-red-900/40 rounded-xl p-3 mb-3 grid grid-cols-2 gap-3 font-mono text-xs">
            <div>
              <p className="text-red-400 font-bold flex items-center gap-1 uppercase tracking-tight text-[11px]"><ShieldAlert size={13}/> Sagara Corporate Mech</p>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>Integrity Chassis</span>
                <span className="text-red-500 font-bold">{enemyHp} / 600</span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-sm mt-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-700 to-pink-600 transition-all duration-300" style={{ width: `${(enemyHp / 600) * 100}%` }} />
              </div>
            </div>

            <div>
              <p className="text-amber-400 font-bold flex items-center gap-1 uppercase tracking-tight text-[11px]"><Flame size={13}/> ICE Tracking Signal</p>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>Pelacakan Enforcer</span>
                <span className="text-amber-500 font-bold">{iceTraceProgress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-sm mt-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-600 to-amber-500 transition-all duration-200" style={{ width: `${iceTraceProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT SCREEN MONITOR DISPLAY */}
        <div className="relative bg-[#05020a] rounded-xl aspect-[16/10] w-full p-4 border border-pink-950 flex flex-col justify-between overflow-hidden shadow-inner">
          
          <AnimatePresence mode="wait">
            {/* SCREEN 1: PILIH INTERFACES IMPLAN CYBERWARE */}
            {gameState === "CHOOSE_IMPLANT" && (
              <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-between text-center py-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-widest text-pink-400 uppercase flex items-center justify-center gap-1.5"><Wrench size={16}/> Klinik Implan Siber Kalimalang</h3>
                  <p className="text-[11px] text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
                    Suntikkan modifikasi tubuh siber ilegal untuk menyesuaikan gaya bermain taktis RPG Anda di jalanan keras Bekasi masa depan.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 my-auto px-1">
                  <button 
                    onClick={() => handleStartMission("SANDEVISTAN")}
                    className="p-2.5 bg-[#1b0825] border border-pink-900 rounded-xl hover:border-pink-500 transition-all text-center group cursor-pointer flex flex-col items-center justify-between h-32"
                  >
                    <Crosshair size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Sandevistan</p>
                      <p className="text-[8px] text-zinc-500 mt-0.5 font-sans leading-tight">Meningkatkan Dmg Senjata Api (+60%)</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleStartMission("NETRUNNER_DECK")}
                    className="p-2.5 bg-[#081e25] border border-cyan-900 rounded-xl hover:border-cyan-500 transition-all text-center group cursor-pointer flex flex-col items-center justify-between h-32"
                  >
                    <Cpu size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Netrunner OS</p>
                      <p className="text-[8px] text-zinc-500 mt-0.5 font-sans leading-tight">Regenerasi RAM Siber Jauh Lebih Cepat</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleStartMission("SUBDERMAL_ARMOR")}
                    className="p-2.5 bg-[#1b1c08] border border-yellow-900 rounded-xl hover:border-yellow-500 transition-all text-center group cursor-pointer flex flex-col items-center justify-between h-32"
                  >
                    <Wrench size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Kromium Kulit</p>
                      <p className="text-[8px] text-zinc-500 mt-0.5 font-sans leading-tight">Mengurangi Kerusakan/Damage Musuh 50%</p>
                    </div>
                  </button>
                </div>

                <p className="text-[8px] font-mono text-zinc-600 tracking-wider">SAGARA CYBERNETICS // CLINIC MODULAR SYSTEM</p>
              </motion.div>
            )}

            {/* SCREEN 2: HUD TERMINAL INFILTRASI AKTIF */}
            {gameState === "INFILTRATION" && (
              <motion.div key="infiltrate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col justify-between">
                {/* Visual Lokasi & Implan Indikator */}
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-pink-950/60 pb-1.5">
                  <span className="text-pink-400 flex items-center gap-1"><Terminal size={11}/> STAGE: PETA_KALIMALANG_1:1</span>
                  <span className="text-cyan-400 bg-cyan-950/40 px-1.5 border border-cyan-900/60 rounded">CYBERWARE: {activeImplant}</span>
                </div>

                {/* CYBERNETIC WIREFRAME HOLOGRAM GRAPHICS */}
                <div className="my-auto py-2 flex flex-col items-center justify-center relative">
                  <div className="text-4xl animate-pulse mb-1">🤖</div>
                  <p className="text-[11px] font-mono text-zinc-400 tracking-wide">Target Node Lock: <span className="text-white font-bold">SAGARA_SEC_ENFORCER</span></p>
                  
                  {isOverclocked && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[8px] font-mono rounded font-bold animate-bounce uppercase">
                      ⚠️ RAM Overclock Active
                    </span>
                  )}
                </div>

                {/* RUNNING CYBERNETIC HUD LOGS BOX */}
                <div className="bg-black/80 rounded-lg p-2 border border-pink-950 text-[9px] font-mono text-cyan-300 space-y-0.5 h-16 overflow-hidden flex flex-col justify-end">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="truncate tracking-tight">{log}</div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: MISSION SUCCESS (KONTRAK BERHASIL) */}
            {gameState === "SUCCESS" && (
              <motion.div key="success" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-11 h-11 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  💰
                </div>
                <div>
                  <h4 className="text-base font-black tracking-widest text-emerald-400 uppercase font-mono">CONTRACT COMPLETED</h4>
                  <p className="text-[11px] text-zinc-400 max-w-xs font-sans mt-1">
                    Node Sagara Cybernetics runtuh. Rekening eRupiah Anda berhasil dikirim sebesar <span className="text-yellow-400 font-bold">+3.500 €$</span>. Street Cred naik!
                  </p>
                </div>
                <button 
                  onClick={() => setGameState("CHOOSE_IMPLANT")}
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-500 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Ambil Kontrak Baru 💾
                </button>
              </motion.div>
            )}

            {/* SCREEN 4: FLATLINED (DEAD STATE) */}
            {gameState === "FLATLINED" && (
              <motion.div key="flatline" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-11 h-11 bg-red-950 border border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <Skull size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-black tracking-widest text-red-600 uppercase font-mono">FLATLINED</h4>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Sinyal siber Anda terputus total di aspal Kalimalang. Kesadaran Anda dihapus.</p>
                </div>
                <button 
                  onClick={() => setGameState("CHOOSE_IMPLANT")}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-pink-400 border border-pink-900 text-xs font-mono font-bold uppercase rounded-md cursor-pointer flex items-center gap-1 mx-auto"
                >
                  <RefreshCw size={11}/> Jack In Again (Respawn)
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* CONTROLLERS INTERFACE HUD (TACTICAL RPG INPUTS) */}
        {gameState === "INFILTRATION" && (
          <div className="mt-3.5 space-y-3">
            
            {/* PLAYER PERFORMANCE SLIDER (HP & RAM VITALITY) */}
            <div className="grid grid-cols-2 gap-3 bg-black/40 border border-pink-950 p-2.5 rounded-xl font-mono text-xs">
              <div>
                <div className="flex justify-between items-center text-pink-400 font-bold mb-0.5">
                  <span className="text-[10px] uppercase">SYNAPSE_HEALTH</span>
                  <span>{playerHp}/100</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-sm overflow-hidden">
                  <div className="h-full bg-pink-600 transition-all" style={{ width: `${playerHp}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-cyan-400 font-bold mb-0.5">
                  <span className="text-[10px] uppercase">CYBER_RAM_DECK</span>
                  <span>{playerRam}/12 SLOTS</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-sm overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(playerRam / 12) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* STRATEGY MATRIKS PANEL ACTIONS */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => triggerQuickhack("SHORT_CIRCUIT")}
                className="py-2.5 bg-[#140b24] border border-cyan-900 hover:bg-[#1e1035] text-cyan-300 text-[10px] font-mono rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <span>SHORT_CIRCUIT</span>
                <span className="text-[8px] text-zinc-500 font-sans">Cost: 3 RAM</span>
              </button>

              <button 
                onClick={() => triggerQuickhack("OVERHEAT")}
                className="py-2.5 bg-[#140b24] border border-cyan-900 hover:bg-[#1e1035] text-cyan-300 text-[10px] font-mono rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <span>OVERHEAT [🔥]</span>
                <span className="text-[8px] text-zinc-500 font-sans">Cost: 5 RAM</span>
              </button>

              <button 
                onClick={() => triggerQuickhack("SYNAPSE_BURST")}
                className="py-2.5 bg-[#140b24] border border-cyan-900 hover:bg-[#1e1035] text-cyan-300 text-[10px] font-mono rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <span>SYNAPSE_BURST</span>
                <span className="text-[8px] text-zinc-500 font-sans">Cost: 7 RAM</span>
              </button>
            </div>

            {/* COMBAT ATK & K_LOCAL CONSUMABLE ITEMS BAR */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-pink-950/40">
              <button
                onClick={triggerWeaponStrike}
                className="col-span-2 py-3 bg-gradient-to-r from-pink-700 to-purple-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <Crosshair size={14}/> Fire Smart Rifle Burst
              </button>

              <button
                onClick={useEsTehOverclock}
                disabled={euroRupiah < 200}
                className={`py-3 rounded-xl font-mono text-[10px] font-bold flex flex-col items-center justify-center transition-all ${euroRupiah >= 200 ? "bg-yellow-950/60 text-yellow-400 border border-yellow-700/50 hover:bg-yellow-900/40 cursor-pointer" : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"}`}
              >
                <span>ES TEH OVERCLOCK</span>
                <span className="text-[7px] text-zinc-500 font-sans font-normal">Cost: 200 €$</span>
              </button>
            </div>

            {/* ADDITIONAL TOGGLE: RAM OVERCLOCK HARD BOOSTER */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border border-red-950/50 rounded-lg text-[10px] font-mono">
              <span className="text-zinc-400">Mode Sistemik: <span className="text-red-400 font-bold">CYBER-OVERCLOCK MODULATOR</span></span>
              <button 
                onClick={() => setIsOverclocked(!isOverclocked)}
                className={`px-3 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${isOverclocked ? "bg-red-900 border-red-500 text-white animate-pulse" : "bg-zinc-900 border-zinc-700 text-zinc-400"}`}
              >
                {isOverclocked ? "ON (FAST REGEN / HIGH RISK)" : "OFF"}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* FOOTER COZY BRANDING */}
      <div className="mt-3.5 text-center text-[10px] font-mono text-pink-950 flex items-center gap-1 tracking-widest uppercase">
        <Zap size={11} className="text-pink-900" /> SAGARA CYBERNETICS // NUSANTARA DIGITAL MEDIA // ENGINE_2026_V1
      </div>
    </div>
  );
}