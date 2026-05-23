"use client";
import { motion } from "framer-motion";
import { Code2, Globe, Cpu, Terminal, Sparkles, Briefcase } from "lucide-react";

const skills = [
  { name: "Frontend", icon: Code2, desc: "React, Next.js, Tailwind" },
  { name: "Backend", icon: Terminal, desc: "Supabase, Node.js, API" },
  { name: "Deployment", icon: Globe, desc: "Vercel, Docker, Git" },
  { name: "Performance", icon: Cpu, desc: "Optimasi & Web Speed" },
];

const experiences = [
  {
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "2023 - Sekarang",
    description: "Membangun berbagai landing page dan aplikasi web modern yang responsif. Berfokus pada animasi UI/UX yang mulus dan optimasi performa menggunakan ekosistem React.",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    role: "Freelance Technical Writer",
    company: "BHT",
    period: "Dec 2025 - Jan 2026",
    description: "Menyusun berbagai bentuk dokumentasi teknis, seperti user manuals, API documentation, hingga white papers, dengan menyederhanakan istilah teknis yang kompleks menjadi informasi yang mudah dipahami tanpa menghilangkan aspek esensialnya. Dalam menjalankan tugasnya, mereka melakukan kolaborasi erat dengan tim engineering atau product untuk mendalami cara kerja sistem, sekaligus memastikan konsistensi gaya bahasa, tata bahasa, dan alur logis pada setiap dokumen yang dibuat agar pesan tersampaikan secara akurat dan efektif kepada audiens.",
    techStack: ["Video Editor", "MS Word", "UAT"],
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 px-6 py-24 text-white overflow-hidden z-0">        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
           <motion.div 
             animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]"
           />
           <motion.div 
             animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"
           />
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-indigo-600/10 rounded-full blur-[100px]"
           />
        </div>

        {/* Floating Particles */}
        <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }} 
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-32 right-32 text-cyan-500/30"
        >
            <Sparkles size={24} />
        </motion.div>

        <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Sisi Kiri: Narasi */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Aksen Garis Kecil di Kiri Judul */}
                    <div className="absolute -left-6 top-2 w-1 h-12 bg-linear-to-b from-cyan-500 to-transparent rounded-full hidden md:block"></div>
                    
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500 tracking-tight">
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
                        whileHover={{ y: -10, boxShadow: "0 10px 30px -10px rgba(6,182,212,0.3)" }}
                        className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
                    >
                        <skill.icon className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" size={32} />
                        <h3 className="font-bold text-lg mb-1 text-slate-200 group-hover:text-white transition-colors">{skill.name}</h3>
                        <p className="text-xs text-slate-500">{skill.desc}</p>
                    </motion.div>
                    ))}
                </div>
            </div>

            {/* Divider Estetik */}
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 64 }}
                viewport={{ once: true }}
                className="w-[1px] bg-linear-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 mx-auto my-16"
            />

            {/* Timeline Singkat */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-slate-900/40 backdrop-blur-lg border border-white/5 relative overflow-hidden"
            >
                {/* Efek kilau di sudut card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
                
                <h2 className="text-2xl font-bold mb-8 text-center text-cyan-400">Journey</h2>
                <div className="space-y-8 relative">
                    {/* Garis vertikal timeline */}
                    <div className="absolute left-1 top-2 bottom-2 w-[4px] bg-white/40"></div>
                    
                    {[
                    { year: "2026", event: "Menguasai Next.js 16 & Turbopack" },
                    { year: "2025", event: "Membangun berbagai proyek Fullstack" },
                    ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start relative z-10 group">
                        <div className="w-3 h-3 rounded-full bg-cyan-500 mt-1.5 shadow-[0_0_10px_#06b6d4] group-hover:scale-125 transition-transform" />
                        <div>
                            <span className="block font-mono text-cyan-400 text-sm mb-1">{item.year}</span>
                            <span className="text-slate-300">{item.event}</span>
                        </div>
                    </div>
                    ))}
                </div>
            </motion.div>

            {/* Divider Estetik */}
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 64 }}
                viewport={{ once: true }}
                className="w-[1px] bg-linear-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 mx-auto my-16"
            />

            {/* Pengalaman Pekerjaan */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white inline-flex items-center gap-2 relative">
                        <Briefcase className="text-cyan-400" size={24} />
                        Pengalaman Pekerjaan
                        <div className="absolute -bottom-2 left-1/4 right-1/4 h-[2px] bg-cyan-500/50 blur-[1px]"></div>
                    </h2>
                </div>
                
                <div className="space-y-6">
                    {experiences.map((exp, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ borderColor: "rgba(6,182,212,0.3)" }}
                        className="p-6 md:p-8 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/5 transition-all group relative overflow-hidden"
                    >
                        {/* Aksen gradient saat hover */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{exp.role}</h3>
                                <p className="text-slate-400 font-medium">{exp.company}</p>
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-950/50 border border-slate-800 text-xs font-mono text-cyan-400 whitespace-nowrap">
                                {exp.period}
                            </span>
                        </div>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {exp.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            {exp.techStack.map((tech, j) => (
                                <span key={j} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-300 border border-white/5">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                    ))}
                </div>
            </section>

            {/* Divider Estetik */}
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 64 }}
                viewport={{ once: true }}
                className="w-[1px] bg-linear-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 mx-auto my-16"
            />

            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white inline-block relative">
                        Pendidikan
                        <div className="absolute -bottom-2 left-1/4 right-1/4 h-[2px] bg-cyan-500/50 blur-[1px]"></div>
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                    { school: "Universitas Bina Sarana Informatika", degree: "Teknologi Informasi", year: "2022 - Sekarang" },
                    { school: "MA Al-Hikmah", degree: "Jurusan IPA", year: "2019 - 2022" },
                    ].map((edu, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(6,182,212,0.4)" }}
                        className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/5 transition-all"
                    >
                        <h3 className="text-lg font-bold text-white">{edu.school}</h3>
                        <p className="text-cyan-400 text-sm mb-2">{edu.degree}</p>
                        <p className="text-slate-500 text-xs font-mono bg-slate-950/50 inline-block px-2 py-1 rounded">{edu.year}</p>
                    </motion.div>
                    ))}
                </div>
            </section>

            {/* Divider Estetik */}
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 64 }}
                viewport={{ once: true }}
                className="w-[1px] bg-linear-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 mx-auto my-16"
            />

            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white">Di luar Koding</h2>
                    <p className="text-slate-500 mt-2 text-sm">Hal-hal yang membuat otak saya tetap kreatif.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                    {["Gaming", "UI Design", "Fotografi", "Musik", "Open Source"].map((hobby, i) => (
                    <motion.span
                        key={hobby}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1, backgroundColor: "#0891b2", borderColor: "#06b6d4" }}
                        className="px-6 py-3 rounded-full border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm text-sm font-medium text-slate-300 cursor-default hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300"
                    >
                        {hobby}
                    </motion.span>
                    ))}
                </div>
            </section>

            {/* Divider Estetik */}
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 64 }}
                viewport={{ once: true }}
                className="w-[1px] bg-linear-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 mx-auto my-16"
            />

            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white">Workflow & Tools</h2>
                    <p className="text-slate-500 mt-2 text-sm">Stack yang saya gunakan untuk memastikan efisiensi.</p>
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="text-center p-4 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 transition-all group"
                    >
                        <div className="text-cyan-400 font-bold mb-1 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">{tool.name}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-slate-400">{tool.category}</div>
                    </motion.div>
                    ))}
                </div>
            </section>

            <section className="mt-32">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative p-[1px] rounded-3xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)]"
                >
                    <div className="bg-slate-950/90 backdrop-blur-xl p-12 rounded-[calc(1.5rem-1px)] text-center relative overflow-hidden">
                        {/* Aksen cahaya melintang */}
                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg] animate-[shimmer_3s_infinite]"></div>
                        
                        <h2 className="text-3xl font-bold mb-4 relative z-10">Mari Kita Kolaborasi!</h2>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-10">
                            Saya selalu terbuka untuk proyek baru, diskusi teknologi, atau sekadar bertukar ide. 
                            Jangan ragu untuk menyapa!
                        </p>
                        <motion.a 
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            href="mailto:syahrizaalsistani@gmail.com"
                            className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all relative z-10"
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