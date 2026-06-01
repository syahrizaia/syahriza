/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatDate } from "@/lib/date";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from("blogs").select("*").eq("id", id).single();
      if (data) setPost(data);
    }
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-center py-20 text-white">Memuat artikel...</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-24 px-6 text-white">
      <div className="max-w-3xl mx-auto">
        
        {/* Tombol Kembali */}
        <Link href="/blogs" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all mb-8">
          <ArrowLeft size={18} /> Kembali ke daftar blog
        </Link>

        {/* Artikel Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Metadata Artikel */}
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2"><User size={16} /> {post.author}</div>
              <div className="flex items-center gap-2"><Calendar size={16} /> {formatDate(post.created_at)}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {post.read_time}</div>
            </div>
          </div>

          {/* Konten Artikel */}
          <div className="prose prose-invert prose-lg prose-cyan max-w-none">
            <p className="text-slate-300 leading-relaxed">
              Laravel 10 membawa berbagai pembaruan yang membuat pengembangan web menjadi lebih efisien dan menyenangkan. Dalam artikel ini, kita akan membahas arsitektur tiga tingkat dan implementasinya pada aplikasi pameran foto...
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Mengapa Laravel 10?</h2>
            <p className="text-slate-300 leading-relaxed">
              Pemisahan yang jelas antara <em>frontend</em>, <em>backend</em>, dan <em>database</em> memberikan skalabilitas yang lebih baik. Laravel 10 menyediakan ekosistem yang sangat matang untuk menangani logika bisnis yang kompleks dengan sintaks yang elegan.
            </p>

            <div className="my-8 p-6 bg-slate-900 border-l-4 border-cyan-500 rounded-r-xl">
              <p className="text-cyan-100 italic">&quot;Teknologi web modern memungkinkan kita untuk menghadirkan pengalaman pameran fisik ke dalam ruang digital yang lebih inklusif.&quot;</p>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}