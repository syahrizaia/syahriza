/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Swords, Shield, ShieldAlert, Heart, RefreshCw, Zap, Sparkles } from "lucide-react";

export default function EldenRingGameplay() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Souls-like System States
  const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAMEOVER" | "VICTORY">("MENU");
  const [bossHp, setBossHp] = useState(1000);
  const [playerHp, setPlayerHp] = useState(100);
  const [stamina, setStamina] = useState(100);
  const [flasks, setFlasks] = useState(3);
  const [isHit, setIsHit] = useState(false);

  // Controller Tracking
  const keysPressed = useRef({ left: false, right: false, attack: false, roll: false });
  const internalState = useRef({
    playerX: 220,
    isRolling: 0, // frame counter untuk invincibility frames
    staminaRegenCooldown: 0,
    bossHp: 1000,
    playerHp: 100,
    stamina: 100,
  });

  useEffect(() => {
    if (gameState !== "PLAYING" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;
    
    // Reset internal state saat mulai bermain
    internalState.current = {
      playerX: canvas.width / 2 - 15,
      isRolling: 0,
      staminaRegenCooldown: 0,
      bossHp: 1000,
      playerHp: 100,
      stamina: 100,
    };
    
    setBossHp(1000);
    setPlayerHp(100);
    setStamina(100);
    setFlasks(3);

    // Entity Definitions
    const player = {
      y: canvas.height - 50,
      width: 30,
      height: 35,
      speed: 5,
    };

    let bossProjectiles: any[] = []; // Cursed Thorns (Hujan Sihir Kegelapan)
    let playerSlashes: any[] = [];    // Serangan tebasan pedang emas player

    // MAIN ENGINES CORE LOOP
    const gameLoop = () => {
      frameCount++;

      // 1. Clear & Drawing Ethereal Dark Fantasy Background
      ctx.fillStyle = "#0c0c0e"; // Elden Pitch Black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint Golden Tree Dust Particle Background
      ctx.fillStyle = "rgba(212, 175, 55, 0.08)";
      for (let i = 0; i < 5; i++) {
        let pX = (Math.sin(frameCount * 0.01 + i) * canvas.width/2) + canvas.width/2;
        let pY = ((frameCount + i * 80) % canvas.height);
        ctx.fillRect(pX, pY, 2, 2);
      }

      // 2. Boss Logic & Drawing (Shade of the Elden Lord)
      ctx.fillStyle = "rgba(139, 0, 0, 0.85)"; // Deep Scarlet Core
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#8b0000";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 70, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Boss Halo / Cursed Crown
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 70, 55, frameCount * 0.01, frameCount * 0.01 + Math.PI * 1.5);
      ctx.stroke();

      // Prosedural Boss Attack Pattern (Patience Tester)
      // Menembakkan pecahan kutukan kuno berdasar interval frame
      if (frameCount % (internalState.current.bossHp > 400 ? 20 : 12) === 0) {
        bossProjectiles.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: 110,
          width: 6,
          height: 18,
          speed: 4 + Math.random() * 4,
        });
      }

      // 3. Player Stamina & Action Management
      // Regenerasi Stamina alami
      if (internalState.current.staminaRegenCooldown > 0) {
        internalState.current.staminaRegenCooldown--;
      } else if (internalState.current.stamina < 100) {
        internalState.current.stamina = Math.min(100, internalState.current.stamina + 1.5);
        setStamina(Math.floor(internalState.current.stamina));
      }

      // Hitung durasi I-Frames Guling (Dodge Roll)
      if (internalState.current.isRolling > 0) {
        internalState.current.isRolling--;
      }

      // Membaca Input Pergerakan
      if (keysPressed.current.left && internalState.current.playerX > 10) {
        internalState.current.playerX -= internalState.current.isRolling > 0 ? player.speed * 1.5 : player.speed;
      }
      if (keysPressed.current.right && internalState.current.playerX < canvas.width - player.width - 10) {
        internalState.current.playerX += internalState.current.isRolling > 0 ? player.speed * 1.5 : player.speed;
      }

      // Eksekusi Dodge Roll via Keyboard BIND
      if (keysPressed.current.roll && internalState.current.isRolling === 0 && internalState.current.stamina >= 25) {
        internalState.current.stamina -= 25;
        internalState.current.isRolling = 20; // 20 Frame bebas serangan musuh
        internalState.current.staminaRegenCooldown = 25;
        setStamina(Math.floor(internalState.current.stamina));
        keysPressed.current.roll = false; // Reset instant trigger
      }

      // Eksekusi Serangan (Sword Slash) via Keyboard BIND
      if (keysPressed.current.attack && internalState.current.stamina >= 30) {
        internalState.current.stamina -= 30;
        internalState.current.staminaRegenCooldown = 35;
        setStamina(Math.floor(internalState.current.stamina));
        
        playerSlashes.push({
          x: internalState.current.playerX + player.width / 2 - 2,
          y: player.y - 10,
          width: 4,
          height: 15,
          speed: 8,
        });
        keysPressed.current.attack = false; // Reset instant trigger
      }

      // 4. Drawing Player (The Tarnished Silhouette)
      if (internalState.current.isRolling > 0) {
        ctx.fillStyle = "rgba(212, 175, 55, 0.6)"; // Warna Emas Ethereal saat guling
        ctx.beginPath();
        ctx.arc(internalState.current.playerX + player.width / 2, player.y + player.height / 2, player.width / 1.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#c5b358"; // Paladin Gold Dust Color
        ctx.fillRect(internalState.current.playerX, player.y, player.width, player.height);
        // Armor helm/tameng variasi kecil
        ctx.fillStyle = "#4a4a5a";
        ctx.fillRect(internalState.current.playerX + 5, player.y + 5, player.width - 10, 10);
      }

      // 5. Projectiles Updates & Hitbox Collision Detection
      // Bos Projectile (Turun Kebawah)
      ctx.fillStyle = "#ff2a2a"; // Crimson Red Curse Thorns
      bossProjectiles.forEach((proj, index) => {
        proj.y += proj.speed;
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height);

        // Tabrakan dengan Player
        if (
          proj.x < internalState.current.playerX + player.width &&
          proj.x + proj.width > internalState.current.playerX &&
          proj.y < player.y + player.height &&
          proj.y + proj.height > player.y
        ) {
          bossProjectiles.splice(index, 1);
          
          // Player aman jika sedang dalam mode kebal guling (I-Frames)
          if (internalState.current.isRolling === 0) {
            internalState.current.playerHp = Math.max(0, internalState.current.playerHp - 35);
            setPlayerHp(internalState.current.playerHp);
            setIsHit(true);
            setTimeout(() => setIsHit(false), 150);

            if (internalState.current.playerHp <= 0) {
              setGameState("GAMEOVER");
            }
          }
        }

        if (proj.y > canvas.height) bossProjectiles.splice(index, 1);
      });

      // Player Slashes Update (Naik ke Atas menyerang Bos Core)
      ctx.fillStyle = "#ffd700"; // Holy Gold Sword Wave
      playerSlashes.forEach((slash, index) => {
        slash.y -= slash.speed;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffd700";
        ctx.fillRect(slash.x, slash.y, slash.width, slash.height);
        ctx.shadowBlur = 0;

        // Cek jika tebakan mengenai batas area inti bos di atas screen
        if (slash.y <= 115 && slash.x >= (canvas.width / 2 - 50) && slash.x <= (canvas.width / 2 + 50)) {
          playerSlashes.splice(index, 1);
          internalState.current.bossHp = Math.max(0, internalState.current.bossHp - 45);
          setBossHp(internalState.current.bossHp);

          if (internalState.current.bossHp <= 0) {
            setGameState("VICTORY");
          }
        }

        if (slash.y < 0) playerSlashes.splice(index, 1);
      });

      // Ulangi loop selama HP masih tersedia
      if (internalState.current.playerHp > 0 && internalState.current.bossHp > 0) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  // Deskripsi Keyboard Input Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") keysPressed.current.left = true;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") keysPressed.current.right = true;
      if (e.key === "j" || e.key === "J" || e.key === " ") { e.preventDefault(); keysPressed.current.attack = true; }
      if (e.key === "k" || e.key === "K" || e.key === "Shift") { e.preventDefault(); keysPressed.current.roll = true; }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") keysPressed.current.left = false;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") keysPressed.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Mekanisme Penggunaan Flaskof Crimson Tears (Heal Item)
  const useHealFlask = () => {
    if (flasks > 0 && internalState.current.playerHp > 0 && gameState === "PLAYING") {
      setFlasks((prev) => prev - 1);
      internalState.current.playerHp = Math.min(100, internalState.current.playerHp + 45);
      setPlayerHp(internalState.current.playerHp);
    }
  };

  return (
    <div className={`min-h-screen bg-[#070709] text-amber-100 flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden font-serif ${isHit ? "bg-red-950/50 transition-all duration-75" : ""}`}>
      
      {/* Dark Vignette Overlay Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85))] pointer-events-none z-10" />

      {/* HEADER HUD BAR */}
      <div className="w-full max-w-lg flex justify-between items-center mb-3 z-20">
        <button 
          onClick={() => router.back()}
          className="px-3 py-1.5 bg-[#121216] border border-amber-900/40 text-[11px] rounded tracking-widest text-amber-500/80 hover:text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer uppercase"
        >
          <ArrowLeft size={12} /> Return To Grace
        </button>
        <div className="text-right text-[9px] tracking-widest text-amber-700 uppercase">
          ZONE: <span className="text-amber-500 font-bold">SHADOW_REALM_NODE</span>
        </div>
      </div>

      {/* CORE FRAME MONITOR SCREEN */}
      <div className="w-full max-w-lg bg-[#0e0e12] border border-amber-800/20 rounded-xl p-4 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative z-20">
        
        {/* BOSS HEALTH BAR (Classic Souls Style) */}
        {gameState === "PLAYING" && (
          <div className="w-full bg-black/80 border border-amber-900/30 px-4 py-2 rounded mb-3 font-mono text-center relative overflow-hidden">
            <div className="flex justify-between items-center mb-1 text-[10px] tracking-widest uppercase text-amber-600">
              <span className="flex items-center gap-1 font-serif"><ShieldAlert size={12} /> Shade of the Elden Lord</span>
              <span className="text-red-500 font-bold">{bossHp} / 1000 HP</span>
            </div>
            <div className="w-full h-2 bg-neutral-900 rounded-sm border border-white/5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-800 to-red-600 transition-all duration-100 shadow-[0_0_8px_#ff0000]"
                style={{ width: `${(bossHp / 1000) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* TARNISHED LIVE HUD PROGRESS STATUS */}
        {gameState === "PLAYING" && (
          <div className="grid grid-cols-3 gap-2 items-center bg-black/40 border border-white/5 px-3 py-2 rounded mb-3 font-mono text-xs">
            {/* HP Red Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[8px] text-red-400 font-bold uppercase">
                <span className="flex items-center gap-0.5"><Heart size={8} /> Vigor</span>
                <span>{playerHp}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-950 border border-white/5 rounded-sm overflow-hidden">
                <div className="h-full bg-red-700" style={{ width: `${playerHp}%` }} />
              </div>
            </div>

            {/* Stamina Green Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[8px] text-emerald-400 font-bold uppercase">
                <span className="flex items-center gap-0.5"><Zap size={8} /> Endurance</span>
                <span>{stamina}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-950 border border-white/5 rounded-sm overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${stamina}%` }} />
              </div>
            </div>

            {/* Heal Charge Tracker Counter */}
            <button 
              onClick={useHealFlask}
              disabled={flasks === 0}
              className={`py-1 rounded text-[9px] uppercase font-bold flex items-center justify-center gap-1 transition-all border ${flasks > 0 ? "bg-amber-950/40 border-amber-700/50 text-amber-400 hover:bg-amber-900/50 cursor-pointer" : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"}`}
            >
              <Sparkles size={10} className={flasks > 0 ? "text-amber-400 animate-pulse" : ""} /> Estus [{flasks}]
            </button>
          </div>
        )}

        {/* MONITOR DISPLAY SCREEN CANVAS */}
        <div className="relative bg-[#050507] rounded-lg aspect-[4/3.2] w-full overflow-hidden flex items-center justify-center border border-amber-900/10 shadow-inner">
          
          <AnimatePresence mode="wait">
            {gameState === "MENU" && (
              <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-6 space-y-4 z-20 font-serif">
                <div className="w-12 h-12 bg-amber-950/20 border border-amber-700/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(212,175,55,0.15)]">
                  <Swords size={20} className="text-amber-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold tracking-widest text-amber-200 uppercase">SHADOW REALM CHALLENGE</h3>
                  <p className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed font-sans">
                    Hadapi kutukan sisa-sisa pecahan takhta. Gunakan <kbd className="px-1 bg-zinc-800 text-white rounded">A</kbd>/<kbd className="px-1 bg-zinc-800 text-white rounded">D</kbd> untuk bergeser, tombol bawah untuk bertarung menantang batas kesabaran.
                  </p>
                </div>
                <button 
                  onClick={() => setGameState("PLAYING")}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-500/30 text-amber-100 font-bold text-xs uppercase tracking-widest rounded transition-all shadow-lg hover:brightness-110 cursor-pointer mx-auto"
                >
                  Touch Grace & Begin ⚔️
                </button>
              </motion.div>
            )}

            {gameState === "GAMEOVER" && (
              <motion.div key="gameover" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center p-6 space-y-5 z-20">
                <div>
                  <h2 className="text-3xl font-black font-serif tracking-widest text-red-700 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] uppercase animate-fade-in">YOU DIED</h2>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1">Kesabaran Anda teruji. Jiwa Tarnished Anda kembali terlelap dalam kegelapan.</p>
                </div>
                <button 
                  onClick={() => setGameState("PLAYING")}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-amber-900/40 text-amber-500 font-bold text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RefreshCw size={12} /> Awaken Once More
                </button>
              </motion.div>
            )}

            {gameState === "VICTORY" && (
              <motion.div key="victory" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center p-6 space-y-4 z-20">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.3)] text-amber-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-serif tracking-widest text-amber-400 uppercase">GREAT FOE VANQUISHED</h2>
                  <p className="text-[10px] text-zinc-400 font-sans mt-1">Takhta Elden Lord kini layak kembali ke dalam genggaman suci Anda.</p>
                </div>
                <button 
                  onClick={() => setGameState("PLAYING")}
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-600/40 font-bold text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RefreshCw size={12} /> Re-enter Shadow Arena
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REALTIME 2D CANVAS RENDERING FRAME */}
          <canvas
            ref={canvasRef}
            width={480}
            height={384}
            className={`w-full h-full ${gameState !== "PLAYING" ? "hidden" : "block"}`}
          />
        </div>

        {/* TACTICAL CONTROLLER FOR MOBILE LAYOUT */}
        <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3.5 border-t border-white/5 font-sans">
          <button
            onTouchStart={() => { keysPressed.current.left = true; }}
            onTouchEnd={() => { keysPressed.current.left = false; }}
            onMouseDown={() => { keysPressed.current.left = true; }}
            onMouseUp={() => { keysPressed.current.left = false; }}
            className="py-3 bg-zinc-950/60 active:bg-amber-950/20 border border-zinc-900 active:border-amber-900/40 text-zinc-500 active:text-amber-500 rounded flex items-center justify-center transition-all cursor-pointer select-none touch-none font-bold text-xs"
          >
            ◀ LEFT
          </button>
          
          <button
            onTouchStart={() => { keysPressed.current.right = true; }}
            onTouchEnd={() => { keysPressed.current.right = false; }}
            onMouseDown={() => { keysPressed.current.right = true; }}
            onMouseUp={() => { keysPressed.current.right = false; }}
            className="py-3 bg-zinc-950/60 active:bg-amber-950/20 border border-zinc-900 active:border-amber-900/40 text-zinc-500 active:text-amber-500 rounded flex items-center justify-center transition-all cursor-pointer select-none touch-none font-bold text-xs"
          >
            RIGHT ▶
          </button>

          <button
            onTouchStart={() => { keysPressed.current.roll = true; }}
            onTouchEnd={() => { keysPressed.current.roll = false; }}
            onMouseDown={() => { keysPressed.current.roll = true; }}
            onMouseUp={() => { keysPressed.current.roll = false; }}
            className="py-3 bg-zinc-950/60 active:bg-emerald-950/20 border border-zinc-900 active:border-emerald-900/40 text-zinc-500 active:text-emerald-400 rounded flex flex-col items-center justify-center transition-all cursor-pointer select-none touch-none text-[10px] font-bold"
          >
            <span>DODGE</span>
            <span className="text-[6px] opacity-40 font-mono">-25 END</span>
          </button>

          <button
            onTouchStart={() => { keysPressed.current.attack = true; }}
            onTouchEnd={() => { keysPressed.current.attack = false; }}
            onMouseDown={() => { keysPressed.current.attack = true; }}
            onMouseUp={() => { keysPressed.current.attack = false; }}
            className="py-3 bg-zinc-950/60 active:bg-red-950/20 border border-zinc-900 active:border-red-900/40 text-zinc-500 active:text-red-400 rounded flex flex-col items-center justify-center transition-all cursor-pointer select-none touch-none text-[10px] font-bold"
          >
            <span>STRIKE</span>
            <span className="text-[6px] opacity-40 font-mono">-30 END</span>
          </button>
        </div>

      </div>

      {/* SOULS METRICS SYSTEM FOOTER */}
      <div className="mt-3.5 text-center text-[9px] font-mono text-zinc-600 flex items-center gap-1.5 z-20 tracking-wider">
        <Shield size={10} className="text-amber-800" /> FROMSOFTWARE LOCALIZED // BANDAI NUSANTARA // VER_2.0.26
      </div>
    </div>
  );
}