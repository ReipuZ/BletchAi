import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, BookOpen, Star } from "lucide-react";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";

const bubbles = [
  { size: 180, color: "#A67C52", x: "-60px", y: "-60px", duration: 8, delay: 0, opacity: 0.35 },
  { size: 120, color: "#D4A574", x: "55%",   y: "-20px", duration: 10, delay: 1, opacity: 0.28 },
  { size: 90,  color: "#8B5E3C", x: "-20px", y: "55%",   duration: 7,  delay: 2, opacity: 0.3  },
  { size: 150, color: "#F0C27F", x: "60%",   y: "60%",   duration: 9,  delay: 0.5, opacity: 0.22 },
  { size: 60,  color: "#6D4C41", x: "30%",   y: "80%",   duration: 6,  delay: 1.8, opacity: 0.25 },
  { size: 45,  color: "#FFCC80", x: "75%",   y: "35%",   duration: 11, delay: 0.3, opacity: 0.3  },
];

export default function AuthModal({ isOpen, onClose, initialMode = "login", onSuccess }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => { setMode(initialMode); }, [initialMode]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          style={{ background: "rgba(30,18,8,0.55)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 28 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-[860px] overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-3xl"
            style={{ maxHeight: "calc(100vh - 3rem)" }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── PANEL KIRI ── ilustrasi + bubbles
                 Mobile: strip header dengan logo, maskot, dan bubble teks mengambang
                 Desktop: panel penuh di samping, seperti semula */}
            <div
              className="flex flex-col w-full md:w-[380px] h-[260px] sm:h-[280px] md:h-auto flex-shrink-0 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #2C1A0E 0%, #4A2C1A 40%, #7A4A28 80%, #A67C52 100%)",
              }}
            >              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(255,255,255,0.04)" }} />

              {/* Animated bubbles */}
              {bubbles.map((b, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: b.size,
                    height: b.size,
                    left: b.x,
                    top: b.y,
                    background: b.color,
                    opacity: b.opacity,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    y: [0, -28, 12, -18, 0],
                    x: [0, 14, -10, 8, 0],
                    scale: [1, 1.12, 0.93, 1.07, 1],
                  }}
                  transition={{
                    duration: b.duration,
                    delay: b.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Glass inner circles (dekoratif, mirip referensi) */}
              <motion.div
                className="absolute rounded-full border pointer-events-none"
                style={{
                  width: 220, height: 220,
                  top: "50%", left: "50%",
                  marginTop: -110, marginLeft: -110,
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                }}
                animate={{ scale: [1, 1.06, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute rounded-full border pointer-events-none"
                style={{
                  width: 320, height: 320,
                  top: "50%", left: "50%",
                  marginTop: -160, marginLeft: -160,
                  borderColor: "rgba(255,255,255,0.07)",
                  background: "transparent",
                }}
                animate={{ scale: [1, 0.95, 1], rotate: [0, -8, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* ── Versi mobile: maskot + teks sambutan, layout horizontal di strip pendek ── */}
              <div className="md:hidden relative z-10 h-full flex flex-col">
                {/* Logo — pojok kiri atas */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="px-5 pt-4"
                >
                  <span className="text-white font-bold text-sm tracking-wide">Bletch AI</span>
                </motion.div>

                {/* Maskot — di tengah, mengintip di atas pinggir bubble */}
                <div className="flex-1 flex items-end justify-center relative" style={{ marginBottom: -18 }}>
                  {/* Stat bubbles — mengambang mengitari maskot, ganti dari baris stats di bawah */}
                  <motion.div
                    className="absolute z-20 flex items-center gap-1.5 rounded-full pointer-events-none"
                    style={{
                      top: "2px", left: "8%", padding: "5px 10px 5px 6px",
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 4px 12px rgba(20,12,6,0.25)",
                    }}
                    animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,124,82,0.18)" }}>
                      <Users size={11} className="text-[#7A4A28]" />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[11px] font-bold text-[#2C1A0E]">50K+</span>
                      <span className="block text-[8.5px] text-[#8A6A4A] -mt-0.5">Pelajar</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute z-20 flex items-center gap-1.5 rounded-full pointer-events-none"
                    style={{
                      top: "-6px", right: "6%", padding: "5px 10px 5px 6px",
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 4px 12px rgba(20,12,6,0.25)",
                    }}
                    animate={{ y: [0, -9, 0], rotate: [3, -3, 3] }}
                    transition={{ duration: 5.5, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,124,82,0.18)" }}>
                      <BookOpen size={11} className="text-[#7A4A28]" />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[11px] font-bold text-[#2C1A0E]">200+</span>
                      <span className="block text-[8.5px] text-[#8A6A4A] -mt-0.5">Kursus</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute z-20 flex items-center gap-1.5 rounded-full pointer-events-none"
                    style={{
                      bottom: "26px", left: "2%", padding: "5px 10px 5px 6px",
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 4px 12px rgba(20,12,6,0.25)",
                    }}
                    animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 5, delay: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,124,82,0.18)" }}>
                      <Star size={11} className="text-[#7A4A28]" />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[11px] font-bold text-[#2C1A0E]">4.9</span>
                      <span className="block text-[8.5px] text-[#8A6A4A] -mt-0.5">Rating</span>
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                    transition={{
                      opacity: { delay: 0.15, duration: 0.4 },
                      scale: { delay: 0.15, duration: 0.4 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="relative z-10"
                  >
                    <svg width="104" height="104" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="110" cy="205" rx="44" ry="8" fill="rgba(0,0,0,0.18)" />
                      <motion.g animate={{ rotate: [-8, 8, -8] }} style={{ transformOrigin: "96px 50px" }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="96" y1="50" x2="74" y2="24" stroke="rgba(255,204,128,0.9)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="73" cy="22" r="4.5" fill="rgba(255,204,128,0.9)" />
                      </motion.g>
                      <motion.g animate={{ rotate: [8, -8, 8] }} style={{ transformOrigin: "124px 50px" }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="124" y1="50" x2="146" y2="24" stroke="rgba(255,204,128,0.9)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="147" cy="22" r="4.5" fill="rgba(255,204,128,0.9)" />
                      </motion.g>
                      <circle cx="110" cy="60" r="24" fill="rgba(166,124,82,0.95)" />
                      <circle cx="100" cy="57" r="5.5" fill="rgba(255,255,255,0.92)" />
                      <circle cx="101" cy="58" r="2.8" fill="rgba(30,15,5,0.95)" />
                      <circle cx="102" cy="57" r="1.1" fill="white" />
                      <circle cx="120" cy="57" r="5.5" fill="rgba(255,255,255,0.92)" />
                      <circle cx="121" cy="58" r="2.8" fill="rgba(30,15,5,0.95)" />
                      <circle cx="122" cy="57" r="1.1" fill="white" />
                      <path d="M102 67 Q110 75 118 67" stroke="rgba(50,25,8,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <circle cx="96" cy="66" r="5" fill="rgba(220,140,80,0.35)" />
                      <circle cx="124" cy="66" r="5" fill="rgba(220,140,80,0.35)" />
                      <rect x="106" y="82" width="8" height="9" rx="4" fill="rgba(120,75,30,0.85)" />
                      <ellipse cx="110" cy="107" rx="21" ry="19" fill="rgba(139,94,60,0.95)" />
                      <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: "91px 100px" }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="91" y1="100" x2="58" y2="86" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="58" y1="86" x2="38" y2="103" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      <motion.g animate={{ rotate: [15, -15, 15] }} style={{ transformOrigin: "129px 100px" }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="129" y1="100" x2="162" y2="86" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="162" y1="86" x2="182" y2="103" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      <motion.g animate={{ rotate: [12, -12, 12] }} style={{ transformOrigin: "90px 109px" }}
                        transition={{ duration: 0.85, delay: 0.28, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="90" y1="109" x2="56" y2="112" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="56" y1="112" x2="35" y2="130" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      <motion.g animate={{ rotate: [-12, 12, -12] }} style={{ transformOrigin: "130px 109px" }}
                        transition={{ duration: 0.85, delay: 0.28, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="130" y1="109" x2="164" y2="112" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="164" y1="112" x2="185" y2="130" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: "92px 120px" }}
                        transition={{ duration: 0.85, delay: 0.56, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="92" y1="120" x2="60" y2="136" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="60" y1="136" x2="42" y2="156" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      <motion.g animate={{ rotate: [15, -15, 15] }} style={{ transformOrigin: "128px 120px" }}
                        transition={{ duration: 0.85, delay: 0.56, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="128" y1="120" x2="160" y2="136" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="160" y1="136" x2="178" y2="156" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      <rect x="106" y="124" width="8" height="11" rx="4" fill="rgba(80,45,15,0.85)" />
                      <ellipse cx="110" cy="163" rx="28" ry="34" fill="rgba(101,65,30,0.97)" />
                      <path d="M86 152 Q110 147 134 152" stroke="rgba(166,124,82,0.25)" strokeWidth="1.5" fill="none" />
                      <path d="M84 163 Q110 157 136 163" stroke="rgba(166,124,82,0.25)" strokeWidth="1.5" fill="none" />
                      <path d="M86 174 Q110 168 134 174" stroke="rgba(166,124,82,0.25)" strokeWidth="1.5" fill="none" />
                      <ellipse cx="100" cy="152" rx="7" ry="4" fill="rgba(255,255,255,0.08)" />
                    </svg>
                  </motion.div>
                </div>

                {/* Bubble teks + stats — mengambang, warna cream */}
                <div className="px-5 pb-5 relative z-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="rounded-2xl px-4 pt-6 pb-3.5 text-center"
                    style={{
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 8px 20px rgba(20,12,6,0.25)",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="text-[#2C1A0E] text-[15px] font-bold leading-snug mb-0.5">
                          {mode === "login" ? "Selamat datang kembali!" : "Bergabunglah bersama kami!"}
                        </p>
                        <p className="text-[#6D4C41] text-[11.5px] leading-relaxed">
                          {mode === "login"
                            ? "Lanjutkan perjalanan belajarmu."
                            : "Mulai belajar bersama ribuan pelajar."}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* ── Versi desktop: konten penuh (logo, maskot besar, teks, stats) ── */}
              <div className="hidden md:flex relative z-10 flex-col h-full p-8 justify-between">
                {/* Logo */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10"
                  >
                    <span className="text-white font-bold text-base tracking-wide">Bletch AI</span>
                  </motion.div>
                </div>

                {/* Ilustrasi SVG — orang duduk santai */}
                <motion.div
                  className="flex justify-center items-center flex-1 relative"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {/* Stat bubbles — mengambang mengitari maskot, ganti dari baris stats di bawah */}
                  <motion.div
                    className="absolute z-20 flex items-center gap-2 rounded-full pointer-events-none"
                    style={{
                      top: "6px", left: "8%", padding: "6px 12px 6px 7px",
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 4px 12px rgba(20,12,6,0.25)",
                    }}
                    animate={{ y: [0, -9, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,124,82,0.18)" }}>
                      <Users size={13} className="text-[#7A4A28]" />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[12.5px] font-bold text-[#2C1A0E]">50K+</span>
                      <span className="block text-[9.5px] text-[#8A6A4A] -mt-0.5">Pelajar</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute z-20 flex items-center gap-2 rounded-full pointer-events-none"
                    style={{
                      top: "-4px", right: "4%", padding: "6px 12px 6px 7px",
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 4px 12px rgba(20,12,6,0.25)",
                    }}
                    animate={{ y: [0, -11, 0], rotate: [3, -3, 3] }}
                    transition={{ duration: 6, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,124,82,0.18)" }}>
                      <BookOpen size={13} className="text-[#7A4A28]" />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[12.5px] font-bold text-[#2C1A0E]">200+</span>
                      <span className="block text-[9.5px] text-[#8A6A4A] -mt-0.5">Kursus</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute z-20 flex items-center gap-2 rounded-full pointer-events-none"
                    style={{
                      bottom: "18px", left: "2%", padding: "6px 12px 6px 7px",
                      background: "rgba(253, 246, 238, 0.95)",
                      boxShadow: "0 4px 12px rgba(20,12,6,0.25)",
                    }}
                    animate={{ y: [0, -7, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 5.5, delay: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,124,82,0.18)" }}>
                      <Star size={13} className="text-[#7A4A28]" />
                    </span>
                    <span className="leading-none">
                      <span className="block text-[12.5px] font-bold text-[#2C1A0E]">4.9</span>
                      <span className="block text-[9.5px] text-[#8A6A4A] -mt-0.5">Rating</span>
                    </span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Bayangan */}
                      <ellipse cx="110" cy="205" rx="44" ry="8" fill="rgba(0,0,0,0.18)" />

                      {/* Antena kiri */}
                      <motion.g animate={{ rotate: [-8, 8, -8] }} style={{ transformOrigin: "96px 50px" }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="96" y1="50" x2="74" y2="24" stroke="rgba(255,204,128,0.9)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="73" cy="22" r="4.5" fill="rgba(255,204,128,0.9)" />
                      </motion.g>

                      {/* Antena kanan */}
                      <motion.g animate={{ rotate: [8, -8, 8] }} style={{ transformOrigin: "124px 50px" }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="124" y1="50" x2="146" y2="24" stroke="rgba(255,204,128,0.9)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="147" cy="22" r="4.5" fill="rgba(255,204,128,0.9)" />
                      </motion.g>

                      {/* Kepala */}
                      <circle cx="110" cy="60" r="24" fill="rgba(166,124,82,0.95)" />
                      {/* Mata kiri */}
                      <circle cx="100" cy="57" r="5.5" fill="rgba(255,255,255,0.92)" />
                      <circle cx="101" cy="58" r="2.8" fill="rgba(30,15,5,0.95)" />
                      <circle cx="102" cy="57" r="1.1" fill="white" />
                      {/* Mata kanan */}
                      <circle cx="120" cy="57" r="5.5" fill="rgba(255,255,255,0.92)" />
                      <circle cx="121" cy="58" r="2.8" fill="rgba(30,15,5,0.95)" />
                      <circle cx="122" cy="57" r="1.1" fill="white" />
                      {/* Senyum */}
                      <path d="M102 67 Q110 75 118 67" stroke="rgba(50,25,8,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      {/* Pipi */}
                      <circle cx="96" cy="66" r="5" fill="rgba(220,140,80,0.35)" />
                      <circle cx="124" cy="66" r="5" fill="rgba(220,140,80,0.35)" />

                      {/* Leher */}
                      <rect x="106" y="82" width="8" height="9" rx="4" fill="rgba(120,75,30,0.85)" />

                      {/* Torso */}
                      <ellipse cx="110" cy="107" rx="21" ry="19" fill="rgba(139,94,60,0.95)" />

                      {/* Kaki kiri atas */}
                      <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: "91px 100px" }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="91" y1="100" x2="58" y2="86" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="58" y1="86" x2="38" y2="103" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      {/* Kaki kanan atas */}
                      <motion.g animate={{ rotate: [15, -15, 15] }} style={{ transformOrigin: "129px 100px" }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="129" y1="100" x2="162" y2="86" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="162" y1="86" x2="182" y2="103" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>

                      {/* Kaki kiri tengah */}
                      <motion.g animate={{ rotate: [12, -12, 12] }} style={{ transformOrigin: "90px 109px" }}
                        transition={{ duration: 0.85, delay: 0.28, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="90" y1="109" x2="56" y2="112" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="56" y1="112" x2="35" y2="130" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      {/* Kaki kanan tengah */}
                      <motion.g animate={{ rotate: [-12, 12, -12] }} style={{ transformOrigin: "130px 109px" }}
                        transition={{ duration: 0.85, delay: 0.28, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="130" y1="109" x2="164" y2="112" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="164" y1="112" x2="185" y2="130" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>

                      {/* Kaki kiri bawah */}
                      <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: "92px 120px" }}
                        transition={{ duration: 0.85, delay: 0.56, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="92" y1="120" x2="60" y2="136" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="60" y1="136" x2="42" y2="156" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>
                      {/* Kaki kanan bawah */}
                      <motion.g animate={{ rotate: [15, -15, 15] }} style={{ transformOrigin: "128px 120px" }}
                        transition={{ duration: 0.85, delay: 0.56, repeat: Infinity, ease: "easeInOut" }}>
                        <line x1="128" y1="120" x2="160" y2="136" stroke="rgba(166,124,82,0.92)" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="160" y1="136" x2="178" y2="156" stroke="rgba(166,124,82,0.92)" strokeWidth="4" strokeLinecap="round" />
                      </motion.g>

                      {/* Pinggang */}
                      <rect x="106" y="124" width="8" height="11" rx="4" fill="rgba(80,45,15,0.85)" />

                      {/* Abdomen */}
                      <ellipse cx="110" cy="163" rx="28" ry="34" fill="rgba(101,65,30,0.97)" />
                      {/* Segmen abdomen */}
                      <path d="M86 152 Q110 147 134 152" stroke="rgba(166,124,82,0.25)" strokeWidth="1.5" fill="none" />
                      <path d="M84 163 Q110 157 136 163" stroke="rgba(166,124,82,0.25)" strokeWidth="1.5" fill="none" />
                      <path d="M86 174 Q110 168 134 174" stroke="rgba(166,124,82,0.25)" strokeWidth="1.5" fill="none" />
                      {/* Kilap abdomen */}
                      <ellipse cx="100" cy="152" rx="7" ry="4" fill="rgba(255,255,255,0.08)" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Teks bawah */}
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-white text-lg font-bold leading-snug mb-1">
                        {mode === "login" ? "Selamat datang kembali!" : "Bergabunglah bersama kami!"}
                      </p>
                      <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {mode === "login"
                          ? "Lanjutkan perjalanan belajarmu bersama Bletch AI."
                          : "Daftar dan mulai belajar bersama ribuan pelajar."}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── PANEL KANAN ── form */}
            <div className="relative flex-1 flex flex-col px-5 sm:px-8 py-10 bg-white overflow-y-auto">
              {/* Shadow fade dari atas — menyatukan transisi dengan strip header di mobile */}
              <div
                className="md:hidden pointer-events-none absolute left-0 right-0 top-0 h-6 z-[1]"
                style={{ background: "linear-gradient(to bottom, rgba(20,12,6,0.08), rgba(20,12,6,0))" }}
              />

              {/* Tombol close */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center"
              >
                <X size={15} className="text-zinc-500" />
              </motion.button>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.div
                    key="login"
                    className="w-full m-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Login onLogin={onSuccess} onGoRegister={() => setMode("register")} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    className="w-full m-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Register onGoLogin={() => setMode("login")} onSuccess={onSuccess} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}