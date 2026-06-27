/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TabSwitcher from "@/components/manage/TabSwitcher";
import DynamicForm from "@/components/manage/DynamicForm";
import DataTable from "@/components/manage/DataTable";

const PRIMARY_KEYS = {
  projects: "project_id",
  certificates: "cert_id",
  blogs: "blog_id",
};

type TabType = keyof typeof PRIMARY_KEYS;

export default function ManageDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [dataList, setDataList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from(activeTab)
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error(`Error fetching ${activeTab}:`, error);
    else setDataList(data || []);
  };

  useEffect(() => {
    handleReset();
    fetchData();
  }, [activeTab]);

  const handleReset = () => {
    setFormData({});
    setIsEditing(null);
  };

  const handleEditTrigger = (item: any) => {
    const primaryKey = PRIMARY_KEYS[activeTab];
    setIsEditing(item[primaryKey]);
    setFormData({
      ...item,
      tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack.join(", ") : item.tech_stack || "",
    });
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      alert(`${activeTab === "certificates" ? "Nama Sertifikat" : "Title"} wajib diisi!`);
      return;
    }

    setIsSubmitting(true);
    let payload: any = {};

    if (activeTab === "projects") {
      payload = {
        title: formData.title,
        description: formData.description || "",
        link: formData.link || "",
        github: formData.github || "",
        tech_stack: formData.tech_stack ? formData.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      };
    } else if (activeTab === "blogs") {
      payload = {
        title: formData.title,
        author: formData.author || "Anonymous",
        excerpt: formData.excerpt || "",
        content: formData.content || "",
        category: formData.category || "General",
      };
    } else if (activeTab === "certificates") {
      payload = {
        title: formData.title,
        issuer: formData.issuer || "",
        date: formData.date || null,
        link: formData.link || "",
        image: formData.image || "",
      };
    }

    const primaryKey = PRIMARY_KEYS[activeTab];

    try {
      if (isEditing) {
        const { error } = await supabase.from(activeTab).update(payload).eq(primaryKey, isEditing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(activeTab).insert([payload]);
        if (error) throw error;
      }
      handleReset();
      fetchData();
    } catch (err: any) {
      alert(`Gagal menyimpan data: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    const primaryKey = PRIMARY_KEYS[activeTab];
    const { error } = await supabase.from(activeTab).delete().eq(primaryKey, id);
    
    if (error) console.error("Delete Error:", error);
    else fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-white pt-24 md:pt-28 selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto space-y-6">
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <DynamicForm 
          activeTab={activeTab}
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onSave={handleSave}
          onCancel={handleReset}
        />

        <DataTable 
          activeTab={activeTab}
          dataList={dataList}
          onEdit={handleEditTrigger}
          onDelete={deleteItem}
        />
      </div>
    </div>
  );
}