import { Plus, User, CheckCircle, Search, Bookmark, Heart, Share2, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { defaultKanbanIdeas, type KanbanIdea } from "@/lib/dummy-data";
import { useBookmarks, useLikes, shareItem } from "@/hooks/use-personalization";

interface InnovationHubViewProps {
  lang: Language;
}

type IdeaWithMeta = KanbanIdea & { id: string; status: "proposed" | "underReview" | "implemented" };

const columns = [
  { key: "proposed" as const, labelKey: "proposed" as const, dotColor: "bg-blue-400", barColor: "bg-blue-400" },
  { key: "underReview" as const, labelKey: "underReview" as const, dotColor: "bg-gold", barColor: "bg-gold" },
  { key: "implemented" as const, labelKey: "implemented" as const, dotColor: "bg-emerald-500", barColor: "bg-emerald-500" },
];

function withIds(group: KanbanIdea[], status: IdeaWithMeta["status"], prefix: string): IdeaWithMeta[] {
  return group.map((idea, i) => ({ ...idea, id: `${prefix}-${i}-${idea.titleEn.slice(0, 20)}`, status }));
}

export function InnovationHubView({ lang }: InnovationHubViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [kanbanIdeas, setKanbanIdeas] = useState<{ proposed: IdeaWithMeta[]; underReview: IdeaWithMeta[]; implemented: IdeaWithMeta[] }>({
    proposed: withIds(defaultKanbanIdeas.proposed, "proposed", "p"),
    underReview: withIds(defaultKanbanIdeas.underReview, "underReview", "r"),
    implemented: withIds(defaultKanbanIdeas.implemented, "implemented", "i"),
  });
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideaDept, setIdeaDept] = useState("Microfinance");
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<IdeaWithMeta | null>(null);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();
  const { isLiked, toggleLike } = useLikes();

  const handleSubmit = () => {
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;
    const newIdea: IdeaWithMeta = {
      id: `user-${Date.now()}`,
      status: "proposed",
      titleEn: ideaTitle,
      titleAm: ideaTitle,
      authorEn: "You - Head Office",
      authorAm: "Sii - Waajjira Olaanaa",
      department: ideaDept,
      departmentAm: ideaDept,
      descriptionEn: ideaDesc,
      descriptionAm: ideaDesc,
    };
    setKanbanIdeas((prev) => ({ ...prev, proposed: [newIdea, ...prev.proposed] }));
    setIdeaTitle("");
    setIdeaDesc("");
    setIdeaDept("Microfinance");
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const allIdeas = useMemo(
    () => [...kanbanIdeas.proposed, ...kanbanIdeas.underReview, ...kanbanIdeas.implemented],
    [kanbanIdeas]
  );

  const departments = useMemo(() => Array.from(new Set(allIdeas.map((i) => i.department).filter(Boolean) as string[])), [allIdeas]);

  const matchesFilters = (idea: IdeaWithMeta) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      idea.titleEn.toLowerCase().includes(q) ||
      idea.titleAm.includes(search) ||
      idea.authorEn.toLowerCase().includes(q) ||
      (idea.department || "").toLowerCase().includes(q);
    const matchesDept = deptFilter === "all" || idea.department === deptFilter;
    return matchesSearch && matchesDept;
  };

  // Analytics
  const analytics = useMemo(() => {
    const total = allIdeas.length;
    const byStatus = {
      proposed: kanbanIdeas.proposed.length,
      underReview: kanbanIdeas.underReview.length,
      implemented: kanbanIdeas.implemented.length,
    };
    const byDept: Record<string, number> = {};
    allIdeas.forEach((i) => {
      const d = i.department || "Other";
      byDept[d] = (byDept[d] || 0) + 1;
    });
    return { total, byStatus, byDept };
  }, [allIdeas, kanbanIdeas]);

  const maxDept = Math.max(1, ...Object.values(analytics.byDept));

  const handleBookmark = (idea: IdeaWithMeta) => {
    const nowBookmarked = toggleBookmark({
      id: idea.id,
      type: "idea",
      titleEn: idea.titleEn,
      titleAm: idea.titleAm,
      subtitleEn: idea.department,
      subtitleAm: idea.departmentAm,
    });
    toast.success(t(lang, nowBookmarked ? "bookmarkAdded" : "bookmarkRemoved"));
  };

  const handleShare = async (idea: IdeaWithMeta) => {
    const status = await shareItem(lang === "en" ? idea.titleEn : idea.titleAm, `${idea.department || ""} · ${idea.authorEn}`);
    if (status === "copied" || status === "shared") toast.success(t(lang, "shared"));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "innovationHub")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "en" ? "Propose, track, and implement local market innovations" : "Kalaqa gabaa naannoo dhiyeessi, hordofii fi hojiirra oolchi"}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-gradient text-navy-dark text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={16} /> {t(lang, "submitIdea")}
        </button>
      </div>

      {/* Analytics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold uppercase">
            <BarChart3 size={14} /> {t(lang, "totalIdeas")}
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{analytics.total}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.byStatus.implemented} {lang === "en" ? "implemented" : "hojiirra oolfame"}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">{t(lang, "byStatus")}</p>
          <div className="space-y-2">
            {columns.map((col) => {
              const count = analytics.byStatus[col.key];
              const pct = analytics.total ? (count / analytics.total) * 100 : 0;
              return (
                <div key={col.key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground">{t(lang, col.labelKey)}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${col.barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">{t(lang, "byDepartment")}</p>
          <div className="space-y-2">
            {Object.entries(analytics.byDept).slice(0, 4).map(([dept, count]) => (
              <div key={dept}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground truncate">{dept}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${(count / maxDept) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Dept Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(lang, "searchIdeas")}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="all">{t(lang, "allDepartments")}</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Submit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card border border-border rounded-xl p-5 space-y-4 overflow-hidden">
            <h3 className="font-display font-semibold text-foreground">{t(lang, "submitIdea")}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "ideaTitle")}</label>
                <input value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "ideaDepartment")}</label>
                <select value={ideaDept} onChange={(e) => setIdeaDept(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30">
                  <option value="Microfinance">{t(lang, "microfinance")}</option>
                  <option value="Corporate Services">{t(lang, "corporateServices")}</option>
                  <option value="Human Capital Management">{t(lang, "humanCapital")}</option>
                  <option value="Risk & Compliance">{t(lang, "riskCompliance")}</option>
                  <option value="Digital Banking">{t(lang, "digitalBanking")}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "ideaDescription")}</label>
              <textarea value={ideaDesc} onChange={(e) => setIdeaDesc(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={!ideaTitle.trim() || !ideaDesc.trim()} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {t(lang, "submit")}
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                {t(lang, "cancel")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board */}
      <div className="grid lg:grid-cols-3 gap-5">
        {columns.map((col) => {
          const visible = kanbanIdeas[col.key].filter(matchesFilters);
          return (
            <div key={col.key}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="font-display font-semibold text-sm text-foreground">{t(lang, col.labelKey)}</h3>
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{visible.length}</span>
              </div>
              <div className="space-y-3">
                {visible.map((idea, i) => {
                  const liked = isLiked(`idea-${idea.id}`);
                  const bookmarked = isBookmarked(idea.id, "idea");
                  return (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border rounded-xl p-4 card-hover"
                    >
                      <div onClick={() => setExpandedIdea(idea)} className="cursor-pointer">
                        <h4 className="font-display font-semibold text-sm text-foreground mb-1.5">{lang === "en" ? idea.titleEn : idea.titleAm}</h4>
                        {idea.department && (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2">{idea.department}</span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User size={12} />
                          <span className="truncate">{lang === "en" ? idea.authorEn : idea.authorAm}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLike(`idea-${idea.id}`); }}
                          className={`p-1.5 rounded-md transition-colors ${liked ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          <Heart size={12} fill={liked ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBookmark(idea); }}
                          className={`p-1.5 rounded-md transition-colors ${bookmarked ? "text-gold bg-gold-muted" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          <Bookmark size={12} fill={bookmarked ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShare(idea); }}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                        >
                          <Share2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
                {visible.length === 0 && (
                  <div className="bg-card border border-dashed border-border rounded-xl p-4 text-center text-xs text-muted-foreground">
                    {t(lang, "noResults")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-[200]">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{t(lang, "ideaSubmitted")}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idea Detail Modal */}
      <AnimatePresence>
        {expandedIdea && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setExpandedIdea(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl w-full max-w-md p-5 space-y-3">
              <h3 className="font-display font-bold text-foreground">{lang === "en" ? expandedIdea.titleEn : expandedIdea.titleAm}</h3>
              {expandedIdea.department && <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-gold-muted text-gold font-medium">{expandedIdea.department}</span>}
              <p className="text-sm text-foreground/80 leading-relaxed">{lang === "en" ? (expandedIdea.descriptionEn || "No description provided.") : (expandedIdea.descriptionAm || "Ibsi hin kennamne.")}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                <User size={12} />
                <span>{lang === "en" ? expandedIdea.authorEn : expandedIdea.authorAm}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBookmark(expandedIdea)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${isBookmarked(expandedIdea.id, "idea") ? "bg-gold-muted text-gold" : "border border-border hover:bg-muted text-foreground"}`}>
                  <Bookmark size={12} fill={isBookmarked(expandedIdea.id, "idea") ? "currentColor" : "none"} /> {t(lang, "bookmark")}
                </button>
                <button onClick={() => handleShare(expandedIdea)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                  <Share2 size={12} /> {t(lang, "share")}
                </button>
                <button onClick={() => setExpandedIdea(null)} className="flex-1 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">{t(lang, "close")}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
