/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit2, X, Briefcase, Award, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/date";

export default function ManageDataPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'blogs'>('projects');
  const [dataList, setDataList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    const { data } = await supabase.from(activeTab).select('*');
    setDataList(data || []);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSave = async () => {
    if (activeTab === 'projects' && !formData.title) return alert("Title harus diisi!");
    if (activeTab === 'certificates' && !formData.title) return alert("Nama Sertifikat harus diisi!");

    let payload;
    if (activeTab === 'projects') {
        payload = { 
        title: formData.title,
        description: formData.description,
        link: formData.link,
        github: formData.github, 
        tech_stack: formData.tech_stack?.split(",").map((t:string) => t.trim()) 
        };
    } else if (activeTab === 'blogs') {
        payload = { 
            title: formData.title,
            author: formData.author,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category
        };
    } else {
        payload = { title: formData.title, issuer: formData.issuer, date: formData.date, link: formData.link, image: formData.image };
    }

    const table = activeTab;
    const idField = activeTab === 'projects' ? 'project_id' : 'cert_id';

    if (isEditing) {
        const { error } = await supabase.from(table).update(payload).eq(idField, isEditing);
        if (error) console.error("Update Error:", error);
    } else {
        const { error } = await supabase.from(table).insert([payload]);
        if (error) console.error("Insert Error:", error);
    }

    setFormData({ title: "", description: "", link: "", github: "", tech_stack: "", name: "", issuer: "", date: "", image: "" });
    setIsEditing(null);
    fetchData();
  };

  const deleteItem = async (id: string) => {
    const idField = activeTab === 'projects' ? 'project_id' : 'cert_id';
    await supabase.from(activeTab).delete().eq(idField, id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Switcher Tab */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-6 py-2 rounded-full ${activeTab === 'projects' ? 'bg-cyan-600' : 'bg-slate-800'}`}><Briefcase size={18}/> Projects</button>
          <button onClick={() => setActiveTab('certificates')} className={`flex items-center gap-2 px-6 py-2 rounded-full ${activeTab === 'certificates' ? 'bg-cyan-600' : 'bg-slate-800'}`}><Award size={18}/> Certificates</button>
          <button onClick={() => setActiveTab('blogs')} className={`flex items-center gap-2 px-6 py-2 rounded-full ${activeTab === 'blogs' ? 'bg-cyan-600' : 'bg-slate-800'}`}><BookOpen size={18}/> Blogs</button>
        </div>

        {/* Form Input Dinamis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-900 p-6 rounded-xl border border-white/10">
          {activeTab === 'blogs' ? (
            <>
              <input placeholder="Title" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input 
                placeholder="Author" 
                className="p-2 bg-slate-950 rounded border border-white/10" 
                value={formData.author || ""} 
                onChange={e => setFormData({...formData, author: e.target.value})} 
              />
              <input placeholder="Category" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} />
              <textarea placeholder="Excerpt" className="p-2 bg-slate-950 rounded border border-white/10 md:col-span-2" value={formData.excerpt || ""} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
              <textarea placeholder="Content" rows={5} className="p-2 bg-slate-950 rounded border border-white/10 md:col-span-2" value={formData.content || ""} onChange={e => setFormData({...formData, content: e.target.value})} />
            </>
          ) : activeTab === 'certificates' ? (
            <>
              <input placeholder="Cert Name" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input placeholder="Issuer" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.issuer || ""} onChange={e => setFormData({...formData, issuer: e.target.value})} />
              <input type="date" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input placeholder="Link" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.link || ""} onChange={e => setFormData({...formData, link: e.target.value})} />
              <input placeholder="Image URL" className="p-2 bg-slate-950 rounded border border-white/10" value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} />
            </>
          ) : (
            <>
                {/* Form */}
                <input 
                    placeholder="Title" 
                    className="p-2 bg-slate-950 rounded border border-white/10" 
                    value={formData.title || ""} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                />
                <input
                    placeholder="Description"
                    className="p-2 bg-slate-950 rounded border border-white/10"
                    value={formData.description || ""}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <input
                    placeholder="Link Demo"
                    className="p-2 bg-slate-950 rounded border border-white/10"
                    value={formData.link || ""}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                />
                <input
                    placeholder="GitHub URL"
                    className="p-2 bg-slate-950 rounded border border-white/10"
                    value={formData.github || ""}
                    onChange={e => setFormData({...formData, github: e.target.value})}
                />
                <input
                    placeholder="Tech Stack (koma)"
                    className="p-2 bg-slate-950 rounded border border-white/10 md:col-span-2"
                    value={formData.tech_stack || ""}
                    onChange={e => setFormData({...formData, tech_stack: e.target.value})}
                />
                
                {isEditing && (
                    <button onClick={() => {setIsEditing(null); setFormData({title:"", description:"", link:"", github:"", tech_stack:""})}} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-2 rounded font-bold">
                    <X size={18} /> Batal
                    </button>
                )}
            </>
          )}
          <button onClick={handleSave} className="md:col-span-2 bg-cyan-600 py-2 rounded font-bold">Save {activeTab}</button>
        </div>

        {/* Tabel List */}
        <div className="overflow-x-auto bg-slate-900 rounded-xl border border-white/10">
            <table className="w-full text-left min-w-200">
                <thead className="bg-slate-800 text-sm">
                    <tr>
                        {activeTab === 'blogs' ? (
                            <>
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Excerpt</th>
                                <th className="p-4">Content</th>
                            </>
                        ) : activeTab === 'projects' ? (
                        <>
                            <th className="p-4">Title</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Link Demo</th>
                            <th className="p-4">GitHub</th>
                            <th className="p-4">Tech Stack</th>
                        </>
                        ) : (
                        <>
                            <th className="p-4">Title</th>
                            <th className="p-4">Issuer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Link</th>
                        </>
                        )}
                        <th className="p-4 text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataList.map((item, index) => (
                        <tr key={item.project_id || item.cert_id || index} className="border-t border-white/5 hover:bg-white/5">
                        {activeTab === 'blogs' ? (
                            <>
                                <td className="p-4">{item.title}</td>
                                <td className="p-4">{item.author}</td>
                                <td className="p-4">{item.category}</td>
                                <td className="p-4 text-slate-400">{item.excerpt}</td>
                                <td className="p-4 text-slate-400">{item.content}</td>
                                <td className="p-4 flex justify-center gap-4">
                                    {/* Tombol Edit/Delete tetap sama */}
                                </td>
                            </>
                        ) : activeTab === 'projects' ? (
                            <>
                            <td className="p-4">{item.title}</td>
                            <td className="p-4 text-slate-400">{item.description}</td>
                            <td className="p-4 text-slate-400">{item.link}</td>
                            <td className="p-4 text-slate-400">{item.github}</td>
                            <td className="p-4 text-slate-400">{item.tech_stack?.join(", ")}</td>
                            </>
                        ) : (
                            <>
                            <td className="p-4">{item.title}</td>
                            <td className="p-4 text-slate-400">{item.issuer}</td>
                            <td className="p-4 text-slate-400">{formatDate(item.date)}</td>
                            <td className="p-4 text-slate-400">{item.image}</td>
                            <td className="p-4 text-slate-400">{item.link}</td>
                            </>
                        )}
                        <td className="p-4 flex justify-center gap-4">
                            <button 
                            onClick={() => {
                                setIsEditing(item.project_id || item.cert_id);
                                setFormData(item);
                            }} 
                            className="text-blue-400 hover:text-blue-300"
                            >
                            <Edit2 size={18} />
                            </button>
                            <button 
                            onClick={() => deleteItem(item.project_id || item.cert_id)} 
                            className="text-red-400 hover:text-red-300"
                            >
                            <Trash2 size={18} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}