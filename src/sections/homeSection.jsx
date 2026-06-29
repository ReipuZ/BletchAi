import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Star, BookOpen, Mic, FileText, ChevronRight, ArrowUpRight } from "lucide-react";
import homePageImg from "../assets/image/home_page1.png";
import homePageImg2 from "../assets/image/home_page2.jpg";
import homePageImg4 from "../assets/image/home_page4.png";
import backgroundImg from "../assets/image/background-1.png";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";
import ChatOverlay from "./ChatOverlay.jsx";

const glass = {
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
  },
};

export default function HomeSection() {
  const [activeCategory, setActiveCategory] = useState("Rekayasa Perangkat Lunak");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [clickWave, setClickWave] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const heroImages = [homePageImg, homePageImg2, homePageImg4];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setPrevSlide(currentSlide);
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        setTimeout(() => { setPrevSlide(null); setIsAnimating(false); }, 700);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const goToSlide = (i) => {
    if (!isAnimating && i !== currentSlide) {
      setPrevSlide(currentSlide);
      setIsAnimating(true);
      setCurrentSlide(i);
      setTimeout(() => { setPrevSlide(null); setIsAnimating(false); }, 700);
    }
  };

  const triggerClickWave = (cat) => setClickWave({ cat, key: Date.now() + Math.random() });

  const [overlayInitMsg, setOverlayInitMsg] = useState("");

  const openChat = (msg) => {
    const text = msg || inputValue;
    if (!text.trim()) return;
    setOverlayInitMsg(text.trim());
    setInputValue("");
    setShowOverlay(true);
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
      iconColor: "text-[#3B82F6]",
      badgeClass: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20",
      accentLine: "rgba(59,130,246,0.5)",
    },
    {
      icon: Mic,
      title: "Tips Interview Kerja",
      desc: "Strategi menjawab pertanyaan sulit & bangun kepercayaan diri.",
      badge: "✨ Baru",
      color: "from-[#06B6D4]/30 to-transparent",
      accentBorder: "rgba(6,182,212,0.18)",
      iconColor: "text-[#06B6D4]",
      badgeClass: "bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20",
      accentLine: "rgba(6,182,212,0.5)",
    },
    {
      icon: BookOpen,
      title: "Optimasi Profil LinkedIn",
      desc: "Buat profil yang menarik perhatian rekruter industri.",
      badge: "✨ Baru",
      color: "from-[#8B5CF6]/30 to-transparent",
      accentBorder: "rgba(139,92,246,0.18)",
      iconColor: "text-[#8B5CF6]",
      badgeClass: "bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20",
      accentLine: "rgba(139,92,246,0.5)",
    },
  ];

  return (
    <section
      id="home"
      className="relative pb-6 md:pb-10 overflow-hidden"
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
        @keyframes shimmer-rtl {
          0%   { background-position: 220% center; background-size: 280% 100%; }
          40%  { background-position: 90% center;  background-size: 420% 100%; }
          60%  { background-position: 50% center;  background-size: 420% 100%; }
          100% { background-position: -120% center; background-size: 280% 100%; }
        }
        .animate-shimmer-text { animation: shimmer-rtl 16s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-ambient-drift, .animate-pulse-glow, .animate-shimmer-text { animation: none; }
        }
      `}</style>

      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[160px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
      <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[140px]"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04] blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${backgroundImg})`, opacity: 0.03 }} />

      <ChatOverlay show={showOverlay} onClose={() => setShowOverlay(false)} initialMessage={overlayInitMsg} />

      <div className="relative z-10">

        {/* Hero — pt dikurangi di mobile agar tidak ada gap besar */}
        <div className="px-3 md:px-12 pt-0 md:pt-10">
          <div
            className="relative z-10 rounded-[20px] md:rounded-[36px] overflow-visible flex flex-col items-center justify-center text-center"
            style={{
              /* 
                MOBILE: tinggi dikurangi jadi ~220px, bukan 280px+
                Desktop tetap sama seperti sebelumnya
              */
              minHeight: "clamp(180px, 40svh, 400px)",
              paddingTop: "clamp(20px, 4vw, 60px)",
              paddingBottom: "clamp(52px, 10vw, 80px)",
            }}
          >
            <div className="absolute inset-0 rounded-[20px] md:rounded-[36px] overflow-hidden pointer-events-none">
              <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence initial={false}>
                  {prevSlide !== null && (
                    <motion.img key={`prev-${prevSlide}`} src={heroImages[prevSlide]} alt=""
                      className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 1 }}
                      initial={{ x: "0%" }} animate={{ x: "-100%" }} exit={{}}
                      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} />
                  )}
                  <motion.img key={`slide-${currentSlide}`} src={heroImages[currentSlide]} alt=""
                    className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 2 }}
                    initial={{ x: isAnimating ? "100%" : "0%" }} animate={{ x: "0%" }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} />
                </AnimatePresence>
              </div>
              <div className="absolute inset-0" style={{ zIndex: 3,
                background: `radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.08) 0%, transparent 55%),
                  linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.98) 100%)` }} />
              <div className="absolute inset-0 rounded-[20px] md:rounded-[36px] border border-white/[0.07] pointer-events-none" style={{ zIndex: 4 }} />
              <div className="absolute bottom-[36%] inset-x-0 h-px mx-10 md:mx-24 pointer-events-none" style={{ zIndex: 4,
                background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }} />
            </div>

            <div className="relative z-10 px-4 md:px-8 pb-4 md:pb-6">
              <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 text-[#AAAAAA] text-[10px] md:text-xs font-medium px-3 py-1 rounded-full mb-2 md:mb-5"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.14)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse-glow" />
                Sosialisasi &amp; Edukasi Karier
              </motion.span>

              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
                className="text-[clamp(20px,5vw,52px)] font-bold leading-[1.3] tracking-tight pb-1">
                <span className="block bg-clip-text text-transparent animate-shimmer-text pb-1"
                  style={{
                    backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 25%, #EFF6FF 36%, #BFDBFE 44%, #93C5FD 50%, #BFDBFE 56%, #EFF6FF 64%, #ffffff 75%, #ffffff 100%)",
                    backgroundSize: "250% 100%",
                  }}>
                  Siapkan Dirimu<br className="hidden sm:block" />{" "}Menghadapi Dunia Kerja
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="hidden md:block text-[#777777] text-sm mt-4 max-w-md mx-auto leading-relaxed">
                Bletch AI hadir membantu kamu mempersiapkan CV, melatih interview,
                dan menemukan peluang karier yang tepat — kapan saja kamu butuh.
              </motion.p>

              <div className="flex items-center justify-center gap-1.5 mt-2 md:mt-3">
                {heroImages.map((_, i) => (
                  <button key={i} onClick={() => goToSlide(i)} aria-label={`Slide ${i + 1}`}
                    style={{ width: "5px", height: "5px", borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, transition: "background 0.3s",
                      background: i === currentSlide ? "rgba(147,197,253,0.7)" : "rgba(255,255,255,0.20)" }} />
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                className="flex items-center justify-center gap-1.5 md:gap-2 mt-2 md:mt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {quickPrompts.map(({ icon: Icon, label }) => (
                  <button key={label}
                    onClick={() => { setInputValue(label); openChat(label); }}
                    className="flex shrink-0 items-center gap-1 text-[#AAAAAA] text-[9px] md:text-xs font-medium px-2 md:px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105"
                    style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.13)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; e.currentTarget.style.color = "#DDDDDD"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#AAAAAA"; }}>
                    <Icon size={10} />{label}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Search Card — overlap lebih sedikit di mobile */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-20 -mt-10 md:-mt-12 mx-0 md:mx-4">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl px-3 pt-3 pb-3 md:px-7 md:pt-6 md:pb-6"
              style={{ background: "rgba(10,10,10,0.88)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 20px 60px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)" }}>

              <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden rounded-2xl md:rounded-3xl">
                <div className="absolute w-[140%] h-[140%] -left-1/4 -bottom-1/4 animate-ambient-drift"
                  style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto pb-0.5 mb-3 md:mb-6 [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => {
                  const isActive  = activeCategory === cat;
                  const isHovered = hoveredCategory === cat;
                  return (
                    <button key={cat}
                      onClick={() => { triggerClickWave(cat); setActiveCategory(cat); }}
                      onPointerEnter={() => setHoveredCategory(cat)}
                      onPointerLeave={() => setHoveredCategory(null)}
                      className="relative shrink-0 overflow-hidden text-[10px] md:text-xs font-medium px-2.5 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-all duration-200"
                      style={isActive ? {
                        background: "rgba(59,130,246,0.18)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                        color: "#93C5FD", border: "1px solid rgba(59,130,246,0.35)",
                        boxShadow: "inset 0 1px 0 rgba(59,130,246,0.25), 0 0 16px rgba(59,130,246,0.10)",
                      } : {
                        background: isHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                        color: isHovered ? "#999999" : "#4A4A4A",
                        border: "1px solid " + (isHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"),
                      }}>
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.span key={`shimmer-${cat}`} className="absolute inset-y-0 w-1/3 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
                            initial={{ x: "-150%" }} animate={{ x: "250%" }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }} />
                        )}
                      </AnimatePresence>
                      <AnimatePresence>
                        {clickWave?.cat === cat && (
                          <motion.span key={clickWave.key} className="absolute inset-0 rounded-full pointer-events-none"
                            style={{ background: "rgba(59,130,246,0.10)" }}
                            initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            onAnimationComplete={() => setClickWave(null)} />
                        )}
                      </AnimatePresence>
                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <h2 className="text-[12px] md:text-sm font-medium text-[#666666] shrink-0">
                  Apa yang ingin kamu pelajari hari ini?
                </h2>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>

              <div className="rounded-xl px-3 py-2 md:px-4 md:py-3.5 flex items-center gap-2.5 transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
                <Search size={14} style={{ color: "#444444" }} className="shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && openChat()}
                  placeholder="Tanyakan seputar layanan BLETCHAI..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[11px] md:text-sm text-[#E2E8F0] placeholder:text-[#333333]"
                  onFocus={e => {
                    const wrap = e.currentTarget.parentElement;
                    wrap.style.borderColor = "rgba(59,130,246,0.40)";
                    wrap.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.06)";
                    wrap.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onBlur={e => {
                    const wrap = e.currentTarget.parentElement;
                    wrap.style.borderColor = "rgba(255,255,255,0.08)";
                    wrap.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
                    wrap.style.background = "rgba(255,255,255,0.04)";
                  }}
                />
                <button onClick={openChat} disabled={!inputValue.trim()}
                  className="rounded-lg w-7 h-7 md:w-9 md:h-9 flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "rgba(59,130,246,0.22)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(59,130,246,0.32)", boxShadow: "inset 0 1px 0 rgba(59,130,246,0.28), 0 0 12px rgba(59,130,246,0.08)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.32)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.22)"; }}>
                  <Send size={12} style={{ color: "#93C5FD" }} />
                </button>
              </div>

              <p className="text-[#2E2E2E] text-[9px] md:text-xs mt-1.5 md:mt-2 ml-0.5">
                Chatbot akan membantu menjawab pertanyaan berdasarkan informasi yang tersedia.
              </p>

              <div className="flex items-center gap-3 mt-3 md:mt-4 pt-3 md:pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex -space-x-2">
                  {[["R", "#1A3050"], ["P", "#181F40"], ["L", "#251560"]].map(([letter, color]) => (
                    <div key={letter}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-semibold text-white"
                      style={{ backgroundColor: color, borderColor: "#0A0A0A", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] md:text-sm font-semibold text-[#CCCCCC] leading-tight">2.500+ Peserta Aktif</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={9} className="fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="text-[9px] md:text-xs text-[#555555]">4.9 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Materi Populer — mt dikurangi di mobile */}
        <Reveal className="px-3 md:px-12 mt-4 md:mt-12" amount={0.15}>
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div>
              <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.12em] mb-0.5 md:mb-1"
                style={{ color: "rgba(255,255,255,0.18)" }}>Kurikulum</p>
              <h3 className="text-xs md:text-base font-semibold text-[#888888]">Materi Populer</h3>
            </div>
            <button className="flex items-center gap-1 text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
              style={{ color: "#555555", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#AAAAAA"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555555"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
              Lihat semua <ChevronRight size={13} />
            </button>
          </div>

          <RevealGroup className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1} amount={0.15}>
            {popularTopics.map((topic) => <DesktopCard key={topic.title} {...topic} />)}
          </RevealGroup>

          <div className="md:hidden flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {popularTopics.map((topic) => <MobileCard key={topic.title} {...topic} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DesktopCard({ icon: Icon, title, desc, badge, color, accentBorder, iconColor, badgeClass, accentLine }) {
  return (
    <motion.div variants={revealItem} whileHover={{ y: -4, scale: 1.010 }}
      className="group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; }}>
      <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background: `linear-gradient(to right, ${accentLine}, transparent 70%)` }} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${color} opacity-40`} />
      <div className={`relative w-11 h-11 shrink-0 rounded-xl flex items-center justify-center mb-4 ${iconColor}`}
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          border: `1px solid ${accentBorder}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        <Icon size={16} />
      </div>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold text-[#E0E0E0] leading-snug">{title}</p>
        <ArrowUpRight size={14} className="shrink-0 mt-0.5 text-[#888888] opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
      </div>
      <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 mb-4">{desc}</p>
      <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${badgeClass}`}
        style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>{badge}</span>
    </motion.div>
  );
}

function MobileCard({ icon: Icon, title, desc, badge, color, accentBorder, iconColor, badgeClass, accentLine }) {
  return (
    <div className="relative overflow-hidden rounded-xl p-3.5 cursor-pointer flex-shrink-0 snap-start"
      style={{ width: "calc(75vw)", maxWidth: "260px", background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
      <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background: `linear-gradient(to right, ${accentLine}, transparent 70%)` }} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${color} opacity-40`} />
      <div className="flex items-start gap-3 relative">
        <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${iconColor}`}
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${accentBorder}` }}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <p className="text-[12px] font-semibold text-[#E0E0E0] leading-snug">{title}</p>
            <ArrowUpRight size={12} className="shrink-0 mt-0.5 text-[#555555]" />
          </div>
          <p className="text-[10px] text-[#555555] leading-relaxed line-clamp-2 mb-2">{desc}</p>
          <span className={`inline-block text-[9px] font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>{badge}</span>
        </div>
      </div>
    </div>
  );
}