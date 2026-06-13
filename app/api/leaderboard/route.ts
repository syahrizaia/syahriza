/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mapping ID Gift ke nominal Rupiah asli sesuai di Widget
const GIFT_PRICES: Record<number, number> = {
  1: 2000,   // Kopi Koding
  2: 10000,  // Overclock Engine
  3: 35000,  // Kartu Uno Reverse
  4: 75000,  // Satelit Mata-Mata
  5: 250000, // Server Takeover
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe") || "daily";

  try {
    const now = new Date();
    let query = supabase.from("gift_transactions").select("*");

    // 1. FILTER WAKTU BERDASARKAN TAB YANG DIPILIH
    if (timeframe === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      query = query.gte("created_at", startOfDay);
    } else if (timeframe === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
      query = query.gte("created_at", startOfWeek);
    } else if (timeframe === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      query = query.gte("created_at", startOfMonth);
    } else if (timeframe === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
      query = query.gte("created_at", startOfYear);
    }

    const { data: transactions, error } = await query;
    if (error) throw error;

    // 2. AMBIL DATA BULAN INI KHUSUS UNTUK GLOBAL HYPE METER
    const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: monthTransactions, error: monthError } = await supabase
      .from("gift_transactions")
      .select("*")
      .gte("created_at", startOfCurrentMonth);

    if (monthError) throw monthError;

    // 3. AGREGASI DATA UNTUK LIST LEADERBOARD
    const leaderboardMap: Record<string, { giver_name: string; total_spent: number; total_gifts: number; is_anonymous: boolean }> = {};

    transactions?.forEach((tx) => {
      const name = tx.giver_name || "Hamba Allah";
      const price = GIFT_PRICES[tx.gift_id] || 0;
      // Otomatis tandai anonim jika menggunakan nama samaran bawaan widget
      const isAnon = name.toLowerCase() === "hamba allah" || name.toLowerCase().includes("anon");

      if (!leaderboardMap[name]) {
        leaderboardMap[name] = { giver_name: name, total_spent: 0, total_gifts: 0, is_anonymous: isAnon };
      }
      leaderboardMap[name].total_spent += price;
      leaderboardMap[name].total_gifts += 1;
    });

    // Urutkan dari pengirim nominal terbesar
    const leaderboard = Object.values(leaderboardMap).sort((a, b) => b.total_spent - a.total_spent);

    // 4. KALKULASI TOTAL METRICS UNTUK HYPE METER & HERO BULAN INI
    let globalHypePool = 0;
    const monthHeroMap: Record<string, number> = {};

    monthTransactions?.forEach((tx) => {
      const price = GIFT_PRICES[tx.gift_id] || 0;
      globalHypePool += price;

      const name = tx.giver_name || "Hamba Allah";
      monthHeroMap[name] = (monthHeroMap[name] || 0) + price;
    });

    let communityHero = "Belum Ada";
    let maxSpent = 0;
    Object.entries(monthHeroMap).forEach(([name, spent]) => {
      if (spent > maxSpent && name !== "Hamba Allah") {
        maxSpent = spent;
        communityHero = name;
      }
    });

    return NextResponse.json({ leaderboard, globalHypePool, communityHero });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}