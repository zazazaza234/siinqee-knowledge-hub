import { Bookmark, FileText, Users, Lightbulb, BookOpen, Star, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { useBookmarks, type BookmarkType } from "@/hooks/use-personalization";
import type { TabId } from "@/components/KMSSidebar";

interface BookmarksViewProps {
  lang: Language;
  onNavigate?: (tab: TabId) => void;
}

const typeMeta: Record<BookmarkType, { icon: typeof FileText; tab: TabId; labelEn: string; labelAm: string }> = {
  document: { icon: FileText, tab: "knowledge-base", labelEn: "Document", labelAm: "Galmee" },
  expert: { icon: Users, tab: "expert-locator", labelEn: "Expert", labelAm: "Ogeessa" },
  lesson: { icon: BookOpen, tab: "lessons-learned", labelEn: "Lesson", labelAm: "Barnoota" },
  idea: { icon: Lightbulb, tab: "innovation-hub", labelEn: "Idea", labelAm: "Yaada" },
  quicklink: { icon: Star, tab: "dashboard", labelEn: "Quick Link", labelAm: "Hidhata" },
};

export function BookmarksView({ lang, onNavigate }: BookmarksViewProps) {
  const { bookmarks, remove } = useBookmarks();
  const [filter, setFilter] = useState<BookmarkType | "all">("all");

  const filtered = filter === "all" ? bookmarks : bookmarks.filter((b) => b.type === filter);

  const counts: Record<BookmarkType | "all", number> = {
    all: bookmarks.length,
    document: bookmarks.filter((b) => b.type === "document").length,
    expert: bookmarks.filter((b) => b.type === "expert").length,
    lesson: bookmarks.filter((b) => b.type === "lesson").length,
    idea: bookmarks.filter((b) => b.type === "idea").length,
    quicklink: bookmarks.filter((b) => b.type === "quicklink").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Bookmark size={22} className="text-gold" /> {t(lang, "myBookmarks")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "en" ? "Quickly return to documents, experts, lessons, and ideas you've saved." : "Galmee, ogeessota, barnootaa fi yaada olkaayte saffisaan deebi'i argadhu."}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "document", "expert", "lesson", "idea", "quicklink"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === key ? "bg-gold text-gold-foreground" : "bg-gold-muted text-gold hover:bg-gold/20"}`}
          >
            {key === "all" ? (lang === "en" ? "All" : "Hunda") : (lang === "en" ? typeMeta[key].labelEn : typeMeta[key].labelAm)} ({counts[key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
          <Bookmark size={32} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">{t(lang, "noBookmarks")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((b) => {
              const meta = typeMeta[b.type];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={`${b.type}-${b.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-4 card-hover"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                          {lang === "en" ? meta.labelEn : meta.labelAm}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-sm text-foreground leading-snug">
                        {lang === "en" ? b.titleEn : b.titleAm}
                      </h3>
                      {b.subtitleEn && (
                        <p className="text-xs text-muted-foreground mt-1">{lang === "en" ? b.subtitleEn : b.subtitleAm}</p>
                      )}
                      <div className="flex items-center justify-between gap-2 mt-3">
                        <button
                          onClick={() => onNavigate?.(meta.tab)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:gap-2 transition-all"
                        >
                          {t(lang, "view")} <ArrowRight size={12} />
                        </button>
                        <button
                          onClick={() => {
                            remove(b.id, b.type);
                            toast.success(t(lang, "bookmarkRemoved"));
                          }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title={t(lang, "removeBookmark")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
