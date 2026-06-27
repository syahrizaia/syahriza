/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { targetPhone } = await request.json();

    if (!targetPhone) {
      return NextResponse.json(
        { message: "Nomor tujuan wajib diisi" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const galleryLink = `${baseUrl}/tools/photo-booth/${targetPhone}`;
    const messageText = `Halo! Keseruan fotomu di WhisperBooth sudah siap digital nih ✨\n\nLihat dan unduh foto strip milikmu langsung melalui link album pribadimu di sini:\n👉 ${galleryLink}\n\nTerima kasih sudah berbagi momen serumu! ❤️`;

    const gatewayUrl = "https://api.fonnte.com/send";
    const gatewayToken = process.env.WHATSAPP_GATEWAY_TOKEN;

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        Authorization: gatewayToken || "",
      },
      body: new URLSearchParams({
        target: targetPhone,
        message: messageText,
      }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.status) {
      throw new Error(resData.reason || "Terjadi kesalahan pada server gateway");
    }

    return NextResponse.json({ success: true, data: resData });

  } catch (error: any) {
    console.error("WA Gateway Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}