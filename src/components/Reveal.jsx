import { motion } from "framer-motion";

/**
 * Reveal
 * Wrapper reusable untuk animasi "kebuka" saat elemen masuk viewport ketika di-scroll.
 * Pakai whileInView dari framer-motion — animasi cuma jalan sekali (once: true)
 * supaya tidak berulang kalau user scroll naik-turun.
 *
 * Props:
 * - children     : konten yang dibungkus
 * - delay        : jeda sebelum animasi mulai (detik), default 0
 * - duration     : lama animasi (detik), default 0.6
 * - y            : jarak geser awal dari bawah (px), default 24
 * - amount       : seberapa besar elemen harus terlihat sebelum trigger (0-1), default 0.2
 * - className    : className tambahan untuk div pembungkus
 * - as           : tag/Component pembungkus (default "div")
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 24,
  amount = 0.2,
  className = "",
  as = "div",
}) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({ children, className = "", stagger = 0.08, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};