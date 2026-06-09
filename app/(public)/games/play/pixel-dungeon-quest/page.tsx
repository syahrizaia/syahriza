/* eslint-disable prefer-const */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sword, Heart, Coins, Trophy, Skull, RefreshCw, Package, Backpack } from "lucide-react";

// Tipe tipe data untuk ubin labirin prosedural
type TileType = "START" | "EMPTY" | "TREASURE" | "MONSTER" | "BOSS" | "STAIRS" | "CLEARED";

interface RoomTile {
  type: TileType;
  discovered: boolean;
  enemyHp?: number;
  enemyMaxHp?: number;
  enemyName?: string;
}

export default function PixelDungeonQuestGameplay() {
  const router = useRouter();

  // STATUS UTAMA GAME
  const [gameState, setGameState] = useState<"START" | "EXPLORING" | "COMBAT" | "VICTORY" | "GAMEOVER">("START");
  
  // STATS KARAKTER PEMAIN (RPG Sederhana)
  const [playerHp, setPlayerHp] = useState(60);
  const [playerMaxHp, setPlayerMaxHp] = useState(60);
  const [playerGold, setPlayerGold] = useState(0);
  const [playerFloor, setPlayerFloor] = useState(1);
  const [playerAtk, setPlayerAtk] = useState(12);
  const [potions, setPotions] = useState(2);

  // KONDISI LABIRIN PROSEDURAL (Grid 4x4)
  const [grid, setGrid] = useState<RoomTile[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  // STATUS KHUSUS COMBAT
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [dungeonLog, setDungeonLog] = useState<string>("Selamat datang di dungeon! Cari tangga untuk turun lebih dalam.");

  // Audio Synthesizer Beep ala Konsol Retro 8-Bit/16-Bit
  const playRetroTone = (freq: number, type: OscillatorType, duration: number) => {
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
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // FUNGSI 1: GENERATOR LABIRIN PROSEDURAL (ACAK TIAP LANTAI)
  const generateProceduralFloor = (floorNumber: number) => {
    const size = 4;
    const newGrid: RoomTile[][] = [];

    // Monster Pool sesuai kedalaman lantai
    const monsterNames = ["Pixel Slime", "Skeleton Warrior", "Goblin Rogue", "Shadow Bat"];
    const randomMonster = () => monsterNames[Math.floor(Math.random() * monsterNames.length)];

    for (let y = 0; y < size; y++) {
      const row: RoomTile[] = [];
      for (let x = 0; x < size; x++) {
        // Default Tile Kosong
        row.push({ type: "EMPTY", discovered: false });
      }
      newGrid.push(row);
    }

    // Set Titik Start Pemain selalu aman di kiri atas (0,0)
    newGrid[0][0] = { type: "START", discovered: true };

    // Tentukan Lokasi Objektif Utama (Tangga atau Boss Besar di Lantai 4)
    const objX = 3;
    const objY = 3;
    if (floorNumber >= 4) {
      newGrid[objY][objX] = { 
        type: "BOSS", 
        discovered: false, 
        enemyName: "RAJA KEGELAPAN (BOSS)", 
        enemyHp: 180, 
        enemyMaxHp: 180 
      };
    } else {
      newGrid[objY][objX] = { type: "STAIRS", discovered: false };
    }

    // Isi Sisa Ubin Lain Secara Acak (Treasure vs Monster)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if ((x === 0 && y === 0) || (x === objX && y === objY)) continue;

        const rand = Math.random();
        if (rand < 0.3) {
          newGrid[y][x] = { type: "TREASURE", discovered: false };
        } else if (rand < 0.7) {
          const hpBase = 25 + floorNumber * 10;
          newGrid[y][x] = { 
            type: "MONSTER", 
            discovered: false, 
            enemyName: randomMonster(),
            enemyHp: hpBase,
            enemyMaxHp: hpBase
          };
        }
      }
    }

    setGrid(newGrid);
    setPlayerPos({ x: 0, y: 0 });
    setGameState("EXPLORING");
    setDungeonLog(`Memasuki Lantai B bawah tanah ${floorNumber}F. Labirin telah teracak secara prosedural!`);
  };

  // FUNGSI 2: MEMULAI GAME BARU
  const startNewGame = () => {
    setPlayerHp(60);
    setPlayerMaxHp(60);
    setPlayerGold(0);
    setPlayerFloor(1);
    setPlayerAtk(12);
    setPotions(2);
    playRetroTone(400, "square", 0.15);
    generateProceduralFloor(1);
  };

  // FUNGSI 3: KONTROL NAVIGASI JELAJAH SATU TANGAN (D-PAD MOBILE)
  const movePlayer = (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    if (gameState !== "EXPLORING") return;

    let { x, y } = playerPos;
    if (direction === "UP" && y > 0) y--;
    else if (direction === "DOWN" && y < 3) y++;
    else if (direction === "LEFT" && x > 0) x--;
    else if (direction === "RIGHT" && x < 3) x++;
    else return; // Menabrak dinding luar labirin

    // Update posisi koordinat pemain
    const updatedGrid = [...grid];
    const targetTile = updatedGrid[y][x];
    targetTile.discovered = true;
    setPlayerPos({ x, y });

    playRetroTone(250, "sine", 0.05);

    // CEK EVENT BERDASARKAN JENIS TILE YANG DIINJAK
    if (targetTile.type === "TREASURE") {
      const foundGold = Math.floor(Math.random() * 25) + 15;
      setPlayerGold((g) => g + foundGold);
      targetTile.type = "CLEARED";
      setDungeonLog(`🎁 Menemukan peti kuno! Mendapatkan +${foundGold} Koin Emas.`);
      playRetroTone(600, "sine", 0.2);
    } else if (targetTile.type === "STAIRS") {
      setDungeonLog("🪜 Anda menemukan tangga turun! Beristirahat sejenak lalu turun.");
    } else if (targetTile.type === "MONSTER" || targetTile.type === "BOSS") {
      // Pemicu Pertarungan Turn-Based RPG
      setGameState("COMBAT");
      setCombatLog([`⚔️ Bertemu dengan ${targetTile.enemyName}! Siapkan senjatamu.`]);
    } else {
      setDungeonLog("Ubin koridor kosong aman. Lanjutkan melangkah.");
    }

    setGrid(updatedGrid);
  };

  // FUNGSI 4: MEKANIK TURN-BASED COMBAT (SERANG & BERTAHAN KASUAL)
  const handleAttack = () => {
    if (gameState !== "COMBAT") return;

    const currentTile = grid[playerPos.y][playerPos.x];
    if (!currentTile.enemyHp) return;

    // 1. Serangan Giliran Pemain
    const dmgToEnemy = Math.floor(Math.random() * 6) + playerAtk;
    const nextEnemyHp = Math.max(0, currentTile.enemyHp - dmgToEnemy);
    currentTile.enemyHp = nextEnemyHp;
    playRetroTone(150, "sawtooth", 0.1);

    let newLogs = [`⚔️ Anda menebas ${currentTile.enemyName} sebesar -${dmgToEnemy} HP.`];

    // Cek Apakah Musuh Tumbang
    if (nextEnemyHp <= 0) {
      if (currentTile.type === "BOSS") {
        setGameState("VICTORY");
        playRetroTone(700, "sine", 0.5);
        return;
      }
      
      // Musuh Biasa Kalah
      const lootGold = Math.floor(Math.random() * 30) + 20;
      setPlayerGold((g) => g + lootGold);
      currentTile.type = "CLEARED";
      setGameState("EXPLORING");
      setDungeonLog(`🎉 Berhasil mengalahkan ${currentTile.enemyName}! Mendapatkan +${lootGold} Emas.`);
      playRetroTone(550, "sine", 0.25);
      return;
    }

    // 2. Serangan Balasan Giliran Musuh (Turn-Based Counter)
    const dmgToPlayer = Math.floor(Math.random() * 5) + (currentTile.type === "BOSS" ? 10 : 4);
    const nextPlayerHp = Math.max(0, playerHp - dmgToPlayer);
    setPlayerHp(nextPlayerHp);
    newLogs.push(`💥 ${currentTile.enemyName} menyerang balik! Tubuhmu terkena -${dmgToPlayer} HP.`);
    playRetroTone(100, "square", 0.15);

    if (nextPlayerHp <= 0) {
      setGameState("GAMEOVER");
      playRetroTone(80, "sawtooth", 0.5);
    }

    setCombatLog(newLogs);
  };

  // FUNGSI 5: MEKANIK MEMINUM RAMUAN PENYEMBUH (HEAL POTION)
  const usePotion = () => {
    if (potions > 0 && playerHp < playerMaxHp) {
      setPotions((p) => p - 1);
      setPlayerHp((hp) => Math.min(playerMaxHp, hp + 35));
      playRetroTone(450, "sine", 0.2);
      if (gameState === "COMBAT") {
        setCombatLog((prev) => [...prev, "🧪 Meminum Ramuan Penyembuh! HP memulih +35."]);
      } else {
        setDungeonLog("🧪 Meminum Ramuan Penyembuh! Kesehatan Anda kembali segar.");
      }
    }
  };

  // FUNGSI 6: TURUN KE LANTAI SELANJUTNYA
  const nextFloorAction = () => {
    const currentTile = grid[playerPos.y][playerPos.x];
    if (currentTile.type === "STAIRS") {
      const nextF = playerFloor + 1;
      setPlayerFloor(nextF);
      setPlayerAtk((atk) => atk + 3); // Naik kekuatan serang bertahap
      setPlayerMaxHp((max) => max + 10);
      setPlayerHp((hp) => Math.min(playerMaxHp + 10, hp + 20)); // Bonus heal ganti lantai
      generateProceduralFloor(nextF);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f11] text-zinc-100 px-4 py-24 flex flex-col items-center justify-center font-mono selection:bg-yellow-500 selection:text-black">
      
      {/* HEADER ATAS BACK BUTTON */}
      <div className="w-full max-w-sm flex justify-between items-center mb-3 bg-[#17191d] border-2 border-zinc-800 px-3 py-2 rounded-xl text-xs shadow-md">
        <button 
          onClick={() => router.back()}
          className="px-2 py-1 bg-black/40 border border-zinc-700 text-zinc-400 rounded hover:text-white flex items-center gap-1 transition-all cursor-pointer"
        >
          <ArrowLeft size={12} /> Keluar
        </button>
        <span className="text-yellow-500 font-bold tracking-wider text-[11px] uppercase flex items-center gap-1">
          🎰 16-BIT RETRO CONSOLE
        </span>
      </div>

      {/* RENDER UTAMA FRAME GAMING MOBILE EMULATOR CHASSIS */}
      <div className="w-full max-w-sm bg-gradient-to-b from-[#212429] to-[#15171a] border-[4px] border-zinc-700 rounded-[28px] p-4 shadow-2xl relative">
        
        {/* RETRO SCREEN DISPLAY MONITOR */}
        <div className="bg-[#121417] rounded-xl p-3 border-2 border-black min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
          
          <AnimatePresence mode="wait">
            
            {/* PANEL A: MENU UTAMA AWAL (JACK IN) */}
            {gameState === "START" && (
              <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full my-auto flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="text-4xl animate-bounce">🗝️</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-widest text-yellow-500 uppercase">PIXEL DUNGEON QUEST</h3>
                  <p className="text-[10px] text-zinc-500 max-w-[240px] leading-relaxed">
                    Rogue-like kasual RPG offline. Jelajahi labirin acak prosedural setiap kali masuk.
                  </p>
                </div>
                <button
                  onClick={startNewGame}
                  className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs uppercase rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Mulai Petualangan ⚔️
                </button>
              </motion.div>
            )}

            {/* PANEL B: MODE EKSPLORASI LABIRIN PROSEDURAL */}
            {gameState === "EXPLORING" && (
              <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {/* HUD STATUS ATAS */}
                <div className="flex justify-between items-center text-[10px] bg-black/60 p-2 rounded border border-zinc-900">
                  <span className="text-red-400 font-bold flex items-center gap-0.5"><Heart size={10} fill="red"/> {playerHp}/{playerMaxHp}</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-0.5"><Coins size={10}/> {playerGold} G</span>
                  <span className="text-cyan-400 font-bold">Lantai: B{playerFloor}F</span>
                </div>

                {/* RENDERING GRID DUNGEON 4X4 */}
                <div className="grid grid-cols-4 gap-1.5 bg-black/40 p-2 rounded-lg border border-zinc-900">
                  {grid.map((row, y) =>
                    row.map((tile, x) => {
                      const isCurrent = playerPos.x === x && playerPos.y === y;
                      return (
                        <div
                          key={`${y}-${x}`}
                          className={`aspect-square rounded flex items-center justify-center text-xs font-bold transition-all relative ${
                            isCurrent
                              ? "bg-yellow-500 text-black scale-105 z-10 font-black shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                              : tile.discovered
                              ? tile.type === "STAIRS"
                                ? "bg-cyan-950 text-cyan-300 border border-cyan-500"
                                : tile.type === "BOSS"
                                ? "bg-red-950 text-red-400 border border-red-500 animate-pulse"
                                : "bg-zinc-800 text-zinc-500"
                              : "bg-zinc-950 text-transparent border border-zinc-900"
                          }`}
                        >
                          {isCurrent ? (
                            "🧙"
                          ) : tile.discovered ? (
                            tile.type === "TREASURE" ? "🎁" :
                            tile.type === "MONSTER" ? "💀" :
                            tile.type === "BOSS" ? "👑" :
                            tile.type === "STAIRS" ? "🪜" : "·"
                          ) : (
                            "?"
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* LIVE TICK DUNGEON ACTION MONITOR LOG */}
                <div className="bg-black text-[10px] text-zinc-400 p-2 rounded border border-zinc-900 min-h-[38px] flex items-center leading-tight">
                  {dungeonLog}
                </div>

                {/* OPSI TOMBOL INTERAKSI LANJUTAN TANGGA */}
                {grid[playerPos.y]?.[playerPos.x]?.type === "STAIRS" && (
                  <button
                    onClick={nextFloorAction}
                    className="w-full py-1.5 bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-[11px] rounded uppercase tracking-wider animate-pulse cursor-pointer"
                  >
                    Turun ke Lantai Selanjutnya 🪜
                  </button>
                )}
              </motion.div>
            )}

            {/* PANEL C: MEKANIK COMBAT TURN-BASED SCREEN */}
            {gameState === "COMBAT" && (
              <motion.div key="combat" initial={{ scale: 0.97 }} animate={{ scale: 1 }} className="space-y-3 my-auto py-1">
                <div className="text-center pb-1 border-b border-zinc-800">
                  <span className="text-[10px] text-red-500 bg-red-950/60 px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                    ⚠️ Turn Combat Aktif
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 uppercase">
                    {grid[playerPos.y][playerPos.x].enemyName}
                  </h4>
                  {/* Nyawa Musuh Status */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300" 
                      style={{ width: `${((grid[playerPos.y][playerPos.x].enemyHp || 0) / (grid[playerPos.y][playerPos.x].enemyMaxHp || 1)) * 100}%` }} 
                    />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono">Chassis HP: {grid[playerPos.y][playerPos.x].enemyHp}</span>
                </div>

                {/* RUNNING RETRO COMBAT TEXT LOG */}
                <div className="bg-black p-2 rounded border border-zinc-900 h-20 overflow-y-auto flex flex-col justify-end text-[10px] text-cyan-400 space-y-1">
                  {combatLog.map((log, i) => (
                    <div key={i} className="leading-normal tracking-tight">{log}</div>
                  ))}
                </div>

                {/* COMBAT SKILLS OPTIONS */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <button
                    onClick={handleAttack}
                    className="py-2.5 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer uppercase text-[11px]"
                  >
                    <Sword size={12}/> Serang Senjata
                  </button>
                  <button
                    onClick={usePotion}
                    disabled={potions === 0}
                    className="py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:bg-zinc-900 text-white font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer uppercase text-[11px]"
                  >
                    <Backpack size={12}/> Ramuan ({potions})
                  </button>
                </div>
              </motion.div>
            )}

            {/* PANEL D: SCREEN GAME VICTORY (MENANG KONTRAK KERAJAAN) */}
            {gameState === "VICTORY" && (
              <motion.div key="victory" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="h-full text-center py-6 space-y-4 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-yellow-950 border-2 border-yellow-500 rounded-full flex items-center justify-center text-yellow-400 text-lg shadow-lg animate-bounce">
                  <Trophy size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black tracking-widest text-yellow-500 uppercase">DUNGEON CONQUERED</h3>
                  <p className="text-[10px] text-zinc-400 max-w-[220px] mx-auto font-sans leading-relaxed">
                    Raja Kegelapan berhasil ditaklukkan! Labirin bawah tanah hancur bersama kemenangannya. Anda membawa pulang total <span className="text-yellow-500 font-bold">{playerGold} Emas</span>.
                  </p>
                </div>
                <button
                  onClick={() => setGameState("START")}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-yellow-500 font-bold text-[10px] rounded uppercase cursor-pointer"
                >
                  Kembali ke Menu Utama
                </button>
              </motion.div>
            )}

            {/* PANEL E: GAME OVER (DEAD STATE) */}
            {gameState === "GAMEOVER" && (
              <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full text-center py-6 space-y-4 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-red-950 border border-red-500 rounded-full flex items-center justify-center text-red-500 text-lg">
                  <Skull size={18} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black tracking-widest text-red-500 uppercase">HERO FLATLINED</h3>
                  <p className="text-[10px] text-zinc-500 max-w-[200px] font-sans leading-snug">Jiwa petualang Anda gugur di Lantai B{playerFloor}F. Labirin merenggut segalanya.</p>
                </div>
                <button
                  onClick={startNewGame}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-yellow-500 border border-zinc-700 text-[10px] font-bold uppercase rounded cursor-pointer flex items-center gap-1 mx-auto"
                >
                  <RefreshCw size={11}/> Coba Lagi (Respawn)
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* ONE-HANDED MOBILE RESPONSIVE NAVIGATIONAL D-PAD INTERFACES */}
        {gameState === "EXPLORING" && (
          <div className="mt-4 grid grid-cols-3 gap-2 bg-black/20 p-2.5 rounded-xl border border-zinc-800/60 shadow-inner max-w-[280px] mx-auto">
            
            {/* Row 1 */}
            <div />
            <button
              onClick={() => movePlayer("UP")}
              className="py-2.5 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg border-b-2 border-zinc-950 shadow-md flex items-center justify-center transition-all cursor-pointer text-sm"
            >
              ▲
            </button>
            {/* Quick Consumable Heal in Exploration Bar */}
            <button
              onClick={usePotion}
              disabled={potions === 0}
              className={`row-span-1 rounded-lg text-[9px] font-bold flex flex-col items-center justify-center border transition-all ${potions > 0 ? "bg-emerald-950 text-emerald-400 border-emerald-800 cursor-pointer" : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"}`}
            >
              <span>POTION</span>
              <span>({potions})</span>
            </button>

            {/* Row 2 */}
            <button
              onClick={() => movePlayer("LEFT")}
              className="py-2.5 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg border-b-2 border-zinc-950 shadow-md flex items-center justify-center transition-all cursor-pointer text-sm"
            >
              ◀
            </button>
            <div className="bg-zinc-900 rounded-lg border border-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-600">
              D-PAD
            </div>
            <button
              onClick={() => movePlayer("RIGHT")}
              className="py-2.5 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg border-b-2 border-zinc-950 shadow-md flex items-center justify-center transition-all cursor-pointer text-sm"
            >
              ▶
            </button>

            {/* Row 3 */}
            <div />
            <button
              onClick={() => movePlayer("DOWN")}
              className="py-2.5 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg border-b-2 border-zinc-950 shadow-md flex items-center justify-center transition-all cursor-pointer text-sm"
            >
              ▼
            </button>
            <div />

          </div>
        )}

      </div>

      {/* FOOTER RETRO BRANDING ENGINE */}
      <div className="mt-4 text-center text-[10px] text-zinc-600 tracking-widest uppercase flex items-center gap-1">
        <Package size={11} className="text-zinc-700" /> CHIBI BYTE DEV // INDIEGO STUDIOS // ENGINE_2026_OFFLINE
      </div>
    </div>
  );
}