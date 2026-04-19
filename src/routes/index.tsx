import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, ShieldCheck, Briefcase, Building2 } from "lucide-react";
import { KMSSidebar, type TabId } from "@/components/KMSSidebar";
import { DashboardView } from "@/components/DashboardView";
import { KnowledgeBaseView } from "@/components/KnowledgeBaseView";
import { ExpertLocatorView } from "@/components/ExpertLocatorView";
import { LessonsLearnedView } from "@/components/LessonsLearnedView";
import { InnovationHubView } from "@/components/InnovationHubView";
import { HelpFAQView } from "@/components/HelpFAQView";
import { BookmarksView } from "@/components/BookmarksView";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { LoginScreen } from "@/components/LoginScreen";
import { CommandPalette } from "@/components/CommandPalette";
import { useAuth, ROLE_META } from "@/hooks/use-auth";
import { t, type Language } from "@/lib/translations";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Siinqee Bank — Knowledge Management System" },
      { name: "description", content: "Siinqee Bank KMS: Access policies, connect with experts, and drive innovation across all branches." },
      { property: "og:title", content: "Siinqee Bank — Knowledge Management System" },
      { property: "og:description", content: "Access policies, connect with experts, and drive innovation across all branches." },
    ],
  }),
});

const roleIcons = { officer: Building2, manager: Briefcase, executive: ShieldCheck };

function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [lang, setLang] = useState<Language>("en");
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginScreen lang={lang} onLangChange={setLang} />;
  }

  const RoleIcon = roleIcons[user.role];

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView lang={lang} onNavigate={setActiveTab} />;
      case "knowledge-base":
        return <KnowledgeBaseView lang={lang} />;
      case "expert-locator":
        return <ExpertLocatorView lang={lang} />;
      case "lessons-learned":
        return <LessonsLearnedView lang={lang} />;
      case "innovation-hub":
        return <InnovationHubView lang={lang} />;
      case "bookmarks":
        return <BookmarksView lang={lang} onNavigate={setActiveTab} />;
      case "help-faq":
        return <HelpFAQView lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <KMSSidebar activeTab={activeTab} onTabChange={setActiveTab} lang={lang} onLangChange={setLang} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <main className={`transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-64"}`}>
        <div className="flex items-center justify-between gap-4 px-8 py-3 border-b border-border bg-card/50">
          <CommandPalette lang={lang} onNavigate={setActiveTab} />
          <div className="flex items-center gap-2">
            <NotificationsPanel lang={lang} />
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-navy-dark text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-tight">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{lang === "en" ? ROLE_META[user.role].en : ROLE_META[user.role].om}</p>
                </div>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.branch}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gold-muted text-gold font-medium">
                        <RoleIcon size={10} /> {lang === "en" ? ROLE_META[user.role].en : ROLE_META[user.role].om}
                      </span>
                    </div>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                    >
                      <LogOut size={14} /> {t(lang, "signOut")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
