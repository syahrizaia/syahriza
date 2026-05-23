"use client";
import { motion } from "framer-motion";
import { Code2, Globe, Cpu, Terminal } from "lucide-react";

const skills = [
  { name: "Frontend", icon: Code2, desc: "React, Next.js, Tailwind" },
  { name: "Backend", icon: Terminal, desc: "Supabase, Node.js, API" },
  { name: "Deployment", icon: Globe, desc: "Vercel, Docker, Git" },
  { name: "Performance", icon: Cpu, desc: "Optimasi & Web Speed" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-white">
        <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
            
                {/* Sisi Kiri: Narasi */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500">
                    Tentang Saya
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    Saya seorang pengembang web yang antusias dengan antarmuka futuristik dan performa tinggi. 
                    Fokus saya adalah menciptakan pengalaman digital yang tidak hanya fungsional, 
                    tetapi juga memanjakan mata pengguna.
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed">
                    Selalu bereksperimen dengan teknologi baru seperti Turbopack, Framer Motion, 
                    dan database modern untuk menghasilkan solusi yang skalabel.
                    </p>
                </motion.div>

                {/* Sisi Kanan: Skill Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, i) => (
                    <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/50 transition-colors"
                    >
                        <skill.icon className="text-cyan-400 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-1">{skill.name}</h3>
                        <p className="text-xs text-slate-500">{skill.desc}</p>
                    </motion.div>
                    ))}
                </div>
            </div>

            {/* Timeline Singkat */}
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-24 p-8 rounded-3xl bg-white/5 border border-white/5"
            >
                <h2 className="text-2xl font-bold mb-8 text-center text-cyan-400">Journey</h2>
                <div className="space-y-8">
                    {[
                    { year: "2026", event: "Menguasai Next.js 16 & Turbopack" },
                    { year: "2025", event: "Membangun berbagai proyek Fullstack" },
                    ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span className="font-mono text-cyan-500">{item.year}</span>
                        <span className="text-slate-300">{item.event}</span>
                    </div>
                    ))}
                </div>
            </motion.div>

            <section className="mt-24">
                <h2 className="text-2xl font-bold mb-10 text-center">Pendidikan</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                    { school: "Universitas Bina Sarana Informatika", degree: "Teknologi Informasi", year: "2022 - Sekarang" },
                    { school: "MA Al-Hikmah", degree: "Jurusan IPA", year: "2019 - 2022" },
                    ].map((edu, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-slate-900 border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-white">{edu.school}</h3>
                        <p className="text-cyan-400 text-sm mb-2">{edu.degree}</p>
                        <p className="text-slate-500 text-xs font-mono">{edu.year}</p>
                    </motion.div>
                    ))}
                </div>
            </section>

            <section className="mt-24 mb-12">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white">Di luar Koding</h2>
                    <p className="text-slate-500 mt-2">Hal-hal yang membuat otak saya tetap kreatif.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                    {["Gaming", "UI Design", "Fotografi", "Musik", "Open Source"].map((hobby) => (
                    <motion.span
                        key={hobby}
                        whileHover={{ scale: 1.1, backgroundColor: "#0891b2" }}
                        className="px-6 py-3 rounded-full border border-slate-700 text-sm font-medium text-slate-300 cursor-default hover:text-white transition-all"
                    >
                        {hobby}
                    </motion.span>
                    ))}
                </div>
            </section>

            <section className="mt-24">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white">Workflow & Tools</h2>
                    <p className="text-slate-500 mt-2">Stack yang saya gunakan untuk memastikan efisiensi.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                    { name: "VS Code", category: "Editor" },
                    { name: "Figma", category: "Design" },
                    { name: "Postman", category: "API Test" },
                    { name: "Git", category: "Version" }
                    ].map((tool, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 rounded-xl bg-slate-900 border border-white/5"
                    >
                        <div className="text-cyan-400 font-bold mb-1">{tool.name}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-600">{tool.category}</div>
                    </motion.div>
                    ))}
                </div>
            </section>

            <section className="mt-24">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative p-1 rounded-3xl bg-linear-to-r from-cyan-500 to-blue-600 overflow-hidden"
                >
                    <div className="bg-slate-950 p-12 rounded-[calc(1.5rem-4px)] text-center">
                    <h2 className="text-3xl font-bold mb-4">Mari Kita Kolaborasi!</h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        Saya selalu terbuka untuk proyek baru, diskusi teknologi, atau sekadar bertukar ide. 
                        Jangan ragu untuk menyapa!
                    </p>
                    <motion.a 
                        whileHover={{ scale: 1.05 }}
                        href="mailto:emailanda@example.com"
                        className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold transition-all"
                    >
                        Kirim Email Sekarang
                    </motion.a>
                    </div>
                </motion.div>
            </section>
        </div>
    </div>
  );
}