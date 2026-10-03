import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BgRemover from "@/components/tools/BgRemover";

export const metadata: Metadata = {
  title: "Penghapus Latar Belakang",
  description: "Hapus latar belakang gambar di browser dan unduh hasil PNG transparan dengan resolusi asli.",
};

export default function BgRemoverPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/tools" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke katalog alat
        </Link>
        <BgRemover />
      </div>
    </div>
  );
}
