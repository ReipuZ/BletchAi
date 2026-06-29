import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Users, Clock, Award, X, ArrowUpRight, Sparkles } from "lucide-react";
import KursusRPL from "../assets/image/kursusRPL.jpg";
import KursusDesain from "../assets/image/kursusDesain.jpg";
import KursusAkuntansi from "../assets/image/kursusAkuntansi.jpg";
import KursusOtomotif from "../assets/image/kursusOtomotif.jpg";
import KursusTataboga from "../assets/image/kursusTataboga.jpg";
import KursusEditting from "../assets/image/kursusEditting.jpg";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const benefits = [
  {
    icon: Award,
    title: "Kurikulum Industri",
    desc: "Materi disusun bersama praktisi HR dan perusahaan mitra agar relevan dengan kebutuhan dunia kerja nyata.",
    iconColor: "#3B82F6",
    accentLine: "rgba(59,130,246,0.55)",
    glowColor: "rgba(59,130,246,0.06)",
  },
  {
    icon: Users,
    title: "Mentor Berpengalaman",
    desc: "Dibimbing langsung oleh mentor aktif di industri dengan rata-rata 5+ tahun pengalaman di bidangnya.",
    iconColor: "#FBBF24",
    accentLine: "rgba(251,191,36,0.55)",
    glowColor: "rgba(251,191,36,0.05)",
  },
  {
    icon: Clock,
    title: "Belajar Fleksibel",
    desc: "Akses materi kapan saja dan di mana saja. Cocok untuk siswa SMK yang punya jadwal padat.",
    iconColor: "#06B6D4",
    accentLine: "rgba(6,182,212,0.55)",
    glowColor: "rgba(6,182,212,0.05)",
  },
  {
    icon: Star,
    title: "Sertifikat Resmi",
    desc: "Dapatkan sertifikat yang diakui industri setelah menyelesaikan kursus. Nilai tambah untuk CV-mu.",
    iconColor: "#8B5CF6",
    accentLine: "rgba(139,92,246,0.55)",
    glowColor: "rgba(139,92,246,0.05)",
  },
];

const courses = [
  {
    id: 1,
    title: "Web Development dengan React",
    category: "Rekayasa Perangkat Lunak",
    level: "Pemula",
    rating: 4.9,
    students: "1.2k",
    duration: "24 jam",
    sessions: "12 Pertemuan",
    ageRange: "15–18 tahun",
    desc: "Pelajari cara membangun aplikasi web modern menggunakan React. Mulai dari dasar hingga deploy project nyata.",
    mentor: "Budi Santoso",
    price: "Rp 180.000",
    badge: "Terlaris",
    online: true,
    image: KursusRPL,
    accent: "#185FA5",
    accentRgb: "24,95,165",
  },
  {
    id: 2,
    title: "Desain UI/UX Profesional",
    category: "Desain Grafis",
    level: "Menengah",
    rating: 4.8,
    students: "980",
    duration: "18 jam",
    sessions: "10 Pertemuan",
    ageRange: "15–18 tahun",
    desc: "Kuasai Figma dan prinsip desain UI/UX dari nol. Buat portofolio desain yang siap kerja.",
    mentor: "Sari Dewi",
    price: "Rp 150.000",
    badge: "Populer",
    online: true,
    image: KursusDesain,
    accent: "#993356",
    accentRgb: "153,51,86",
  },
  {
    id: 3,
    title: "Akuntansi Digital & Excel",
    category: "Akuntansi",
    level: "Pemula",
    rating: 4.7,
    students: "2.1k",
    duration: "20 jam",
    sessions: "8 Pertemuan",
    ageRange: "15–18 tahun",
    desc: "Kuasai pembukuan digital dan Excel untuk kebutuhan akuntansi modern di dunia kerja.",
    mentor: "Rina Marlina",
    price: "Rp 120.000",
    badge: "Terlaris",
    online: true,
    image: KursusAkuntansi,
    accent: "#0F6E56",
    accentRgb: "15,110,86",
  },
  {
    id: 4,
    title: "Teknik Perawatan Mesin",
    category: "Teknik Otomotif",
    level: "Menengah",
    rating: 4.8,
    students: "760",
    duration: "30 jam",
    sessions: "15 Pertemuan",
    ageRange: "15–18 tahun",
    desc: "Pelajari teknik servis dan perawatan mesin kendaraan dari mekanik berpengalaman.",
    mentor: "Doni Prasetyo",
    price: "Rp 200.000",
    badge: "Baru",
    online: false,
    image: KursusOtomotif,
    accent: "#854F0B",
    accentRgb: "133,79,11",
  },
  {
    id: 5,
    title: "Editing Video & Motion",
    category: "Multimedia",
    level: "Pemula",
    rating: 4.9,
    students: "1.5k",
    duration: "22 jam",
    sessions: "11 Pertemuan",
    ageRange: "15–18 tahun",
    desc: "Kuasai Adobe Premiere dan After Effects untuk editing video profesional dan motion graphic.",
    mentor: "Fajar Nugroho",
    price: "Rp 165.000",
    badge: "Populer",
    online: true,
    image: KursusEditting,
    accent: "#534AB7",
    accentRgb: "83,74,183",
  },
  {
    id: 6,
    title: "Pastry & Bakery Modern",
    category: "Tata Boga",
    level: "Pemula",
    rating: 4.6,
    students: "640",
    duration: "16 jam",
    sessions: "8 Pertemuan",
    ageRange: "15–18 tahun",
    desc: "Belajar membuat kue dan roti modern dari chef berpengalaman. Cocok untuk pemula.",
    mentor: "Chef Maya",
    price: "Rp 135.000",
    badge: "Online",
    online: true,
    image: KursusTataboga,
    accent: "#993C1D",
    accentRgb: "153,60,29",
  },
];

