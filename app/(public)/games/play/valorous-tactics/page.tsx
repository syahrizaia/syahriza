/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crosshair, Shield, EyeOff, Zap, Bomb, RefreshCw, Radio, Terminal } from "lucide-react";

// Struktur Tipe Musuh / Defender
interface Enemy {
  id: number;
  name: string;
  position: "A_HEAVEN" | "A_DEFAULT" | "A_LONG";
  posX: number; // Persentase X di dalam kontainer
  posY: number; // Persentase Y di dalam kontainer
  hp: number;
  isBlinded: boolean;
  isSmoked: boolean;
  timeToShoot: number; // Sisa waktu sebelum musuh menembak player (ms)
}

export default function ValorousTacticsGameplay() {
  const router = useRouter();

  // TAC-SHOOTER HUD SYSTEM STATES
  const [gameState, setGameState] = useState<"BUY_PHASE" | "ACTION" | "VICTORY" | "DEFEAT">("BUY_PHASE");
  const [playerHp, setPlayerHp] = useState(100);
  const [playerShield, setPlayerShield] = useState(50);
  const [ammo, setAmmo] = useState(25);
  const [reserveAmmo, setReserveAmmo] = useState(75);
  const [isReloading, setIsReloading] = useState(false);

  // ABILITY CHARGES (Kemampuan Magis Agen)
  const [flashCharges, setFlashCharges] = useState(2); // Q Ability
  const [smokeCharges, setSmokeCharges] = useState(2); // E Ability
  const [ultPoints, setUltPoints] = useState(0);       // X Ability (Max 3 poin untuk aktif)
  const [activeSmokePos, setActiveSmokePos] = useState<string | null>(null);

  // SPIKE / CORE DEFUSAL OBJECTIVE
  const [spikeTimer, setSpikeTimer] = useState(45);
  const [defuseProgress, setDefuseProgress] = useState(0);
  const [isDefusing, setIsDefusing] = useState(false);

  // ENEMIES & FEED TRACKER
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [killFeed, setKillFeed] = useState<string[]>(["[SYSTEM]: Match Started. Retake Site A, Defuse the Core."]);
  const [totalKills, setTotalKills] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spikeLoopRef = useRef<NodeJS.Timeout | null>(null);

  // BEEP / HIT SOUND GENERATOR (Web Audio API Synthesizer)
  const playSynthSound = (type: "SHOOT" | "HEADSHOT" | "KILL" | "HIT" | "FLASH") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "SHOOT") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === "HEADSHOT") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
      } else if (type === "KILL") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(500, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      } else if (type === "HIT") {
        osc.type = "square";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
        osc.start(); osc.stop(ctx.currentTime + 0.12);
      } else if (type === "FLASH") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        osc.start(); osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      // Audio context block protection
    }
  };

  // AMMO RELOAD MECHANIC
  const handleReload = () => {
    if (isReloading || ammo === 25 || reserveAmmo === 0) return;
    setIsReloading(true);
    setTimeout(() => {
      const neededAmmo = 25 - ammo;
      const actualReload = Math.min(neededAmmo, reserveAmmo);
      setAmmo((prev) => prev + actualReload);
      setReserveAmmo((prev) => prev - actualReload);
      setIsReloading(false);
    }, 1500); // 1.5 Detik Animasi Reload
  };

  // SPARK ROUND GAME ACTION START
  const startActionPhase = () => {
    setGameState("ACTION");
    setPlayerHp(100);
    setPlayerShield(50);
    setAmmo(25);
    setReserveAmmo(75);
    setSpikeTimer(45);
    setDefuseProgress(0);
    setTotalKills(0);
    setUltPoints(0);
    setActiveSmokePos(null);

    // Spawn 3 Defender Musuh Awal dengan Sudut Taktis Berbeda
    const initialEnemies: Enemy[] = [
      { id: 1, name: "Viper_Bot", position: "A_LONG", posX: 20, posY: 55, hp: 100, isBlinded: false, isSmoked: false, timeToShoot: 3500 },
      { id: 2, name: "Jett_Bot", position: "A_DEFAULT", posX: 50, posY: 45, hp: 100, isBlinded: false, isSmoked: false, timeToShoot: 4500 },
      { id: 3, name: "Omen_Bot", position: "A_HEAVEN", posX: 80, posY: 25, hp: 100, isBlinded: false, isSmoked: false, timeToShoot: 5500 },
    ];
    setEnemies(initialEnemies);
    setKillFeed(["⚔️ [ROUND START]: Spike Has Been Planted. Retake Initiated!"]);
  };

  // CORE TICK SIMULATION LOGIC LOOP (Setiap 100ms)
  useEffect(() => {
    if (gameState !== "ACTION") return;

    gameLoopRef.current = setInterval(() => {
      setEnemies((prevEnemies) => {
        return prevEnemies.map((enemy) => {
          // Jika musuh terkena smoke/flash, timer menembak mereka tertunda/lambat
          let decay = 100;
          if (enemy.isBlinded) decay = 0; // Buta total tidak mengurangi timer tembak
          if (enemy.isSmoked || activeSmokePos === enemy.position) decay = 20; // Smoke menghalangi pandangan

          const newTime = enemy.timeToShoot - decay;

          // Jika timer habis, musuh menembak player!
          if (newTime <= 0) {
            playSynthSound("HIT");
            setPlayerShield((shield) => {
              if (shield > 0) {
                const remainder = 25 - shield;
                if (remainder > 0) {
                  setPlayerHp((hp) => Math.max(0, hp - remainder));
                  return 0;
                }
                return shield - 25;
              } else {
                setPlayerHp((hp) => Math.max(0, hp - 25));
                return 0;
              }
            });

            setKillFeed((feed) => [...feed.slice(-4), `💥 ${enemy.name} melukis tembakan ke tubuhmu! (-25 DMG)`]);
            return { ...enemy, timeToShoot: 3000 + Math.random() * 2000 }; // Reset timer serang musuh
          }

          return { ...enemy, timeToShoot: newTime };
        });
      });
    }, 100);

    // SPIKE COUNTDOWN TIMER LOOP (1 Detik)
    spikeLoopRef.current = setInterval(() => {
      setSpikeTimer((prev) => {
        if (prev <= 1) {
          setGameState("DEFEAT");
          setKillFeed((feed) => [...feed, "💥 [DETONATION]: Spike meledak meratakan seluruh area site!"]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (spikeLoopRef.current) clearInterval(spikeLoopRef.current);
    };
  }, [gameState, activeSmokePos]);

  // MONITOR KONDISI KEKALAHAN/KEMATIAN PLAYER
  useEffect(() => {
    if (playerHp <= 0 && gameState === "ACTION") {
      setGameState("DEFEAT");
      setKillFeed((feed) => [...feed, "💀 You were eliminated. Clutch Failed!"]);
    }
  }, [playerHp, gameState]);

  // MEKANIK MENEMBAK TARGET (Precision Aiming Point-and-Click)
  const handleShootTarget = (enemyId: number, zone: "HEAD" | "BODY") => {
    if (ammo <= 0 || isReloading || gameState !== "ACTION") {
      if (ammo === 0) playSynthSound("HIT"); // Dry fire click sound
      return;
    }

    setAmmo((prev) => prev - 1);
    
    const damage = zone === "HEAD" ? 150 : 40;
    if (zone === "HEAD") {
      playSynthSound("HEADSHOT");
    } else {
      playSynthSound("SHOOT");
    }

    setEnemies((prevEnemies) => {
      const updated = prevEnemies.map((enemy) => {
        if (enemy.id === enemyId) {
          const currentHp = Math.max(0, enemy.hp - damage);
          if (currentHp <= 0) {
            playSynthSound("KILL");
            setTotalKills((k) => k + 1);
            setUltPoints((u) => Math.min(3, u + 1));
            setKillFeed((feed) => [...feed.slice(-4), `🎯 [HEADSHOT] You ➡️ ${enemy.name}`]);
          } else {
            setKillFeed((feed) => [...feed.slice(-4), `💥 Hit ${enemy.name} di bagian ${zone} (-${damage} HP)`]);
          }
          return { ...enemy, hp: currentHp };
        }
        return enemy;
      });

      // Cek apakah semua musuh telah habis dieliminasi
      const activeEnemies = updated.filter((e) => e.hp > 0);
      if (activeEnemies.length === 0) {
        setKillFeed((feed) => [...feed, "📢 ALL ENEMIES CLEAR. Defuse the Spike Core now!"]);
      }

      return updated;
    });
  };

  // CLICK ON BACKGROUND EMPTY FIELD (MISS SHOT PENALTY)
  const handleMissShot = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "BUTTON" || ammo <= 0 || isReloading || gameState !== "ACTION") return;
    setAmmo((prev) => prev - 1);
    playSynthSound("SHOOT");
  };

  // MAGICAL ABILITY 1: FLASH BANG (Q) - Kebutaan Massal Sementara
  const useFlashAbility = () => {
    if (flashCharges <= 0 || gameState !== "ACTION") return;
    setFlashCharges((prev) => prev - 1);
    playSynthSound("FLASH");
    setKillFeed((feed) => [...feed.slice(-4), "✨ [ABILITY]: Mengaktifkan Radiant Flash! Seluruh musuh mengalami blind!"]);
    
    setEnemies((prev) => prev.map((e) => ({ ...e, isBlinded: true })));
    setTimeout(() => {
      setEnemies((prev) => prev.map((e) => ({ ...e, isBlinded: false, timeToShoot: 2000 + Math.random() * 2000 })));
    }, 3000); // Durasi Buta 3 Detik
  };

  // MAGICAL ABILITY 2: DARK SMOKE (E) - Menutupi Sudut Pandang Posisi
  const useSmokeAbility = (pos: "A_LONG" | "A_DEFAULT" | "A_HEAVEN") => {
    if (smokeCharges <= 0 || gameState !== "ACTION") return;
    setSmokeCharges((prev) => prev - 1);
    setActiveSmokePos(pos);
    setKillFeed((feed) => [...feed.slice(-4), `☁️ [ABILITY]: Bola asap magis menutup sudut pandang zona ${pos}!`]);

    setTimeout(() => {
      setActiveSmokePos(null);
    }, 6000); // Durasi asap bertahan 6 Detik
  };

  // MAGICAL ABILITY 3: ULTIMATE RADIAN STRIKE (X) - Instant Kill 1 Target Acak
  const useUltimateAbility = () => {
    if (ultPoints < 3 || gameState !== "ACTION") return;
    const activeEnemies = enemies.filter((e) => e.hp > 0);
    if (activeEnemies.length === 0) return;

    setUltPoints(0);
    const randomEnemy = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
    playSynthSound("HEADSHOT");
    
    setEnemies((prev) => prev.map((e) => e.id === randomEnemy.id ? { ...e, hp: 0 } : e));
    setTotalKills((k) => k + 1);
    setKillFeed((feed) => [...feed.slice(-4), `⚡ [ULTIMATE]: Radian Strike menyambar sisa energi vital ${randomEnemy.name}!`]);
  };

  // DEFUSE SPIKE TICK CONTROLLER HOLD PROGRESS
  useEffect(() => {
    let defuseInterval: NodeJS.Timeout | null = null;
    if (isDefusing && gameState === "ACTION") {
      defuseInterval = setInterval(() => {
        setDefuseProgress((prev) => {
          if (prev + 4 >= 100) {
            setGameState("VICTORY");
            if (defuseInterval) clearInterval(defuseInterval);
            return 100;
          }
          return prev + 4;
        });
      }, 150); // Sekitar 3.7 detik waktu penjinakan total penuh
    } else {
      if (defuseInterval) clearInterval(defuseInterval);
    }
    return () => { if (defuseInterval) clearInterval(defuseInterval); };
  }, [isDefusing, gameState]);

  return (
    <div className="min-h-screen bg-[#060b11] text-cyan-100 flex flex-col items-center justify-center px-4 py-24 font-sans select-none relative overflow-hidden">
      
      {/* ESPORTS AMBIENCE MATRIX BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />

      {/* MATCH HUD HEADER INFORMASI NETWORK */}
      <div className="w-full max-w-xl flex justify-between items-center mb-2.5 bg-[#0e1622] border border-cyan-900/30 px-4 py-2 rounded-lg text-[11px] font-mono tracking-wider shadow-xl z-20">
        <button 
          onClick={() => router.back()}
          className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 rounded transition-all flex items-center gap-1.5 cursor-pointer uppercase font-semibold"
        >
          <ArrowLeft size={12} /> Leave Lobby
        </button>
        <div className="flex items-center gap-4 text-cyan-400">
          <span className="flex items-center gap-1"><Radio size={12} className="animate-pulse text-emerald-400"/> PING: 7ms</span>
          <span className="bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/50 font-bold uppercase text-amber-400">RANKED COMPETITIVE</span>
        </div>
      </div>

      {/* CORE OPERATIONAL SHOOTER VIEW CONTEXT */}
      <div className="w-full max-w-xl bg-[#0b111a] border-2 border-cyan-800/30 rounded-xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-20">
        
        {/* TACTICAL SPIKE STATE / TOP CENTER BAR */}
        <div className="grid grid-cols-3 items-center bg-black/60 border border-cyan-950 px-4 py-2 rounded-lg mb-3 font-mono">
          <div className="text-left text-xs text-zinc-400">DEFENDERS ELIMINATED: <span className="text-cyan-400 font-bold font-sans">{totalKills} / 3</span></div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-red-500 animate-pulse font-bold text-sm">
              <Bomb size={15} /> 00:{spikeTimer < 10 ? `0${spikeTimer}` : spikeTimer}
            </div>
            <span className="text-[7px] text-red-400/80 tracking-widest uppercase mt-0.5">Core Detonation Window</span>
          </div>
          <div className="text-right text-[10px] text-cyan-500/80 uppercase">Objective: <span className="text-white font-bold">Retake Site A</span></div>
        </div>

        {/* 2D MAP SITE ANGLE SIMULATOR (THE COMBAT FIELD) */}
        <div 
          onClick={handleMissShot}
          className="relative bg-[#04070c] rounded-xl aspect-[16/10] w-full border border-cyan-950 overflow-hidden flex items-center justify-center cursor-crosshair shadow-inner"
        >
          {/* Wireframe Bombsite Layout Graphics Backdrop */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20 text-cyan-500 font-mono text-[9px]">
            <div className="flex justify-between">
              <div className="border border-cyan-500/40 p-2 rounded">A HEAVEN (HIGH ANGLE)</div>
              <div className="border border-cyan-500/40 p-2 rounded">A SITE STAGING</div>
            </div>
            <div className="w-36 h-20 border-2 border-dashed border-red-500/40 m-auto flex items-center justify-center text-red-500 text-xs font-bold">🚨 CORE DROP ZONE A</div>
            <div className="flex justify-between">
              <div className="border border-cyan-500/40 p-2 rounded">A LONG (ENTRY ANGLE)</div>
              <div className="border border-cyan-500/40 p-2 rounded">A DEFAULT BOXES</div>
            </div>
          </div>

          {/* RENDERING MAGICAL SMOKE VOLUME VISUAL COVERS */}
          {activeSmokePos && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute w-32 h-32 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-center text-[10px] font-mono font-bold text-slate-400 pointer-events-none z-30 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md`}
              style={{
                left: activeSmokePos === "A_LONG" ? "10%" : activeSmokePos === "A_DEFAULT" ? "40%" : "70%",
                top: activeSmokePos === "A_HEAVEN" ? "15%" : "35%"
              }}
            >
              <EyeOff size={16} className="mb-1 block opacity-60 mx-auto" /> SMOKE SCREEN ACTIVE
            </motion.div>
          )}

          <AnimatePresence>
            {gameState === "BUY_PHASE" && (
              <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 space-y-4 text-center z-40">
                <div className="w-11 h-11 bg-cyan-950/60 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400">
                  <Crosshair size={22} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">PRE-ROUND TACTICAL LOCK</h3>
                  <p className="text-[10px] text-zinc-400 max-w-xs mt-1 leading-relaxed">
                    Sistem anti-cheat <span className="text-amber-400 font-semibold font-mono">Vanguardian</span> aktif. Skenario: Rekan tim tumbang, sisa Anda 1v3 untuk menjinakkan Core. Gunakan keahlian magis menembak jitu kepala.
                  </p>
                </div>
                <button 
                  onClick={startActionPhase}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 border border-cyan-400/30 text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-lg hover:brightness-110 cursor-pointer"
                >
                  Buy Rifle & Start Clutch ⚔️
                </button>
              </motion.div>
            )}

            {/* SCREEN GAME OVER STATE */}
            {gameState === "DEFEAT" && (
              <motion.div key="defeat" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 space-y-4 text-center z-40">
                <h2 className="text-2xl font-black tracking-wider text-red-600 drop-shadow-md uppercase">ROUND DEFEAT</h2>
                <p className="text-[10px] text-zinc-500 font-mono max-w-xs">Bidikan Anda kurang presisi atau waktu habis. Evaluasi taktik tim Anda kembali.</p>
                <button 
                  onClick={startActionPhase}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-cyan-900 text-cyan-400 font-bold text-xs tracking-wider uppercase rounded cursor-pointer flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw size={12} /> Retry Scenario
                </button>
              </motion.div>
            )}

            {/* SCREEN VICTORY STATE */}
            {gameState === "VICTORY" && (
              <motion.div key="victory" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 space-y-4 text-center z-40">
                <h2 className="text-2xl font-black tracking-wider text-emerald-400 drop-shadow-md uppercase">ROUND WON (CLUTCH)</h2>
                <p className="text-[10px] text-zinc-400 font-mono max-w-xs">Luar biasa! Core berhasil dijinakkan dengan mekanik bidikan latensi rendah.</p>
                <button 
                  onClick={startActionPhase}
                  className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 text-white font-bold text-xs tracking-wider uppercase rounded cursor-pointer flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw size={12} /> Play Next Round
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE DYNAMIC TARGET RENDERING */}
          {gameState === "ACTION" && enemies.map((enemy) => {
            if (enemy.hp <= 0) return null;
            return (
              <div 
                key={enemy.id} 
                className="absolute flex flex-col items-center group z-20"
                style={{ left: `${enemy.posX}%`, top: `${enemy.posY}%` }}
              >
                {/* Visual Indikator Buta / Smoke pada Kepala Musuh */}
                <div className="mb-1 flex gap-0.5 font-mono text-[7px] font-bold">
                  {enemy.isBlinded && <span className="bg-amber-500 text-black px-1 rounded animate-pulse">🎯 BLINDED</span>}
                  {activeSmokePos === enemy.position && <span className="bg-slate-700 text-white px-1 rounded">☁️ OBSCURED</span>}
                </div>

                {/* TARGET TACTICAL SILHOUETTE DESIGN */}
                <div className="relative w-12 h-16 border border-cyan-500/20 bg-cyan-950/20 rounded flex flex-col items-center pt-1 transition-all group-hover:border-red-500">
                  {/* Bagian Headshot Point (Klik Kepala) */}
                  <button 
                    onClick={() => handleShootTarget(enemy.id, "HEAD")}
                    className="w-5 h-5 bg-red-600/80 border border-white/20 rounded-full hover:scale-110 active:bg-white transition-all cursor-crosshair flex items-center justify-center text-[6px] text-white font-bold font-mono shadow-[0_0_8px_#ff0000]"
                  >
                    HEAD
                  </button>
                  {/* Bagian Bodyshot Point (Klik Badan) */}
                  <button 
                    onClick={() => handleShootTarget(enemy.id, "BODY")}
                    className="w-9 h-8 bg-cyan-800/60 border border-cyan-400/40 rounded mt-1.5 hover:bg-cyan-600/80 transition-all cursor-crosshair font-mono text-[7px] text-cyan-200"
                  >
                    BODY
                  </button>

                  {/* Enemy Mini Health Indicators Bar */}
                  <div className="w-full h-1 bg-neutral-900 mt-1 rounded-sm overflow-hidden px-0.5">
                    <div className="h-full bg-emerald-500" style={{ width: `${enemy.hp}%` }} />
                  </div>
                </div>
                <span className="text-[8px] font-mono text-zinc-400 mt-0.5 bg-black/60 px-1 rounded">{enemy.name}</span>
              </div>
            );
          })}

          {/* OBJECTIVE PROGRESS DEFUSAL HOLD DISPLAY */}
          {gameState === "ACTION" && enemies.filter(e => e.hp > 0).length === 0 && (
            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-center z-30 pointer-events-none">
              <p className="text-[10px] text-amber-400 font-bold font-mono tracking-widest animate-pulse mb-1">
                {isDefusing ? "⚠️ DEFUSING TACTICAL CORE..." : "⚠️ HOLD 'DEFUSE CORE' BUTTON TO WIN"}
              </p>
              <div className="w-48 h-2 bg-neutral-950 border border-white/10 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all" style={{ width: `${defuseProgress}%` }} />
              </div>
            </div>
          )}

        </div>

        {/* COMPREHENSIVE GUN HUD & ABILITY BARS */}
        <div className="grid grid-cols-3 gap-3 items-center mt-3.5 bg-[#0e1724] p-3 rounded-lg border border-cyan-900/40">
          
          {/* SISI KIRI: INDIKATOR KESEHATAN & DEFENSE SHIELD */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between items-center text-cyan-400 font-bold">
              <span className="flex items-center gap-1"><Zap size={13} /> VITALITY</span>
              <span>{playerHp} HP</span>
            </div>
            <div className="w-full h-2 bg-neutral-950 rounded-sm overflow-hidden border border-cyan-950">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${playerHp}%` }} />
            </div>

            <div className="flex justify-between items-center text-blue-400 font-bold text-[11px] pt-0.5">
              <span className="flex items-center gap-1"><Shield size={12} /> HEAVY KEVLAR</span>
              <span>{playerShield} AP</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950 rounded-sm overflow-hidden border border-cyan-950">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${(playerShield / 50) * 100}%` }} />
            </div>
          </div>

          {/* SISI TENGAH: MAGICAL ABILITY CONTROLLERS SKILLS */}
          <div className="flex justify-center items-center gap-1.5">
            {/* Q - FLASH */}
            <button 
              onClick={useFlashAbility}
              disabled={flashCharges === 0 || gameState !== "ACTION"}
              className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${flashCharges > 0 ? "bg-cyan-950/50 border-cyan-700 text-cyan-300 hover:bg-cyan-900/70" : "bg-neutral-900 border-zinc-800 text-zinc-600"}`}
              title="Q Ability: Radiant Flash"
            >
              <span className="text-[7px] font-bold block mb-0.5 opacity-60">FLASH [Q]</span>
              <span className="text-xs font-bold font-mono">x{flashCharges}</span>
            </button>

            {/* E - SMOKE (Menargetkan Zona Default) */}
            <button 
              onClick={() => useSmokeAbility("A_DEFAULT")}
              disabled={smokeCharges === 0 || gameState !== "ACTION" || activeSmokePos !== null}
              className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${smokeCharges > 0 && !activeSmokePos ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-neutral-900 border-zinc-800 text-zinc-600"}`}
              title="E Ability: Dark Smoke Site"
            >
              <span className="text-[7px] font-bold block mb-0.5 opacity-60">SMOKE [E]</span>
              <span className="text-xs font-bold font-mono">x{smokeCharges}</span>
            </button>

            {/* X - ULTIMATE */}
            <button 
              onClick={useUltimateAbility}
              disabled={ultPoints < 3 || gameState !== "ACTION"}
              className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${ultPoints >= 3 ? "bg-amber-950/80 border-amber-500 text-amber-400 hover:brightness-110 shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse" : "bg-neutral-900 border-zinc-800 text-zinc-600"}`}
              title="X Ultimate Strike"
            >
              <span className="text-[7px] font-bold block mb-0.5 opacity-60">ULTIMATE [X]</span>
              <span className="text-xs font-bold font-mono">{ultPoints}/3 PNT</span>
            </button>
          </div>

          {/* SISI KANAN: AMMUNITION / WEAPON SYSTEMS RIFLE */}
          <div className="text-right font-mono space-y-1">
            <span className="text-[8px] bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block w-max ml-auto">
              VANDAL AR RIFLE
            </span>
            <div className="text-xl font-bold text-white tracking-tight">
              {isReloading ? (
                <span className="text-xs text-amber-500 uppercase tracking-widest animate-pulse">RELOADING...</span>
              ) : (
                <>
                  <span className={ammo <= 5 ? "text-red-500" : "text-white"}>{ammo}</span>
                  <span className="text-zinc-500 text-sm"> / {reserveAmmo}</span>
                </>
              )}
            </div>
            {ammo < 25 && !isReloading && (
              <button 
                onClick={handleReload}
                className="text-[9px] text-cyan-400 underline hover:text-cyan-200 cursor-pointer block w-max ml-auto"
              >
                Press R to Reload Ammo
              </button>
            )}
          </div>

        </div>

        {/* SEKSI BAWAH: OBJECTIVE DEFUSE HOLD CONTROLLER & TACTICAL LOG FEED */}
        <div className="mt-3.5 grid grid-cols-3 gap-3 items-stretch">
          {/* KILLFEED LOG CONSOLE */}
          <div className="col-span-2 bg-black/60 rounded-lg p-2.5 border border-cyan-950/60 font-mono text-[8.5px] text-cyan-300/80 space-y-1 h-20 overflow-hidden flex flex-col justify-end">
            <div className="text-zinc-500 text-[7px] tracking-widest uppercase border-b border-zinc-900 pb-0.5 flex items-center gap-1"><Terminal size={10}/> Tactical Combat Feed Log</div>
            {killFeed.map((feed, idx) => (
              <div key={idx} className="truncate animate-fade-in">{feed}</div>
            ))}
          </div>

          {/* DEFUSE SPIKE TACTICAL HOLD CONTROLLER INTERACT */}
          <button
            onMouseDown={() => { if(enemies.filter(e => e.hp > 0).length === 0) setIsDefusing(true); }}
            onMouseUp={() => setIsDefusing(false)}
            onMouseLeave={() => setIsDefusing(false)}
            onTouchStart={() => { if(enemies.filter(e => e.hp > 0).length === 0) setIsDefusing(true); }}
            onTouchEnd={() => setIsDefusing(false)}
            disabled={enemies.filter(e => e.hp > 0).length > 0 || gameState !== "ACTION"}
            className={`rounded-lg border font-bold text-xs uppercase tracking-widest transition-all flex flex-col items-center justify-center p-2 text-center select-none touch-none ${
              enemies.filter(e => e.hp > 0).length === 0 && gameState === "ACTION"
                ? "bg-gradient-to-b from-amber-600 to-amber-800 border-amber-500 text-black active:brightness-90 shadow-md cursor-pointer"
                : "bg-neutral-900/60 border-zinc-900 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <span>TAP & HOLD</span>
            <span className="text-[8px] font-mono mt-0.5">DEFUSE CORE</span>
          </button>
        </div>

      </div>

      {/* FOOTER METRICS LOGO & COPYRIGHT */}
      <div className="mt-3 text-center text-[10px] font-mono text-cyan-800 flex items-center gap-1 tracking-widest uppercase">
        ⚡ RIOTOUS GAMES // NUSANTARA ESPORT NETWORK // ANTI-CHEAT KERNEL VANGUARDIAN SECURE
      </div>
    </div>
  );
}