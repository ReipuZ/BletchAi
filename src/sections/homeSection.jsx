import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Star, BookOpen, Mic, FileText, ChevronRight, ArrowUpRight, Wrench, Palette, Calculator, ChefHat, Camera, X } from "lucide-react";
import homePageImg from "../assets/image/home_page1.png";
import homePageImg2 from "../assets/image/home_page2.jpg";
import homePageImg4 from "../assets/image/home_page4.png";
import backgroundImg from "../assets/image/background-1.png";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";
import ChatOverlay from "./ChatOverlay.jsx";

export default function HomeSection() {
  const [activeCategory, setActiveCategory] = useState("Rekayasa Perangkat Lunak");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [clickWave, setClickWave] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayInitMsg, setOverlayInitMsg] = useState("");

  // NEW: dipakai saat user melanjutkan sesi lama dari HistoryPage.
  // overlayInitMessages = riwayat pesan sesi tsb, overlaySessionId = id-nya
  // (supaya ChatOverlay tahu harus UPDATE sesi ini, bukan bikin sesi baru).
  const [overlayInitMessages, setOverlayInitMessages] = useState(null);
  const [overlaySessionId, setOverlaySessionId] = useState(null);

  // NEW: kontrol overlay "Lihat semua" materi (modal, sama seperti CourseRecommendation)
  const [showAllModal, setShowAllModal] = useState(false);

  // CHANGED: deteksi sinyal dari HistoryPage saat tombol "Mulai chat baru" /
  // "Lanjutkan chat" / tombol kembali diklik (navigate("/", { state: {...} })).
  //
  // BUGFIX: sebelumnya overlay bisa muncul tiba-tiba tanpa diminta saat user
  // menavigasi balik (tombol back browser/perangkat) ke halaman beranda,
  // karena history entry lama di browser masih menyimpan state.openChat=true
  // dari kunjungan sebelumnya, lalu effect ini ke-trigger ulang.
  //
  // Perbaikan: setiap sinyal dari HistoryPage sekarang dibungkus dengan
  // `navId` unik (Date.now()+random). Kita simpan id sinyal yang TERAKHIR
  // KALI sudah diproses di sessionStorage. Kalau navId yang datang sama
  // dengan yang sudah pernah diproses, effect ini diabaikan — jadi replay
  // dari history/back-forward tidak akan membuka overlay lagi.
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const signal = location.state;
    if (signal?.openChat && signal?.navId) {
      const lastProcessed = sessionStorage.getItem("bletch_last_openchat_navid");
      if (lastProcessed === String(signal.navId)) {
        // Sinyal ini sudah pernah diproses sebelumnya (kemungkinan besar
        // hasil back/forward browser membawa state lama) — abaikan.
        return;
      }
      sessionStorage.setItem("bletch_last_openchat_navid", String(signal.navId));

      if (signal.continueSession && signal.sessionMessages) {
        // Melanjutkan sesi lama dari HistoryPage
        setOverlayInitMessages(signal.sessionMessages);
        setOverlaySessionId(signal.sessionId || null);
        setOverlayInitMsg("");
      } else {
        // Chat baru biasa
        setOverlayInitMessages(null);
        setOverlaySessionId(null);
        setOverlayInitMsg("");
      }

      setShowOverlay(true);
      // Bersihkan state URL supaya tidak ke-trigger lagi saat halaman di-refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

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

  const openChat = (msg) => {
    const text = msg || inputValue;
    if (!text.trim()) return;
    // Chat baru biasa dari beranda — pastikan tidak membawa sisa riwayat
    // sesi lama dari percobaan "lanjutkan chat" sebelumnya.
    setOverlayInitMessages(null);
    setOverlaySessionId(null);
    setOverlayInitMsg(text.trim());
    setInputValue("");
    setShowOverlay(true);
  };

  // NEW: ketika jurusan diklik, langsung kirim pertanyaan otomatis ke AI
  const handleCategoryClick = (cat) => {
    triggerClickWave(cat);
    setActiveCategory(cat);
    const prompt = `Jelaskan tentang jurusan ${cat}: apa saja yang dipelajari, prospek karier, dan skill yang dibutuhkan.`;
    openChat(prompt);
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

  // NEW: daftar materi tambahan yang muncul saat "Lihat semua" diklik
  const moreTopics = [
    {
      icon: Wrench,
      title: "Dasar-Dasar Teknik Otomotif",
      desc: "Pengenalan komponen mesin, perawatan, dan diagnosis kendaraan.",
      badge: "🔧 Teknik",
      color: "from-[#F97316]/30 to-transparent",
      accentBorder: "rgba(249,115,22,0.20)",
      iconColor: "text-[#F97316]",
      badgeClass: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20",
      accentLine: "rgba(249,115,22,0.5)",
    },
    {
      icon: Palette,
      title: "Prinsip Dasar Desain Grafis",
      desc: "Teori warna, tipografi, dan layout untuk desain yang efektif.",
      badge: "🎨 Desain",
      color: "from-[#EC4899]/30 to-transparent",
      accentBorder: "rgba(236,72,153,0.20)",
      iconColor: "text-[#EC4899]",
      badgeClass: "bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20",
      accentLine: "rgba(236,72,153,0.5)",
    },
    {
      icon: Calculator,
      title: "Akuntansi Dasar untuk Pemula",
      desc: "Memahami laporan keuangan, neraca, dan pencatatan transaksi.",
      badge: "📊 Akuntansi",
      color: "from-[#10B981]/30 to-transparent",
      accentBorder: "rgba(16,185,129,0.20)",
      iconColor: "text-[#10B981]",
      badgeClass: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20",
      accentLine: "rgba(16,185,129,0.5)",
    },
    {
      icon: ChefHat,
      title: "Pengantar Tata Boga",
      desc: "Teknik memasak dasar, sanitasi dapur, dan manajemen menu.",
      badge: "🍳 Boga",
      color: "from-[#F59E0B]/30 to-transparent",
      accentBorder: "rgba(245,158,11,0.20)",
      iconColor: "text-[#F59E0B]",
      badgeClass: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
      accentLine: "rgba(245,158,11,0.5)",
    },
    {
      icon: Camera,
      title: "Produksi Konten Multimedia",
      desc: "Dasar videografi, editing, dan storytelling visual.",
      badge: "🎬 Multimedia",
      color: "from-[#6366F1]/30 to-transparent",
      accentBorder: "rgba(99,102,241,0.20)",
      iconColor: "text-[#6366F1]",
      badgeClass: "bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20",
      accentLine: "rgba(99,102,241,0.5)",
    },
    {
      icon: Mic,
      title: "Public Speaking & Presentasi",
      desc: "Bangun rasa percaya diri tampil dan menyampaikan ide dengan jelas.",
      badge: "🎤 Soft Skill",
      color: "from-[#14B8A6]/30 to-transparent",
      accentBorder: "rgba(20,184,166,0.20)",
      iconColor: "text-[#14B8A6]",
      badgeClass: "bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20",
      accentLine: "rgba(20,184,166,0.5)",
    },
  ];

  const allTopics = [...popularTopics, ...moreTopics];

  return (
    <section
      id="home"
      className="relative pb-6 md:pb-10 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
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
          .animate-ambient-drift,
          .animate-pulse-glow,
          .animate-shimmer-text { animation: none; }
        }

        /* Quick prompt pills — hover via CSS supaya var() terbaca */
        .quick-pill {
          color: var(--pill-color);
          background: var(--pill-bg);
          border: 1px solid var(--pill-border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .quick-pill:hover {
          color: var(--pill-color-hover);
          background: var(--pill-bg-hover);
          transform: scale(1.05);
        }

        /* Category hover shimmer — warna via var */
        .cat-shimmer {
          background: linear-gradient(90deg, transparent, var(--pill-shimmer), transparent);
        }
      `}</style>

      {/* ── Background decorations — opacity via var ── */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[160px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)", opacity: "var(--blob-opacity-blue)" }} />
      <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)", opacity: "var(--blob-opacity-purple)" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)", opacity: "var(--blob-opacity-cyan)" }} />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: "var(--grid-opacity)",
        }} />

      {/* Texture */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${backgroundImg})`, opacity: 0.03 }} />

      <ChatOverlay
        show={showOverlay}
        onClose={() => setShowOverlay(false)}
        initialMessage={overlayInitMsg}
        initialMessages={overlayInitMessages}
        sessionId={overlaySessionId}
      />

      <div className="relative z-10">

        {/* ── Hero ── */}
        <div className="px-3 md:px-12 pt-0 md:pt-10">
          <div
            className="relative z-10 rounded-[20px] md:rounded-[36px] overflow-visible flex flex-col items-center justify-center text-center"
            style={{
              minHeight: "clamp(180px, 40svh, 400px)",
              paddingTop: "clamp(20px, 4vw, 60px)",
              paddingBottom: "clamp(52px, 10vw, 80px)",
            }}
          >
            {/* Slide background */}
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
              {/* Image overlay — tetap gelap agar teks terbaca di atas foto */}
              <div className="absolute inset-0" style={{ zIndex: 3,
                background: `radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.08) 0%, transparent 55%),
                  linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.98) 100%)` }} />
              <div className="absolute inset-0 rounded-[20px] md:rounded-[36px] border border-white/[0.07] pointer-events-none" style={{ zIndex: 4 }} />
              <div className="absolute bottom-[36%] inset-x-0 h-px mx-10 md:mx-24 pointer-events-none" style={{ zIndex: 4,
                background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }} />
            </div>

            <div className="relative z-10 px-4 md:px-8 pb-4 md:pb-6">

              {/* Hero badge */}
              <motion.span
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-medium px-3 py-1 rounded-full mb-2 md:mb-5"
                style={{
                  color: "var(--hero-badge-color)",
                  background: "var(--hero-badge-bg)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid var(--hero-badge-border)",
                  boxShadow: "inset 0 1px 0 var(--card-inset)",
                }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse-glow" />
                Sosialisasi &amp; Edukasi Karier
              </motion.span>

              {/* Shimmer headline — gradient via var */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-[clamp(20px,5vw,52px)] font-bold leading-[1.3] tracking-tight pb-1">
                <span
                  className="block bg-clip-text text-transparent animate-shimmer-text pb-1"
                  style={{
                    backgroundImage: `linear-gradient(to right,
                      var(--shimmer-from)  0%,
                      var(--shimmer-from)  25%,
                      var(--shimmer-mid-1) 36%,
                      var(--shimmer-mid-2) 44%,
                      var(--shimmer-peak)  50%,
                      var(--shimmer-mid-2) 56%,
                      var(--shimmer-mid-1) 64%,
                      var(--shimmer-from)  75%,
                      var(--shimmer-from)  100%)`,
                    backgroundSize: "250% 100%",
                  }}>
                  Siapkan Dirimu<br className="hidden sm:block" />{" "}Menghadapi Dunia Kerja
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="hidden md:block text-sm mt-4 max-w-md mx-auto leading-relaxed"
                style={{ color: "var(--text-muted)" }}>
                Bletch AI hadir membantu kamu mempersiapkan CV, melatih interview,
                dan menemukan peluang karier yang tepat — kapan saja kamu butuh.
              </motion.p>

              {/* Slide dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2 md:mt-3">
                {heroImages.map((_, i) => (
                  <button key={i} onClick={() => goToSlide(i)} aria-label={`Slide ${i + 1}`}
                    style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "background 0.3s",
                      background: i === currentSlide ? "var(--slide-dot-active)" : "var(--slide-dot)",
                    }} />
                ))}
              </div>

              {/* Quick prompt pills */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex items-center justify-center gap-1.5 md:gap-2 mt-2 md:mt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {quickPrompts.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => { setInputValue(label); openChat(label); }}
                    className="quick-pill flex shrink-0 items-center gap-1 text-[9px] md:text-xs font-medium px-2 md:px-2.5 py-1 rounded-full">
                    <Icon size={10} />{label}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── Search Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-20 -mt-10 md:-mt-12 mx-0 md:mx-4">
            <div
              className="relative overflow-hidden rounded-2xl md:rounded-3xl px-3 pt-3 pb-3 md:px-7 md:pt-6 md:pb-6"
              style={{
                background: "var(--bg-card)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid var(--border-md)",
                boxShadow: `0 20px 60px var(--shadow-search), inset 0 1px 0 var(--card-inset)`,
              }}>

              {/* Ambient drift blob di dalam card */}
              <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden rounded-2xl md:rounded-3xl">
                <div
                  className="absolute w-[140%] h-[140%] -left-1/4 -bottom-1/4 animate-ambient-drift"
                  style={{ background: `radial-gradient(circle, var(--card-ambient) 0%, transparent 70%)` }} />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto pb-0.5 mb-3 md:mb-6 [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => {
                  const isActive  = activeCategory === cat;
                  const isHovered = hoveredCategory === cat;
                  return (
                    <button key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      onPointerEnter={() => setHoveredCategory(cat)}
                      onPointerLeave={() => setHoveredCategory(null)}
                      className="relative shrink-0 overflow-hidden text-[10px] md:text-xs font-medium px-2.5 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-all duration-200"
                      style={isActive ? {
                        background: "var(--accent-bg)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        color: "var(--accent-light)",
                        border: "1px solid var(--accent-border)",
                        boxShadow: "inset 0 1px 0 rgba(59,130,246,0.25), 0 0 16px rgba(59,130,246,0.10)",
                      } : {
                        background: isHovered ? "var(--bg-surface-md)" : "var(--bg-surface)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: isHovered ? "var(--text-secondary)" : "var(--text-muted)",
                        border: "1px solid " + (isHovered ? "var(--border-strong)" : "var(--border-soft)"),
                      }}>

                      {/* Shimmer strip hover — warna via CSS class */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.span
                            key={`shimmer-${cat}`}
                            className="absolute inset-y-0 w-1/3 pointer-events-none cat-shimmer"
                            initial={{ x: "-150%" }} animate={{ x: "250%" }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }} />
                        )}
                      </AnimatePresence>

                      {/* Click wave */}
                      <AnimatePresence>
                        {clickWave?.cat === cat && (
                          <motion.span
                            key={clickWave.key}
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{ background: "var(--accent-bg)" }}
                            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                            exit={{ opacity: 0 }}
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
                <h2 className="text-[12px] md:text-sm font-medium shrink-0" style={{ color: "var(--text-muted)" }}>
                  Apa yang ingin kamu pelajari hari ini?
                </h2>
                <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
              </div>

              {/* Input */}
              <div
                className="rounded-xl px-3 py-2 md:px-4 md:py-3.5 flex items-center gap-2.5 transition-all duration-300"
                style={{
                  background: "var(--bg-surface)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid var(--border-md)",
                  boxShadow: `inset 0 1px 0 var(--card-inset)`,
                }}>
                <Search size={14} style={{ color: "var(--text-muted)" }} className="shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && openChat()}
                  placeholder="Tanyakan seputar layanan BLETCHAI..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[11px] md:text-sm"
                  style={{ color: "var(--text-primary)" }}
                  onFocus={e => {
                    const w = e.currentTarget.parentElement;
                    w.style.borderColor = "var(--accent-border)";
                    w.style.boxShadow = "0 0 0 3px var(--accent-bg), inset 0 1px 0 var(--card-inset)";
                    w.style.background = "var(--bg-surface-md)";
                  }}
                  onBlur={e => {
                    const w = e.currentTarget.parentElement;
                    w.style.borderColor = "var(--border-md)";
                    w.style.boxShadow = `inset 0 1px 0 var(--card-inset)`;
                    w.style.background = "var(--bg-surface)";
                  }}
                />
                <button
                  onClick={openChat}
                  disabled={!inputValue.trim()}
                  className="rounded-lg w-7 h-7 md:w-9 md:h-9 flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--accent-bg)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid var(--accent-border)",
                    boxShadow: "inset 0 1px 0 rgba(59,130,246,0.28), 0 0 12px rgba(59,130,246,0.08)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-bg-hover)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-bg)"; }}>
                  <Send size={12} style={{ color: "var(--accent-light)" }} />
                </button>
              </div>

              <p className="text-[9px] md:text-xs mt-1.5 md:mt-2 ml-0.5" style={{ color: "var(--text-faint)" }}>
                Chatbot akan membantu menjawab pertanyaan berdasarkan informasi yang tersedia.
              </p>

              {/* Avatar + stats */}
              <div className="flex items-center gap-3 mt-3 md:mt-4 pt-3 md:pt-4"
                style={{ borderTop: "1px solid var(--border-soft)" }}>
                <div className="flex -space-x-2">
                  {[
                    ["R", "var(--avatar-bg-1)"],
                    ["P", "var(--avatar-bg-2)"],
                    ["L", "var(--avatar-bg-3)"],
                  ].map(([letter, bg]) => (
                    <div key={letter}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-semibold"
                      style={{
                        backgroundColor: bg,
                        borderColor: "var(--avatar-border)",
                        color: "var(--avatar-text)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                      }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] md:text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                    2.500+ Peserta Aktif
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={9} className="fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="text-[9px] md:text-xs" style={{ color: "var(--text-muted)" }}>4.9 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Materi Populer ── */}
        <Reveal className="px-3 md:px-12 mt-4 md:mt-12" amount={0.15}>
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div>
              <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.12em] mb-0.5 md:mb-1"
                style={{ color: "var(--border-strong)" }}>Kurikulum</p>
              <h3 className="text-xs md:text-base font-semibold" style={{ color: "var(--text-secondary)" }}>Materi Populer</h3>
            </div>
            <button
              onClick={() => setShowAllModal(true)}
              className="flex items-center gap-1 text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                color: "var(--text-muted)",
                background: "var(--bg-surface)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid var(--border-soft)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "var(--bg-surface-md)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "var(--bg-surface)";
              }}>
              Lihat semua <ChevronRight size={13} />
            </button>
          </div>

          <RevealGroup className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1} amount={0.15}>
            {popularTopics.map((topic) => <DesktopCard key={topic.title} {...topic} onClick={() => openChat(`Jelaskan lebih lanjut tentang materi "${topic.title}".`)} />)}
          </RevealGroup>

          <div className="md:hidden flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {popularTopics.map((topic) => <MobileCard key={topic.title} {...topic} onClick={() => openChat(`Jelaskan lebih lanjut tentang materi "${topic.title}".`)} />)}
          </div>
        </Reveal>
      </div>

      {/* Modal: Semua Materi — sama seperti modal "Semua Kursus" di CourseRecommendation */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4"
            style={{ background: "var(--overlay)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            onClick={() => setShowAllModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl max-h-[86vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
              style={{
                background: "var(--bg-card)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid var(--border-md)",
                boxShadow: `0 40px 100px var(--shadow-search), inset 0 1px 0 var(--card-inset)`,
              }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-0.5" style={{ color: "var(--border-strong)" }}>Kurikulum</p>
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Semua Materi</h2>
                </div>
                <button onClick={() => setShowAllModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface-md)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg-surface)"}>
                  <X size={13} style={{ color: "var(--text-muted)" }} />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allTopics.map((topic) => (
                    <div key={topic.title}
                      className="cursor-pointer group rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98] relative p-4"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-soft)",
                        boxShadow: `inset 0 1px 0 var(--card-inset)`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.border = "1px solid var(--border-strong)";
                        e.currentTarget.style.background = "var(--bg-surface-md)";
                        e.currentTarget.style.boxShadow = `0 4px 20px var(--shadow-card), inset 0 1px 0 var(--card-inset)`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.border = "1px solid var(--border-soft)";
                        e.currentTarget.style.background = "var(--bg-surface)";
                        e.currentTarget.style.boxShadow = `inset 0 1px 0 var(--card-inset)`;
                      }}
                      onClick={() => {
                        setShowAllModal(false);
                        openChat(`Jelaskan lebih lanjut tentang materi "${topic.title}".`);
                      }}>

                      <div className="absolute inset-x-0 top-0 h-[1.5px]"
                        style={{ background: `linear-gradient(to right, ${topic.accentLine}, transparent 70%)` }} />

                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${topic.iconColor}`}
                        style={{
                          background: "var(--bg-surface)",
                          border: `1px solid ${topic.accentBorder}`,
                          boxShadow: `inset 0 1px 0 var(--card-inset)`,
                        }}>
                        <topic.icon size={16} />
                      </div>

                      <p className="text-xs font-semibold mb-1.5 leading-snug" style={{ color: "var(--text-primary)" }}>{topic.title}</p>
                      <p className="text-[11px] leading-relaxed mb-2.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>{topic.desc}</p>
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${topic.badgeClass}`}>{topic.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function DesktopCard({ icon: Icon, title, desc, badge, color, accentBorder, iconColor, badgeClass, accentLine, onClick }) {
  return (
    <motion.div
      variants={revealItem}
      whileHover={{ y: -4, scale: 1.010 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300"
      style={{
        background: "var(--bg-surface)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--border-md)",
        boxShadow: `0 4px 20px var(--shadow-card), inset 0 1px 0 var(--card-inset)`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--bg-surface-md)";
        e.currentTarget.style.border = "1px solid var(--border-strong)";
        e.currentTarget.style.boxShadow = `0 8px 32px var(--shadow-card-lg), inset 0 1px 0 var(--card-inset)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--bg-surface)";
        e.currentTarget.style.border = "1px solid var(--border-md)";
        e.currentTarget.style.boxShadow = `0 4px 20px var(--shadow-card), inset 0 1px 0 var(--card-inset)`;
      }}>
      <div className="absolute inset-x-0 top-0 h-[1.5px]"
        style={{ background: `linear-gradient(to right, ${accentLine}, transparent 70%)` }} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${color} opacity-40`} />
      <div className={`relative w-11 h-11 shrink-0 rounded-xl flex items-center justify-center mb-4 ${iconColor}`}
        style={{
          background: "var(--bg-surface)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `1px solid ${accentBorder}`,
          boxShadow: `inset 0 1px 0 var(--card-inset)`,
        }}>
        <Icon size={16} />
      </div>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{title}</p>
        <ArrowUpRight size={14} className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
          style={{ color: "var(--text-secondary)" }} />
      </div>
      <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--text-muted)" }}>{desc}</p>
      <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${badgeClass}`}
        style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>{badge}</span>
    </motion.div>
  );
}

function MobileCard({ icon: Icon, title, desc, badge, color, accentBorder, iconColor, badgeClass, accentLine, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-xl p-3.5 cursor-pointer flex-shrink-0 snap-start"
      style={{
        width: "calc(75vw)",
        maxWidth: "260px",
        background: "var(--bg-surface)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--border-md)",
        boxShadow: `0 4px 20px var(--shadow-card), inset 0 1px 0 var(--card-inset)`,
      }}>
      <div className="absolute inset-x-0 top-0 h-[1.5px]"
        style={{ background: `linear-gradient(to right, ${accentLine}, transparent 70%)` }} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${color} opacity-40`} />
      <div className="flex items-start gap-3 relative">
        <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${iconColor}`}
          style={{ background: "var(--bg-surface)", border: `1px solid ${accentBorder}` }}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <p className="text-[12px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{title}</p>
            <ArrowUpRight size={12} className="shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="text-[10px] leading-relaxed line-clamp-2 mb-2" style={{ color: "var(--text-muted)" }}>{desc}</p>
          <span className={`inline-block text-[9px] font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>{badge}</span>
        </div>
      </div>
    </div>
  );
}