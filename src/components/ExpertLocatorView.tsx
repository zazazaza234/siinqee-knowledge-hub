import { MessageSquare, Calendar, User, X, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

type ModalMode = "message" | "book" | null;

export function ExpertLocatorView({ lang }: ExpertLocatorViewProps) {
  const [selectedExpert, setSelectedExpert] = useState<typeof experts[number] | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [messageText, setMessageText] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [showSuccess, setShowSuccess] = useState<"message" | "booking" | null>(null);
  const [searchTag, setSearchTag] = useState("");

  const openModal = (expert: typeof experts[number], mode: ModalMode) => {
    setSelectedExpert(expert);
    setModalMode(mode);
    setMessageText("");
    setBookingDate("");
    setBookingTime("");
    setBookingTopic("");
  };

  const closeModal = () => {
    setSelectedExpert(null);
    setModalMode(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    closeModal();
    setShowSuccess("message");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleBookConsult = () => {
    if (!bookingDate || !bookingTime || !bookingTopic.trim()) return;
    closeModal();
    setShowSuccess("booking");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const filteredExperts = searchTag
    ? experts.filter((exp) => exp.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase())) || exp.tagsAm.some((tag) => tag.includes(searchTag)))
    : experts;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "expertLocator")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t(lang, "expertLocatorSubtitle")}</p>
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        {["Agricultural Loans", "Sharia Compliance", "Cyber Security", "Mobile Banking", "Trade Finance", "Talent Management"].map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchTag(searchTag === tag ? "" : tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${searchTag === tag ? "bg-gold text-gold-foreground" : "bg-gold-muted text-gold hover:bg-gold/20"}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperts.map((expert, i) => (
          <motion.div key={expert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-border rounded-xl p-5 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">{lang === "en" ? expert.name : expert.nameAm}</h3>
                <p className="text-xs text-muted-foreground">{lang === "en" ? expert.title : expert.titleAm}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{lang === "en" ? expert.bio : expert.bioAm}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {(lang === "en" ? expert.tags : expert.tagsAm).map((tag, j) => (
                <span key={j} onClick={() => setSearchTag(lang === "en" ? expert.tags[j] : tag)} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gold-muted text-gold cursor-pointer hover:bg-gold/20 transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => openModal(expert, "message")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                <MessageSquare size={13} /> {t(lang, "messageExpert")}
              </button>
              <button onClick={() => openModal(expert, "book")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors">
                <Calendar size={13} /> {t(lang, "bookConsult")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-[200]"
          >
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{t(lang, showSuccess === "message" ? "messageSent" : "bookingConfirmed")}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selectedExpert && modalMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[experts.indexOf(selectedExpert) % avatarColors.length]} flex items-center justify-center`}>
                    <User size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{lang === "en" ? selectedExpert.name : selectedExpert.nameAm}</h3>
                    <p className="text-xs text-muted-foreground">{lang === "en" ? selectedExpert.title : selectedExpert.titleAm}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={18} /></button>
              </div>

              <div className="p-5 space-y-4">
                {modalMode === "message" ? (
                  <>
                    <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "messageExpert")}</label>
                    <textarea
                      rows={4}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={t(lang, "messagePlaceholder")}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">{t(lang, "cancel")}</button>
                      <button onClick={handleSendMessage} disabled={!messageText.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                        <Send size={14} /> {t(lang, "send")}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "bookingTopic")}</label>
                      <input value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "bookingDate")}</label>
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{t(lang, "bookingTime")}</label>
                        <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30">
                          <option value="">--</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:00">03:00 PM</option>
                          <option value="16:00">04:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">{t(lang, "cancel")}</button>
                      <button onClick={handleBookConsult} disabled={!bookingDate || !bookingTime || !bookingTopic.trim()} className="px-4 py-2 rounded-lg gold-gradient text-navy-dark text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5">
                        <Calendar size={14} /> {t(lang, "bookingConfirm")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
