"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

interface Project {
  project_id: string;
  title: string;
  description: string;
  tech_stack: string[];
  link: string;
  github: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from('projects').select('*');
      setProjects(data || []);
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-linear-to-r from-white to-cyan-500"
        >
          My Projects
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.project_id ?? idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Glowing effect saat hover */}
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
              
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-slate-400 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech_stack?.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs font-mono rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {tech}
                  </span>
                )) || null}
              </div>

              <div className="flex gap-4 relative z-10">
                <Link href={project.link} target="_blank" className="flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors">
                  <ExternalLink size={16} /> Live Demo
                </Link>
                <Link href={project.github} target="_blank" className="flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors">
                  <FaGithub size={16} /> Code
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}