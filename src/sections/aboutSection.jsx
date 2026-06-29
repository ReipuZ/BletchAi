import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const navLinks = [
  { label: "Home",      href: "#home"      },
  { label: "Interview", href: "#interview" },
  { label: "Progress",  href: "#stats"     },
  { label: "FAQ",       href: "#faq"       },
];

const contacts = [
  { icon: MapPin, text: "Semarang, Indonesia" },
  { icon: Phone,  text: "+62 812-3456-7890"  },
  { icon: Mail,   text: "halo@bletchai.id"   },
];

const socials = [
  {
    label: "Instagram", href: "#",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Twitter/X", href: "#",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn", href: "#",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function FooterSection() {
  return (
    <footer
      className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8"
      style={{ background: "var(--bg-base)" }}
    >
      <style>{`
        @keyframes pulse-glow-footer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        .footer-pulse { animation: pulse-glow-footer 3s ease-in-out infinite; }

        @keyframes footer-blob-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(18px, -14px) scale(1.06); }
          66%       { transform: translate(-10px, 10px) scale(0.95); }
        }
        @keyframes footer-blob-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-14px, 12px) scale(1.04); }
          75%       { transform: translate(12px, -8px) scale(0.97); }
        }
        @keyframes footer-blob-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(8px, 16px) scale(1.05); }
        }
        .footer-blob-1 { animation: footer-blob-drift-1 9s ease-in-out infinite; }
        .footer-blob-2 { animation: footer-blob-drift-2 11s ease-in-out infinite; }
        .footer-blob-3 { animation: footer-blob-drift-3 13s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .footer-pulse,
          .footer-blob-1,
          .footer-blob-2,
          .footer-blob-3 { animation: none; }
        }
      `}</style>

      {/* ── Ambient glows — pakai var() agar responsif light/dark ── */}
      <div
        className="footer-blob-1 pointer-events-none absolute -bottom-20 -left-20 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--blob-blue), transparent 70%)",
          opacity: "var(--blob-opacity-blue)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="footer-blob-2 pointer-events-none absolute -top-10 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--blob-purple), transparent 70%)",
          opacity: "var(--blob-opacity-purple)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="footer-blob-3 pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[120px] sm:w-[500px] sm:h-[180px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--blob-cyan), transparent 70%)",
          opacity: "var(--blob-opacity-cyan)",
          filter: "blur(90px)",
        }}
      />

      {/* ── Grid lines ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: "var(--grid-opacity)",
        }}
      />

      {/* ── Top separator ── */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent-border) 30%, rgba(139,92,246,0.25) 65%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 md:px-10">
        <div
          className="grid grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr] gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:gap-x-16 pb-10 sm:pb-14"
          style={{ borderBottom: "1px solid var(--border-soft)" }}
        >

          {/* ── Brand ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  boxShadow: "inset 0 1px 0 var(--accent-border)",
                }}
              >
                <span className="font-black text-xs" style={{ color: "var(--accent-light)" }}>B</span>
              </div>
              <span className="text-lg font-black tracking-wide" style={{ color: "var(--text-primary)" }}>
                BLETCHAI
              </span>
            </div>

            <span
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full mb-3 max-w-full"
              style={{
                color: "var(--accent-light)",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                boxShadow: "inset 0 1px 0 var(--accent-bg)",
                whiteSpace: "normal",
                lineHeight: "1.4",
              }}
            >
              <span
                className="footer-pulse w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--accent)" }}
              />
              Platform Persiapan Karier untuk SMK
            </span>

            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "28ch" }}>
              Membantu lulusan SMK mempersiapkan karier melalui AI Interview, Skill Academy, dan Career Recommendation.
            </p>

            <div className="flex gap-2 mt-4 sm:mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-bg)";
                    e.currentTarget.style.borderColor = "var(--accent-border)";
                    e.currentTarget.style.color = "var(--accent-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bg-surface)";
                    e.currentTarget.style.borderColor = "var(--border-soft)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Navigasi ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1"
          >
            <p
              className="text-[10px] font-medium uppercase tracking-[0.12em] mb-1"
              style={{ color: "var(--text-label)" }}
            >
              Menu
            </p>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Navigasi</p>
            <div className="h-px w-7 rounded mb-4" style={{ background: "var(--gradient-brand)" }} />
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs transition-colors duration-200 block py-0.5"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-light)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Kontak ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            <p
              className="text-[10px] font-medium uppercase tracking-[0.12em] mb-1"
              style={{ color: "var(--text-label)" }}
            >
              Kontak
            </p>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Hubungi Kami</p>
            <div className="h-px w-7 rounded mb-4" style={{ background: "var(--gradient-brand)" }} />
            <ul className="space-y-3">
              {contacts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <div
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                    style={{
                      background: "var(--accent-bg)",
                      border: "1px solid var(--accent-border)",
                    }}
                  >
                    <Icon size={10} style={{ color: "var(--accent)" }} />
                  </div>
                  <span className="text-xs leading-snug break-all" style={{ color: "var(--text-muted)" }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row gap-1 sm:gap-0 justify-between items-center text-center sm:text-left">
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            © 2026{" "}
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>BletchAI</span>
            . All rights reserved.
          </p>
          <div className="hidden sm:block w-1 h-1 rounded-full" style={{ background: "var(--border-md)" }} />
          <p className="text-[10px] italic" style={{ color: "var(--text-muted)" }}>
            Built with ❤️ by Team BletchAI
          </p>
        </div>
      </div>
    </footer>
  );
}