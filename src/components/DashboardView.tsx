import { Search, FileText, Users, Lightbulb, GitBranch, ArrowRight, Clock, X, BookOpen, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { quickLinks, branchInsights, documents, experts, lessons } from "@/lib/dummy-data";
import type { TabId } from "@/components/KMSSidebar";
import { useAuth, ROLE_META, type Role } from "@/hooks/use-auth";
import { useActivity, trackActivity, type ActivityType } from "@/hooks/use-activity";

interface DashboardViewProps {
  lang: Language;
  onNavigate?: (tab: TabId) => void;
}

const allStats = [
  { key: "totalDocuments" as const, value: "2,847", icon: FileText, change: "+12%", roles: ["officer", "manager", "executive"] as Role[] },
  { key: "activeExperts" as const, value: "156", icon: Users, change: "+5", roles: ["officer", "manager", "executive"] as Role[] },
  { key: "ideasSubmitted" as const, value: "89", icon: Lightbulb, change: "+23%", roles: ["manager", "executive"] as Role[] },
  { key: "branchUpdates" as const, value: "34", icon: GitBranch, change: "This week", roles: ["manager", "executive"] as Role[] },
];

const activityIcons: Record<ActivityType, typeof FileText> = {
  document: FileText, expert: Users, lesson: BookOpen, idea: Lightbulb, quicklink: Star,
};
const activityTabs: Record<ActivityType, TabId> = {
  document: "knowledge-base", expert: "expert-locator", lesson: "lessons-learned", idea: "innovation-hub", quicklink: "knowledge-base",
};

function timeAgo(ts: number, lang: Language): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return lang === "en" ? "just now" : "amma";
  if (m < 60) return lang === "en" ? `${m}m ago` : `Daqiiqaa ${m} dura`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "en" ? `${h}h ago` : `Sa'aa ${h} dura`;
  const d = Math.floor(h / 24);
  return lang === "en" ? `${d}d ago` : `Guyyaa ${d} dura`;
}

type SearchResult = {
  type: "document" | "expert" | "quicklink" | "lesson";
  titleEn: string;
  titleAm: string;
  subtitleEn: string;
  subtitleAm: string;
};

