import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi client Supabase sisi server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { giverName, giftId } = await request.json();

    if (!giverName || !giftId) {
      return NextResponse.json({ error: "Data nama atau ID gift tidak valid" }, { status: 400 });
    }

    // Force simulasikan transaksi langsung masuk ke database Supabase
    const { data, error } = await supabase
      .from("gift_transactions")
      .insert([
        { 
          giver_name: giverName.trim(), 
          gift_id: giftId 
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Gift berhasil terkirim dan tercatat!", data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}