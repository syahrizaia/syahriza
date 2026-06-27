/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Plus, Save } from "lucide-react";

interface DynamicFormProps {
  activeTab: "projects" | "certificates" | "blogs";
  formData: any;
  setFormData: (data: any) => void;
  isEditing: string | null;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function DynamicForm({
  activeTab,
  formData,
  setFormData,
  isEditing,
  isSubmitting,
  onSave,
  onCancel,
}: DynamicFormProps) {
  const getLabel = () => {
    if (activeTab === "projects") return "Projects";
    if (activeTab === "certificates") return "Certificates";
    return "Blogs";
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
        {isEditing ? `📝 Edit ${getLabel()}` : `✨ Tambah ${getLabel()}`}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeTab === "blogs" && (
          <>
            <input placeholder="Blog Title" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input placeholder="Author" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.author || ""} onChange={e => setFormData({...formData, author: e.target.value})} />
            <input placeholder="Category" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors md:col-span-2" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} />
            <textarea placeholder="Excerpt (Ringkasan Singkat)" rows={2} className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors md:col-span-2" value={formData.excerpt || ""} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
            <textarea placeholder="Content (Konten Utama)" rows={5} className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors md:col-span-2" value={formData.content || ""} onChange={e => setFormData({...formData, content: e.target.value})} />
          </>
        )}

        {activeTab === "certificates" && (
          <>
            <input placeholder="Certificate Name" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors md:col-span-2" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input placeholder="Issuer / Penyelenggara" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.issuer || ""} onChange={e => setFormData({...formData, issuer: e.target.value})} />
            <input type="date" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} />
            <input placeholder="Credential Link" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.link || ""} onChange={e => setFormData({...formData, link: e.target.value})} />
            <input placeholder="Image URL" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} />
          </>
        )}

        {activeTab === "projects" && (
          <>
            <input placeholder="Project Title" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input placeholder="Description" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            <input placeholder="Demo Live Link" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.link || ""} onChange={e => setFormData({...formData, link: e.target.value})} />
            <input placeholder="GitHub Repository URL" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors" value={formData.github || ""} onChange={e => setFormData({...formData, github: e.target.value})} />
            <input placeholder="Tech Stack (Pisahkan dengan koma)" className="p-2.5 bg-slate-950 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition-colors md:col-span-2" value={formData.tech_stack || ""} onChange={e => setFormData({...formData, tech_stack: e.target.value})} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-sm rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <X size={16} /> Batal
          </button>
        )}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSave}
          className="w-full sm:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 active:scale-95 text-sm rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-600/10"
        >
          {isSubmitting ? "Saving..." : isEditing ? <><Save size={16}/> Update Data</> : <><Plus size={16}/> Save Data</>}
        </button>
      </div>
    </div>
  );
}