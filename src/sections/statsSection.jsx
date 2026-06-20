import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";
import AntyMascot from "../components/Antymascot.jsx";

const stats = [
  { label: "Pemilihan kata", value: 82, color: "#E24B4A" },
  { label: "Pemecahan masalah", value: 90, color: "#378ADD" },
  { label: "Kompetensi bidang", value: 95, color: "#3B9F4F" },
];

const steps = [
  {
    no: "01",
    title: "Latih Kemampuan Komunikasimu",
    desc: "BletchAI menghadirkan berbagai skenario percakapan. Pilih respons terbaik untuk melatih penggunaan kata yang tepat dan profesional.",
  },
  {
    no: "02",
    title: "Dapatkan Evaluasi dari AI",
    desc: "Setelah memilih jawaban, AI akan memberikan penjelasan, masukan, dan alasan mengapa suatu respons lebih efektif dan profesional.",
  },
  {
    no: "03",
    title: "Tingkatkan Keterampilanmu",
    desc: "Temukan rekomendasi pengembangan diri dan keterampilan yang perlu ditingkatkan sesuai kebutuhanmu.",
  },
];

const CIRC = 2 * Math.PI * 22;

const floatVariants = [
  { y: [0, -9, 0], rotate: [-0.8, 0.8, -0.8], duration: 3.8 },
  { y: [-4, 6, -4], rotate: [0.6, -0.6, 0.6], duration: 4.4 },
  { y: [0, -7, 0], rotate: [-0.5, 0.5, -0.5], duration: 3.5 },
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

function StatBubble({ label, value, color, delay, floatIndex }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(value, 1600, inView, delay);
  const fv = floatVariants[floatIndex];

  return (
    <motion.div
      ref={ref}
      className="bg-white border border-zinc-100 rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-4"
      animate={{ y: fv.y, rotate: fv.rotate }}
      transition={{ duration: fv.duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Donut ring */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="28" cy="28" r="22" fill="none" stroke="#f4f4f5" strokeWidth="6" />
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
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-zinc-800">{count}%</span>
        </div>
      </div>

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-700 mb-2 truncate">{label}</p>
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
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
    <section id="stats" className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* Maskot + Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 sm:gap-8 md:gap-12 items-center mb-12 sm:mb-16 md:mb-20">
          <Reveal amount={0.4} y={16}>
            <AntyMascot size={180} className="mx-auto md:hidden" />
            <AntyMascot size={300} className="mx-auto hidden md:block" />
          </Reveal>

          <Reveal amount={0.3} delay={0.1} y={16}>
            <p className="italic text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-5 text-center md:text-left">
              *Sepertinya keahlian interview-mu semakin hari semakin baik
            </p>
            <div className="flex flex-col gap-3">
              {stats.map((s, i) => (
                <StatBubble key={s.label} {...s} delay={0.15 + i * 0.15} floatIndex={i} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Heading 3 langkah */}
        <Reveal amount={0.4}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 text-center mb-8 sm:mb-10">
            Wujudkan Karier Impianmu dalam 3 Langkah!
          </h3>
        </Reveal>

        {/* 3 kartu dengan nomor dan aksen coklat */}
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" stagger={0.12} amount={0.2}>
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={revealItem}
              whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(166,124,82,0.12)" }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl border border-[#E8D8C4] shadow-sm p-5 sm:p-6 overflow-hidden cursor-default group"
            >
              {/* Aksen sudut kanan atas */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-[60px] bg-[#FDF6EE] transition-colors duration-300 group-hover:bg-[#F5EAD8]" />

              {/* Nomor besar di sudut */}
              <span className="absolute top-3 right-5 text-3xl font-black text-[#C49A5A] opacity-30 select-none leading-none">
                {step.no}
              </span>

              {/* Garis aksen coklat */}
              <div className="h-[3px] w-10 bg-[#A67C52] rounded-full mb-5" />

              <p className="text-base font-bold text-zinc-900 mb-2.5 leading-snug">
                {step.title}
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {step.desc}
              </p>

              {/* Nomor pill di bawah */}
              <div className="mt-5 inline-flex items-center gap-1.5 bg-[#FDF6EE] border border-[#E8D8C4] rounded-full px-3 py-1">
                <span className="text-xs font-semibold text-[#A67C52]">Langkah {step.no}</span>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}