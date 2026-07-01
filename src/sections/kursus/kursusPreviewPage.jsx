import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Star,
  Users,
  Clock,
  Check,
  ChevronDown,
  PlayCircle,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import Reveal from "../../components/Reveal.jsx";
import { getCourseById, getJurusanRoute } from "../../components/kursus.js";
import { getPurchasedCourses, PURCHASED_EVENT } from "./kursusPurchased";

/* ─── Fallback generators (dipakai kalau course belum punya data detail) ─── */
function buildFallbackCurriculum(course) {
  const sessionCount = parseInt(course.sessions) || 8;
  return Array.from({ length: sessionCount }).map((_, i) => ({
    title: `Sesi ${i + 1}`,
    desc: `Materi inti bagian ${i + 1} dari ${course.title}.`,
    duration: "±2 jam",
  }));
}

function buildFallbackLearn(course) {
  return [
    `Memahami dasar-dasar ${course.category.toLowerCase()}`,
    `Praktik langsung sesuai studi kasus industri`,
    `Membangun portofolio dari project nyata`,
    `Siap menghadapi dunia kerja di bidang ${course.category.toLowerCase()}`,
  ];
}

function buildFallbackRequirements() {
  return ["Laptop atau perangkat dengan koneksi internet", "Niat belajar dan konsisten mengikuti sesi", "Tidak perlu pengalaman sebelumnya"];
}

function buildFallbackReviews(course) {
  return [
    { name: "Aldi P.", rating: 5, text: "Materinya jelas dan mentornya responsif banget, langsung paham." },
    { name: "Nadia S.", rating: 5, text: "Worth it, project akhir bisa langsung masuk portofolio." },
    { name: "Rizky F.", rating: 4, text: "Bagus, cuma pengen sesi tanya jawabnya lebih panjang." },
  ];
}

/* ─── Tabs ─── */
const TABS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "kurikulum", label: "Kurikulum" },
  { id: "ulasan", label: "Ulasan" },
];

