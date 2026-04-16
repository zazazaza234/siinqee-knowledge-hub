import { Plus, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { kanbanIdeas } from "@/lib/dummy-data";

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "innovationHub")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "en" ? "Propose, track, and implement local market innovations" : "የአካባቢ ገበያ ፈጠራዎችን ያቅርቡ፣ ይከታተሉ እና ያተግብሩ"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gold-gradient text-navy-dark text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> {t(lang, "submitIdea")}
        </button>
      </div>

      {/* Submit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border border-border rounded-xl p-5 space-y-4"
        >
          <h3 className="font-display font-semibold text-foreground">{t(lang, "submitIdea")}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "ideaTitle")}</label>
              <input className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "ideaDepartment")}</label>
              <select className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30">
                <option>{t(lang, "microfinance")}</option>
                <option>{t(lang, "corporateServices")}</option>
                <option>{t(lang, "humanCapital")}</option>
                <option>{t(lang, "riskCompliance")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "ideaDescription")}</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t(lang, "submit")}
          </button>
        </motion.div>
      )}

      {/* Kanban Board */}
      <div className="grid lg:grid-cols-3 gap-5">
        {columns.map((col) => (
          <div key={col.key}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
              <h3 className="font-display font-semibold text-sm text-foreground">
                {t(lang, col.labelKey)}
              </h3>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {kanbanIdeas[col.key].length}
              </span>
            </div>
            <div className="space-y-3">
              {kanbanIdeas[col.key].map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-4 card-hover cursor-grab"
                >
                  <h4 className="font-display font-semibold text-sm text-foreground mb-2">
                    {lang === "en" ? idea.titleEn : idea.titleAm}
                  </h4>
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
    </div>
  );
}
