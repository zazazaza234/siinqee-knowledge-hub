import { MessageSquare, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { experts } from "@/lib/dummy-data";

interface ExpertLocatorViewProps {
  lang: Language;
}

const avatarColors = [
  "from-gold to-amber-500",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-sky-600",
];

export function ExpertLocatorView({ lang }: ExpertLocatorViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "expertLocator")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t(lang, "expertLocatorSubtitle")}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {experts.map((expert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-xl p-5 card-hover"
          >
            {/* Avatar & Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">{lang === "en" ? expert.name : expert.nameAm}</h3>
                <p className="text-xs text-muted-foreground">{lang === "en" ? expert.title : expert.titleAm}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(lang === "en" ? expert.tags : expert.tagsAm).map((tag, j) => (
                <span
                  key={j}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gold-muted text-gold cursor-pointer hover:bg-gold/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                <MessageSquare size={13} /> {t(lang, "messageExpert")}
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors">
                <Calendar size={13} /> {t(lang, "bookConsult")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
