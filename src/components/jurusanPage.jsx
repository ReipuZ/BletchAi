import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  Clock,
  Layers,
  BookOpen,
  PlayCircle,
  Hammer,
  FolderGit2,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import Reveal from "./Reveal.jsx";

const TYPE_META = {
  Video: { icon: PlayCircle, label: "Video" },
  Praktik: { icon: Hammer, label: "Praktik" },
  Project: { icon: FolderGit2, label: "Project" },
  Kuis: { icon: HelpCircle, label: "Kuis" },
};

/* ─── Satu baris modul di dalam tahap roadmap ─── */
function ModuleItem({ module, accent, accentRgb }) {
  const meta = TYPE_META[module.type] || TYPE_META.Video;
  const Icon = meta.icon;
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `rgba(${accentRgb},0.14)`, border: `1px solid rgba(${accentRgb},0.25)` }}
        >
          <Icon size={13} style={{ color: accent }} />
        </div>
        <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
          {module.title}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="hidden sm:inline-block text-[10px] px-2 py-[2px] rounded-full"
          style={{ background: "var(--bg-surface-md)", color: "var(--text-muted)", border: "1px solid var(--border-md)" }}
        >
          {meta.label}
        </span>
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{module.duration}</span>
      </div>
    </div>
  );
}

/* ─── Satu kartu tahap roadmap (dengan rel timeline) ─── */
function StageCard({ stage, index, total, accent, accentRgb, open, onToggle }) {
  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 z-10 transition-all duration-200"
          style={{
            background: open ? accent : `rgba(${accentRgb},0.14)`,
            color: open ? "#fff" : accent,
            border: `1px solid ${open ? accent : `rgba(${accentRgb},0.3)`}`,
            boxShadow: open ? `0 4px 14px rgba(${accentRgb},0.4)` : "none",
          }}
        >
          {index + 1}
        </div>
        {index < total - 1 && (
          <div
            className="w-px flex-1 mt-1 mb-1"
            style={{ background: `linear-gradient(to bottom, rgba(${accentRgb},0.35), var(--border-soft))`, minHeight: "28px" }}
          />
        )}
      </div>

      {/* Stage content */}
      <div className="flex-1 pb-6 min-w-0">
        <div
          className="rounded-2xl overflow-hidden transition-all duration-200"
          style={{
            background: open ? `rgba(${accentRgb},0.05)` : "var(--bg-card)",
            border: `1px solid ${open ? `rgba(${accentRgb},0.25)` : "var(--border-md)"}`,
            boxShadow: open
              ? `inset 0 1px 0 rgba(${accentRgb},0.12), 0 4px 18px rgba(${accentRgb},0.08)`
              : `inset 0 1px 0 var(--card-inset)`,
          }}
        >
          <button onClick={onToggle} className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-[13.5px] font-semibold" style={{ color: "var(--text-primary)" }}>{stage.title}</p>
                <span
                  className="flex items-center gap-1 text-[10px] px-2 py-[2px] rounded-full"
                  style={{ background: "var(--bg-surface-md)", color: "var(--text-muted)", border: "1px solid var(--border-md)" }}
                >
                  <Clock size={9} /> {stage.duration}
                </span>
              </div>
              <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{stage.desc}</p>
            </div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
              <ChevronDown size={15} style={{ color: open ? accent : "var(--text-muted)" }} />
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
                <div className="px-4 pb-4 flex flex-col gap-1.5">
                  {stage.modules.map((m, i) => (
                    <ModuleItem key={i} module={m} accent={accent} accentRgb={accentRgb} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Halaman utama jurusan — dipakai oleh rplPage.jsx, desainPage.jsx, dst ─── */
export default function JurusanPage({ jurusan }) {
  const navigate = useNavigate();
  const [openStage, setOpenStage] = useState(0);

  if (!jurusan) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-base)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Jurusan tidak ditemukan.</p>
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

  const { accent, accentRgb, icon: Icon } = jurusan;
  const totalStages = jurusan.roadmap.length;
  const totalModules = jurusan.roadmap.reduce((sum, s) => sum + s.modules.length, 0);

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <style>{`
        @keyframes jurusan-ambient-drift {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(24%, -22%) scale(1.12); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        .jurusan-ambient-drift { animation: jurusan-ambient-drift 10s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .jurusan-ambient-drift { animation: none; }
        }
      `}</style>

      {/* ── Ambient background blobs — diwarnai dari aksen jurusan ── */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[380px] rounded-full opacity-[0.07] blur-[150px]"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-40 -right-20 w-[320px] h-[280px] rounded-full opacity-[0.045] blur-[130px]"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
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

        {/* ── Hero jurusan ── */}
        <Reveal>
          <div
            className="rounded-2xl overflow-hidden mb-8 relative p-6 sm:p-8"
            style={{
              background: "var(--bg-card)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid var(--border-md)",
              boxShadow: `0 8px 40px var(--shadow-card-lg), 0 0 0 1px rgba(${accentRgb},0.12), inset 0 1px 0 var(--card-inset)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[1.5px]"
              style={{ background: `linear-gradient(to right, ${accent}, rgba(${accentRgb},0.1) 60%, transparent)` }} />

            {/* Ambient drift blob di dalam card */}
            <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
              <div
                className="absolute w-[120%] h-[120%] -left-1/4 -bottom-1/3 jurusan-ambient-drift"
                style={{ background: `radial-gradient(circle, rgba(${accentRgb},0.06) 0%, transparent 70%)` }} />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(${accentRgb},0.14)`, border: `1px solid rgba(${accentRgb},0.25)` }}
              >
                <Icon size={20} style={{ color: accent }} />
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
                style={{ background: `rgba(${accentRgb},0.14)`, color: accent, border: `1px solid rgba(${accentRgb},0.25)` }}
              >
                Jurusan
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>
              {jurusan.title}
            </h1>
            <p className="text-[13px] mb-1.5 font-medium" style={{ color: accent }}>{jurusan.tagline}</p>
            <p className="text-[13px] leading-relaxed mb-5 max-w-2xl" style={{ color: "var(--text-muted)" }}>
              {jurusan.desc}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { icon: Layers, label: `${totalStages} tahap belajar` },
                { icon: BookOpen, label: `${totalModules} modul` },
                { icon: Clock, label: jurusan.stats.duration },
              ].map(({ icon: PIcon, label }) => (
                <span key={label} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full"
                  style={{ background: "var(--bg-surface-md)", border: "1px solid var(--border-md)", color: "var(--text-secondary)" }}>
                  <PIcon size={10} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Roadmap heading ── */}
        <Reveal>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-1" style={{ color: "var(--border-strong)" }}>
                Roadmap Belajar
              </p>
              <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--text-secondary)" }}>
                Jalur Pembelajaran {jurusan.shortTitle}
              </h2>
            </div>
            <button
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-xl flex-shrink-0 transition-all duration-200"
              style={{
                background: `rgba(${accentRgb},0.14)`,
                color: accent,
                border: `1px solid rgba(${accentRgb},0.25)`,
                boxShadow: `inset 0 1px 0 rgba(${accentRgb},0.18)`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${accentRgb},0.22)`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${accentRgb},0.14)`; }}
            >
              Lihat Kursus Tersedia <ArrowUpRight size={13} />
            </button>
          </div>
        </Reveal>

        {/* ── Roadmap list ── */}
        <Reveal>
          <div className="flex flex-col">
            {jurusan.roadmap.map((stage, i) => (
              <StageCard
                key={i}
                stage={stage}
                index={i}
                total={jurusan.roadmap.length}
                accent={accent}
                accentRgb={accentRgb}
                open={openStage === i}
                onToggle={() => setOpenStage(openStage === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}