export function DashboardView({ lang, onNavigate }: DashboardViewProps) {
  const [search, setSearch] = useState("");
  const [selectedQuickLink, setSelectedQuickLink] = useState<typeof quickLinks[number] | null>(null);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (search.length < 2) return [];
    const q = search.toLowerCase();
    const results: SearchResult[] = [];

    documents.forEach((doc) => {
      if (doc.title.toLowerCase().includes(q) || doc.titleAm.includes(q) || doc.dept.toLowerCase().includes(q)) {
        results.push({ type: "document", titleEn: doc.title, titleAm: doc.titleAm, subtitleEn: doc.dept, subtitleAm: doc.deptAm });
      }
    });

    experts.forEach((exp) => {
      const allText = [exp.name, exp.nameAm, exp.title, exp.titleAm, ...exp.tags, ...exp.tagsAm].join(" ").toLowerCase();
      if (allText.includes(q)) {
        results.push({ type: "expert", titleEn: exp.name, titleAm: exp.nameAm, subtitleEn: exp.title, subtitleAm: exp.titleAm });
      }
    });

    quickLinks.forEach((link) => {
      if (link.titleEn.toLowerCase().includes(q) || link.titleAm.includes(q) || link.descEn.toLowerCase().includes(q)) {
        results.push({ type: "quicklink", titleEn: link.titleEn, titleAm: link.titleAm, subtitleEn: link.dept, subtitleAm: link.deptAm });
      }
    });

    lessons.forEach((lesson) => {
      if (lesson.titleEn.toLowerCase().includes(q) || lesson.titleAm.includes(q) || lesson.category.toLowerCase().includes(q)) {
        results.push({ type: "lesson", titleEn: lesson.titleEn, titleAm: lesson.titleAm, subtitleEn: lesson.category, subtitleAm: lesson.categoryAm });
      }
    });

    return results.slice(0, 8);
  }, [search]);

  const typeIcons = { document: FileText, expert: Users, quicklink: Star, lesson: BookOpen };
  const typeLabels = { document: "Document", expert: "Expert", quicklink: "Quick Link", lesson: "Lesson" };
  const { user } = useAuth();
  const { activity, clear } = useActivity();
  const stats = useMemo(() => allStats.filter((s) => !user || s.roles.includes(user.role)), [user]);
  const roleLabel = user ? (lang === "en" ? ROLE_META[user.role].en : ROLE_META[user.role].om) : "";

  return (
    <div className="space-y-8">
      {/* Welcome & Search */}
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-display font-bold text-foreground">
          {t(lang, "welcomeBack")}, {user?.name || "Friend"} 👋
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-1 flex flex-wrap items-center gap-2">
          {user && (
            <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-gold-muted text-gold font-medium">
              {roleLabel} · {user.branch}
            </span>
          )}
          <span>{lang === "en" ? "Access knowledge, connect with experts, and drive innovation." : "Beekumsa argadhu, ogeessota waliin walqunnami, kalaqa onnachiisi."}</span>
        </p>
      </div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
        <Search className="absolute left-4 top-4 text-muted-foreground" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t(lang, "searchPlaceholder")}
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm shadow-sm transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        )}

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {search.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto"
            >
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">{t(lang, "noResults")}</div>
              ) : (
                <>
                  <div className="px-4 py-2 bg-muted/30 text-xs font-semibold text-muted-foreground">
                    {t(lang, "searchResults")} ({searchResults.length})
                  </div>
                  {searchResults.map((result, i) => {
                    const Icon = typeIcons[result.type];
                    return (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                        onClick={() => {
                          setSearch("");
                          // Synthesize an activity id from titleEn for tracking
                          const id = result.titleEn.toLowerCase().replace(/\s+/g, "-").slice(0, 40);
                          trackActivity({ id, type: result.type as ActivityType, titleEn: result.titleEn, titleAm: result.titleAm });
                          if (result.type === "document" && onNavigate) onNavigate("knowledge-base");
                          if (result.type === "expert" && onNavigate) onNavigate("expert-locator");
                          if (result.type === "lesson" && onNavigate) onNavigate("lessons-learned");
                          if (result.type === "quicklink" && onNavigate) onNavigate("knowledge-base");
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lang === "en" ? result.titleEn : result.titleAm}</p>
                          <p className="text-xs text-muted-foreground">{lang === "en" ? result.subtitleEn : result.subtitleAm}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{typeLabels[result.type]}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="bg-card rounded-xl p-4 border border-border card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gold-muted flex items-center justify-center">
                <stat.icon size={16} className="text-gold" />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(lang, stat.key)}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links & Branch Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-foreground mb-4">{t(lang, "quickLinks")}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => {
                  setSelectedQuickLink(link);
                  trackActivity({ id: link.id, type: "quicklink", titleEn: link.titleEn, titleAm: link.titleAm });
                }}
                className="bg-card border border-border rounded-xl p-4 card-hover cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center mb-3">
                  <FileText size={14} className="text-navy-dark" />
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground leading-snug mb-1.5">{lang === "en" ? link.titleEn : link.titleAm}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{lang === "en" ? link.descEn : link.descAm}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gold group-hover:gap-2 transition-all">
                  {t(lang, "view")} <ArrowRight size={12} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-foreground mb-4">{t(lang, "recentBranchInsights")}</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {branchInsights.map((insight, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gold">{insight.branch}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} /> {lang === "en" ? insight.time : insight.timeAm}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{lang === "en" ? insight.messageEn : insight.messageAm}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Link Detail Modal */}
      <AnimatePresence>
        {selectedQuickLink && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedQuickLink(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display font-bold text-foreground">{lang === "en" ? selectedQuickLink.titleEn : selectedQuickLink.titleAm}</h2>
                <button onClick={() => setSelectedQuickLink(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              <div
                className="p-5 prose prose-sm max-w-none text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h3]:font-display [&_h3]:text-base [&_h3]:mt-4 [&_ul]:space-y-1 [&_li]:text-sm [&_p]:text-sm [&_hr]:my-4 [&_hr]:border-border"
                dangerouslySetInnerHTML={{ __html: lang === "en" ? selectedQuickLink.contentEn : selectedQuickLink.contentAm }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
