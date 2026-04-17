import { Folder, FileText, Download, Eye, Search, X, ArrowLeft, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { documents } from "@/lib/dummy-data";
import { useBookmarks } from "@/hooks/use-personalization";

interface KnowledgeBaseViewProps {
  lang: Language;
}

const departments = [
  { nameEn: "Microfinance", nameAm: "ማይክሮፋይናንስ", count: 342, color: "bg-chart-1", deptKey: "Microfinance" },
  { nameEn: "Corporate Services", nameAm: "የድርጅት አገልግሎቶች", count: 518, color: "bg-chart-2", deptKey: "Corporate Services" },
  { nameEn: "Human Capital Management", nameAm: "የሰው ሀብት አስተዳደር", count: 196, color: "bg-chart-3", deptKey: "Human Capital Management" },
  { nameEn: "Risk & Compliance", nameAm: "ስጋት እና ተገዢነት", count: 421, color: "bg-chart-4", deptKey: "Risk & Compliance" },
];

export function KnowledgeBaseView({ lang }: KnowledgeBaseViewProps) {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[number] | null>(null);
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();

  const handleBookmark = (doc: typeof documents[number]) => {
    const now = toggleBookmark({ id: doc.id, type: "document", titleEn: doc.title, titleAm: doc.titleAm, subtitleEn: doc.dept, subtitleAm: doc.deptAm });
    toast.success(t(lang, now ? "bookmarkAdded" : "bookmarkRemoved"));
  };

  const filtered = documents.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.dept.toLowerCase().includes(search.toLowerCase()) || d.titleAm.includes(search);
    const matchesDept = !selectedDept || d.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "knowledgeBase")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t(lang, "knowledgeBaseSubtitle")}</p>
      </div>

      {/* Department Folders */}
      <div>
        <h2 className="font-display font-semibold text-foreground mb-4">{t(lang, "departments")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept, i) => {
            const isActive = selectedDept === dept.deptKey;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDept(isActive ? null : dept.deptKey)}
                className={`bg-card border rounded-xl p-4 card-hover cursor-pointer group ${isActive ? "border-gold ring-2 ring-gold/20" : "border-border"}`}
              >
                <div className={`w-10 h-10 rounded-lg ${dept.color}/15 flex items-center justify-center mb-3`}>
                  <Folder size={18} className="text-gold" />
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground">{lang === "en" ? dept.nameEn : dept.nameAm}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{dept.count} {t(lang, "documents").toLowerCase()}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active filter badge */}
      {selectedDept && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t(lang, "filterByDept")}:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-muted text-gold text-xs font-medium">
            {selectedDept}
            <button onClick={() => setSelectedDept(null)}><X size={12} /></button>
          </span>
        </div>
      )}

      {/* Documents Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground">{t(lang, "documents")}</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(lang, "searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold text-foreground">{t(lang, "title")}</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">{t(lang, "department")}</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">{t(lang, "lastUpdated")}</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">{t(lang, "action")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <FileText size={14} className="text-gold flex-shrink-0" />
                    <span className="text-foreground">{lang === "en" ? doc.title : doc.titleAm}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{lang === "en" ? doc.dept : doc.deptAm}</td>
                  <td className="py-3 px-4 text-muted-foreground">{doc.date}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleBookmark(doc)} className={`p-1.5 rounded-md transition-colors ${isBookmarked(doc.id, "document") ? "text-gold bg-gold-muted" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} title={t(lang, "bookmark")}>
                        <Bookmark size={14} fill={isBookmarked(doc.id, "document") ? "currentColor" : "none"} />
                      </button>
                      <button onClick={() => setSelectedDoc(doc)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => toast.success(lang === "en" ? "Download started" : "Buufachuun jalqabameera")} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedDoc(null)} className="p-1.5 rounded-lg hover:bg-muted"><ArrowLeft size={16} /></button>
                  <div>
                    <h2 className="font-display font-bold text-foreground text-sm">{lang === "en" ? selectedDoc.title : selectedDoc.titleAm}</h2>
                    <p className="text-xs text-muted-foreground">{lang === "en" ? selectedDoc.dept : selectedDoc.deptAm} · {selectedDoc.date}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="p-5">
                <p className="text-sm text-foreground leading-relaxed">{lang === "en" ? selectedDoc.contentEn : selectedDoc.contentAm}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
