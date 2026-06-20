import { Briefcase, Award, BookOpen } from "lucide-react";

const TAB_CONFIG = {
  projects: { label: "Projects", icon: Briefcase },
  certificates: { label: "Certificates", icon: Award },
  blogs: { label: "Blogs", icon: BookOpen },
};

type TabType = keyof typeof TAB_CONFIG;

interface TabSwitcherProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
  return (
    <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide snap-x border-b border-white/5">
      {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => {
        const config = TAB_CONFIG[tab];
        const Icon = config.icon;
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 snap-start cursor-pointer ${
              isActive
                ? "bg-cyan-600 shadow-lg shadow-cyan-600/20"
                : "bg-slate-900 border border-white/5 hover:bg-slate-800"
            }`}
          >
            <Icon size={16} /> {config.label}
          </button>
        );
      })}
    </div>
  );
}