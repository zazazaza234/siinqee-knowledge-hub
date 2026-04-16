import { Folder, FileText, Download, Eye, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { documents } from "@/lib/dummy-data";

interface KnowledgeBaseViewProps {
  lang: Language;
}

const departments = [
  { nameEn: "Microfinance", nameAm: "ማይክሮፋይናንስ", count: 342, color: "bg-chart-1" },
  { nameEn: "Corporate Services", nameAm: "የድርጅት አገልግሎቶች", count: 518, color: "bg-chart-2" },
  { nameEn: "Human Capital Management", nameAm: "የሰው ሀብት አስተዳደር", count: 196, color: "bg-chart-3" },
  { nameEn: "Risk & Compliance", nameAm: "ስጋት እና ተገዢነት", count: 421, color: "bg-chart-4" },
];

export function KnowledgeBaseView({ lang }: KnowledgeBaseViewProps) {
  const [search, setSearch] = useState("");
  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.dept.toLowerCase().includes(search.toLowerCase())
  );

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
          {departments.map((dept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 card-hover cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-lg ${dept.color}/15 flex items-center justify-center mb-3`}>
                <Folder size={18} className="text-gold" />
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground">{lang === "en" ? dept.nameEn : dept.nameAm}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{dept.count} {t(lang, "documents").toLowerCase()}</p>
            </motion.div>
          ))}
        </div>
      </div>

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
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <FileText size={14} className="text-gold flex-shrink-0" />
                    <span className="text-foreground">{lang === "en" ? doc.title : doc.titleAm}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{lang === "en" ? doc.dept : doc.deptAm}</td>
                  <td className="py-3 px-4 text-muted-foreground">{doc.date}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
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
    </div>
  );
}
