import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";

export default function InterviewSection() {
  return (
    <section id="interview" className="bg-[#F5F3F0] py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12">
      <Reveal amount={0.3} y={32}>
        <motion.div
          className="relative max-w-5xl mx-auto rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden text-center py-12 sm:py-16 md:py-20 px-5 sm:px-8 md:px-10 shadow-xl shadow-black/10"
          style={{ backgroundColor: "#4A3326" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full"
            style={{ background: "#D9B996", opacity: 0.1 }}
            animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-20 -left-12 w-64 h-64 rounded-full"
            style={{ background: "#D9B996", opacity: 0.08 }}
            animate={{ y: [0, -16, 0], x: [0, 14, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="pointer-events-none absolute top-1/3 left-1/5 w-28 h-28 rounded-full"
            style={{ background: "#C9924F", opacity: 0.1 }}
            animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />

          <div className="relative">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#F5EDE4] mb-1">
              Tingkatkan Keahlian
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#F5EDE4] leading-[1.05] tracking-tight">
              interview mu!
            </h2>

            <p className="italic text-[#D9C7B8] text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto mt-4 sm:mt-6">
              Berlatih wawancara bersama <span className="not-italic font-semibold text-[#F0DCC4]">Anty</span>,
              asisten virtual BletchAI. Latih kemampuan interview-mu melalui simulasi
              interaktif dan dapatkan evaluasi berdasarkan hasil latihanmu.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#A67C52] hover:bg-[#C9924F] text-[#2A1B12] font-semibold text-xs sm:text-sm px-5 sm:px-7 py-3 sm:py-3.5 rounded-full mt-6 sm:mt-9 shadow-lg shadow-black/20 transition-colors duration-200"
            >
              Mulai Interview
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}