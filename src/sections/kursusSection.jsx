import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Users, Clock, Award, X } from "lucide-react";
import KursusRPL from "../assets/image/kursusRPL.jpg";
import KursusDesain from "../assets/image/kursusDesain.jpg";
import KursusAkuntansi from "../assets/image/kursusAkuntansi.jpg";
import KursusOtomotif from "../assets/image/kursusOtomotif.jpg";
import KursusTataboga from "../assets/image/kursusTataboga.jpg";
import KursusEditting from "../assets/image/kursusEditting.jpg";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";

// Deteksi apakah perangkat touch (mobile)
const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const benefits = [
  {
    icon: Award,
    title: "Kurikulum Industri",
    desc: "Materi disusun bersama praktisi HR dan perusahaan mitra agar relevan dengan kebutuhan dunia kerja nyata.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-500",
    textColor: "text-blue-800",
    subColor: "text-blue-500",
  },
  {
    icon: Users,
    title: "Mentor Berpengalaman",
    desc: "Dibimbing langsung oleh mentor aktif di industri dengan rata-rata 5+ tahun pengalaman di bidangnya.",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-500",
    textColor: "text-amber-800",
    subColor: "text-amber-500",
  },
  {
    icon: Clock,
    title: "Belajar Fleksibel",
    desc: "Akses materi kapan saja dan di mana saja. Cocok untuk siswa SMK yang punya jadwal padat.",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-500",
    textColor: "text-emerald-800",
    subColor: "text-emerald-500",
  },
  {
    icon: Star,
    title: "Sertifikat Resmi",
    desc: "Dapatkan sertifikat yang diakui industri setelah menyelesaikan kursus. Nilai tambah untuk CV-mu.",
    color: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-500",
    textColor: "text-purple-800",
    subColor: "text-purple-500",
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
    badgeColor: "bg-red-500",
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
    badgeColor: "bg-pink-500",
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
    badgeColor: "bg-red-500",
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
    badgeColor: "bg-blue-500",
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
    badgeColor: "bg-pink-500",
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
    badgeColor: "bg-emerald-500",
    online: true,
    image: KursusTataboga,
    accent: "#993C1D",
  },
];

const loopedCourses = [...courses, ...courses, ...courses];
const CARD_W = 220;
const CARD_GAP = 14;
const STEP = CARD_W + CARD_GAP;

