import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Users, Clock, Award, X } from "lucide-react";
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
    accent: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.18)",
    iconColor: "#3B82F6",
  },
  {
    icon: Users,
    title: "Mentor Berpengalaman",
    desc: "Dibimbing langsung oleh mentor aktif di industri dengan rata-rata 5+ tahun pengalaman di bidangnya.",
    accent: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.16)",
    iconColor: "#FBBF24",
  },
  {
    icon: Clock,
    title: "Belajar Fleksibel",
    desc: "Akses materi kapan saja dan di mana saja. Cocok untuk siswa SMK yang punya jadwal padat.",
    accent: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.16)",
    iconColor: "#06B6D4",
  },
  {
    icon: Star,
    title: "Sertifikat Resmi",
    desc: "Dapatkan sertifikat yang diakui industri setelah menyelesaikan kursus. Nilai tambah untuk CV-mu.",
    accent: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.16)",
    iconColor: "#8B5CF6",
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
    ageRange: "15-18 tahun",
    desc: "Pelajari cara membangun aplikasi web modern menggunakan React. Mulai dari dasar hingga deploy project nyata.",
    mentor: "Budi Santoso",
    price: "Rp 180.000",
    badge: "Terlaris",
    online: true,
    image: KursusRPL,
    accent: "#185FA5",
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
    ageRange: "15-18 tahun",
    desc: "Kuasai Figma dan prinsip desain UI/UX dari nol. Buat portofolio desain yang siap kerja.",
    mentor: "Sari Dewi",
    price: "Rp 150.000",
    badge: "Populer",
    online: true,
    image: KursusDesain,
    accent: "#993356",
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
    ageRange: "15-18 tahun",
    desc: "Kuasai pembukuan digital dan Excel untuk kebutuhan akuntansi modern di dunia kerja.",
    mentor: "Rina Marlina",
    price: "Rp 120.000",
    badge: "Terlaris",
    online: true,
    image: KursusAkuntansi,
    accent: "#0F6E56",
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
    ageRange: "15-18 tahun",
    desc: "Pelajari teknik servis dan perawatan mesin kendaraan dari mekanik berpengalaman.",
    mentor: "Doni Prasetyo",
    price: "Rp 200.000",
    badge: "Baru",
    online: false,
    image: KursusOtomotif,
    accent: "#854F0B",
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
    ageRange: "15-18 tahun",
    desc: "Kuasai Adobe Premiere dan After Effects untuk editing video profesional dan motion graphic.",
    mentor: "Fajar Nugroho",
    price: "Rp 165.000",
    badge: "Populer",
    online: true,
    image: KursusEditting,
    accent: "#534AB7",
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
    ageRange: "15-18 tahun",
    desc: "Belajar membuat kue dan roti modern dari chef berpengalaman. Cocok untuk pemula.",
    mentor: "Chef Maya",
    price: "Rp 135.000",
    badge: "Online",
    online: true,
    image: KursusTataboga,
    accent: "#993C1D",
  },
];

const loopedCourses = [...courses, ...courses, ...courses];
const CARD_W = 220;
const CARD_GAP = 14;
const STEP = CARD_W + CARD_GAP;

