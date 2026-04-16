import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KMSSidebar, type TabId } from "@/components/KMSSidebar";
import { DashboardView } from "@/components/DashboardView";
import { KnowledgeBaseView } from "@/components/KnowledgeBaseView";
import { ExpertLocatorView } from "@/components/ExpertLocatorView";
import { LessonsLearnedView } from "@/components/LessonsLearnedView";
import { InnovationHubView } from "@/components/InnovationHubView";
import type { Language } from "@/lib/translations";

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

function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [lang, setLang] = useState<Language>("en");
  const [collapsed, setCollapsed] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView lang={lang} />;
      case "knowledge-base":
        return <KnowledgeBaseView lang={lang} />;
      case "expert-locator":
        return <ExpertLocatorView lang={lang} />;
      case "lessons-learned":
        return <LessonsLearnedView lang={lang} />;
      case "innovation-hub":
        return <InnovationHubView lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <KMSSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onLangChange={setLang}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <main
        className={`transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-64"}`}
      >
        <div className="max-w-6xl mx-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
