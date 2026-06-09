"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sprout, Fish, Heart, ShoppingBag, Coins, Sun, CloudRain, User, ArrowUpRight } from "lucide-react";

type TabType = "LADANG" | "KOLAM" | "DESA" | "PASAR";

export default function HarvestSimulatorGameplay() {
  const router = useRouter();

  // RESOURCE GLOBAL STATE
  const [coins, setCoins] = useState(15000); // Rupiah Virtual
  const [seeds, setSeeds] = useState(3);
  const [fishFeed, setFishFeed] = useState(5);
  
  // INVENTORY HARVEST
  const [harvestedRice, setHarvestedRice] = useState(0);
  const [harvestedLele, setHarvestedLele] = useState(0);

  // SIMULASI WAKTU & CUACA TROPIS
  const [day, setDay] = useState(1);
  const [weather, setWeather] = useState<"CERAH" | "HUJAN">("CERAH");

  // NAVIGATION UI TAB
  const [activeTab, setActiveTab] = useState<TabType>("LADANG");

  // 1. MECHANIC: LADANG PERTANIAN
  const [cropStatus, setCropStatus] = useState<"KOSONG" | "BERTUMBUH" | "PANEN">("KOSONG");
  const [cropProgress, setCropProgress] = useState(0);

  // 2. MECHANIC: KOLAM LELE ORGANIK
  const [leleStatus, setLeleStatus] = useState<"KOSONG" | "LAPAR" | "BERTUMBUH" | "PANEN">("KOSONG");
  const [leleProgress, setLeleProgress] = useState(0);

  // 3. MECHANIC: JODOH (SOSIAL DESA VIRTUAL)
  const [crushAffection, setCrushAffection] = useState(10); // Skala 0 - 100%
  const [dialogueLog, setDialogueLog] = useState("Sri: 'Selamat pagi, Kang! Desanya asri banget ya hari ini.'");

  // NOTIFIKASI POP-UP LOG
  const [gameLog, setGameLog] = useState("Selamat datang di Desa Sukamaju! Mari kelola ladangmu.");

  // TIME LOOP ENGINE (Tiap 2.5 detik = Berjalan 1 fase pertumbuhan)
  useEffect(() => {
    const timer = setInterval(() => {
      // Siklus Cuaca Acak
      if (Math.random() > 0.85) {
        setWeather((prev) => (prev === "CERAH" ? "HUJAN" : "CERAH"));
      }

      // Pertumbuhan Tanaman Padi
      if (cropStatus === "BERTUMBUH") {
        setCropProgress((prev) => {
          const speed = weather === "HUJAN" ? 15 : 10; // Hujan mempercepat tanaman tumbuh
          if (prev + speed >= 100) {
            setCropStatus("PANEN");
            setGameLog("🌾 Padi di ladang sudah menguning dan siap dipanen!");
            return 100;
          }
          return prev + speed;
        });
      }

      // Pertumbuhan & Status Kelaparan Lele
      if (leleStatus === "BERTUMBUH") {
        setLeleProgress((prev) => {
          if (prev + 8 >= 100) {
            setLeleStatus("PANEN");
            setGameLog("🐟 Kolam beriak kencang! Lele organik sudah besar dan siap panen.");
            return 100;
          }
          // Lele acak menjadi lapar di tengah pertumbuhan
          if (prev > 40 && Math.random() > 0.6) {
            setLeleStatus("LAPAR");
            setGameLog("⚠️ Lele peliharaanmu lapar, segera beri pakan organik!");
          }
          return prev + 8;
        });
      }

      // Pertambahan Hari
      setDay((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(timer);
  }, [cropStatus, leleStatus, weather]);

  // ACTION HANDLERS
  const handlePlant = () => {
    if (seeds > 0 && cropStatus === "KOSONG") {
      setSeeds((prev) => prev - 1);
      setCropStatus("BERTUMBUH");
      setCropProgress(0);
      setGameLog("🌱 Benih padi unggul berhasil ditanam di petak ladang.");
    }
  };

  const handleHarvestCrop = () => {
    if (cropStatus === "PANEN") {
      setHarvestedRice((prev) => prev + 5);
      setCropStatus("KOSONG");
      setCropProgress(0);
      setGameLog("🧺 Panen berhasil! 5 ikat padi organik masuk ke gudang penyimpanan.");
    }
  };

  const handleSpreadFingerlings = () => {
    if (coins >= 1000 && leleStatus === "KOSONG") {
      setCoins((prev) => prev - 1000);
      setLeleStatus("BERTUMBUH");
      setLeleProgress(0);
      setGameLog("🐟 Bibit lele organik disebar ke kolam terpal utama.");
    } else if (coins < 1000) {
      setGameLog("❌ Dana tidak cukup untuk membeli bibit lele baru (Butuh Rp1.000).");
    }
  };

  const handleFeedLele = () => {
    if (fishFeed > 0 && leleStatus === "LAPAR") {
      setFishFeed((prev) => prev - 1);
      setLeleStatus("BERTUMBUH");
      setGameLog("✨ Lele kenyang diberi pakan fermentasi organik alami.");
    }
  };

  const handleHarvestLele = () => {
    if (leleStatus === "PANEN") {
      setHarvestedLele((prev) => prev + 3);
      setLeleStatus("KOSONG");
      setLeleProgress(0);
      setGameLog("📦 Mantap! 3 kg lele jumbo berhasil diserok dari kolam.");
    }
  };

  // INTERAKSI SOSIAL / JODOH
  const handleInteractSocial = (actionType: "CHAT" | "GIFT") => {
    if (actionType === "CHAT") {
      setCrushAffection((prev) => Math.min(100, prev + 5));
      setDialogueLog("Sri: 'Wah, makasih udah nyempetin ngobrol, Kang. Pekerja keras banget deh!'");
      setGameLog("❤️ Hubungan kedekatan dengan Sri meningkat!");
    } else if (actionType === "GIFT") {
      if (harvestedLele > 0) {
        setHarvestedLele((prev) => prev - 1);
        setCrushAffection((prev) => Math.min(100, prev + 20));
        setDialogueLog("Sri: 'Ya ampun dibawain Lele Bakar Organik! Akang tau aja kesukaan Sri, hiks.'");
        setGameLog("💖 Hadiah lele disukai! Sri baper tingkat tinggi!");
      } else {
        setGameLog("❌ Kamu tidak punya stok Lele di gudang untuk dijadikan hadiah.");
      }
    }
  };

  // PASAR TRADISIONAL
  const handleMarketTrade = (tradeType: "BUY_SEED" | "BUY_FEED" | "SELL_RICE" | "SELL_FISH") => {
    switch (tradeType) {
      case "BUY_SEED":
        if (coins >= 500) {
          setCoins((prev) => prev - 500);
          setSeeds((prev) => prev + 1);
          setGameLog("💰 Membeli 1 kantong benih padi seharga Rp500.");
        }
        break;
      case "BUY_FEED":
        if (coins >= 400) {
          setCoins((prev) => prev - 400);
          setFishFeed((prev) => prev + 1);
          setGameLog("💰 Membeli 1 bungkus pakan lele seharga Rp400.");
        }
        break;
      case "SELL_RICE":
        if (harvestedRice > 0) {
          setHarvestedRice((prev) => prev - 1);
          setCoins((prev) => prev + 2500);
          setGameLog("💰 Menjual 1 ikat padi seharga Rp2.500 ke Tengkulak.");
        }
        break;
      case "SELL_FISH":
        if (harvestedLele > 0) {
          setHarvestedLele((prev) => prev - 1);
          setCoins((prev) => prev + 4500);
          setGameLog("💰 Menjual 1 kg Lele Organik premium seharga Rp4.500.");
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#1c2e1f] text-amber-50/90 flex flex-col items-center justify-center px-4 py-24 font-sans selection:bg-emerald-800">
      
      {/* HUD DASHBOARD UTAMA */}
      <div className="w-full max-w-xl flex justify-between items-center mb-3 bg-[#2a442f] border border-emerald-700/40 px-4 py-2.5 rounded-xl text-xs shadow-md">
        <button 
          onClick={() => router.back()}
          className="px-2.5 py-1 bg-[#162419] hover:bg-emerald-900 border border-emerald-800 rounded font-medium text-emerald-400 hover:text-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={12} /> Kembali ke Menu
        </button>
        <div className="flex items-center gap-4 font-mono font-semibold">
          <div className="flex items-center gap-1 bg-[#1a2c1e] px-2 py-0.5 rounded border border-emerald-800/60">
            {weather === "CERAH" ? <Sun size={13} className="text-amber-400 animate-spin-slow" /> : <CloudRain size={13} className="text-sky-400" />}
            <span>Hari {day}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 bg-[#162419] px-2.5 py-0.5 rounded border border-amber-900/40 text-sm">
            <Coins size={14} />
            <span>Rp {coins.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* FRAME UTAMA SIMULATOR */}
      <div className="w-full max-w-xl bg-[#233a27] border-2 border-emerald-800/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        
        {/* REVENUE & STOCK FOOTPRINT */}
        <div className="grid grid-cols-4 gap-2 text-[10px] text-center bg-[#17271b] py-2 px-3 rounded-xl border border-emerald-900 mb-4 text-emerald-300 font-mono">
          <div>Benih: <span className="text-white font-bold">{seeds}</span></div>
          <div>Pakan Lele: <span className="text-white font-bold">{fishFeed}</span></div>
          <div>Stok Padi: <span className="text-white font-bold">{harvestedRice}</span></div>
          <div>Stok Lele: <span className="text-white font-bold">{harvestedLele}</span></div>
        </div>

        {/* MONITOR DISPLAY DINAMIS BERDASARKAN TAB */}
        <div className="bg-[#111c14] rounded-xl aspect-[4/2.6] w-full p-4 border border-emerald-950 flex flex-col justify-between relative shadow-inner">
          
          <AnimatePresence mode="wait">
            {/* SCREEN 1: MANAGEMENT LADANG PADI */}
            {activeTab === "LADANG" && (
              <motion.div key="ladang" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-2">
                  <span className="text-xs font-bold tracking-wide text-emerald-400 flex items-center gap-1"><Sprout size={14}/> Petak Sawah Utama</span>
                  <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-900">Status: {cropStatus}</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto py-4 space-y-3">
                  {cropStatus === "KOSONG" && (
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 bg-[#322214] rounded-full border border-amber-900/30 mx-auto flex items-center justify-center text-amber-700 font-bold text-xl">🟫</div>
                      <p className="text-xs text-neutral-400 font-medium">Tanah subur gembur kosong. Siap ditanami benih padi.</p>
                      <button onClick={handlePlant} className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/30 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer shadow">
                        Tanam Benih Padi (-1 Benih)
                      </button>
                    </div>
                  )}

                  {cropStatus === "BERTUMBUH" && (
                    <div className="w-full text-center space-y-2 max-w-xs">
                      <div className="text-3xl animate-bounce">🌱</div>
                      <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                        <span>Padi Berkembang...</span>
                        <span>{cropProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-950 rounded-full border border-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300" style={{ width: `${cropProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {cropStatus === "PANEN" && (
                    <div className="text-center space-y-2">
                      <div className="text-4xl animate-pulse">🌾</div>
                      <p className="text-xs text-amber-300 font-semibold">Padi menguning subur!</p>
                      <button onClick={handleHarvestCrop} className="px-5 py-1.5 bg-amber-600 hover:bg-amber-500 border border-amber-400/30 rounded-lg text-xs font-bold text-black transition-all cursor-pointer shadow">
                        Ayo Sabit Padi! (Panen)
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: KOLAM TERNAK LELE */}
            {activeTab === "KOLAM" && (
              <motion.div key="kolam" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-2">
                  <span className="text-xs font-bold tracking-wide text-sky-400 flex items-center gap-1"><Fish size={14}/> Kolam Terpal Organik</span>
                  <span className="text-[10px] bg-sky-950 px-2 py-0.5 rounded text-sky-300 border border-sky-900">Status: {leleStatus}</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto py-4 space-y-3">
                  {leleStatus === "KOSONG" && (
                    <div className="text-center space-y-2">
                      <div className="text-3xl">🥣</div>
                      <p className="text-xs text-neutral-400">Kolam air bersih kosong, belum ada bibit lele.</p>
                      <button onClick={handleSpreadFingerlings} className="px-4 py-1.5 bg-sky-700 hover:bg-sky-600 border border-sky-500/30 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer shadow">
                        Beli & Sebar Bibit Lele (-Rp1.000)
                      </button>
                    </div>
                  )}

                  {leleStatus === "BERTUMBUH" && (
                    <div className="w-full text-center space-y-2 max-w-xs">
                      <div className="text-2xl animate-pulse">🐟 🌊</div>
                      <div className="flex justify-between text-[10px] text-sky-400 font-mono">
                        <span>Lele membesar sehat...</span>
                        <span>{leleProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-950 rounded-full border border-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-300" style={{ width: `${leleProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {leleStatus === "LAPAR" && (
                    <div className="text-center space-y-2">
                      <div className="text-3xl animate-bounce">😮‍💨</div>
                      <p className="text-xs text-red-400 font-bold animate-pulse">⚠️ Lele kelaparan! Pertumbuhan terhenti.</p>
                      <button onClick={handleFeedLele} className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg text-xs transition-all cursor-pointer shadow">
                        Beri Pakan Organik (-1 Pakan)
                      </button>
                    </div>
                  )}

                  {leleStatus === "PANEN" && (
                    <div className="text-center space-y-2">
                      <div className="text-4xl">🦈</div>
                      <p className="text-xs text-sky-300 font-semibold">Lele sehat montok siap panen raya!</p>
                      <button onClick={handleHarvestLele} className="px-5 py-1.5 bg-sky-500 hover:bg-sky-400 border border-sky-300/30 rounded-lg text-xs font-bold text-slate-950 transition-all cursor-pointer shadow">
                        Serok & Ambil Hasil Lele
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: DESA VIRTUAL (CARI JODOH) */}
            {activeTab === "DESA" && (
              <motion.div key="desa" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-2">
                  <span className="text-xs font-bold tracking-wide text-rose-400 flex items-center gap-1"><User size={14}/> Saung Desa Sukamaju</span>
                  <div className="flex items-center gap-1 text-[10px] text-rose-300 font-mono bg-rose-950/40 border border-rose-900/50 px-2 py-0.5 rounded">
                    <Heart size={11} className="fill-rose-500 text-rose-500" /> Cinta Sri: {crushAffection}%
                  </div>
                </div>

                <div className="my-auto bg-black/30 p-3 rounded-xl border border-emerald-900/40 font-serif italic text-xs text-center text-amber-100/90 leading-relaxed max-w-sm mx-auto">
                  {dialogueLog}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => handleInteractSocial("CHAT")} className="py-2 bg-emerald-900/50 border border-emerald-800 hover:bg-emerald-800 text-emerald-300 text-xs rounded-lg transition-all font-semibold cursor-pointer">
                    💬 Ajak Ngobrol Santai
                  </button>
                  <button onClick={() => handleInteractSocial("GIFT")} className="py-2 bg-rose-900/50 border border-rose-800 hover:bg-rose-800 text-rose-300 text-xs rounded-lg transition-all font-semibold cursor-pointer">
                    🎁 Kasih Hadiah Lele Organik
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 4: PASAR TRADISIONAL */}
            {activeTab === "PASAR" && (
              <motion.div key="pasar" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-between overflow-y-auto">
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-1.5">
                  <span className="text-xs font-bold tracking-wide text-amber-400 flex items-center gap-1"><ShoppingBag size={14}/> Toko Kelontong & Tengkulak Desa</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] my-auto py-2">
                  <div className="bg-[#18291d] p-2 border border-emerald-900 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Beli Benih Padi</p>
                      <p className="text-[9px] text-neutral-400">Harga: Rp500</p>
                    </div>
                    <button onClick={() => handleMarketTrade("BUY_SEED")} className="p-1 px-2 bg-amber-600 active:scale-95 text-black font-extrabold rounded text-[10px] cursor-pointer"><ArrowUpRight size={12} /></button>
                  </div>

                  <div className="bg-[#18291d] p-2 border border-emerald-900 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Beli Pakan Lele</p>
                      <p className="text-[9px] text-neutral-400">Harga: Rp400</p>
                    </div>
                    <button onClick={() => handleMarketTrade("BUY_FEED")} className="p-1 px-2 bg-amber-600 active:scale-95 text-black font-extrabold rounded text-[10px] cursor-pointer"><ArrowUpRight size={12} /></button>
                  </div>

                  <div className="bg-[#18291d] p-2 border border-emerald-900 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-400">Jual Padi Panen</p>
                      <p className="text-[9px] text-neutral-400">Hasil: +Rp2.500</p>
                    </div>
                    <button onClick={() => handleMarketTrade("SELL_RICE")} disabled={harvestedRice === 0} className="p-1 px-2 bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded text-[10px] cursor-pointer">Jual 1</button>
                  </div>

                  <div className="bg-[#18291d] p-2 border border-emerald-900 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sky-400">Jual Lele Organik</p>
                      <p className="text-[9px] text-neutral-400">Hasil: +Rp4.500</p>
                    </div>
                    <button onClick={() => handleMarketTrade("SELL_FISH")} disabled={harvestedLele === 0} className="p-1 px-2 bg-sky-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded text-[10px] cursor-pointer">Jual 1</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FEED / GAME ACTION LOG TERMINAL */}
        <div className="mt-3 bg-[#17271b] border border-emerald-900/60 rounded-xl px-3 py-2 text-[10px] font-mono text-emerald-200/90 flex items-center gap-1.5 h-8 overflow-hidden">
          🔊 <span className="animate-fade-in truncate">{gameLog}</span>
        </div>

        {/* CONTROLLER NAVIGATION BAR TAB */}
        <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3.5 border-t border-emerald-800/40">
          <button 
            onClick={() => setActiveTab("LADANG")} 
            className={`py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${activeTab === "LADANG" ? "bg-emerald-700 text-white border-emerald-500 shadow-lg" : "bg-[#18291c] border-emerald-900 text-emerald-500 hover:text-emerald-300"}`}
          >
            <Sprout size={15} /> Ladang
          </button>
          
          <button 
            onClick={() => setActiveTab("KOLAM")} 
            className={`py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${activeTab === "KOLAM" ? "bg-sky-700 text-white border-sky-500 shadow-lg" : "bg-[#18291c] border-emerald-900 text-sky-600 hover:text-sky-400"}`}
          >
            <Fish size={15} /> Kolam
          </button>

          <button 
            onClick={() => setActiveTab("DESA")} 
            className={`py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${activeTab === "DESA" ? "bg-rose-800 text-white border-rose-600 shadow-lg" : "bg-[#18291c] border-emerald-900 text-rose-500 hover:text-rose-400"}`}
          >
            <Heart size={15} /> Cari Jodoh
          </button>

          <button 
            onClick={() => setActiveTab("PASAR")} 
            className={`py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${activeTab === "PASAR" ? "bg-amber-600 text-black border-amber-400 shadow-lg" : "bg-[#18291c] border-emerald-900 text-amber-500 hover:text-amber-400"}`}
          >
            <ShoppingBag size={15} /> Pasar
          </button>
        </div>

      </div>

      {/* METRICS SYSTEM BRANDING FOOTER */}
      <div className="mt-4 text-center text-[10px] font-mono text-emerald-600 flex items-center gap-1 tracking-wider uppercase">
        🏡 ENGINE: COZY_LIFE_SIM_CORE // ARTHA STUDIO // REGION: NUSANTARA_IND
      </div>
    </div>
  );
}