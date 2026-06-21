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
      <div className="px-3 md:px-12 pt-3 md:pt-8">
        <div
          className="relative rounded-[18px] md:rounded-[28px] overflow-hidden flex flex-col items-center justify-center text-center"
          style={{ height: "clamp(200px, 42vw, 340px)" }}
        >
          <img src={homePageImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111315]/80 via-[#111315]/55 to-[#111315]/90" />

          <div className="relative z-10 px-3 md:px-6">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-[#E5E5E5] text-[10px] md:text-xs font-medium px-3 py-1 rounded-full mb-2 md:mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" />
              Sosialisasi & Edukasi Karier
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-[clamp(18px,5vw,36px)] font-bold leading-tight"
            >
              <span className="text-white">Siapkan Dirimu</span>
              <br />
              <span className="text-white">Menghadapi </span>
              <span className="text-[#D9B996]">Dunia</span>{" "}
              <span className="text-[#A67C52]">Kerja</span>
            </motion.h1>

            {/* Deskripsi: hanya muncul di layar lebar */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="hidden md:block text-[#E5E5E5]/75 text-sm mt-3 max-w-md mx-auto leading-relaxed"
            >
              Bletch AI hadir membantu kamu mempersiapkan CV, melatih interview,
              dan menemukan peluang karier yang tepat — kapan saja kamu butuh.
            </motion.p>

            {/* Quick prompt chips — satu baris, tidak wrap */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center justify-center gap-1.5 mt-3 md:mt-5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
            >
              {quickPrompts.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setInputValue(label)}
                  className="flex shrink-0 items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white/80 text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200"
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Slide indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            <span className="w-4 h-1 rounded-full bg-[#A67C52]" />
            <span className="w-1.5 h-1 rounded-full bg-white/40" />
            <span className="w-1.5 h-1 rounded-full bg-white/40" />
          </div>
        </div>

        {/* ── Search Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative -mt-6 md:-mt-10 mx-0 md:mx-4"
        >
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-zinc-100 px-3 pt-3 pb-3 md:px-6 md:pt-5 md:pb-5">

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 mb-3 md:mb-5 [&::-webkit-scrollbar]:hidden">
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
                      relative shrink-0 overflow-hidden text-[11px] md:text-xs font-medium px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-colors duration-300 ease-out border
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

            <h2 className="text-[13px] md:text-lg font-semibold text-zinc-800 mb-2 md:mb-3">
              Apa yang ingin kamu pelajari hari ini?
            </h2>

            {/* Search input */}
            <div className="bg-[#F5F5F4] rounded-full border border-zinc-200 px-3 py-2 md:px-5 md:py-3.5 flex items-center gap-2 focus-within:border-[#A67C52]/50 focus-within:ring-2 focus-within:ring-[#A67C52]/10 transition-all">
              <Search size={15} className="text-zinc-400 shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan seputar layanan BLETCHAI..."
                className="flex-1 min-w-0 bg-transparent outline-none text-[12px] md:text-sm text-zinc-800 placeholder:text-zinc-400"
              />
              <button className="bg-[#6D4C41] hover:bg-[#A67C52] transition-colors duration-200 rounded-full w-7 h-7 md:w-9 md:h-9 flex items-center justify-center shrink-0 shadow-sm">
                <Send size={12} className="text-white" />
              </button>
            </div>

            <p className="text-zinc-400 text-[10px] md:text-xs mt-1.5 ml-1">
              Chatbot akan membantu menjawab pertanyaan berdasarkan informasi yang tersedia.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-2.5 mt-2.5 pt-2.5 border-t border-zinc-100">
              <div className="flex -space-x-2">
                {[["A", "#A67C52"], ["B", "#6D4C41"], ["C", "#8D6E63"], ["D", "#D9B996"]].map(([letter, color]) => (
                  <div
                    key={letter}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[12px] md:text-sm font-semibold text-zinc-800 leading-tight">2.500+ Peserta Aktif</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={10} className="fill-[#A67C52] text-[#A67C52]" />
                  <span className="text-[10px] md:text-xs text-zinc-500">4.9 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Materi Populer ── */}
      <Reveal className="px-3 md:px-12 mt-4 md:mt-10" amount={0.15}>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-[13px] md:text-base font-semibold text-zinc-800">Materi Populer</h3>
          <button className="flex items-center gap-1 text-[11px] md:text-xs font-medium text-[#A67C52] hover:text-[#6D4C41] transition-colors">
            Lihat semua <ChevronRight size={13} />
          </button>
        </div>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4" stagger={0.1} amount={0.15}>
          {popularTopics.map(({ icon: Icon, title, desc, badge, badgeColor }) => (
            <motion.div
              key={title}
              variants={revealItem}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-zinc-100 hover:border-[#A67C52]/30 hover:shadow-md transition-all cursor-pointer flex gap-3 md:block"
            >
              {/* Mobile: ikon di kiri, konten di kanan (horizontal) */}
              <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center md:mb-3">
                <Icon size={15} className="text-[#A67C52]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] md:text-sm font-semibold text-zinc-800 mb-0.5">{title}</p>
                <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed line-clamp-2">{desc}</p>
                <span className={`inline-block mt-1.5 md:mt-3 text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {badge}
                </span>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </Reveal>

    </section>
  );
}