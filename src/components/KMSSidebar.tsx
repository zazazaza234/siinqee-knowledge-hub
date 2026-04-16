import { LayoutDashboard, BookOpen, Users, Lightbulb, GraduationCap, Globe } from "lucide-react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";

export type TabId = "dashboard" | "knowledge-base" | "expert-locator" | "lessons-learned" | "innovation-hub";

const navItems: { id: TabId; icon: typeof LayoutDashboard; labelKey: keyof typeof import("@/lib/translations").translations.en }[] = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { id: "knowledge-base", icon: BookOpen, labelKey: "knowledgeBase" },
  { id: "expert-locator", icon: Users, labelKey: "expertLocator" },
  { id: "lessons-learned", icon: GraduationCap, labelKey: "lessonsLearned" },
  { id: "innovation-hub", icon: Lightbulb, labelKey: "innovationHub" },
];

interface KMSSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function KMSSidebar({ activeTab, onTabChange, lang, onLangChange, collapsed, onToggleCollapse }: KMSSidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
          <span className="text-navy-dark font-display font-bold text-sm">SB</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-sm text-sidebar-foreground leading-tight">{t(lang, "appName")}</p>
            <p className="text-[10px] text-sidebar-foreground/50 leading-tight">{t(lang, "appSubtitle")}</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon size={18} className={active ? "text-sidebar-primary" : ""} />
              {!collapsed && <span>{t(lang, item.labelKey)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="px-3 pb-3 space-y-2">
        <button
          onClick={() => onLangChange(lang === "en" ? "am" : "en")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          <Globe size={18} />
          {!collapsed && <span>{lang === "en" ? "አማርኛ" : "English"}</span>}
        </button>
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform ${collapsed ? "rotate-180" : ""}`}>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
