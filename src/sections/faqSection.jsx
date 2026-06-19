import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    <section id="faq" className="bg-[#F7F3EE] px-8 py-16">

      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-black text-zinc-900"
        >
          FAQ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-1.5 text-zinc-500 italic text-sm"
        >
          Pertanyaan umum
        </motion.p>
      </div>

      {/* FAQ list */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className={`
                relative rounded-2xl border overflow-hidden transition-colors duration-300
                ${isOpen
                  ? "border-[#C49A5A] bg-white"
                  : "border-[#E2D5C3] bg-white hover:border-[#C49A5A]"}
              `}
            >
              {/* Slash wipe overlay saat buka — dari atas ke bawah */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="wipe"
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, #FDF6EE 0%, #FDF6EE 100%)",
                      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    }}
                    initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                    exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </AnimatePresence>

              {/* Accent bar kiri */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#A67C52]"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              />

              {/* Tombol */}
              <button
                onClick={() => handleToggle(index)}
                className="relative z-10 w-full flex justify-between items-center px-6 py-4 text-left gap-4"
              >
                <span className={`text-base font-semibold transition-colors duration-200 ${isOpen ? "text-[#7A5230]" : "text-zinc-800"}`}>
                  {faq.question}
                </span>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300
                    ${isOpen ? "bg-[#A67C52] text-white" : "bg-[#EDE5D8] text-[#A67C52]"}
                  `}
                >
                  <ChevronDown size={16} />
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
                    className="relative z-10 overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      {/* divider tipis */}
                      <div className="h-px bg-[#E8D8C4] mb-4" />
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}