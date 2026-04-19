import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Briefcase, ArrowRight, Globe } from "lucide-react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { useAuth, ROLE_META, type Role } from "@/hooks/use-auth";
import siinqeeLogo from "@/assets/siinqee-logo.webp";

interface LoginScreenProps {
  lang: Language;
  onLangChange: (l: Language) => void;
}

const roleIcons: Record<Role, typeof Building2> = {
  officer: Building2,
  manager: Briefcase,
  executive: ShieldCheck,
};

export function LoginScreen({ lang, onLangChange }: LoginScreenProps) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [role, setRole] = useState<Role>("officer");

  const canSubmit = name.trim().length > 1 && branch.trim().length > 1;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    login({ name: name.trim(), branch: branch.trim(), role });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light opacity-95" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.16 75 / 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.78 0.16 75 / 0.18) 0%, transparent 50%)",
      }} />

      <button
        onClick={() => onLangChange(lang === "en" ? "om" : "en")}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white/90 hover:bg-white/20 text-sm transition-colors"
      >
        <Globe size={14} /> {lang === "en" ? "Afaan Oromoo" : "English"}
      </button>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center">
            <img src={siinqeeLogo} alt="Siinqee Bank" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">{t(lang, "signInTitle")}</h1>
            <p className="text-xs text-muted-foreground">{t(lang, "signInSubtitle")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">{t(lang, "fullName")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "en" ? "e.g. Tadesse Bekele" : "fkn. Taaddasaa Baqqalaa"}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">{t(lang, "yourBranch")}</label>
            <input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder={lang === "en" ? "e.g. Shaggar Branch" : "fkn. Damee Shaggar"}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">{t(lang, "selectRole")}</label>
            <div className="space-y-2">
              {(Object.keys(ROLE_META) as Role[]).map((r) => {
                const meta = ROLE_META[r];
                const Icon = roleIcons[r];
                const active = role === r;
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                      active
                        ? "border-gold bg-gold-muted/40 ring-2 ring-gold/30"
                        : "border-border bg-background hover:border-gold/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "gold-gradient text-navy-dark" : "bg-muted text-muted-foreground"}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{lang === "en" ? meta.en : meta.om}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{lang === "en" ? meta.descEn : meta.descOm}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg gold-gradient text-navy-dark font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {t(lang, "enterToContinue")} <ArrowRight size={14} />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