// ── Popup desktop (floating di atas card) ──
function CoursePopupDesktop({ course, anchorRect, onMouseEnter, onMouseLeave, onSelect }) {
  if (!anchorRect) return null;

  const POPUP_W = 260;
  const POPUP_MARGIN = 10;
  const top = anchorRect.top + window.scrollY - POPUP_MARGIN;
  let left = anchorRect.left + window.scrollX;
  if (left + POPUP_W > window.innerWidth - 12) {
    left = anchorRect.right + window.scrollX - POPUP_W;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden"
        style={{ zIndex: 9999, width: POPUP_W, top, left, transform: "translateY(-100%)" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <PopupContent course={course} onSelect={onSelect} />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ── Popup mobile (modal di tengah layar) ──
function CoursePopupMobile({ course, onClose, onSelect }) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-0"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tombol tutup */}
          <div className="flex justify-end px-3 pt-3">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <X size={13} className="text-zinc-500" />
            </button>
          </div>
          <PopupContent course={course} onSelect={onSelect} onClose={onClose} />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ── Konten popup (dipakai oleh desktop & mobile) ──
function PopupContent({ course, onSelect, onClose }) {
  return (
    <>
      <div className="relative h-[120px] w-full overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {course.online && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              Online
            </span>
          )}
          {course.badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${course.badgeColor}`}>
              {course.badge}
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
            style={{ background: course.accent }}
          >
            {course.mentor[0]}
          </div>
          <span className="text-[11px] text-zinc-500">{course.mentor}</span>
        </div>

        <p className="text-xs font-bold text-zinc-800 leading-snug mb-1.5">{course.title}</p>
        <p className="text-[10px] text-zinc-400 leading-relaxed mb-2.5 line-clamp-2">{course.desc}</p>

        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-2.5">
          <span className="flex items-center gap-1"><Clock size={9} />{course.duration}</span>
          <span className="text-zinc-200">·</span>
          <span>{course.sessions}</span>
          <span className="text-zinc-200">·</span>
          <span>{course.ageRange}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-semibold text-zinc-700">{course.rating}</span>
          <span className="text-[10px] text-zinc-400">· {course.students} siswa</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-800">{course.price}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(course);
              onClose?.();
            }}
            className="text-[11px] font-semibold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer hover:brightness-110 active:scale-95 transition"
            style={{ background: course.accent }}
          >
            Lihat Detail <ChevronRight size={11} />
          </button>
        </div>
      </div>
    </>
  );
}

// ── CourseCard: beda behavior desktop vs mobile ──
function CourseCard({ course, onSelect, pausedRef }) {
  const [hovered, setHovered] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cardRef = useRef(null);
  const closeTimerRef = useRef(null);
  const isTouch = isTouchDevice();

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setHovered(false);
      setAnchorRect(null);
    }, 120);
  };

  const handleCardEnter = () => {
    cancelClose();
    if (cardRef.current) setAnchorRect(cardRef.current.getBoundingClientRect());
    setHovered(true);
  };

  // FIX: pause carousel saat modal mobile dibuka
  const handleTap = () => {
    if (isTouch) {
      pausedRef.current = true;
      setMobileOpen(true);
    }
  };

  // FIX: resume carousel saat modal mobile ditutup
  const handleMobileClose = () => {
    setMobileOpen(false);
    pausedRef.current = false;
  };

  useEffect(() => {
    return () => cancelClose();
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className="flex-shrink-0 cursor-pointer group relative"
        style={{ width: CARD_W }}
        // Desktop: hover
        onMouseEnter={!isTouch ? handleCardEnter : undefined}
        onMouseLeave={!isTouch ? scheduleClose : undefined}
        // Mobile: tap
        onClick={isTouch ? handleTap : undefined}
      >
        {/* Gambar card */}
        <div className="relative h-[130px] rounded-2xl mb-3 overflow-hidden">
          {course.image ? (
            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
              <span className="text-5xl select-none">📚</span>
            </div>
          )}
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/25 text-white/90 backdrop-blur-sm">
              {course.level}
            </span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 rounded-2xl" />
        </div>

        {/* Info singkat */}
        <div className="px-0.5">
          <p className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: course.accent }}>
            {course.category}
          </p>
          <p className="text-xs font-semibold text-zinc-800 leading-snug mb-2 line-clamp-2">
            {course.title}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Star size={9} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-zinc-600 font-medium">{course.rating}</span>
            <span className="text-zinc-300">·</span>
            <span>{course.students} siswa</span>
            <span className="text-zinc-300">·</span>
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Desktop popup — tidak berubah sama sekali */}
        {!isTouch && hovered && (
          <CoursePopupDesktop
            course={course}
            anchorRect={anchorRect}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onSelect={onSelect}
          />
        )}
      </div>

      {/* Mobile popup modal */}
      {isTouch && mobileOpen && (
        <CoursePopupMobile
          course={course}
          onClose={handleMobileClose}
          onSelect={onSelect}
        />
      )}
    </>
  );
}

export default function CourseRecommendation() {
  const [showModal, setShowModal] = useState(false);
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

  const handleSelectCourse = (course) => {
    console.log("Lihat detail kursus:", course.title);
  };

  return (
    <div id="kursus" className="bg-white border-t border-zinc-100 pt-6 sm:pt-8 pb-10 sm:pb-12">

      <Reveal className="px-4 sm:px-8 md:px-12 flex items-center justify-between mb-5" amount={0.4}>
        <h3 className="text-sm sm:text-base font-semibold text-zinc-800">Kursus Rekomendasi</h3>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-xs font-medium text-[#A67C52] hover:text-[#6D4C41] transition-colors">
          Lihat semua <ChevronRight size={14} />
        </button>
      </Reveal>

      <Reveal amount={0.1} duration={0.5}>
        {/* FIX: hanya pause saat hover di non-touch device */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => { if (!isTouchDevice()) pausedRef.current = true; }}
          onMouseLeave={() => { if (!isTouchDevice()) pausedRef.current = false; }}
        >
          <div
            ref={trackRef}
            className="flex py-2"
            style={{ gap: CARD_GAP, paddingLeft: "1rem", paddingRight: "1rem", willChange: "transform" }}
          >
            {loopedCourses.map((course, idx) => (
              <CourseCard
                key={`${course.id}-${idx}`}
                course={course}
                onSelect={handleSelectCourse}
                pausedRef={pausedRef}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 text-center mt-1 mb-6 sm:mb-8">
          {isTouchDevice() ? "Ketuk kartu untuk melihat detail" : "Arahkan kursor untuk menjeda"}
        </p>
      </Reveal>

      {/* Benefits */}
      <RevealGroup className="px-4 sm:px-8 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-3" stagger={0.1} amount={0.2}>
        {benefits.map((ben, i) => {
          const BIcon = ben.icon;
          return (
            <motion.div
              key={i}
              variants={revealItem}
              whileHover={{ y: -2 }}
              className={`rounded-2xl border p-3.5 sm:p-4 cursor-default ${ben.color}`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center mb-3">
                <BIcon size={18} className={ben.iconColor} />
              </div>
              <p className={`text-xs font-semibold mb-1.5 ${ben.textColor}`}>{ben.title}</p>
              <p className={`text-[11px] leading-relaxed ${ben.subColor} opacity-80`}>{ben.desc}</p>
            </motion.div>
          );
        })}
      </RevealGroup>

      {/* Modal Semua Kursus */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22 }}
              className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-100">
                <h2 className="text-sm font-semibold text-zinc-800">Semua Kursus</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  <X size={14} className="text-zinc-500" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="cursor-pointer group">
                      <div className="relative h-[130px] rounded-2xl mb-3 overflow-hidden">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                            <span className="text-5xl select-none">📚</span>
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/25 text-white/90 backdrop-blur-sm">
                            {course.level}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-2xl" />
                      </div>
                      <div className="px-0.5">
                        <p className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: course.accent }}>
                          {course.category}
                        </p>
                        <p className="text-xs font-semibold text-zinc-800 leading-snug mb-2 line-clamp-2">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <Star size={9} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                          <span className="text-zinc-600 font-medium">{course.rating}</span>
                          <span className="text-zinc-300">·</span>
                          <span>{course.students} siswa</span>
                          <span className="text-zinc-300">·</span>
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