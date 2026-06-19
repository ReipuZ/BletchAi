import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Interview", href: "#interview" },
  { label: "Progress", href: "#stats" },
  { label: "FAQ", href: "#faq" },
];

const contacts = [
  { icon: MapPin, text: "Semarang, Indonesia" },
  { icon: Phone, text: "+62 812-3456-7890" },
  { icon: Mail, text: "halo@bletchai.id" },
];

const socials = [
  { label: "Instagram", href: "#", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Twitter/X", href: "#", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "LinkedIn", href: "#", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

export default function FooterSection() {
  return (
    <footer className="bg-[#1E1A16] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-10">

        {/* Main grid */}
        <div className="grid grid-cols-[1.8fr_1fr_1fr] gap-16 pb-12 border-b border-white/10">

          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo text */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#A67C52] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-sm">B</span>
              </div>
              <span className="text-xl font-black tracking-wide text-white">BLETCHAI</span>
            </div>

            <p className="text-[#C49A5A] text-sm font-medium mb-3">
              Platform Persiapan Karier untuk SMK
            </p>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Membantu lulusan SMK mempersiapkan karier melalui AI Interview, Skill Academy, dan Career Recommendation.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-[#C49A5A] hover:text-[#C49A5A] transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Nav col */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-bold tracking-widest text-[#C49A5A] uppercase mb-5">
              Navigasi
            </p>
            <div className="h-[2px] w-8 bg-[#A67C52] rounded mb-5" />
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#C49A5A] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact col */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs font-bold tracking-widest text-[#C49A5A] uppercase mb-5">
              Hubungi Kami
            </p>
            <div className="h-[2px] w-8 bg-[#A67C52] rounded mb-5" />
            <ul className="space-y-4">
              {contacts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={14} className="text-[#C49A5A] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/60 leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex justify-between items-center">
          <p className="text-xs text-white/30">
            © 2026 <span className="text-white/50 font-semibold">BletchAI</span>. All rights reserved.
          </p>
          <p className="text-xs text-white/30 italic">
            Built with ❤️ by Team BletchAI
          </p>
        </div>

      </div>
    </footer>
  );
}