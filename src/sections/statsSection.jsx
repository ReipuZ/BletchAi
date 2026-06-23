import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";
import AntyMascot from "../components/Antymascot.jsx";

const stats = [
  { label: "Pemilihan kata",      value: 82, color: "#E24B4A", glow: "rgba(226,75,74,0.25)"  },
  { label: "Pemecahan masalah",   value: 90, color: "#378ADD", glow: "rgba(55,138,221,0.25)" },
  { label: "Kompetensi bidang",   value: 95, color: "#22D3EE", glow: "rgba(34,211,238,0.25)" },
];

const steps = [
  {
    no: "01",
    icon: "💬",
    title: "Latih Kemampuan Komunikasimu",
    desc: "BletchAI menghadirkan berbagai skenario percakapan. Pilih respons terbaik untuk melatih penggunaan kata yang tepat dan profesional.",
    accent: "#378ADD",
  },
  {
    no: "02",
    icon: "🤖",
    title: "Dapatkan Evaluasi dari AI",
    desc: "Setelah memilih jawaban, AI akan memberikan penjelasan, masukan, dan alasan mengapa suatu respons lebih efektif dan profesional.",
    accent: "#22D3EE",
  },
  {
    no: "03",
    icon: "🚀",
    title: "Tingkatkan Keterampilanmu",
    desc: "Temukan rekomendasi pengembangan diri dan keterampilan yang perlu ditingkatkan sesuai kebutuhanmu.",
    accent: "#A78BFA",
  },
];

const CIRC = 2 * Math.PI * 22;

const floatVariants = [
  { y: [0, -9, 0],   rotate: [-0.8,  0.8, -0.8], duration: 3.8 },
  { y: [-4, 6, -4],  rotate: [ 0.6, -0.6,  0.6], duration: 4.4 },
  { y: [0, -7, 0],   rotate: [-0.5,  0.5, -0.5], duration: 3.5 },
];

function useCountUp(target, duration, inView, delay) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [inView, target, duration, delay]);
  return display;
}

function StatBubble({ label, value, color, glow, delay, floatIndex }) {
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count  = useCountUp(value, 1600, inView, delay);
  const fv     = floatVariants[floatIndex];

  return (
    <motion.div
      ref={ref}
      animate={{ y: fv.y, rotate: fv.rotate }}
      transition={{ duration: fv.duration, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-3.5 rounded-2xl"
      style={{
        background:   "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border:       "1px solid rgba(255,255,255,0.08)",
        boxShadow:    `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Donut ring */}
      <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0">
        <svg width="44" height="44" viewBox="0 0 56 56" className="sm:hidden" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <motion.circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={inView ? { strokeDashoffset: CIRC - (value / 100) * CIRC } : {}}
            transition={{ duration: 1.6, delay, ease: [0.25, 1, 0.5, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <svg width="56" height="56" viewBox="0 0 56 56" className="hidden sm:block" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <motion.circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={inView ? { strokeDashoffset: CIRC - (value / 100) * CIRC } : {}}
            transition={{ duration: 1.6, delay, ease: [0.25, 1, 0.5, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] sm:text-xs font-semibold" style={{ color: "#CCCCCC" }}>
            {count}%
          </span>
        </div>
      </div>

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 truncate" style={{ color: "#888888" }}>
          {label}
        </p>
        <div
          className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${glow}`,
            }}
            initial={{ width: 0 }}
            animate={inView ? { width: `${value}%` } : {}}
            transition={{ duration: 1.6, delay, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12"
      style={{ background: "#000000" }}
    >
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">

        {/* ── Badge pill ── */}
        <Reveal amount={0.3}>
          <div className="flex justify-center mb-8 sm:mb-12">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background:   "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border:       "1px solid rgba(255,255,255,0.10)",
                boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.08)",
                color:        "#888888",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#22D3EE",
                  animation:  "pulse-dot 2.5s ease-in-out infinite",
                  boxShadow:  "0 0 6px rgba(34,211,238,0.7)",
                }}
              />
              Statistik & Cara Kerja
            </span>
          </div>
        </Reveal>

        {/* ── Maskot + Statistik ── */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 sm:gap-8 md:gap-12 items-center mb-10 sm:mb-16 md:mb-20">
          <Reveal amount={0.4} y={16}>
            <AntyMascot size={130} className="mx-auto md:hidden" />
            <AntyMascot size={300} className="mx-auto hidden md:block" />
          </Reveal>

          <Reveal amount={0.3} delay={0.1} y={16}>
            <p
              className="italic text-[11px] sm:text-sm mb-3 sm:mb-5 text-center md:text-left"
              style={{ color: "#444444" }}
            >
              *Sepertinya keahlian interview-mu semakin hari semakin baik
            </p>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {stats.map((s, i) => (
                <StatBubble
                  key={s.label}
                  {...s}
                  delay={0.15 + i * 0.15}
                  floatIndex={i}
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Heading 3 langkah ── */}
        <Reveal amount={0.4}>
          <h3
            className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-10 tracking-tight"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 0%, #CCCCCC 50%, #888888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
            }}
          >
            Wujudkan Karier Impianmu dalam 3 Langkah!
          </h3>
        </Reveal>

        {/* ── 3 kartu ── */}
        <RevealGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
          stagger={0.12}
          amount={0.2}
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-2xl overflow-hidden cursor-default group p-4 sm:p-6"
              style={{
                background:   "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border:       "1px solid rgba(255,255,255,0.08)",
                boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)",
                transition:   "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${step.accent}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)";
              }}
            >
              {/* Ambient glow blob sudut kanan atas */}
              <div
                className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, ${step.accent}18 0%, transparent 70%)`,
                }}
              />

              {/* Nomor besar latar */}
              <span
                className="absolute top-3 right-4 text-3xl sm:text-4xl font-black select-none leading-none opacity-10"
                style={{ color: step.accent }}
              >
                {step.no}
              </span>

              {/* Garis aksen warna */}
              <div
                className="h-[3px] w-8 sm:w-10 rounded-full mb-4 sm:mb-5"
                style={{ background: step.accent, boxShadow: `0 0 8px ${step.accent}80` }}
              />

              {/* Judul */}
              <p
                className="text-sm sm:text-base font-bold mb-2 sm:mb-2.5 leading-snug"
                style={{ color: "#CCCCCC" }}
              >
                {step.title}
              </p>

              {/* Deskripsi */}
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "#555555" }}
              >
                {step.desc}
              </p>

              {/* Pill bawah */}
              <div
                className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  background: `${step.accent}12`,
                  border:     `1px solid ${step.accent}28`,
                }}
              >
                <span
                  className="text-[11px] sm:text-xs font-semibold"
                  style={{ color: step.accent }}
                >
                  Langkah {step.no}
                </span>
              </div>
            </motion.div>
          ))}
        </RevealGroup>

      </div>
    </section>
  );
}