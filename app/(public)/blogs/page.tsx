/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatDate } from "@/utils/date";
import { supabase } from "@/utils/supabase";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// const blogPosts = [
//   {
//     id: 1,
//     title: "Membangun Aplikasi Web Modern dengan Laravel 10",
//     excerpt: "Panduan praktis dalam memanfaatkan fitur terbaru Laravel 10 untuk sistem yang efisien.",
//     date: "23 Mei 2026",
//     readTime: "5 min read",
//     category: "Development"
//   },
//   {
//     id: 2,
//     title: "Pentingnya Aksesibilitas Web (WCAG) di Era Digital",
//     excerpt: "Mengapa desain inklusif bukan lagi sekadar pilihan, melainkan keharusan bagi pengembang.",
//     date: "15 Mei 2026",
//     readTime: "4 min read",
//     category: "UI/UX"
//   },
//   {
//     id: 3,
//     title: "Optimasi Performa Gambar dengan Lazy Loading",
//     excerpt: "Teknik krusial untuk menjaga kecepatan loading galeri foto yang berat.",
//     date: "02 Mei 2026",
//     readTime: "3 min read",
//     category: "Performance"
//   }
// ];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (data) setPosts(data);
    }
    fetchBlogs();
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-950 py-24 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500">
            Catatan Teknis
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Berbagi pengalaman seputar pengembangan web, aksesibilitas, dan teknologi.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl bg-slate-900/50 border border-white/10 p-6 hover:border-cyan-500/50 transition-all hover:-translate-y-2"
            >
              <span className="text-cyan-400 text-sm font-semibold">{post.category}</span>
              <h2 className="text-xl font-bold mt-2 mb-3 leading-tight">{post.title}</h2>
              <p className="text-slate-400 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex items-center justify-between mt-auto text-slate-500 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(post.created_at)}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.read_time}</span>
                </div>
              </div>
              
              <Link href={`/blogs/${post.id}`} className="mt-6 flex items-center gap-2 text-cyan-400 font-bold text-sm group-hover:gap-3 transition-all">
                Baca Selengkapnya <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}