import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Users, BookOpen, Lightbulb, Star, X } from "lucide-react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { documents, experts, quickLinks, lessons, defaultKanbanIdeas } from "@/lib/dummy-data";
import type { TabId } from "@/components/KMSSidebar";
import { trackActivity, type ActivityType } from "@/hooks/use-activity";

interface CommandPaletteProps {
  lang: Language;
  onNavigate: (tab: TabId) => void;
}

type Result = {
  id: string;
  type: ActivityType;
  titleEn: string;
  titleAm: string;
  subtitleEn: string;
  subtitleAm: string;
  tab: TabId;
};

const typeMeta: Record<ActivityType, { icon: typeof FileText; tab: TabId; label: string }> = {
  document: { icon: FileText, tab: "knowledge-base", label: "Document" },
  expert: { icon: Users, tab: "expert-locator", label: "Expert" },
  quicklink: { icon: Star, tab: "knowledge-base", label: "Quick Link" },
  lesson: { icon: BookOpen, tab: "lessons-learned", label: "Lesson" },
  idea: { icon: Lightbulb, tab: "innovation-hub", label: "Idea" },
};

export function CommandPalette({ lang, onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo<Result[]>(() => {
    if (q.length < 1) return [];
    const needle = q.toLowerCase();
    const out: Result[] = [];
    documents.forEach((d) => {
      if ([d.title, d.titleAm, d.dept].join(" ").toLowerCase().includes(needle))
        out.push({ id: d.id, type: "document", titleEn: d.title, titleAm: d.titleAm, subtitleEn: d.dept, subtitleAm: d.deptAm, tab: "knowledge-base" });
    });
    experts.forEach((e) => {
      if ([e.name, e.nameAm, e.title, ...e.tags].join(" ").toLowerCase().includes(needle))
        out.push({ id: e.id, type: "expert", titleEn: e.name, titleAm: e.nameAm, subtitleEn: e.title, subtitleAm: e.titleAm, tab: "expert-locator" });
    });
    quickLinks.forEach((l) => {
      if ([l.titleEn, l.titleAm, l.descEn].join(" ").toLowerCase().includes(needle))
        out.push({ id: l.id, type: "quicklink", titleEn: l.titleEn, titleAm: l.titleAm, subtitleEn: l.dept, subtitleAm: l.deptAm, tab: "knowledge-base" });
    });
    lessons.forEach((l) => {
      if ([l.titleEn, l.titleAm, l.category].join(" ").toLowerCase().includes(needle))
        out.push({ id: l.id, type: "lesson", titleEn: l.titleEn, titleAm: l.titleAm, subtitleEn: l.category, subtitleAm: l.categoryAm, tab: "lessons-learned" });
    });
    const allIdeas = [...defaultKanbanIdeas.proposed, ...defaultKanbanIdeas.underReview, ...defaultKanbanIdeas.implemented];
    allIdeas.forEach((i, idx) => {
      if ([i.titleEn, i.titleAm, i.department || ""].join(" ").toLowerCase().includes(needle))
        out.push({ id: `idea-${idx}`, type: "idea", titleEn: i.titleEn, titleAm: i.titleAm, subtitleEn: i.department || "", subtitleAm: i.departmentAm || "", tab: "innovation-hub" });
    });
    return out.slice(0, 12);
  }, [q]);

  const choose = (r: Result) => {
    trackActivity({ id: r.id, type: r.type, titleEn: r.titleEn, titleAm: r.titleAm });
    onNavigate(r.tab);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted border border-border text-xs text-muted-foreground transition-colors"
      >
        <Search size={13} />
        <span>{t(lang, "searchHint")}</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">⌘K</kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label={t(lang, "quickSearch")}
      >
        <Search size={18} className="text-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 flex items-start justify-center p-4 pt-[10vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Search size={16} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t(lang, "searchHint")}
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                {q.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    {t(lang, "searchHint")}
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">{t(lang, "noResults")}</div>
                ) : (
                  results.map((r) => {
                    const Icon = typeMeta[r.type].icon;
                    return (
                      <button
                        key={`${r.type}-${r.id}`}
                        onClick={() => choose(r)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0">
                          <Icon size={13} className="text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lang === "en" ? r.titleEn : r.titleAm}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{lang === "en" ? r.subtitleEn : r.subtitleAm}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{r.type}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