function SummaryTab({ course }) {
  const learn = course.learn || buildFallbackLearn(course);
  const requirements = course.requirements || buildFallbackRequirements();

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
          Apa yang akan kamu pelajari
        </p>
        <ul className="flex flex-col gap-2.5">
          {learn.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--text-secondary)" }}>
              <Check size={14} className="flex-shrink-0 mt-[2px]" style={{ color: course.accent }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
          Persyaratan
        </p>
        <ul className="flex flex-col gap-2.5">
          {requirements.map((item, i) => (
            <li
              key={i}
              className="text-[13px] pl-3 relative"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="absolute left-0 top-[7px] w-1 h-1 rounded-full"
                style={{ background: course.accent }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CurriculumTab({ course }) {
  const modules = course.curriculum || buildFallbackCurriculum(course);
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      {modules.map((mod, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-colors duration-200"
            style={{
              background: open ? `rgba(${course.accentRgb},0.06)` : "var(--bg-surface)",
              border: `1px solid ${open ? `rgba(${course.accentRgb},0.28)` : "var(--border-md)"}`,
              boxShadow: open
                ? `inset 0 1px 0 rgba(${course.accentRgb},0.14), 0 4px 18px rgba(${course.accentRgb},0.08)`
                : `inset 0 1px 0 var(--card-inset)`,
            }}
          >
            <button
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(${course.accentRgb},0.14)`, border: `1px solid rgba(${course.accentRgb},0.25)` }}
                >
                  <PlayCircle size={13} style={{ color: course.accent }} />
                </div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {mod.title}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {mod.duration}
                  </p>
                </div>
              </div>
              <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} style={{ color: open ? course.accent : "var(--text-muted)" }} />
              </motion.div>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    className="px-4 pb-3 pl-[52px] text-[12px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {mod.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function ReviewsTab({ course }) {
  const reviews = course.reviews || buildFallbackReviews(course);

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((rev, i) => (
        <div
          key={i}
          className="rounded-xl p-4"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-md)",
            boxShadow: `inset 0 1px 0 var(--card-inset)`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                style={{ background: course.accent }}
              >
                {rev.name[0]}
              </div>
              <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                {rev.name}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  size={11}
                  className={s < rev.rating ? "fill-amber-400 text-amber-400" : ""}
                  style={s >= rev.rating ? { color: "var(--text-muted)" } : undefined}
                />
              ))}
            </div>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {rev.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function KursusPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(id);
  const [tab, setTab] = useState("ringkasan");

  // ADDED: cek status pembelian, sama seperti di CourseRecommendation
  const [purchasedIds, setPurchasedIds] = useState(() => new Set(getPurchasedCourses()));
  useEffect(() => {
    const refresh = () => setPurchasedIds(new Set(getPurchasedCourses()));
    window.addEventListener(PURCHASED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(PURCHASED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (!course) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-base)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Kursus tidak ditemukan.</p>
        <button
          onClick={() => navigate("/")}
          className="text-[12px] font-medium px-4 py-2 rounded-xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: "var(--text-secondary)" }}
        >
          Kembali ke beranda
        </button>
      </section>
    );
  }

  const isPurchased = purchasedIds.has(course.id); // ADDED

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <style>{`
        @keyframes kursus-ambient-drift {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(24%, -22%) scale(1.12); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        .kursus-ambient-drift { animation: kursus-ambient-drift 10s ease-in-out infinite; }

        @keyframes kursus-pulse-glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.85; }
        }
        .kursus-pulse-glow { animation: kursus-pulse-glow 3s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .kursus-ambient-drift, .kursus-pulse-glow { animation: none; }
        }
      `}</style>

      {/* ── Ambient background blobs — diwarnai dari aksen kursus, sama seperti home page ── */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[380px] rounded-full opacity-[0.07] blur-[150px]"
        style={{ background: `radial-gradient(circle, ${course.accent}, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-40 -right-20 w-[320px] h-[280px] rounded-full opacity-[0.045] blur-[130px]"
        style={{ background: `radial-gradient(circle, ${course.accent}, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 w-[360px] h-[220px] rounded-full opacity-[0.035] blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-[12px] font-medium mb-6 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ChevronLeft size={15} />
          Kembali ke beranda
        </button>

        <Reveal>
          <div
            className="rounded-2xl overflow-hidden mb-6 relative"
            style={{
              background: "var(--bg-card)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid var(--border-md)",
              boxShadow: `0 8px 40px var(--shadow-card-lg), 0 0 0 1px rgba(${course.accentRgb},0.12), inset 0 1px 0 var(--card-inset)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[1.5px]"
              style={{ background: `linear-gradient(to right, ${course.accent}, rgba(${course.accentRgb},0.1) 60%, transparent)` }} />

            {/* Ambient drift blob di dalam card — gaya search card home page */}
            <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
              <div
                className="absolute w-[120%] h-[120%] -left-1/4 -bottom-1/3 kursus-ambient-drift"
                style={{ background: `radial-gradient(circle, rgba(${course.accentRgb},0.05) 0%, transparent 70%)` }} />
            </div>

            <div className="grid sm:grid-cols-[1fr_280px]">
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  {course.online && (
                    <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
                      style={{ background: "rgba(6,182,212,0.90)", color: "#000000" }}>
                      Online
                    </span>
                  )}
                  <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
                    style={{ background: `rgba(${course.accentRgb},0.14)`, color: course.accent, border: `1px solid rgba(${course.accentRgb},0.25)` }}>
                    {course.category}
                  </span>
                  {/* ADDED: badge status kepemilikan */}
                  {isPurchased && (
                    <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-full flex items-center gap-1"
                      style={{ background: "rgba(34,197,94,0.14)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.28)" }}>
                      <CheckCircle2 size={10} /> Sudah Dibeli
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>
                  {course.title}
                </h1>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {course.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    { icon: Clock, label: course.duration },
                    { icon: Users, label: course.sessions },
                    { icon: null, label: course.ageRange },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: "var(--bg-surface-md)", border: "1px solid var(--border-md)", color: "var(--text-secondary)" }}>
                      {Icon && <Icon size={9} />}
                      {label}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                    style={{ background: course.accent }}>
                    {course.mentor[0]}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{course.mentor}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>{course.rating}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>· {course.students} siswa</span>
                  </div>
                </div>
              </div>

              {/* Sidebar card */}
              <div
                className="p-5 sm:p-6 flex flex-col relative"
                style={{ borderLeft: "1px solid var(--border-soft)", background: "var(--bg-surface)" }}
              >
                {course.image && (
                  <div className="rounded-xl overflow-hidden mb-4 h-32">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                )}
                {/* CHANGED: harga diganti status kalau sudah dibeli */}
                {isPurchased ? (
                  <p className="text-[13px] font-semibold mb-4 flex items-center gap-1.5" style={{ color: "#22C55E" }}>
                    <CheckCircle2 size={16} /> Kamu sudah punya akses
                  </p>
                ) : (
                  <p className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>{course.price}</p>
                )}
                {/* CHANGED: kalau sudah dibeli, tombol langsung ke roadmap jurusan (bukan payment) */}
                <button
                  onClick={() =>
                    navigate(isPurchased ? getJurusanRoute(course) : `/kursus/${course.id}/payment`)
                  }
                  className="w-full text-[13px] font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.97] mb-3"
                  style={{
                    background: isPurchased ? "#22C55E" : course.accent,
                    color: "#fff",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${isPurchased ? "34,197,94" : course.accentRgb},0.35)`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 22px rgba(${isPurchased ? "34,197,94" : course.accentRgb},0.48)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${isPurchased ? "34,197,94" : course.accentRgb},0.35)`; }}
                >
                  {isPurchased ? "Lanjutkan Belajar" : "Daftar Sekarang"} <ArrowUpRight size={13} />
                </button>
                <ul className="flex flex-col gap-1.5">
                  {["Akses selamanya", "Sertifikat penyelesaian", "Garansi uang kembali"].map((b) => (
                    <li key={b} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                      <Check size={11} style={{ color: course.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal>
          <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}>
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all relative"
                  style={{
                    color: active ? course.accent : "var(--text-muted)",
                    background: active ? `rgba(${course.accentRgb},0.14)` : "transparent",
                    boxShadow: active ? `inset 0 1px 0 rgba(${course.accentRgb},0.22), 0 0 14px rgba(${course.accentRgb},0.10)` : "none",
                    border: active ? `1px solid rgba(${course.accentRgb},0.25)` : "1px solid transparent",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "ringkasan" && <SummaryTab course={course} />}
              {tab === "kurikulum" && <CurriculumTab course={course} />}
              {tab === "ulasan" && <ReviewsTab course={course} />}
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}