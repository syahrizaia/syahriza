export type FrameColorId = "dark" | "light" | "pink" | "cyber";
export type StickerThemeId = "none" | "love" | "cyberpunk" | "sparkle" | "vintage";

export interface FrameOption {
  id: FrameColorId;
  name: string;
  bgClass: string;
  hexColor: string;
  textColor: string;
}

export interface StickerTheme {
  id: StickerThemeId;
  name: string;
  description: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  { id: "dark", name: "Midnight Black", bgClass: "bg-slate-900", hexColor: "#0f172a", textColor: "#94a3b8" },
  { id: "light", name: "Pure White", bgClass: "bg-white", hexColor: "#ffffff", textColor: "#64748b" },
  { id: "pink", name: "Sweet Sakura", bgClass: "bg-pink-900", hexColor: "#500724", textColor: "#f472b6" },
  { id: "cyber", name: "Neon Matrix", bgClass: "bg-purple-950", hexColor: "#2e1065", textColor: "#22d3ee" },
];

export const STICKER_THEMES: StickerTheme[] = [
  { id: "none", name: "Polos / Minimalis", description: "Hanya bingkai warna murni" },
  { id: "love", name: "🌸 Lovely Pink", description: "Hiasan kelopak sakura dan hati" },
  { id: "cyberpunk", name: "⚡ Y2K Cyber", description: "Gaya futuristik dengan crosshair neon" },
  { id: "sparkle", name: "✨ Party Magic", description: "Bintang emas dan kilauan pesta" },
  { id: "vintage", name: "🎞️ Retro Film", description: "Bingkai rol film analog klasik" },
];