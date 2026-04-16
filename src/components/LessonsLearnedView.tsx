import { BookOpen, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { lessons } from "@/lib/dummy-data";

interface LessonsLearnedViewProps {
  lang: Language;
}

const impactConfig = {
  high: { color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  medium: { color: "bg-gold-muted text-gold", icon: Info },
  low: { color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
};

export function LessonsLearnedView({ lang }: LessonsLearnedViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "lessonsTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t(lang, "lessonsSubtitle")}</p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, i) => {
          const impact = impactConfig[lesson.impact];
          const ImpactIcon = impact.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-xl p-5 card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen size={16} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-foreground">
                      {lang === "en" ? lesson.titleEn : lesson.titleAm}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>{lang === "en" ? lesson.category : lesson.categoryAm}</span>
                      <span>•</span>
                      <span>{lesson.submittedBy}</span>
                      <span>•</span>
                      <span>{lesson.date}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${impact.color}`}>
                  <ImpactIcon size={12} />
                  {t(lang, lesson.impact)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
