"use client";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/date";

interface Certificate {
  cert_id: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  image?: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      const { data, error } = await supabase.from('certificates').select('*').order('date', { ascending: false });
      if (error) console.error("Error fetching certificates:", error);
      else setCertificates(data || []);
      setLoading(false);
    }
    fetchCertificates();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500"
        >
          My Certificates
        </motion.h1>
        <p className="text-slate-400 mb-12">Validasi kompetensi dan pembelajaran berkelanjutan.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.cert_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Gambar Sertifikat */}
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-cyan-900/20 z-10 group-hover:bg-transparent transition-colors duration-300" />
                <Image 
                  src={cert.image || "/placeholder-cert.png"} 
                  alt={cert.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Konten */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Award size={16} />
                  <span className="text-xs font-mono">{cert.issuer}</span>
                </div>
                <h3 className="text-lg font-bold mb-4">{cert.title}</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Calendar size={14} />
                    {formatDate(cert.date)}
                  </div>
                  <Link
                    href={cert.link} 
                    className="p-2 rounded-full bg-slate-800 hover:bg-cyan-500 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}