// ── Panel detail di bawah carousel ──
function CourseDetailPanel({ course, onClose }) {
  return (
    <AnimatePresence>
      {course && (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div
            className="mx-4 sm:mx-8 md:mx-12 rounded-2xl overflow-hidden mb-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Gambar — lebih pendek di mobile */}
              <div className="relative sm:w-56 flex-shrink-0 h-36 sm:h-auto overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.85)), linear-gradient(to right, transparent 60%, rgba(0,0,0,0.85))",
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {course.online && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(6,182,212,0.15)",
                        color: "#06B6D4",
                        border: "1px solid rgba(6,182,212,0.25)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}
                    >
                      Online
                    </span>
                  )}
                  {course.badge && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "#AAAAAA",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}
                    >
                      {course.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Konten */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  {/* Mentor */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ background: course.accent }}
                    >
                      {course.mentor[0]}
                    </div>
                    <span className="text-[11px]" style={{ color: "#555555" }}>
                      {course.mentor}
                    </span>
                  </div>

                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
                    style={{ color: "#555555" }}
                  >
                    {course.category}
                  </p>
                  <p
                    className="text-sm font-semibold leading-snug mb-2"
                    style={{ color: "#E0E0E0" }}
                  >
                    {course.title}
                  </p>
                  <p
                    className="text-[11px] leading-relaxed mb-3 line-clamp-2 sm:line-clamp-none"
                    style={{ color: "#666666" }}
                  >
                    {course.desc}
                  </p>

                  {/* Meta — wrap di mobile */}
                  <div
                    className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] mb-3"
                    style={{ color: "#555555" }}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={10} /> {course.sessions}
                    </span>
                    <span>{course.ageRange}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold" style={{ color: "#BBBBBB" }}>
                      {course.rating}
                    </span>
                    <span className="text-[11px]" style={{ color: "#555555" }}>
                      · {course.students} siswa
                    </span>
                  </div>
                </div>

                {/* Harga & CTA — full width di mobile */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-bold" style={{ color: "#F0F0F5" }}>
                    {course.price}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                      }
                    >
                      <X size={13} style={{ color: "#666666" }} />
                    </button>
                    <button
                      className="text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
                      style={{
                        background: "rgba(59,130,246,0.15)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: "#93C5FD",
                        border: "1px solid rgba(59,130,246,0.28)",
                        boxShadow: "inset 0 1px 0 rgba(59,130,246,0.20)",
                        minHeight: "40px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(59,130,246,0.25)";
                        e.currentTarget.style.boxShadow =
                          "inset 0 1px 0 rgba(59,130,246,0.25), 0 0 12px rgba(59,130,246,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                        e.currentTarget.style.boxShadow =
                          "inset 0 1px 0 rgba(59,130,246,0.20)";
                      }}
                    >
                      Daftar Sekarang <ChevronRight size={12} />
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

// ── CourseCard ──
function CourseCard({ course, isSelected, onSelect, pausedRef }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef(null);
  const isTouch = useRef(isTouchDevice());

  // Deteksi swipe vs tap di mobile
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
    // Hanya trigger select jika bukan swipe (gerakan < 8px)
    if (dx < 8 && dy < 8) {
      onSelect(course);
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-shrink-0 relative"
      style={{ width: CARD_W, perspective: "800px" }}
      onMouseEnter={
        !isTouch.current
          ? () => { setHovered(true); pausedRef.current = true; }
          : undefined
      }
      onMouseLeave={
        !isTouch.current
          ? () => {
              setHovered(false);
              setMousePos({ x: 0, y: 0 });
              if (!isSelected) pausedRef.current = false;
            }
          : undefined
      }
      onMouseMove={!isTouch.current ? handleMouseMove : undefined}
      onClick={!isTouch.current ? () => onSelect(course) : undefined}
      onTouchStart={isTouch.current ? handleTouchStart : undefined}
      onTouchEnd={isTouch.current ? handleTouchEnd : undefined}
    >
      <motion.div
        className="cursor-pointer rounded-2xl overflow-hidden w-full"
        style={{
          background: isSelected
            ? "rgba(59,130,246,0.10)"
            : "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isSelected
            ? "1px solid rgba(59,130,246,0.28)"
            : "1px solid rgba(255,255,255,0.09)",
          boxShadow: isSelected
            ? "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(59,130,246,0.15)"
            : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        animate={
          !isTouch.current && hovered
            ? {
                rotateX: -mousePos.y * 6,
                rotateY: mousePos.x * 6,
                scale: 1.04,
              }
            : {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        // Feedback tap di mobile
        whileTap={isTouch.current ? { scale: 0.97 } : undefined}
      >
        {/* Gambar + parallax (desktop only) */}
        <div className="relative h-[130px] overflow-hidden">
          {course.image ? (
            <motion.img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
              animate={
                !isTouch.current && hovered
                  ? { scale: 1.08, x: mousePos.x * -6, y: mousePos.y * -6 }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-5xl select-none">📚</span>
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)",
            }}
          />

          <div className="absolute top-2.5 left-2.5">
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.45)",
                color: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {course.level}
            </span>
          </div>

          {/* Shimmer — desktop only */}
          {!isTouch.current && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: `radial-gradient(circle at ${50 + mousePos.x * 35}% ${
                  50 + mousePos.y * 35
                }%, rgba(255,255,255,0.07) 0%, transparent 65%)`,
              }}
            />
          )}
        </div>

        {/* Info */}
        <div className="px-3 py-2.5">
          <p
            className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide"
            style={{ color: "#555555" }}
          >
            {course.category}
          </p>
          <p
            className="text-xs font-medium leading-snug mb-2 line-clamp-2"
            style={{ color: "#BBBBBB" }}
          >
            {course.title}
          </p>
          <div
            className="flex items-center gap-1.5 text-[10px]"
            style={{ color: "#444444" }}
          >
            <Star size={9} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="font-medium" style={{ color: "#666666" }}>
              {course.rating}
            </span>
            <span style={{ color: "#333333" }}>·</span>
            <span>{course.students} siswa</span>
            <span style={{ color: "#333333" }}>·</span>
            <span>{course.duration}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

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
        posRef.current -= (dt / 1000) * 60;
        if (posRef.current <= -totalW) posRef.current += totalW;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${posRef.current}px)`;
        }
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
    <div
      id="kursus"
      className="pt-6 sm:pt-8 pb-10 sm:pb-12"
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Reveal
        className="px-4 sm:px-8 md:px-12 flex items-center justify-between mb-5"
        amount={0.4}
      >
        <h3 className="text-sm sm:text-base font-medium" style={{ color: "#555555" }}>
          Kursus Rekomendasi
        </h3>
        <button
          onClick={() => setShowAllModal(true)}
          className="flex items-center gap-1 text-xs font-medium transition-all duration-200 px-2.5 py-1 rounded-full"
          style={{
            color: "#555555",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#AAAAAA";
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#555555";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          }}
        >
          Lihat semua <ChevronRight size={14} />
        </button>
      </Reveal>

      <Reveal amount={0.1} duration={0.5}>
        {/* Carousel — pause saat hover desktop */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => { if (!isTouchDevice()) pausedRef.current = true; }}
          onMouseLeave={() => { if (!isTouchDevice() && !selectedCourse) pausedRef.current = false; }}
        >
          <div
            ref={trackRef}
            className="flex py-3"
            style={{
              gap: CARD_GAP,
              paddingLeft: "1rem",
              paddingRight: "1rem",
              willChange: "transform",
            }}
          >
            {loopedCourses.map((course, idx) => (
              <CourseCard
                key={`${course.id}-${idx}`}
                course={course}
                isSelected={selectedCourse?.id === course.id}
                onSelect={handleSelectCourse}
                pausedRef={pausedRef}
              />
            ))}
          </div>
        </div>

        {/* Panel detail */}
        <CourseDetailPanel course={selectedCourse} onClose={handleCloseDetail} />

        <p
          className="text-[10px] text-center mt-1 mb-6 sm:mb-8"
          style={{ color: "#333333" }}
        >
          {isTouchDevice() ? "Ketuk kartu untuk melihat detail" : "Klik kartu untuk melihat detail"}
        </p>
      </Reveal>

      {/* Benefits */}
      <RevealGroup
        className="px-4 sm:px-8 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-3"
        stagger={0.1}
        amount={0.2}
      >
        {benefits.map((ben, i) => {
          const BIcon = ben.icon;
          return (
            <motion.div
              key={i}
              variants={revealItem}
              whileHover={{ y: -3, scale: 1.008 }}
              className="rounded-2xl p-3.5 sm:p-4 cursor-default relative overflow-hidden"
              style={{
                background: ben.accent,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${ben.border}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <BIcon size={18} style={{ color: ben.iconColor }} />
              </div>
              <p className="text-xs font-medium mb-1.5" style={{ color: "#BBBBBB" }}>
                {ben.title}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: "#555555" }}>
                {ben.desc}
              </p>
            </motion.div>
          );
        })}
      </RevealGroup>

      {/* Modal semua kursus */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={() => setShowAllModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <h2 className="text-sm font-medium" style={{ color: "#BBBBBB" }}>
                  Semua Kursus
                </h2>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                  }
                >
                  <X size={14} style={{ color: "#666666" }} />
                </button>
              </div>
              <div className="overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="cursor-pointer group rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.boxShadow =
                          "inset 0 1px 0 rgba(255,255,255,0.06)";
                      }}
                      onClick={() => {
                        setShowAllModal(false);
                        setSelectedCourse(course);
                        pausedRef.current = true;
                      }}
                    >
                      <div className="relative h-[120px] sm:h-[130px] overflow-hidden">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.03)" }}
                          >
                            <span className="text-5xl select-none">📚</span>
                          </div>
                        )}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)",
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(0,0,0,0.45)",
                              color: "rgba(255,255,255,0.70)",
                              backdropFilter: "blur(8px)",
                              WebkitBackdropFilter: "blur(8px)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                          >
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-2.5">
                        <p
                          className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide"
                          style={{ color: "#555555" }}
                        >
                          {course.category}
                        </p>
                        <p
                          className="text-xs font-medium leading-snug mb-2 line-clamp-2"
                          style={{ color: "#BBBBBB" }}
                        >
                          {course.title}
                        </p>
                        <div
                          className="flex items-center gap-1.5 text-[10px]"
                          style={{ color: "#444444" }}
                        >
                          <Star
                            size={9}
                            className="fill-amber-400 text-amber-400 flex-shrink-0"
                          />
                          <span className="font-medium" style={{ color: "#666666" }}>
                            {course.rating}
                          </span>
                          <span style={{ color: "#333333" }}>·</span>
                          <span>{course.students} siswa</span>
                          <span style={{ color: "#333333" }}>·</span>
                          <span>{course.duration}</span>
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
    </div>
  );
}