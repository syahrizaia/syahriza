/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date";

interface DataTableProps {
  activeTab: "projects" | "certificates" | "blogs";
  dataList: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const PRIMARY_KEYS = {
  projects: "project_id",
  certificates: "cert_id",
  blogs: "blog_id",
};

export default function DataTable({ activeTab, dataList, onEdit, onDelete }: DataTableProps) {
  const primaryKey = PRIMARY_KEYS[activeTab];

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm shadow-xl">
      <table className="w-full text-left border-collapse min-w-[750px]">
        <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
          <tr>
            {activeTab === "blogs" ? (
              <>
                <th className="p-4 w-[20%]">Title</th>
                <th className="p-4 w-[15%]">Author</th>
                <th className="p-4 w-[15%]">Category</th>
                <th className="p-4 w-[25%]">Excerpt</th>
                <th className="p-4 w-[15%]">Content</th>
              </>
            ) : activeTab === "projects" ? (
              <>
                <th className="p-4 w-[20%]">Title</th>
                <th className="p-4 w-[25%]">Description</th>
                <th className="p-4 w-[15%]">Link Demo</th>
                <th className="p-4 w-[15%]">GitHub</th>
                <th className="p-4 w-[15%]">Tech Stack</th>
              </>
            ) : (
              <>
                <th className="p-4 w-[25%]">Title</th>
                <th className="p-4 w-[20%]">Issuer</th>
                <th className="p-4 w-[15%]">Date</th>
                <th className="p-4 w-[15%]">Image URL</th>
                <th className="p-4 w-[15%]">Link</th>
              </>
            )}
            <th className="p-4 text-center w-[10%]">Action</th>
          </tr>
        </thead>

        <tbody className="text-sm divide-y divide-white/5">
          {dataList.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500 font-mono text-xs">
                Tidak ada data tersedia.
              </td>
            </tr>
          ) : (
            dataList.map((item, index) => {
              const itemID = item[primaryKey] || index;

              return (
                <tr key={itemID} className="hover:bg-white/[0.02] transition-colors">
                  {activeTab === "blogs" ? (
                    <>
                      <td className="p-4 font-medium truncate max-w-[150px]">{item.title}</td>
                      <td className="p-4 text-slate-300 truncate max-w-[120px]">{item.author}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">{item.category}</span></td>
                      <td className="p-4 text-slate-400 truncate max-w-[200px]">{item.excerpt}</td>
                      <td className="p-4 text-slate-400 truncate max-w-[150px]">{item.content}</td>
                    </>
                  ) : activeTab === "projects" ? (
                    <>
                      <td className="p-4 font-medium truncate max-w-[150px]">{item.title}</td>
                      <td className="p-4 text-slate-400 truncate max-w-[200px]">{item.description}</td>
                      <td className="p-4 text-cyan-400 font-mono text-xs truncate max-w-[120px]">{item.link || "-"}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs truncate max-w-[120px]">{item.github || "-"}</td>
                      <td className="p-4 text-slate-400 truncate max-w-[150px]">{Array.isArray(item.tech_stack) ? item.tech_stack.join(", ") : "-"}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-medium truncate max-w-[180px]">{item.title}</td>
                      <td className="p-4 text-slate-300 truncate max-w-[150px]">{item.issuer}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{item.date ? formatDate(item.date) : "-"}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs truncate max-w-[120px]">{item.image || "-"}</td>
                      <td className="p-4 text-cyan-400 font-mono text-xs truncate max-w-[120px]">{item.link || "-"}</td>
                    </>
                  )}

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(itemID)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}