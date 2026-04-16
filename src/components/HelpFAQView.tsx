import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { faqItems } from "@/lib/dummy-data";

interface HelpFAQViewProps {
  lang: Language;
}

export function HelpFAQView({ lang }: HelpFAQViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "helpCenter")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "en" ? "Frequently asked questions about using the KMS" : "KMS አጠቃቀም ስለሚጠየቁ ጥያቄዎች"}
        </p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0">
                  <HelpCircle size={14} className="text-gold" />
                </div>
                <span className="font-display font-semibold text-sm text-foreground">{lang === "en" ? item.questionEn : item.questionAm}</span>
              </div>
              {openIndex === i ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
            </button>
            {openIndex === i && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-4 pl-15">
                <p className="text-sm text-foreground/80 leading-relaxed ml-11">{lang === "en" ? item.answerEn : item.answerAm}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
