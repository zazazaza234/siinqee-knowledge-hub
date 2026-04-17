import { BookOpen, AlertTriangle, CheckCircle, Info, ArrowLeft, Search, Bookmark, Heart, Share2, Plus, BarChart3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { lessons as defaultLessons } from "@/lib/dummy-data";
import { useBookmarks, useLikes, shareItem } from "@/hooks/use-personalization";

interface LessonsLearnedViewProps {
  lang: Language;
}

type Lesson = (typeof defaultLessons)[number];

const impactConfig = {
  high: { color: "bg-destructive/10 text-destructive", barColor: "bg-destructive", icon: AlertTriangle },
  medium: { color: "bg-gold-muted text-gold", barColor: "bg-gold", icon: Info },
  low: { color: "bg-emerald-500/10 text-emerald-600", barColor: "bg-emerald-500", icon: CheckCircle },
};

export function LessonsLearnedView({ lang }: LessonsLearnedViewProps) {
  const [lessons, setLessons] = useState<Lesson[]>(defaultLessons as unknown as Lesson[]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeImpact, setActiveImpact] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"newest" | "mostLiked">("newest");
  const [showForm, setShowForm] = useState(false);

  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();
  const { isLiked, toggleLike, likes } = useLikes();

  // Form state
  const [fTitle, setFTitle] = useState("");
  const [fCategory, setFCategory] = useState("Operations");
  const [fImpact, setFImpact] = useState<"high" | "medium" | "low">("medium");
  const [fSummary, setFSummary] = useState("");

  const categories = useMemo(() => Array.from(new Set(lessons.map((l) => l.category))), [lessons]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let out = lessons.filter((l) => {
      const matchesSearch =
        !q ||
        l.titleEn.toLowerCase().includes(q) ||
        l.titleAm.includes(search) ||
        l.category.toLowerCase().includes(q) ||
        l.submittedBy.toLowerCase().includes(q);
      const matchesCat = activeCategory === "all" || l.category === activeCategory;
      const matchesImpact = activeImpact === "all" || l.impact === activeImpact;
      return matchesSearch && matchesCat && matchesImpact;
    });
    if (sortBy === "mostLiked") {
      out = [...out].sort((a, b) => (likes[`lesson-${b.id}`] ? 1 : 0) - (likes[`lesson-${a.id}`] ? 1 : 0));
    } else {
      out = [...out].sort((a, b) => (b.date > a.date ? 1 : -1));
    }
    return out;
  }, [lessons, search, activeCategory, activeImpact, sortBy, likes]);

  // Analytics
  const analytics = useMemo(() => {
    const total = lessons.length;
    const byImpact = { high: 0, medium: 0, low: 0 };
    const byCat: Record<string, number> = {};
    lessons.forEach((l) => {
      byImpact[l.impact]++;
      byCat[l.category] = (byCat[l.category] || 0) + 1;
    });
    return { total, byImpact, byCat };
  }, [lessons]);

  const handleSubmit = () => {
    if (!fTitle.trim() || !fSummary.trim()) return;
    const newLesson: Lesson = {
      id: `lesson-user-${Date.now()}`,
      titleEn: fTitle,
      titleAm: fTitle,
      category: fCategory,
      categoryAm: fCategory,
      impact: fImpact,
      submittedBy: "You",
      date: new Date().toISOString().slice(0, 10),
      detailEn: `<h3>Summary</h3><p>${fSummary}</p>`,
      detailAm: `<h3>Cuunfaa</h3><p>${fSummary}</p>`,
    } as Lesson;
    setLessons((prev) => [newLesson, ...prev]);
    setFTitle("");
    setFSummary("");
    setShowForm(false);
    toast.success(t(lang, "lessonShared"));
  };

  const handleShare = async (l: Lesson) => {
    const status = await shareItem(lang === "en" ? l.titleEn : l.titleAm, `${l.category} · ${l.submittedBy}`);
    if (status === "copied" || status === "shared") toast.success(t(lang, "shared"));
  };

  const handleBookmark = (l: Lesson) => {
    const nowBookmarked = toggleBookmark({
      id: l.id,
      type: "lesson",
      titleEn: l.titleEn,
      titleAm: l.titleAm,
      subtitleEn: l.category,
      subtitleAm: l.categoryAm,
    });
    toast.success(t(lang, nowBookmarked ? "bookmarkAdded" : "bookmarkRemoved"));
  };

  const maxCat = Math.max(1, ...Object.values(analytics.byCat));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "lessonsTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t(lang, "lessonsSubtitle")}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-gradient text-navy-dark text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> {t(lang, "addLesson")}
        </button>
      </div>

      {/* Analytics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold uppercase">
            <BarChart3 size={14} /> {t(lang, "totalLessons")}
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{analytics.total}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {filtered.length} {lang === "en" ? "match current filters" : "filtara amma jiruun walsimu"}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">{t(lang, "byImpact")}</p>
          <div className="space-y-2">
            {(["high", "medium", "low"] as const).map((imp) => {
              const pct = analytics.total ? (analytics.byImpact[imp] / analytics.total) * 100 : 0;
              return (
                <div key={imp}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground">{t(lang, imp)}</span>
                    <span className="text-muted-foreground">{analytics.byImpact[imp]}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${impactConfig[imp].barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">{t(lang, "byCategory")}</p>
          <div className="space-y-2">
            {Object.entries(analytics.byCat).slice(0, 4).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground truncate">{cat}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${(count / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(lang, "searchLessons")}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
          >
            {t(lang, "allCategories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {(["all", "high", "medium", "low"] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setActiveImpact(imp)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${activeImpact === imp ? "bg-gold text-gold-foreground" : "bg-gold-muted text-gold hover:bg-gold/20"}`}
              >
                {imp === "all" ? (lang === "en" ? "All Impact" : "Dhiibbaa Hunda") : t(lang, imp)}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "mostLiked")}
              className="text-xs px-2 py-1 rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <option value="newest">{t(lang, "newest")}</option>
              <option value="mostLiked">{t(lang, "mostLiked")}</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedLesson ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-border">
              <button onClick={() => setSelectedLesson(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ArrowLeft size={18} />
              </button>
              <div className="flex-1">
                <h2 className="font-display font-bold text-foreground text-sm">{lang === "en" ? selectedLesson.titleEn : selectedLesson.titleAm}</h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{lang === "en" ? selectedLesson.category : selectedLesson.categoryAm}</span>
                  <span>•</span>
                  <span>{selectedLesson.submittedBy}</span>
                  <span>•</span>
                  <span>{selectedLesson.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const nowLiked = toggleLike(`lesson-${selectedLesson.id}`);
                    if (nowLiked) toast.success(t(lang, "like"));
                  }}
                  className={`p-2 rounded-lg transition-colors ${isLiked(`lesson-${selectedLesson.id}`) ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <Heart size={15} fill={isLiked(`lesson-${selectedLesson.id}`) ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => handleBookmark(selectedLesson)}
                  className={`p-2 rounded-lg transition-colors ${isBookmarked(selectedLesson.id, "lesson") ? "text-gold bg-gold-muted" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <Bookmark size={15} fill={isBookmarked(selectedLesson.id, "lesson") ? "currentColor" : "none"} />
                </button>
                <button onClick={() => handleShare(selectedLesson)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                  <Share2 size={15} />
                </button>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${impactConfig[selectedLesson.impact].color}`}>
                {(() => { const Icon = impactConfig[selectedLesson.impact].icon; return <Icon size={12} />; })()}
                {t(lang, selectedLesson.impact)}
              </span>
            </div>
            <div
              className="p-5 prose prose-sm max-w-none text-foreground [&_h3]:font-display [&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:space-y-1 [&_li]:text-sm [&_p]:text-sm"
              dangerouslySetInnerHTML={{ __html: lang === "en" ? selectedLesson.detailEn : selectedLesson.detailAm }}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
                {t(lang, "noResults")}
              </div>
            ) : (
              filtered.map((lesson, i) => {
                const impact = impactConfig[lesson.impact];
                const ImpactIcon = impact.icon;
                const liked = isLiked(`lesson-${lesson.id}`);
                const bookmarked = isBookmarked(lesson.id, "lesson");
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card border border-border rounded-xl p-5 card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div onClick={() => setSelectedLesson(lesson)} className="flex items-start gap-3 flex-1 cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen size={16} className="text-gold" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-sm text-foreground">{lang === "en" ? lesson.titleEn : lesson.titleAm}</h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span>{lang === "en" ? lesson.category : lesson.categoryAm}</span>
                            <span>•</span>
                            <span>{lesson.submittedBy}</span>
                            <span>•</span>
                            <span>{lesson.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${impact.color}`}>
                          <ImpactIcon size={12} />
                          {t(lang, lesson.impact)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                      <button
                        onClick={() => {
                          const nowLiked = toggleLike(`lesson-${lesson.id}`);
                          if (nowLiked) toast.success(t(lang, "like"));
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${liked ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        <Heart size={12} fill={liked ? "currentColor" : "none"} /> {t(lang, "like")}
                      </button>
                      <button
                        onClick={() => handleBookmark(lesson)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${bookmarked ? "text-gold bg-gold-muted" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        <Bookmark size={12} fill={bookmarked ? "currentColor" : "none"} /> {t(lang, "bookmark")}
                      </button>
                      <button
                        onClick={() => handleShare(lesson)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Share2 size={12} /> {t(lang, "share")}
                      </button>
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="ml-auto text-xs font-medium text-gold hover:underline"
                      >
                        {t(lang, "view")} →
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Lesson Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-display font-bold text-foreground">{t(lang, "addLesson")}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "lessonTitle")}</label>
                  <input value={fTitle} onChange={(e) => setFTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "lessonCategory")}</label>
                    <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30">
                      <option>Operations</option>
                      <option>Risk & Compliance</option>
                      <option>Digital Banking</option>
                      <option>IFB Services</option>
                      <option>Human Capital</option>
                      <option>Microfinance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "lessonImpact")}</label>
                    <select value={fImpact} onChange={(e) => setFImpact(e.target.value as "high" | "medium" | "low")} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30">
                      <option value="high">{t(lang, "high")}</option>
                      <option value="medium">{t(lang, "medium")}</option>
                      <option value="low">{t(lang, "low")}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "lessonSummary")}</label>
                  <textarea rows={4} value={fSummary} onChange={(e) => setFSummary(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">{t(lang, "cancel")}</button>
                  <button onClick={handleSubmit} disabled={!fTitle.trim() || !fSummary.trim()} className="px-4 py-2 rounded-lg gold-gradient text-navy-dark text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                    {t(lang, "submit")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
