import { BookOpen, AlertTriangle, CheckCircle, Info, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  const [selectedLesson, setSelectedLesson] = useState<typeof lessons[number] | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "lessonsTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t(lang, "lessonsSubtitle")}</p>
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
            {lessons.map((lesson, i) => {
              const impact = impactConfig[lesson.impact];
              const ImpactIcon = impact.icon;
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedLesson(lesson)}
                  className="bg-card border border-border rounded-xl p-5 card-hover cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
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
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${impact.color}`}>
                      <ImpactIcon size={12} />
                      {t(lang, lesson.impact)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
