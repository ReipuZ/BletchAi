import { motion } from "framer-motion";

/**
 * AntyMascot — maskot semut humanoid BletchAI
 * Warna coklat, menghadap kanan, tangan kiri memegang dagu (pose berpikir)
 */
export default function AntyMascot({ size = 300, className = "" }) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size * 1.1 }}
      animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 200 220"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antena kiri */}
        <motion.g
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "82px 44px" }}
        >
          <path
            d="M82 44 Q70 22 58 14"
            stroke="#8A6A4A" strokeWidth="3.5" fill="none" strokeLinecap="round"
          />
          <circle cx="58" cy="14" r="4" fill="#A07850" />
        </motion.g>

        {/* Antena kanan */}
        <motion.g
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ transformOrigin: "105px 42px" }}
        >
          <path
            d="M105 42 Q115 20 128 13"
            stroke="#8A6A4A" strokeWidth="3.5" fill="none" strokeLinecap="round"
          />
          <circle cx="128" cy="13" r="4" fill="#A07850" />
        </motion.g>

        {/* Kepala */}
        <ellipse cx="95" cy="70" rx="36" ry="32" fill="#A07850" />

        {/* Topi */}
        <ellipse cx="97" cy="52" rx="38" ry="9" fill="#C49A5A" />
        <path d="M59 48 Q97 22 138 46 L140 54 Q97 34 57 56Z" fill="#B8844A" />

        {/* Kacamata */}
        <rect x="62" y="68" width="25" height="18" rx="9" fill="none" stroke="#3a2010" strokeWidth="3" />
        <rect x="93" y="68" width="25" height="18" rx="9" fill="none" stroke="#3a2010" strokeWidth="3" />
        <line x1="87" y1="76" x2="93" y2="76" stroke="#3a2010" strokeWidth="2.5" />
        <line x1="62" y1="74" x2="54" y2="70" stroke="#3a2010" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="118" y1="74" x2="126" y2="70" stroke="#3a2010" strokeWidth="2.5" strokeLinecap="round" />

        {/* Mata */}
        <circle cx="74" cy="77" r="4" fill="#fff" opacity={0.85} />
        <circle cx="106" cy="77" r="4" fill="#fff" opacity={0.85} />
        <circle cx="74" cy="77" r="2.2" fill="#3a2010" />
        <circle cx="106" cy="77" r="2.2" fill="#3a2010" />

        {/* Senyum */}
        <path d="M84 90 Q95 97 107 90" stroke="#7a4a20" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Badan — kemeja putih */}
        <path d="M72 108 Q95 100 118 108 L122 150 Q95 158 68 150Z" fill="#f5f0ea" />
        {/* Dasi */}
        <polygon points="95,107 91,140 95,143 99,140" fill="#A07850" />
        {/* Sabuk */}
        <rect x="66" y="148" width="58" height="8" rx="2" fill="#3a2010" />
        <rect x="88" y="148" width="14" height="8" rx="1.5" fill="#A07850" />

        {/* Celana */}
        <path d="M68 156 L64 184 Q80 192 95 184 L95 156Z" fill="#C49A5A" />
        <path d="M122 156 L126 184 Q110 192 95 184 L95 156Z" fill="#C49A5A" />

        {/* Sepatu */}
        <ellipse cx="70" cy="188" rx="12" ry="8" fill="#6a4828" />
        <ellipse cx="120" cy="188" rx="12" ry="8" fill="#6a4828" />

        {/* Abdomen semut */}
        <ellipse cx="138" cy="158" rx="32" ry="30" fill="#8A6A4A" />
        <path d="M112 155 Q138 146 164 155" stroke="#6a4828" strokeWidth="1.8" fill="none" opacity={0.5} />
        <path d="M108 165 Q138 157 168 165" stroke="#6a4828" strokeWidth="1.8" fill="none" opacity={0.5} />

        {/* Lengan kiri — upper arm */}
        <path
          d="M72 112 Q58 116 54 128"
          stroke="#A07850" strokeWidth="10" fill="none" strokeLinecap="round"
        />

        {/* Lengan kiri — forearm + tangan pegang dagu (animasi) */}
        <motion.g
          animate={{ y: [0, -5, -2, 0], rotate: [0, -4, 2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "72px 97px" }}
        >
          <path
            d="M54 128 Q56 110 72 100"
            stroke="#A07850" strokeWidth="9" fill="none" strokeLinecap="round"
          />
          {/* kepalan tangan */}
          <circle cx="72" cy="97" r="8" fill="#C49A5A" />
          {/* jari telunjuk menunjuk ke atas / dagu */}
          <rect x="69" y="83" width="7" height="14" rx="3.5" fill="#C49A5A" />
        </motion.g>

        {/* Lengan kanan — mengarah ke kanan */}
        <path
          d="M118 110 Q138 104 158 98"
          stroke="#A07850" strokeWidth="10" fill="none" strokeLinecap="round"
        />
        <circle cx="160" cy="97" r="7" fill="#C49A5A" />
      </svg>
    </motion.div>
  );
}