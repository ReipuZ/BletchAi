import { motion } from "framer-motion";
import { ArrowUpRight, Mic, Sparkles, Clock, Star } from "lucide-react";
import Reveal from "../components/Reveal.jsx";

export default function InterviewSection() {
  return (
    <section
      id="interview"
      className="py-10 sm:py-14 md:py-20 px-4 sm:px-8 md:px-12"
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #06090F 18%, #080D18 60%, #06090F 90%, #000000 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <style>{`
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(22px, -18px) scale(1.08); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-16px, 14px) scale(1.06); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(10px, 10px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .drift-a, .drift-b, .drift-c, .pulse-dot { animation: none !important; }
        }
      `}</style>

      <Reveal amount={0.2} y={24}>
        <div
          className="relative max-w-5xl mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden"
          style={{
            background: "rgba(10,10,10,0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* ── Ambient glow blobs ── */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
              animation: "drift-a 10s ease-in-out infinite",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
              animation: "drift-b 13s ease-in-out infinite",
            }}
          />
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)",
              animation: "drift-c 9s ease-in-out infinite",
            }}
          />

          {/* ── Grid dekoratif ── */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          {/* ── Konten utama ── */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-0 px-6 sm:px-10 md:px-14 py-10 sm:py-14">

            {/* ── Kiri: teks & CTA ── */}
            <div className="flex-1 text-center md:text-left">

              {/* Badge pill */}
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-medium px-3 py-1 rounded-full mb-4"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  color: "#888888",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#22D3EE",
                    animation: "pulse-dot 2.5s ease-in-out infinite",
                    boxShadow: "0 0 6px rgba(34,211,238,0.7)",
                  }}
                />
                Simulasi Interview AI
              </motion.span>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <p
                  className="text-base sm:text-xl md:text-2xl font-semibold mb-1"
                  style={{ color: "#555555" }}
                >
                  Tingkatkan Keahlian
                </p>
                <h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #ffffff 0%, #CCCCCC 50%, #888888 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  interview mu!
                </h2>
              </motion.div>

              {/* Deskripsi */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="text-[12px] sm:text-sm md:text-[15px] leading-relaxed mt-4 max-w-md md:mx-0 mx-auto"
                style={{ color: "#555555" }}
              >
                Berlatih wawancara bersama{" "}
                <span
                  className="font-semibold not-italic"
                  style={{ color: "#93C5FD" }}
                >
                  Anty
                </span>
                , asisten virtual BletchAI. Latih kemampuan interview-mu melalui
                simulasi interaktif dan dapatkan evaluasi berdasarkan hasil latihanmu.
              </motion.p>

              {/* Stat pills kecil */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-5 md:justify-start justify-center"
              >
                {[
                  { icon: Star,  color: "#FBBF24", label: "4.9 Rating" },
                  { icon: Clock, color: "#22D3EE", label: "~15 menit" },
                  { icon: Mic,   color: "#A78BFA", label: "Real-time AI" },
                ].map(({ icon: Icon, color, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                      color: "#666666",
                    }}
                  >
                    <Icon size={11} style={{ color }} />
                    {label}
                  </span>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.38 }}
                className="mt-7 md:justify-start flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    color: "#93C5FD",
                    border: "1px solid rgba(59,130,246,0.28)",
                    boxShadow:
                      "inset 0 1px 0 rgba(59,130,246,0.22), 0 4px 16px rgba(59,130,246,0.10)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.25)";
                    e.currentTarget.style.boxShadow =
                      "inset 0 1px 0 rgba(59,130,246,0.28), 0 8px 24px rgba(59,130,246,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                    e.currentTarget.style.boxShadow =
                      "inset 0 1px 0 rgba(59,130,246,0.22), 0 4px 16px rgba(59,130,246,0.10)";
                  }}
                >
                  Mulai Interview
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            </div>

            {/* ── Kanan: visual card mock ── */}
            <div className="md:w-64 lg:w-72 flex-shrink-0 w-full max-w-xs mx-auto md:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {/* Card simulasi interview */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow:
                      "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Header card */}
                  <div
                    className="px-4 py-3 flex items-center gap-2.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {/* Avatar Anty */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(34,211,238,0.12)",
                        border: "1px solid rgba(34,211,238,0.22)",
                        boxShadow: "inset 0 1px 0 rgba(34,211,238,0.15)",
                      }}
                    >
                      <Mic size={14} style={{ color: "#22D3EE" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#CCCCCC" }}>
                        Anty
                      </p>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: "#22D3EE",
                            animation: "pulse-dot 2s ease-in-out infinite",
                          }}
                        />
                        <span className="text-[10px]" style={{ color: "#555555" }}>
                          Online
                        </span>
                      </div>
                    </div>
                    {/* Sparkles */}
                    <Sparkles
                      size={14}
                      className="ml-auto flex-shrink-0"
                      style={{ color: "#A78BFA" }}
                    />
                  </div>

                  {/* Chat bubbles */}
                  <div className="px-3 py-3 flex flex-col gap-2.5">
                    {/* Anty */}
                    <div className="flex gap-2 items-end">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(34,211,238,0.10)",
                          border: "1px solid rgba(34,211,238,0.18)",
                        }}
                      >
                        <Mic size={10} style={{ color: "#22D3EE" }} />
                      </div>
                      <div
                        className="rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                        }}
                      >
                        <p className="text-[11px] leading-relaxed" style={{ color: "#AAAAAA" }}>
                          Ceritakan pengalaman kamu menghadapi konflik di tempat kerja!
                        </p>
                      </div>
                    </div>

                    {/* User */}
                    <div className="flex gap-2 items-end justify-end">
                      <div
                        className="rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%]"
                        style={{
                          background: "rgba(59,130,246,0.12)",
                          border: "1px solid rgba(59,130,246,0.22)",
                          boxShadow: "inset 0 1px 0 rgba(59,130,246,0.15)",
                        }}
                      >
                        <p className="text-[11px] leading-relaxed" style={{ color: "#93C5FD" }}>
                          Saya pernah menghadapi perbedaan pendapat...
                        </p>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex gap-2 items-end">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(34,211,238,0.10)",
                          border: "1px solid rgba(34,211,238,0.18)",
                        }}
                      >
                        <Mic size={10} style={{ color: "#22D3EE" }} />
                      </div>
                      <div
                        className="rounded-2xl rounded-bl-sm px-4 py-3"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                      >
                        <div className="flex gap-1 items-center">
                          {[0, 0.18, 0.36].map((delay, i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: "#555555",
                                animation: `pulse-dot 1.2s ease-in-out ${delay}s infinite`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skor preview */}
                  <div
                    className="mx-3 mb-3 rounded-xl px-3 py-2.5 flex items-center justify-between"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <p className="text-[10px]" style={{ color: "#555555" }}>
                      Skor sementara
                    </p>
                    <div className="flex items-center gap-1.5">
                      {[
                        { label: "K", color: "#3B82F6" },
                        { label: "C", color: "#22D3EE" },
                        { label: "P", color: "#A78BFA" },
                      ].map(({ label, color }) => (
                        <span
                          key={label}
                          className="text-[10px] font-bold w-5 h-5 rounded-md flex items-center justify-center"
                          style={{
                            background: `${color}18`,
                            border: `1px solid ${color}30`,
                            color,
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </Reveal>
    </section>
  );
}