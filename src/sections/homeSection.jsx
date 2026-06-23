import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Star, BookOpen, Mic, FileText, ChevronRight } from "lucide-react";
import homePageImg from "../assets/image/home_page.png";
import backgroundImg from "../assets/image/background-1.png";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";

/* ─── Palet warna Bletch AI — TikTok-style dark glass ───────
   Background : #000000  (hitam solid)
   Primary    : #3B82F6  (biru elektrik)
   Secondary  : #06B6D4  (cyan)
   Accent     : #8B5CF6  (ungu)
   Glass      : rgba(255,255,255,0.07) + blur(16-24px)
   Glass border: rgba(255,255,255,0.12–0.18)
   Glass highlight: inset 0 1px 0 rgba(255,255,255,0.12)
   Text utama : #F0F0F5
   Text sekunder: #888888
──────────────────────────────────────────────────────────── */

/* Reusable glass style tokens */
const glass = {
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  cardHover: {
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
  },
  pill: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  pillActive: {
    background: "rgba(59,130,246,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(59,130,246,0.28)",
    boxShadow: "inset 0 1px 0 rgba(59,130,246,0.20)",
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};

export default function HomeSection() {
  const [activeCategory, setActiveCategory] = useState("Rekayasa Perangkat Lunak");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [clickWave, setClickWave] = useState(null);

  const triggerClickWave = (cat) => {
    setClickWave({ cat, key: Date.now() + Math.random() });
  };

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
    { icon: Mic,      label: "Tips interview kerja" },
    { icon: BookOpen, label: "Materi RPL terbaru" },
  ];

  const popularTopics = [
    {
      icon: FileText,
      title: "Membuat CV ATS Friendly",
      desc: "Panduan lengkap CV yang lolos sistem rekrutmen modern.",
      badge: "🔥 Populer",
      color: "from-[#3B82F6]/30 to-transparent",
      accentBorder: "rgba(59,130,246,0.20)",
      iconBg: "bg-[#3B82F6]/10 border-[#3B82F6]/25",
      iconColor: "text-[#3B82F6]",
      badgeClass: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20",
    },
    {
      icon: Mic,
      title: "Tips Interview Kerja",
      desc: "Strategi menjawab pertanyaan sulit & bangun kepercayaan diri.",
      badge: "✨ Baru",
      color: "from-[#06B6D4]/30 to-transparent",
      accentBorder: "rgba(6,182,212,0.18)",
      iconBg: "bg-[#06B6D4]/10 border-[#06B6D4]/25",
      iconColor: "text-[#06B6D4]",
      badgeClass: "bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20",
    },
    {
      icon: BookOpen,
      title: "Optimasi Profil LinkedIn",
      desc: "Buat profil yang menarik perhatian rekruter industri.",
      badge: "✨ Baru",
      color: "from-[#8B5CF6]/30 to-transparent",
      accentBorder: "rgba(139,92,246,0.18)",
      iconBg: "bg-[#8B5CF6]/10 border-[#8B5CF6]/25",
      iconColor: "text-[#8B5CF6]",
      badgeClass: "bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20",
    },
  ];

  return (
    <section
      id="home"
      className="relative pb-6 overflow-hidden"
      style={{ background: "#000000" }}
    >
      <style>{`
        @keyframes ambient-drift {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(28%, -28%) scale(1.15); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        .animate-ambient-drift { animation: ambient-drift 9s ease-in-out infinite; }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.8; }
        }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-ambient-drift, .animate-pulse-glow { animation: none; }
        }
      `}</style>

      {/* ── Dekorasi background ── */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[160px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
      <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[140px]"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04] blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />

      {/* Grid lines dekoratif */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${backgroundImg})`, opacity: 0.03 }}
      />

      {/* ── Content wrapper ── */}
      <div className="relative z-10">

        {/* ── Hero ── */}
        <div className="px-3 md:px-12 pt-3 md:pt-8">
          <div
            className="relative rounded-[18px] md:rounded-[28px] overflow-hidden flex flex-col items-center justify-center text-center"
            style={{ height: "clamp(220px, 44vw, 360px)" }}
          >
            {/* Hero image */}
            <img src={homePageImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.95) 100%)" }} />
            {/* Border */}
            <div className="absolute inset-0 rounded-[18px] md:rounded-[28px] border border-white/[0.07] pointer-events-none" />

            <div className="relative z-10 px-3 md:px-6">

              {/* ✦ Badge — glass pill TikTok-style */}
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 text-[#AAAAAA] text-[10px] md:text-xs font-medium px-3 py-1 rounded-full mb-2 md:mb-4"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse-glow" />
                Sosialisasi & Edukasi Karier
              </motion.span>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-[clamp(22px,5.5vw,42px)] font-bold leading-tight"
              >
                <span
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, #E0E0E0 50%, #B0B0B0 100%)" }}
                >
                  Siapkan Dirimu
                  <br />
                  Menghadapi Dunia Kerja
                </span>
              </motion.h1>

              {/* Deskripsi desktop */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="hidden md:block text-[#666666] text-sm mt-3 max-w-md mx-auto leading-relaxed"
              >
                Bletch AI hadir membantu kamu mempersiapkan CV, melatih interview,
                dan menemukan peluang karier yang tepat — kapan saja kamu butuh.
              </motion.p>

              {/* ✦ Quick prompt chips — glass pills */}
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
                    className="flex shrink-0 items-center gap-1 text-[#AAAAAA] text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.13)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                      e.currentTarget.style.color = "#DDDDDD";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#AAAAAA";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
                    }}
                  >
                    <Icon size={11} />
                    {label}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ✦ Search Card — main glass panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative -mt-6 md:-mt-10 mx-0 md:mx-4"
          >
            <div
              className="relative overflow-hidden rounded-2xl md:rounded-3xl px-3 pt-3 pb-3 md:px-6 md:pt-5 md:pb-5"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              {/* Ambient glow */}
              <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden rounded-2xl md:rounded-3xl">
                <div className="absolute w-[140%] h-[140%] -left-1/4 -bottom-1/4 animate-ambient-drift"
                  style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
              </div>

              {/* ✦ Category pills — glass style */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 mb-3 md:mb-5 [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => {
                  const isActive  = activeCategory === cat;
                  const isHovered = hoveredCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { triggerClickWave(cat); setActiveCategory(cat); }}
                      onPointerEnter={() => setHoveredCategory(cat)}
                      onPointerLeave={() => setHoveredCategory(null)}
                      className="relative shrink-0 overflow-hidden text-[11px] md:text-xs font-medium px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-all duration-200"
                      style={isActive ? {
                        background: "rgba(59,130,246,0.18)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        color: "#93C5FD",
                        border: "1px solid rgba(59,130,246,0.30)",
                        boxShadow: "inset 0 1px 0 rgba(59,130,246,0.25), 0 0 12px rgba(59,130,246,0.08)",
                      } : {
                        background: isHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: isHovered ? "#999999" : "#555555",
                        border: "1px solid " + (isHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"),
                        boxShadow: isHovered ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
                      }}
                    >
                      {/* Shimmer hover */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.span
                            key={`shimmer-${cat}`}
                            className="absolute inset-y-0 w-1/3 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
                            initial={{ x: "-150%" }}
                            animate={{ x: "250%" }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Click wave */}
                      <AnimatePresence>
                        {clickWave?.cat === cat && (
                          <motion.span
                            key={clickWave.key}
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{ background: "rgba(59,130,246,0.10)" }}
                            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            onAnimationComplete={() => setClickWave(null)}
                          />
                        )}
                      </AnimatePresence>

                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>

              <h2 className="text-[13px] md:text-base font-medium text-[#888888] mb-2 md:mb-3">
                Apa yang ingin kamu pelajari hari ini?
              </h2>

              {/* ✦ Search input — glass inner */}
              <div
                className="rounded-xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <Search size={15} style={{ color: "#555555" }} className="shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tanyakan seputar layanan BLETCHAI..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[12px] md:text-sm text-[#E2E8F0] placeholder:text-[#3A3A3A]"
                  onFocus={e => {
                    const wrap = e.currentTarget.parentElement;
                    wrap.style.borderColor = "rgba(59,130,246,0.35)";
                    wrap.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.07), inset 0 1px 0 rgba(255,255,255,0.07)";
                    wrap.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onBlur={e => {
                    const wrap = e.currentTarget.parentElement;
                    wrap.style.borderColor = "rgba(255,255,255,0.09)";
                    wrap.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.07)";
                    wrap.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
                {/* ✦ Send button — glass accent */}
                <button
                  className="rounded-lg w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    background: "rgba(59,130,246,0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(59,130,246,0.28)",
                    boxShadow: "inset 0 1px 0 rgba(59,130,246,0.25)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.28)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.30), 0 0 12px rgba(59,130,246,0.15)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.18)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.25)";
                  }}
                >
                  <Send size={12} style={{ color: "#93C5FD" }} />
                </button>
              </div>

              <p className="text-[#333333] text-[10px] md:text-xs mt-1.5 ml-1">
                Chatbot akan membantu menjawab pertanyaan berdasarkan informasi yang tersedia.
              </p>

              {/* ✦ Social proof — glass divider row */}
              <div
                className="flex items-center gap-2.5 mt-2.5 pt-2.5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex -space-x-2">
                  {[["R", "#1A3050"], ["P", "#181F40"], ["L", "#251560"]].map(([letter, color]) => (
                    <div
                      key={letter}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold text-white"
                      style={{
                        backgroundColor: color,
                        borderColor: "#000000",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[12px] md:text-sm font-medium text-[#BBBBBB] leading-tight">2.500+ Peserta Aktif</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="text-[10px] md:text-xs text-[#555555]">4.9 Rating</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Materi Populer ── */}
        <Reveal className="px-3 md:px-12 mt-4 md:mt-10" amount={0.15}>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-[13px] md:text-sm font-medium text-[#555555]">Materi Populer</h3>
            {/* ✦ "Lihat semua" — glass chip */}
            <button
              className="flex items-center gap-1 text-[11px] md:text-xs font-medium transition-all duration-200 px-2.5 py-1 rounded-full"
              style={{
                color: "#666666",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#AAAAAA";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#666666";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              Lihat semua <ChevronRight size={13} />
            </button>
          </div>

          {/* ✦ Popular topic cards — frosted glass */}
          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4" stagger={0.1} amount={0.15}>
            {popularTopics.map(({ icon: Icon, title, desc, badge, color, accentBorder, iconBg, iconColor, badgeClass }) => (
              <motion.div
                key={title}
                variants={revealItem}
                whileHover={{ y: -3, scale: 1.008 }}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-5 cursor-pointer flex gap-3 md:block transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.border = `1px solid rgba(255,255,255,0.14)`;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)";
                }}
              >
                {/* Gradient top accent line */}
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r ${color}`} />

                {/* ✦ Icon — glass square */}
                <div
                  className={`relative w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl flex items-center justify-center md:mb-3 ${iconColor}`}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: `1px solid ${accentBorder}`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon size={15} />
                </div>

                <div className="relative flex-1 min-w-0">
                  <p className="text-[13px] md:text-sm font-medium text-[#E0E0E0] mb-0.5">{title}</p>
                  <p className="text-[11px] md:text-xs text-[#555555] leading-relaxed line-clamp-2">{desc}</p>
                  {/* ✦ Badge — glass pill */}
                  <span
                    className={`inline-block mt-1.5 md:mt-3 text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
                    style={{
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                    }}
                  >
                    {badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </Reveal>

      </div>
    </section>
  );
}