import { Search, FileText, Users, Lightbulb, GitBranch, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { quickLinks, branchInsights } from "@/lib/dummy-data";

interface DashboardViewProps {
  lang: Language;
}

const stats = [
  { key: "totalDocuments" as const, value: "2,847", icon: FileText, change: "+12%" },
  { key: "activeExperts" as const, value: "156", icon: Users, change: "+5" },
  { key: "ideasSubmitted" as const, value: "89", icon: Lightbulb, change: "+23%" },
  { key: "branchUpdates" as const, value: "34", icon: GitBranch, change: "This week" },
];

export function DashboardView({ lang }: DashboardViewProps) {
  return (
    <div className="space-y-8">
      {/* Welcome & Search */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display font-bold text-foreground"
        >
          {t(lang, "welcomeBack")}, Obbo Tadesse 👋
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "en" ? "Access knowledge, connect with experts, and drive innovation." : "እውቀት ያግኙ፣ ከባለሙያዎች ጋር ይገናኙ፣ እና ፈጠራን ያንቀሳቅሱ።"}
        </p>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder={t(lang, "searchPlaceholder")}
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm shadow-sm transition-all"
        />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="bg-card rounded-xl p-4 border border-border card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gold-muted flex items-center justify-center">
                <stat.icon size={16} className="text-gold" />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(lang, stat.key)}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links & Branch Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-foreground mb-4">{t(lang, "quickLinks")}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-card border border-border rounded-xl p-4 card-hover cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center mb-3">
                  <FileText size={14} className="text-navy-dark" />
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground leading-snug mb-1.5">
                  {lang === "en" ? link.titleEn : link.titleAm}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {lang === "en" ? link.descEn : link.descAm}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gold group-hover:gap-2 transition-all">
                  {t(lang, "view")} <ArrowRight size={12} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Branch Insights */}
        <div>
          <h2 className="font-display font-semibold text-foreground mb-4">{t(lang, "recentBranchInsights")}</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {branchInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gold">{insight.branch}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} /> {lang === "en" ? insight.time : insight.timeAm}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "en" ? insight.messageEn : insight.messageAm}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
