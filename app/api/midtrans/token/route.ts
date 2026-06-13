import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phoneNumber, amount } = await await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Nomor HP wajib diisi" }, { status: 400 });
    }

    // Buat ID pesanan unik
    const orderId = `TRACK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    
    // Encode Server Key ke Base64 untuk Otentikasi Midtrans
    const encodedServerKey = Buffer.from(serverKey + ":").toString("base64");

    // Payload data transaksi sesuai dokumentasi Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: "PREMIUM-HLR",
          price: amount,
          quantity: 1,
          name: `Akses Premium Modul Pelacak: ${phoneNumber}`,
        },
      ],
    };

    // Panggil API Midtrans Sandbox
    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${encodedServerKey}`,
      },
      body: JSON.stringify(parameter),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error_messages?.[0] || "Gagal ke Midtrans" }, { status: 500 });
    }

    // Kembalikan token SNAP ke Frontend
    return NextResponse.json({ token: data.token, orderId });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}