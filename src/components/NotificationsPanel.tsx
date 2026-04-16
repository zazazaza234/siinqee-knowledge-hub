import { Bell, FileText, Users, Lightbulb, BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { notifications as defaultNotifications } from "@/lib/dummy-data";

interface NotificationsPanelProps {
  lang: Language;
}

const typeIcons = {
  document: FileText,
  expert: Users,
  idea: Lightbulb,
  lesson: BookOpen,
};

export function NotificationsPanel({ lang }: NotificationsPanelProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(defaultNotifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell size={18} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-display font-semibold text-sm text-foreground">{t(lang, "notifications")}</h3>
                <button onClick={markAllRead} className="text-xs text-gold hover:underline">{t(lang, "markAllRead")}</button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {items.map((notif) => {
                  const Icon = typeIcons[notif.type];
                  return (
                    <div key={notif.id} className={`px-4 py-3 flex items-start gap-3 ${!notif.read ? "bg-gold-muted/30" : ""}`}>
                      <div className="w-7 h-7 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={13} className="text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-relaxed">{lang === "en" ? notif.titleEn : notif.titleAm}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{lang === "en" ? notif.time : notif.timeAm}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
