import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";

/* ── Semut Cyborg SVG ── */
function CyborgAnt() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ant-antenna-l { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
        @keyframes ant-antenna-r { 0%,100%{transform:rotate(8deg)} 50%{transform:rotate(-8deg)} }
        @keyframes ant-leg-a  { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
        @keyframes ant-leg-b  { 0%,100%{transform:rotate(15deg)}  50%{transform:rotate(-15deg)} }
        @keyframes ant-leg-c  { 0%,100%{transform:rotate(12deg)}  50%{transform:rotate(-12deg)} }
        @keyframes ant-leg-d  { 0%,100%{transform:rotate(-12deg)} 50%{transform:rotate(12deg)} }
        @keyframes ant-leg-e  { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
        @keyframes ant-leg-f  { 0%,100%{transform:rotate(15deg)}  50%{transform:rotate(-15deg)} }
        @keyframes ant-eye-scan { 0%,100%{transform:translateX(0)} 30%{transform:translateX(2px)} 70%{transform:translateX(-2px)} }
        @keyframes ant-pulse  { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes ant-cf     { 0%,100%{opacity:.25} 50%{opacity:.8} }

        .a-ant-l  { animation: ant-antenna-l 1.8s ease-in-out infinite; transform-origin: 96px 50px; }
        .a-ant-r  { animation: ant-antenna-r 1.8s ease-in-out infinite; transform-origin: 124px 50px; }
        .a-la { animation: ant-leg-a .85s ease-in-out infinite; transform-origin: 91px 100px; }
        .a-lb { animation: ant-leg-b .85s ease-in-out infinite; transform-origin: 129px 100px; }
        .a-lc { animation: ant-leg-c .85s ease-in-out infinite .28s; transform-origin: 90px 109px; }
        .a-ld { animation: ant-leg-d .85s ease-in-out infinite .28s; transform-origin: 130px 109px; }
        .a-le { animation: ant-leg-e .85s ease-in-out infinite .56s; transform-origin: 92px 120px; }
        .a-lf { animation: ant-leg-f .85s ease-in-out infinite .56s; transform-origin: 128px 120px; }
        .a-eye { animation: ant-eye-scan 3s ease-in-out infinite; }
        .a-pg  { animation: ant-pulse 2s ease-in-out infinite; }
        .a-cf  { animation: ant-cf 2.5s ease-in-out infinite; }
      `}</style>

      {/* Bayangan */}
      <ellipse cx="110" cy="212" rx="40" ry="6" fill="rgba(59,130,246,0.15)" />

      {/* ── Antena kiri ── */}
      <g className="a-ant-l">
        <line x1="96" y1="50" x2="74" y2="24" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" />
        <rect x="80" y="30" width="6" height="6" rx="1.5" fill="#0d1929"
          stroke="rgba(59,130,246,0.5)" strokeWidth="0.8" transform="rotate(-40 83 33)" />
        <circle cx="73" cy="22" r="5" fill="#0a1628" />
        <circle cx="73" cy="22" r="3" fill="#3B82F6" className="a-pg" />
        <circle cx="73" cy="22" r="1.5" fill="#93C5FD" />
      </g>

      {/* ── Antena kanan ── */}
      <g className="a-ant-r">
        <line x1="124" y1="50" x2="146" y2="24" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" />
        <rect x="134" y="30" width="6" height="6" rx="1.5" fill="#0d1929"
          stroke="rgba(59,130,246,0.5)" strokeWidth="0.8" transform="rotate(40 137 33)" />
        <circle cx="147" cy="22" r="5" fill="#0a1628" />
        <circle cx="147" cy="22" r="3" fill="#3B82F6" className="a-pg" />
        <circle cx="147" cy="22" r="1.5" fill="#93C5FD" />
      </g>

      {/* ── Kepala ── */}
      <circle cx="110" cy="60" r="24" fill="#0d1929" />
      <circle cx="110" cy="60" r="24" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" />
      <ellipse cx="102" cy="50" rx="8" ry="4" fill="rgba(255,255,255,0.04)" transform="rotate(-20 102 50)" />
      <line x1="88" y1="55" x2="95" y2="55" stroke="rgba(59,130,246,0.25)" strokeWidth="0.8" className="a-cf" />
      <line x1="125" y1="55" x2="132" y2="55" stroke="rgba(59,130,246,0.25)" strokeWidth="0.8" className="a-cf" />

      {/* Mata kiri — LED */}
      <g className="a-eye" style={{ transformOrigin: "100px 57px" }}>
        <circle cx="100" cy="57" r="6" fill="#0a1a2e" />
        <circle cx="100" cy="57" r="6" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="0.8" />
        <circle cx="100" cy="57" r="3.5" fill="#1d4ed8" />
        <circle cx="100" cy="57" r="2" fill="#3B82F6" />
        <circle cx="101.2" cy="55.8" r="0.9" fill="#DBEAFE" />
        <rect x="94" y="56.5" width="12" height="0.8" rx="0.4" fill="rgba(147,197,253,0.3)" />
      </g>

      {/* Mata kanan — LED */}
      <g className="a-eye" style={{ transformOrigin: "120px 57px" }}>
        <circle cx="120" cy="57" r="6" fill="#0a1a2e" />
        <circle cx="120" cy="57" r="6" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="0.8" />
        <circle cx="120" cy="57" r="3.5" fill="#1d4ed8" />
        <circle cx="120" cy="57" r="2" fill="#3B82F6" />
        <circle cx="121.2" cy="55.8" r="0.9" fill="#DBEAFE" />
        <rect x="114" y="56.5" width="12" height="0.8" rx="0.4" fill="rgba(147,197,253,0.3)" />
      </g>

      {/* Mulut — data port */}
      <rect x="104" y="67" width="12" height="5" rx="2" fill="#061020" stroke="rgba(59,130,246,0.4)" strokeWidth="0.8" />
      <rect x="106" y="69" width="2.5" height="1.5" rx="0.5" fill="#3B82F6" opacity="0.8" />
      <rect x="109.5" y="69" width="2.5" height="1.5" rx="0.5" fill="#3B82F6" opacity="0.5" />
      <rect x="113" y="69" width="2.5" height="1.5" rx="0.5" fill="#3B82F6" opacity="0.8" />

      {/* Pipi — heat vent */}
      <ellipse cx="90" cy="65" rx="5" ry="3.5" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.6" />
      <ellipse cx="130" cy="65" rx="5" ry="3.5" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.6" />

      {/* ── Leher — konektor ── */}
      <rect x="106" y="82" width="8" height="10" rx="3" fill="#0a1628" />
      <rect x="106" y="82" width="8" height="10" rx="3" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="0.8" />
      <rect x="108" y="85" width="4" height="1.5" rx="0.7" fill="rgba(59,130,246,0.5)" />
      <rect x="108" y="88" width="4" height="1.5" rx="0.7" fill="rgba(59,130,246,0.3)" />

      {/* ── Torso — exoskeleton ── */}
      <ellipse cx="110" cy="107" rx="21" ry="19" fill="#0a1628" />
      <ellipse cx="110" cy="107" rx="21" ry="19" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
      <ellipse cx="110" cy="107" rx="13" ry="11" fill="#061020" stroke="rgba(59,130,246,0.2)" strokeWidth="0.7" />
      <circle cx="105" cy="103" r="2" fill="#3B82F6" className="a-pg" />
      <circle cx="110" cy="101" r="1.5" fill="#06B6D4" opacity="0.7" />
      <circle cx="115" cy="103" r="2" fill="#8B5CF6" opacity="0.8" />
      <rect x="103" y="109" width="14" height="2.5" rx="1.2" fill="rgba(255,255,255,0.05)" />
      <rect x="103" y="109" width="9" height="2.5" rx="1.2" fill="rgba(59,130,246,0.6)" />
      <rect x="103" y="113" width="14" height="2.5" rx="1.2" fill="rgba(255,255,255,0.05)" />
      <rect x="103" y="113" width="5" height="2.5" rx="1.2" fill="rgba(139,92,246,0.5)" />
      <line x1="90" y1="108" x2="97" y2="108" stroke="rgba(59,130,246,0.2)" strokeWidth="0.7" className="a-cf" />
      <line x1="123" y1="108" x2="130" y2="108" stroke="rgba(59,130,246,0.2)" strokeWidth="0.7" className="a-cf" />

      {/* ── Kaki — sendi tech ── */}
      {/* kiri atas */}
      <g className="a-la">
        <line x1="91" y1="100" x2="58" y2="86" stroke="#1E3A5F" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="58" cy="86" r="3" fill="#0d1929" stroke="rgba(59,130,246,0.5)" strokeWidth="0.8" />
        <line x1="58" y1="86" x2="38" y2="103" stroke="#1a3050" strokeWidth="4" strokeLinecap="round" />
        <circle cx="38" cy="103" r="2.5" fill="#3B82F6" opacity="0.6" />
      </g>
      {/* kanan atas */}
      <g className="a-lb">
        <line x1="129" y1="100" x2="162" y2="86" stroke="#1E3A5F" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="162" cy="86" r="3" fill="#0d1929" stroke="rgba(59,130,246,0.5)" strokeWidth="0.8" />
        <line x1="162" y1="86" x2="182" y2="103" stroke="#1a3050" strokeWidth="4" strokeLinecap="round" />
        <circle cx="182" cy="103" r="2.5" fill="#3B82F6" opacity="0.6" />
      </g>
      {/* kiri tengah */}
      <g className="a-lc">
        <line x1="90" y1="109" x2="56" y2="112" stroke="#1E3A5F" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="56" cy="112" r="3" fill="#0d1929" stroke="rgba(59,130,246,0.4)" strokeWidth="0.8" />
        <line x1="56" y1="112" x2="35" y2="130" stroke="#1a3050" strokeWidth="4" strokeLinecap="round" />
        <circle cx="35" cy="130" r="2.5" fill="#06B6D4" opacity="0.5" />
      </g>
      {/* kanan tengah */}
      <g className="a-ld">
        <line x1="130" y1="109" x2="164" y2="112" stroke="#1E3A5F" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="164" cy="112" r="3" fill="#0d1929" stroke="rgba(59,130,246,0.4)" strokeWidth="0.8" />
        <line x1="164" y1="112" x2="185" y2="130" stroke="#1a3050" strokeWidth="4" strokeLinecap="round" />
        <circle cx="185" cy="130" r="2.5" fill="#06B6D4" opacity="0.5" />
      </g>
      {/* kiri bawah */}
      <g className="a-le">
        <line x1="92" y1="120" x2="60" y2="136" stroke="#1E3A5F" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="60" cy="136" r="3" fill="#0d1929" stroke="rgba(139,92,246,0.4)" strokeWidth="0.8" />
        <line x1="60" y1="136" x2="42" y2="156" stroke="#1a3050" strokeWidth="4" strokeLinecap="round" />
        <circle cx="42" cy="156" r="2.5" fill="#8B5CF6" opacity="0.5" />
      </g>
      {/* kanan bawah */}
      <g className="a-lf">
        <line x1="128" y1="120" x2="160" y2="136" stroke="#1E3A5F" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="160" cy="136" r="3" fill="#0d1929" stroke="rgba(139,92,246,0.4)" strokeWidth="0.8" />
        <line x1="160" y1="136" x2="178" y2="156" stroke="#1a3050" strokeWidth="4" strokeLinecap="round" />
        <circle cx="178" cy="156" r="2.5" fill="#8B5CF6" opacity="0.5" />
      </g>

      {/* ── Pinggang — konektor ── */}
      <rect x="106" y="124" width="8" height="11" rx="3.5" fill="#0a1628" />
      <rect x="106" y="124" width="8" height="11" rx="3.5" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" />
      <rect x="108" y="127" width="4" height="1.5" rx="0.7" fill="rgba(59,130,246,0.4)" />
      <rect x="108" y="130" width="4" height="1.5" rx="0.7" fill="rgba(59,130,246,0.25)" />

      {/* ── Abdomen — armor plating ── */}
      <ellipse cx="110" cy="163" rx="28" ry="34" fill="#0a1628" />
      <ellipse cx="110" cy="163" rx="28" ry="34" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1" />
      <path d="M84 152 Q110 147 136 152" stroke="rgba(59,130,246,0.35)" strokeWidth="1.2" fill="none" />
      <path d="M82 163 Q110 157 138 163" stroke="rgba(59,130,246,0.3)" strokeWidth="1.2" fill="none" />
      <path d="M84 174 Q110 168 136 174" stroke="rgba(59,130,246,0.25)" strokeWidth="1.2" fill="none" />
      <ellipse cx="110" cy="155" rx="9" ry="5" fill="#061020" stroke="rgba(59,130,246,0.2)" strokeWidth="0.7" />
      <circle cx="107" cy="155" r="1.5" fill="#3B82F6" className="a-pg" opacity="0.7" />
      <circle cx="110" cy="155" r="1.5" fill="#06B6D4" opacity="0.5" />
      <circle cx="113" cy="155" r="1.5" fill="#8B5CF6" opacity="0.6" />
      <ellipse cx="98" cy="150" rx="7" ry="3.5" fill="rgba(255,255,255,0.04)" transform="rotate(-10 98 150)" />
      <ellipse cx="110" cy="185" rx="14" ry="6" fill="#061020" stroke="rgba(59,130,246,0.15)" strokeWidth="0.7" />
    </svg>
  );
}

/* ── Stat Bubble ── */
function StatBubble({ icon, value, label, borderColor, iconBg, iconColor, animClass, style = {} }) {
  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-1.5 pointer-events-none ${animClass}`}
      style={{
        padding: "5px 11px 5px 6px",
        background: "rgba(8,8,12,0.92)",
        border: `1px solid ${borderColor}`,
        borderRadius: "999px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <span className="leading-none">
        <span className="block text-[11px] font-bold text-[#E2E8F0]">{value}</span>
        <span className="block text-[9px] mt-0.5" style={{ color: "#555" }}>{label}</span>
      </span>
    </motion.div>
  );
}

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
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 28 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-[860px] overflow-hidden flex flex-col md:flex-row rounded-3xl"
            style={{
              maxHeight: "calc(100vh - 3rem)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ══════════════════════════════
                PANEL KIRI — dark tech
            ══════════════════════════════ */}
            <div
              className="flex flex-col w-full md:w-[360px] flex-shrink-0 relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #000000 0%, #050a14 50%, #080f1e 100%)",
                minHeight: "160px",
              }}
            >
              {/* Dekorasi glow */}
              <div className="pointer-events-none absolute -top-16 -left-16 w-[280px] h-[280px] rounded-full opacity-[0.12] blur-[90px]"
                style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
              <div className="pointer-events-none absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full opacity-[0.07] blur-[70px]"
                style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
              <div className="pointer-events-none absolute top-1/2 left-1/3 w-[140px] h-[140px] rounded-full opacity-[0.05] blur-[50px]"
                style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />

              {/* Grid lines */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }} />

              {/* Lingkaran dekor */}
              <div className="pointer-events-none absolute rounded-full"
                style={{ width: 260, height: 260, top: "50%", left: "50%", marginTop: -130, marginLeft: -130,
                  border: "1px solid rgba(59,130,246,0.08)" }} />
              <div className="pointer-events-none absolute rounded-full"
                style={{ width: 180, height: 180, top: "50%", left: "50%", marginTop: -90, marginLeft: -90,
                  border: "1px solid rgba(59,130,246,0.12)" }} />

              {/* Accent line top */}
              <div className="absolute inset-x-0 top-0 h-[1.5px]"
                style={{ background: "linear-gradient(to right, rgba(59,130,246,0.6), transparent 70%)" }} />

              {/* ── Mobile strip ── */}
              <div className="md:hidden relative z-10 h-full flex flex-col">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="px-4 pt-3"
                >
                  <div className="inline-flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "3px 10px" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", display: "inline-block", animation: "ant-pulse 2s ease-in-out infinite" }} />
                    <span className="text-[10px] font-bold text-[#AAAAAA] tracking-wide">Bletch AI</span>
                  </div>
                </motion.div>

                {/* Maskot mobile */}
                <div className="flex-1 flex items-end justify-center relative" style={{ marginBottom: -10 }}>
                  <StatBubble
                    icon="👥" value="50K+" label="Pelajar"
                    borderColor="rgba(59,130,246,0.25)" iconBg="rgba(59,130,246,0.15)" iconColor="#93C5FD"
                    animClass="" style={{ top: "0px", left: "6%" }}
                  />
                  <StatBubble
                    icon="📚" value="200+" label="Kursus"
                    borderColor="rgba(139,92,246,0.25)" iconBg="rgba(139,92,246,0.15)" iconColor="#C4B5FD"
                    animClass="" style={{ top: "-4px", right: "4%" }}
                  />
                  <StatBubble
                    icon="⭐" value="4.9" label="Rating"
                    borderColor="rgba(251,191,36,0.2)" iconBg="rgba(251,191,36,0.1)" iconColor="#FBBF24"
                    animClass="" style={{ bottom: "14px", left: "0%" }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ scale: 0.55, transformOrigin: "center bottom" }}
                  >
                    <CyborgAnt />
                  </motion.div>
                </div>

                {/* Teks mobile */}
                <div className="px-4 pb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="rounded-xl px-3.5 pt-3 pb-2.5 text-center"
                    style={{ background: "rgba(10,10,20,0.9)", border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="text-[13px] font-bold leading-snug mb-0.5"
                          style={{ background: "linear-gradient(to right,#fff,#93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {mode === "login" ? "Selamat datang kembali!" : "Bergabunglah bersama kami!"}
                        </p>
                        <p className="text-[10px] leading-snug" style={{ color: "#555" }}>
                          {mode === "login" ? "Lanjutkan perjalanan belajarmu." : "Mulai belajar bersama ribuan pelajar."}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* ── Desktop panel penuh ── */}
              <div className="hidden md:flex relative z-10 flex-col h-full p-8 justify-between">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="inline-flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "4px 12px" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} className="animate-pulse" />
                    <span className="text-[11px] font-bold text-[#AAAAAA] tracking-wide">Bletch AI</span>
                  </div>
                </motion.div>

                {/* Semut + stats */}
                <motion.div
                  className="flex justify-center items-center flex-1 relative my-4"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {/* Stat bubbles */}
                  <motion.div
                    className="absolute z-20 flex items-center gap-2 pointer-events-none"
                    style={{ top: "6px", left: "4%", padding: "6px 12px 6px 7px",
                      background: "rgba(8,8,12,0.92)", border: "1px solid rgba(59,130,246,0.25)",
                      borderRadius: "999px", boxShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
                    animate={{ y: [0, -9, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(59,130,246,0.15)", color: "#93C5FD", fontSize: 13 }}>👥</span>
                    <span className="leading-none">
                      <span className="block text-[12px] font-bold text-[#E2E8F0]">50K+</span>
                      <span className="block text-[9.5px] mt-0.5" style={{ color: "#555" }}>Pelajar</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute z-20 flex items-center gap-2 pointer-events-none"
                    style={{ top: "-4px", right: "2%", padding: "6px 12px 6px 7px",
                      background: "rgba(8,8,12,0.92)", border: "1px solid rgba(139,92,246,0.25)",
                      borderRadius: "999px", boxShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
                    animate={{ y: [0, -11, 0], rotate: [3, -3, 3] }}
                    transition={{ duration: 6, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,92,246,0.15)", color: "#C4B5FD", fontSize: 13 }}>📚</span>
                    <span className="leading-none">
                      <span className="block text-[12px] font-bold text-[#E2E8F0]">200+</span>
                      <span className="block text-[9.5px] mt-0.5" style={{ color: "#555" }}>Kursus</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute z-20 flex items-center gap-2 pointer-events-none"
                    style={{ bottom: "16px", left: "0%", padding: "6px 12px 6px 7px",
                      background: "rgba(8,8,12,0.92)", border: "1px solid rgba(251,191,36,0.2)",
                      borderRadius: "999px", boxShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
                    animate={{ y: [0, -7, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 5.5, delay: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24", fontSize: 13 }}>⭐</span>
                    <span className="leading-none">
                      <span className="block text-[12px] font-bold text-[#E2E8F0]">4.9</span>
                      <span className="block text-[9.5px] mt-0.5" style={{ color: "#555" }}>Rating</span>
                    </span>
                  </motion.div>

                  {/* Semut cyborg animasi float */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CyborgAnt />
                  </motion.div>
                </motion.div>

                {/* Teks bawah */}
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-lg font-bold leading-snug mb-1"
                        style={{
                          background: "linear-gradient(to right,#ffffff 0%,#ffffff 40%,#DBEAFE 48%,#93C5FD 54%,#DBEAFE 60%,#ffffff 70%,#ffffff 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                        {mode === "login" ? "Selamat datang kembali!" : "Bergabunglah bersama kami!"}
                      </p>
                      <p className="text-[13px] leading-relaxed" style={{ color: "#3A3A3A" }}>
                        {mode === "login"
                          ? "Lanjutkan perjalanan belajarmu bersama Bletch AI."
                          : "Daftar dan mulai belajar bersama ribuan pelajar."}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════
                PANEL KANAN — form dark glass
            ══════════════════════════════ */}
            <div
              className="relative flex-1 flex flex-col overflow-y-auto"
              style={{ background: "rgba(6,6,10,0.97)" }}
            >
              {/* Ambient glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute w-[140%] h-[140%] -left-[20%] -bottom-[20%]"
                  style={{ background: "radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)",
                    animation: "ambient-drift 9s ease-in-out infinite" }} />
              </div>

              <div className="relative z-10 px-6 sm:px-10 py-10 flex flex-col h-full">

                {/* Tombol close */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <X size={15} style={{ color: "#666" }} />
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
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}