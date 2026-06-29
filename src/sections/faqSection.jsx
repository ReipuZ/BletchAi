import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Apa itu BletchAI?",
    answer:
      "BletchAI adalah platform berbasis AI yang membantu lulusan SMK mempersiapkan diri menghadapi dunia kerja melalui simulasi interview, rekomendasi karier, dan pelatihan keterampilan.",
  },
  {
    question: "Bagaimana cara kerja fitur Interview Berbasis AI?",
    answer:
      "Pengguna akan mengikuti simulasi interview interaktif, kemudian AI memberikan evaluasi terhadap jawaban berdasarkan aspek komunikasi, pemilihan kata, dan kompetensi bidang.",
  },
  {
    question: "Bagaimana BletchAI membantu saya menghadapi interview?",
    answer:
      "BletchAI menyediakan latihan interview yang realistis, umpan balik instan, serta rekomendasi pengembangan keterampilan sesuai kebutuhan pengguna.",
  },
  {
    question: "Saya belum pernah mengikuti interview. Apakah BletchAI cocok untuk saya?",
    answer:
      "Tentu. Seluruh simulasi dirancang untuk berbagai tingkat kemampuan, termasuk bagi pemula yang belum pernah mengikuti interview kerja sebelumnya.",
  },
  {
    question: "Mengapa saya perlu berlatih sebelum interview kerja?",
    answer:
      "Latihan membantu meningkatkan rasa percaya diri, kemampuan komunikasi, dan kesiapan menghadapi berbagai pertanyaan yang umum muncul saat interview.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 md:px-8"
      style={{ background: "#000000" }}
    >
      <style>{`
        @keyframes ambient-drift {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(20%, -20%) scale(1.1); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
        .faq-pulse { animation: pulse-glow 3s ease-in-out infinite; }
        .faq-drift { animation: ambient-drift 10s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .faq-pulse, .faq-drift { animation: none; }
        }
      `}</style>

      {/* ── Background dekorasi ── */}
      <div
        className="faq-drift pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #3B82F6, transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-10 -right-16 w-[320px] h-[320px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #8B5CF6, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 text-[#AAAAAA] text-[11px] font-medium px-3.5 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            <span className="faq-pulse w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            Pusat Bantuan
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(24px,5vw,38px)] font-bold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 0%, #E0E0E0 50%, #999 100%)",
            }}
          >
            Pertanyaan Umum
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-[#555555] italic text-xs sm:text-sm"
          >
            Semua yang perlu kamu ketahui tentang BletchAI
          </motion.p>
        </div>

        {/* FAQ list */}
        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: isOpen
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: isOpen
                    ? "1px solid rgba(59,130,246,0.30)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isOpen
                    ? "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(59,130,246,0.10)"
                    : "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s",
                }}
              >
                {/* Accent bar kiri — gradasi biru ke ungu */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{
                    background: "linear-gradient(180deg, #3B82F6 0%, #8B5CF6 100%)",
                    borderRadius: "3px 0 0 3px",
                    transformOrigin: "top",
                  }}
                  animate={{ scaleY: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* Top glow line */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="topglow"
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(139,92,246,0.3), transparent)",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Tombol */}
                <button
                  onClick={() => handleToggle(index)}
                  className="relative z-10 w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 text-left gap-3"
                >
                  <span
                    className="text-sm sm:text-base font-semibold leading-snug transition-colors duration-200"
                    style={{ color: isOpen ? "#93C5FD" : "#CCCCCC" }}
                  >
                    {faq.question}
                  </span>

                  {/* Icon + / × */}
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base font-light transition-all duration-300"
                    style={
                      isOpen
                        ? {
                            background: "rgba(59,130,246,0.20)",
                            border: "1px solid rgba(59,130,246,0.35)",
                            color: "#93C5FD",
                            boxShadow: "0 0 12px rgba(59,130,246,0.15)",
                          }
                        : {
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.20)",
                            color: "#3B82F6",
                          }
                    }
                  >
                    +
                  </motion.div>
                </button>

                {/* Jawaban */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden relative z-10"
                    >
                      {/* Divider gradasi */}
                      <div
                        className="h-px mx-4 sm:mx-6"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(59,130,246,0.25), rgba(139,92,246,0.15), rgba(255,255,255,0.04))",
                        }}
                      />
                      <p className="px-4 sm:px-6 pt-3.5 pb-5 text-xs sm:text-sm text-[#888888] leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-10 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-xs text-[#444444]">Masih ada pertanyaan?</span>
          <button
            className="text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200"
            style={{
              color: "#3B82F6",
              background: "rgba(59,130,246,0.10)",
              border: "1px solid rgba(59,130,246,0.22)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(59,130,246,0.18)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(59,130,246,0.10)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.22)";
            }}
          >
            Hubungi kami →
          </button>
        </motion.div>
      </div>
    </section>
  );
}