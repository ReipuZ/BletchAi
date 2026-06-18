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
    question:
      "Saya belum pernah mengikuti interview. Apakah BletchAI cocok untuk saya?",
    answer:
      "Tentu. Seluruh simulasi dirancang untuk berbagai tingkat kemampuan, termasuk bagi pemula yang belum pernah mengikuti interview kerja sebelumnya.",
  },
  {
    question:
      "Mengapa saya perlu berlatih sebelum interview kerja?",
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
      className="bg-[#ECECEC] px-12 py-24"
    >
      {/* Header */}

      <div className="text-center mb-14">
        <h1 className="text-7xl font-black">
          FAQ
        </h1>

        <p className="mt-3 text-zinc-500 italic text-2xl">
          Pertanyaan umum
        </p>
      </div>

      {/* FAQ LIST */}

      <div className="max-w-6xl mx-auto space-y-4">

        {faqs.map((faq, index) => (

          <div
            key={index}
            className="
              rounded-3xl
              border
              border-zinc-400
              overflow-hidden
              bg-[#ECECEC]
              transition-all
              duration-300
              hover:shadow-md
            "
          >

            <button
              onClick={() => handleToggle(index)}
              className="
                w-full
                flex
                justify-between
                items-center
                px-8
                py-6
                text-left
              "
            >

              <span className="text-2xl md:text-3xl font-medium">
                {faq.question}
              </span>

              <div
                className={`
                  w-14
                  h-14
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  flex-shrink-0
                  
                  ${
                    activeIndex === index
                      ? "bg-blue-500 text-white rotate-180"
                      : "bg-[#DDDAD5] text-black"
                  }
                `}
              >
                <ChevronDown size={24} />
              </div>

            </button>

            <AnimatePresence>

              {activeIndex === index && (

                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >

                  <div
                    className="
                      px-8
                      pb-8
                      text-zinc-600
                      text-lg
                      leading-8
                    "
                  >
                    {faq.answer}
                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        ))}

      </div>
    </section>
  );
}