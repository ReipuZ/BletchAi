import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Star, BookOpen, Mic, FileText, ChevronRight } from "lucide-react";
import homePageImg from "../assets/image/home_page.png";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";

export default function HomeSection() {
  const [activeCategory, setActiveCategory] = useState("Rekayasa Perangkat Lunak");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const categories = [
    "Rekayasa Perangkat Lunak",
    "Teknik Otomotif",
    "Desain Grafis",
    "Akuntansi",
    "Tata Boga",
    "Multimedia",
  ];

  const quickPrompts = [
    { icon: FileText, label: "Cara buat CV ATS" },
    { icon: Mic, label: "Tips interview kerja" },
    { icon: BookOpen, label: "Materi RPL terbaru" },
  ];

  const popularTopics = [
    {
      icon: FileText,
      title: "Membuat CV ATS Friendly",
      desc: "Panduan lengkap CV yang lolos sistem rekrutmen modern.",
      badge: "🔥 Populer",
      badgeColor: "bg-orange-50 text-orange-600",
    },
    {
      icon: Mic,
      title: "Tips Interview Kerja",
      desc: "Strategi menjawab pertanyaan sulit & bangun kepercayaan diri.",
      badge: "✨ Baru",
      badgeColor: "bg-amber-50 text-[#A67C52]",
    },
    {
      icon: BookOpen,
      title: "Optimasi Profil LinkedIn",
      desc: "Buat profil yang menarik perhatian rekruter industri.",
      badge: "✨ Baru",
      badgeColor: "bg-amber-50 text-[#A67C52]",
    },
  ];

  return (
    <section id="home" className="min-h-screen bg-[#F5F3F0] pb-16">

      {/* ── Hero ── */}
      <div className="px-4 sm:px-8 md:px-12 pt-4 sm:pt-8">
        <div className="relative rounded-[20px] sm:rounded-[28px] overflow-hidden h-[300px] sm:h-[320px] md:h-[340px] flex flex-col items-center justify-center text-center">
          <img
            src={homePageImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111315]/80 via-[#111315]/55 to-[#111315]/90" />

          <div className="relative z-10 px-4 sm:px-6">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-[#E5E5E5] text-[11px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" />
              Sosialisasi & Edukasi Karier
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            >
              <span className="text-white">Siapkan Dirimu</span>
              <br />
              <span className="text-white">Menghadapi </span>
              <span className="text-[#D9B996]">Dunia</span>{" "}
              <span className="text-[#A67C52]">Kerja</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[#E5E5E5]/75 text-xs sm:text-sm mt-2.5 sm:mt-3 max-w-md mx-auto leading-relaxed"
            >
              Bletch AI hadir membantu kamu mempersiapkan CV, melatih interview,
              dan menemukan peluang karier yang tepat — kapan saja kamu butuh.
            </motion.p>

            {/* Quick prompt chips di dalam hero */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 flex-wrap"
            >
              {quickPrompts.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setInputValue(label)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white/80 text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200"
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Slide indicator dots */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            <span className="w-4 h-1.5 rounded-full bg-[#A67C52]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* ── Search Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative -mt-8 sm:-mt-10 mx-0 sm:mx-4"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-zinc-100 p-4 sm:p-6 pb-4 sm:pb-5">

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 sm:mb-5 [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const isHovered = hoveredCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`
                      relative shrink-0 overflow-hidden text-[11px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-colors duration-300 ease-out border
                      ${isActive
                        ? "bg-[#111315] text-white border-[#111315] shadow-md"
                        : "text-zinc-500 border-zinc-200 hover:border-[#A67C52]/40 hover:text-[#6D4C41]"
                      }
                    `}
                  >
                    {!isActive && (
                      <motion.span
                        className="absolute inset-0 bg-[#A67C52]/10 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <AnimatePresence>
                      {isHovered && !isActive && (
                        <motion.span
                          key={`shimmer-${cat}`}
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
                          initial={{ x: "-150%" }}
                          animate={{ x: "250%" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-zinc-800 mb-3">
              Apa yang ingin kamu pelajari hari ini?
            </h2>

            {/* Search input */}
            <div className="bg-[#F5F5F4] rounded-full border border-zinc-200 px-3.5 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2 sm:gap-3 focus-within:border-[#A67C52]/50 focus-within:ring-2 focus-within:ring-[#A67C52]/10 transition-all">
              <Search size={17} className="text-zinc-400 shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan seputar layanan BLETCHAI..."
                className="flex-1 min-w-0 bg-transparent outline-none text-[13px] sm:text-sm text-zinc-800 placeholder:text-zinc-400"
              />
              <button className="bg-[#6D4C41] hover:bg-[#A67C52] transition-colors duration-200 rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 shadow-sm">
                <Send size={14} className="text-white" />
              </button>
            </div>

            <p className="text-zinc-400 text-[11px] sm:text-xs mt-2.5 ml-1">
              Chatbot akan membantu menjawab pertanyaan berdasarkan informasi yang tersedia.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
              <div className="flex -space-x-2.5">
                {[["A", "#A67C52"], ["B", "#6D4C41"], ["C", "#8D6E63"], ["D", "#D9B996"]].map(([letter, color]) => (
                  <div
                    key={letter}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[13px] sm:text-sm font-semibold text-zinc-800 leading-tight">2.500+ Peserta Aktif</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="fill-[#A67C52] text-[#A67C52]" />
                  <span className="text-[11px] sm:text-xs text-zinc-500">4.9 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Materi Populer ── */}
      <Reveal className="px-4 sm:px-8 md:px-12 mt-8 sm:mt-10" amount={0.15}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-800">Materi Populer</h3>
          <button className="flex items-center gap-1 text-xs font-medium text-[#A67C52] hover:text-[#6D4C41] transition-colors">
            Lihat semua <ChevronRight size={14} />
          </button>
        </div>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" stagger={0.1} amount={0.15}>
          {popularTopics.map(({ icon: Icon, title, desc, badge, badgeColor }) => (
            <motion.div
              key={title}
              variants={revealItem}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-100 hover:border-[#A67C52]/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3">
                <Icon size={18} className="text-[#A67C52]" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 mb-1">{title}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              <span className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            </motion.div>
          ))}
        </RevealGroup>
      </Reveal>

    </section>
  );
}