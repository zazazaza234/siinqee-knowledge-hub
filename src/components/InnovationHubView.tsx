import { Plus, User, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { defaultKanbanIdeas, type KanbanIdea } from "@/lib/dummy-data";

interface InnovationHubViewProps {
  lang: Language;
}

const columns = [
  { key: "proposed" as const, labelKey: "proposed" as const, dotColor: "bg-blue-400" },
  { key: "underReview" as const, labelKey: "underReview" as const, dotColor: "bg-gold" },
  { key: "implemented" as const, labelKey: "implemented" as const, dotColor: "bg-emerald-500" },
];

export function InnovationHubView({ lang }: InnovationHubViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [kanbanIdeas, setKanbanIdeas] = useState(defaultKanbanIdeas);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideaDept, setIdeaDept] = useState("Microfinance");
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<KanbanIdea | null>(null);

  const handleSubmit = () => {
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;

    const newIdea: KanbanIdea = {
      titleEn: ideaTitle,
      titleAm: ideaTitle,
      authorEn: "You - Head Office",
      authorAm: "እርስዎ - ዋና መ/ቤት",
      department: ideaDept,
      departmentAm: ideaDept,
      descriptionEn: ideaDesc,
      descriptionAm: ideaDesc,
    };

    setKanbanIdeas((prev) => ({
      ...prev,
      proposed: [newIdea, ...prev.proposed],
    }));

    setIdeaTitle("");
    setIdeaDesc("");
    setIdeaDept("Microfinance");
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "innovationHub")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "en" ? "Propose, track, and implement local market innovations" : "የአካባቢ ገበያ ፈጠራዎችን ያቅርቡ፣ ይከታተሉ እና ያተግብሩ"}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-gradient text-navy-dark text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={16} /> {t(lang, "submitIdea")}
        </button>
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
        {columns.map((col) => (
          <div key={col.key}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
              <h3 className="font-display font-semibold text-sm text-foreground">{t(lang, col.labelKey)}</h3>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{kanbanIdeas[col.key].length}</span>
            </div>
            <div className="space-y-3">
              {kanbanIdeas[col.key].map((idea, i) => (
                <motion.div
                  key={`${col.key}-${i}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedIdea(idea)}
                  className="bg-card border border-border rounded-xl p-4 card-hover cursor-pointer"
                >
                  <h4 className="font-display font-semibold text-sm text-foreground mb-1.5">{lang === "en" ? idea.titleEn : idea.titleAm}</h4>
                  {idea.department && (
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2">{idea.department}</span>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User size={12} />
                    <span>{lang === "en" ? idea.authorEn : idea.authorAm}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
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
              <p className="text-sm text-foreground/80 leading-relaxed">{lang === "en" ? (expandedIdea.descriptionEn || "No description provided.") : (expandedIdea.descriptionAm || "ማብራሪያ አልተሰጠም።")}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                <User size={12} />
                <span>{lang === "en" ? expandedIdea.authorEn : expandedIdea.authorAm}</span>
              </div>
              <button onClick={() => setExpandedIdea(null)} className="w-full py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">{t(lang, "close")}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