const loopedCourses = [...courses, ...courses, ...courses];
const CARD_W = 220;
const CARD_GAP = 12;
const STEP = CARD_W + CARD_GAP;

/* ─── Detail Panel ─────────────────────────────────────────── */
function CourseDetailPanel({ course, onClose }) {
  return (
    <AnimatePresence>
      {course && (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          <div
            className="mx-4 sm:mx-8 md:mx-12 rounded-2xl overflow-hidden mb-4 relative"
            style={{
              background: "var(--bg-card)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid var(--border-md)",
              // ✅ Gunakan var(--shadow-card-lg) agar adaptif light/dark
              boxShadow: `0 8px 40px var(--shadow-card-lg), 0 0 0 1px rgba(${course.accentRgb},0.12), inset 0 1px 0 var(--card-inset)`,
            }}
          >
            {/* Accent top bar */}
            <div
              className="absolute inset-x-0 top-0 h-[1.5px]"
              style={{ background: `linear-gradient(to right, ${course.accent}, rgba(${course.accentRgb},0.1) 60%, transparent)` }}
            />

            <div className="flex flex-col sm:flex-row">
              {/* Image side */}
              <div className="relative sm:w-52 flex-shrink-0 h-40 sm:h-auto overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                {/* Overlay gelap tetap di atas foto — intentional */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.90)), linear-gradient(to right, transparent 55%, rgba(0,0,0,0.85))" }} />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {course.online && (
                    <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
                      style={{ background: "rgba(6,182,212,0.90)", color: "#000000", letterSpacing: "0.01em" }}>
                      Online
                    </span>
                  )}
                  {course.badge && (
                    <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
                      style={{ background: "rgba(255,255,255,0.92)", color: "#111111", letterSpacing: "0.01em" }}>
                      {course.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content side */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  {/* Mentor row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0"
                      style={{ background: course.accent }}>
                      {course.mentor[0]}
                    </div>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{course.mentor}</span>
                    {/* ✅ Ganti text-faint → text-muted supaya lebih terbaca di light mode */}
                    <span className="text-[10px] ml-auto" style={{ color: "var(--text-muted)" }}>{course.category}</span>
                  </div>

                  <p className="text-sm font-semibold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>{course.title}</p>
                  <p className="text-[11px] leading-relaxed mb-3 line-clamp-2 sm:line-clamp-none" style={{ color: "var(--text-muted)" }}>{course.desc}</p>

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[
                      { icon: Clock, label: course.duration },
                      { icon: Users, label: course.sessions },
                      { icon: null, label: course.ageRange },
                    ].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "var(--bg-surface-md)",
                          border: "1px solid var(--border-md)",
                          // ✅ Ganti text-muted → text-secondary supaya lebih terbaca di light mode
                          color: "var(--text-secondary)",
                        }}>
                        {Icon && <Icon size={9} />}
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{course.rating}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>· {course.students} siswa</span>
                  </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{course.price}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={onClose}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface-md)"}
                      onMouseLeave={e => e.currentTarget.style.background = "var(--bg-surface)"}>
                      <X size={13} style={{ color: "var(--text-muted)" }} />
                    </button>
                    <button
                      className="text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.97] flex-shrink-0"
                      style={{
                        background: `rgba(${course.accentRgb},0.14)`, color: course.accent,
                        border: `1px solid rgba(${course.accentRgb},0.25)`,
                        boxShadow: `inset 0 1px 0 rgba(${course.accentRgb},0.18)`, minHeight: "38px",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `rgba(${course.accentRgb},0.22)`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `rgba(${course.accentRgb},0.14)`; }}>
                      Daftar Sekarang <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Course Card ───────────────────────────────────────────── */
function CourseCard({ course, isSelected, onSelect, pausedRef }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef(null);
  const isTouch = useRef(isTouchDevice());
  const touchStartRef = useRef(null);

  const handleMouseMove = (e) => {
    if (isTouch.current || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
    if (dx < 8 && dy < 8) onSelect(course);
    touchStartRef.current = null;
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-shrink-0 relative"
      style={{ width: CARD_W, perspective: "900px" }}
      onMouseEnter={!isTouch.current ? () => { setHovered(true); pausedRef.current = true; } : undefined}
      onMouseLeave={!isTouch.current ? () => { setHovered(false); setMousePos({ x: 0, y: 0 }); if (!isSelected) pausedRef.current = false; } : undefined}
      onMouseMove={!isTouch.current ? handleMouseMove : undefined}
      onClick={!isTouch.current ? () => onSelect(course) : undefined}
      onTouchStart={isTouch.current ? handleTouchStart : undefined}
      onTouchEnd={isTouch.current ? handleTouchEnd : undefined}
    >
      <motion.div
        className="cursor-pointer rounded-2xl overflow-hidden w-full relative"
        style={{
          background: isSelected ? `rgba(${course.accentRgb},0.10)` : "var(--bg-surface)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isSelected ? `1px solid rgba(${course.accentRgb},0.28)` : "1px solid var(--border-md)",
          // ✅ Gunakan CSS var untuk shadow agar adaptif light/dark
          boxShadow: isSelected
            ? `0 4px 24px var(--shadow-card), inset 0 1px 0 rgba(${course.accentRgb},0.12)`
            : `0 4px 16px var(--shadow-card), inset 0 1px 0 var(--card-inset)`,
        }}
        animate={!isTouch.current && hovered ? { rotateX: -mousePos.y * 5, rotateY: mousePos.x * 5, scale: 1.04 } : { rotateX: 0, rotateY: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        whileTap={isTouch.current ? { scale: 0.97 } : undefined}
      >
        {isSelected && (
          <div className="absolute inset-x-0 top-0 h-[1.5px] z-10"
            style={{ background: `linear-gradient(to right, ${course.accent}, transparent 70%)` }} />
        )}

        {/* Image */}
        <div className="relative h-[132px] overflow-hidden">
          {course.image ? (
            <motion.img src={course.image} alt={course.title} className="w-full h-full object-cover"
              animate={!isTouch.current && hovered ? { scale: 1.08, x: mousePos.x * -5, y: mousePos.y * -5 } : { scale: 1, x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-surface)" }}>
              <span className="text-4xl select-none">📚</span>
            </div>
          )}
          {/* Overlay di atas foto — tetap gelap karena di atas gambar */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)" }} />
          <div className="absolute top-2.5 left-2.5">
            {/* Level badge di atas foto — tetap dark bg intentional */}
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
              style={{ background: "rgba(0,0,0,0.82)", color: "rgba(255,255,255,0.90)", border: "1px solid rgba(255,255,255,0.18)" }}>
              {course.level}
            </span>
          </div>
          {!isTouch.current && (
            <motion.div className="absolute inset-0 pointer-events-none"
              animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}
              // ✅ Ganti hardcode putih → var(--card-inset) supaya shimmer terlihat di dark, halus di light
              style={{ background: `radial-gradient(circle at ${50 + mousePos.x * 35}% ${50 + mousePos.y * 35}%, var(--card-inset) 0%, transparent 65%)` }} />
          )}
        </div>

        {/* Body */}
        <div className="px-3 py-2.5">
          {/* ✅ Ganti text-faint → text-muted untuk category agar terbaca di light mode */}
          <p className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{course.category}</p>
          <p className="text-xs font-medium leading-snug mb-2 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{course.title}</p>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <Star size={9} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{course.rating}</span>
            {/* ✅ Separator dot pakai text-muted bukan text-faint */}
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span style={{ color: "var(--text-muted)" }}>{course.students} siswa</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span style={{ color: "var(--text-muted)" }}>{course.duration}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Export ───────────────────────────────────────────── */
export default function CourseRecommendation() {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const totalW = courses.length * STEP;
    let last = null;
    const tick = (ts) => {
      if (!last) last = ts;
      const dt = ts - last;
      last = ts;
      if (!pausedRef.current) {
        posRef.current -= (dt / 1000) * 52;
        if (posRef.current <= -totalW) posRef.current += totalW;
        if (trackRef.current) trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleSelectCourse = useCallback((course) => {
    setSelectedCourse((prev) => {
      const next = prev?.id === course.id ? null : course;
      pausedRef.current = !!next;
      return next;
    });
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedCourse(null);
    pausedRef.current = false;
  }, []);

  return (
    <section id="kursus" className="relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Fade bridge */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 z-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 100%)" }} />

      {/* Separator */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent 0%, var(--border-soft) 30%, var(--border-soft) 70%, transparent 100%)" }} />

      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/4 w-[380px] h-[280px] rounded-full opacity-[0.05] blur-[140px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-40 right-0 w-[300px] h-[260px] rounded-full opacity-[0.04] blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-20 left-0 w-[280px] h-[220px] rounded-full opacity-[0.035] blur-[110px]"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />

      <div className="relative z-10 pt-8 sm:pt-12 pb-12 sm:pb-16">

        {/* Header */}
        <Reveal className="px-4 sm:px-8 md:px-12 flex items-end justify-between mb-6 md:mb-8" amount={0.3}>
          <div>
            <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.12em] mb-1.5"
              style={{ color: "var(--border-strong)" }}>Rekomendasi</p>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm md:text-base font-semibold" style={{ color: "var(--text-secondary)" }}>Kursus Rekomendasi</h3>
            </div>
          </div>

          <button onClick={() => setShowAllModal(true)}
            className="flex items-center gap-1 text-[11px] md:text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
            style={{ color: "var(--text-muted)", background: "var(--bg-surface)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid var(--border-soft)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-surface-md)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.borderColor = "var(--border-soft)"; }}>
            Lihat semua <ChevronRight size={13} />
          </button>
        </Reveal>

        {/* Carousel */}
        <Reveal amount={0.1} duration={0.5}>
          <div className="overflow-hidden"
            onMouseEnter={() => { if (!isTouchDevice()) pausedRef.current = true; }}
            onMouseLeave={() => { if (!isTouchDevice() && !selectedCourse) pausedRef.current = false; }}>
            <div ref={trackRef} className="flex py-3"
              style={{ gap: CARD_GAP, paddingLeft: "clamp(1rem, 3vw, 3rem)", paddingRight: "clamp(1rem, 3vw, 3rem)", willChange: "transform" }}>
              {loopedCourses.map((course, idx) => (
                <CourseCard key={`${course.id}-${idx}`} course={course}
                  isSelected={selectedCourse?.id === course.id}
                  onSelect={handleSelectCourse} pausedRef={pausedRef} />
              ))}
            </div>
          </div>

          <CourseDetailPanel course={selectedCourse} onClose={handleCloseDetail} />

          <p className="text-[10px] text-center mt-1 mb-8 sm:mb-10" style={{ color: "var(--text-muted)" }}>
            {isTouchDevice() ? "Ketuk kartu untuk melihat detail kursus" : "Klik kartu untuk melihat detail kursus"}
          </p>
        </Reveal>

        {/* Divider */}
        <div aria-hidden="true" className="mx-4 sm:mx-8 md:mx-12 mb-8 h-px"
          style={{ background: "linear-gradient(to right, transparent, var(--border-soft) 30%, var(--border-soft) 70%, transparent)" }} />

        {/* Benefits grid */}
        <RevealGroup className="px-4 sm:px-8 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" stagger={0.09} amount={0.15}>
          {benefits.map((ben, i) => {
            const BIcon = ben.icon;
            return (
              <motion.div key={i} variants={revealItem} whileHover={{ y: -3, scale: 1.010 }}
                className="rounded-2xl p-3.5 sm:p-4 cursor-default relative overflow-hidden group"
                style={{
                  background: "var(--bg-surface)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--border-md)",
                  // ✅ Gunakan var(--shadow-card) & var(--card-inset) agar adaptif
                  boxShadow: `0 4px 20px var(--shadow-card), inset 0 1px 0 var(--card-inset)`,
                  transition: "box-shadow 0.25s ease, background 0.25s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 32px var(--shadow-card-lg), 0 0 0 1px var(--border-soft), inset 0 1px 0 var(--card-inset)`;
                  e.currentTarget.style.background = "var(--bg-surface-md)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 4px 20px var(--shadow-card), inset 0 1px 0 var(--card-inset)`;
                  e.currentTarget.style.background = "var(--bg-surface)";
                }}>

                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{ background: `linear-gradient(to right, ${ben.accentLine}, transparent 65%)` }} />

                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: ben.glowColor,
                    border: "1px solid var(--border-md)",
                    boxShadow: `inset 0 1px 0 var(--card-inset)`,
                  }}>
                  <BIcon size={17} style={{ color: ben.iconColor }} />
                </div>

                <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>{ben.title}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{ben.desc}</p>
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>

      {/* Modal: Semua Kursus */}
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
                // ✅ Modal shadow tetap bisa lebih kuat karena ada overlay gelap di belakangnya
                boxShadow: `0 40px 100px var(--shadow-search), inset 0 1px 0 var(--card-inset)`,
              }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-0.5" style={{ color: "var(--border-strong)" }}>Katalog</p>
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Semua Kursus</h2>
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
                  {courses.map((course) => (
                    <div key={course.id}
                      className="cursor-pointer group rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98] relative"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-soft)",
                        // ✅ Gunakan var(--card-inset) bukan rgba putih hardcode
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
                      onClick={() => { setShowAllModal(false); setSelectedCourse(course); pausedRef.current = true; }}>

                      <div className="absolute inset-x-0 top-0 h-[1.5px] z-10"
                        style={{ background: `linear-gradient(to right, ${course.accent}, transparent 60%)` }} />

                      <div className="relative h-[120px] sm:h-[128px] overflow-hidden">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-surface)" }}>
                            <span className="text-4xl select-none">📚</span>
                          </div>
                        )}
                        {/* Overlay di atas foto — tetap gelap intentional */}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)" }} />
                        <div className="absolute top-2.5 left-2.5">
                          {/* Level badge di atas foto — dark bg intentional */}
                          <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
                            style={{ background: "rgba(0,0,0,0.82)", color: "rgba(255,255,255,0.90)", border: "1px solid rgba(255,255,255,0.18)" }}>
                            {course.level}
                          </span>
                        </div>
                      </div>

                      <div className="px-3 py-2.5">
                        {/* ✅ Ganti text-faint → text-muted untuk category */}
                        <p className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{course.category}</p>
                        <p className="text-xs font-medium leading-snug mb-2 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{course.title}</p>
                        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                          <Star size={9} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                          <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{course.rating}</span>
                          <span style={{ color: "var(--text-muted)" }}>·</span>
                          <span style={{ color: "var(--text-muted)" }}>{course.students} siswa</span>
                          <span style={{ color: "var(--text-muted)" }}>·</span>
                          <span style={{ color: "var(--text-muted)" }}>{course.duration}</span>
                        </div>
                      </div>
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