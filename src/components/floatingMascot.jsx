import { useState, useEffect, useRef } from "react";

// Jika gambar di src/assets:
import antImage from "../assets/image/ant-mascot.png";
// Jika gambar di public, tidak perlu import, langsung pakai path string

export default function FloatingMascot({ onGoToInterview, position = "bottom-right" }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const messages = [
    "Siap uji kemampuanmu? 🎯",
    "Yuk latihan interview sekarang!",
    "Aku siap temenin kamu! 💼",
    "Jangan takut, mulai aja dulu! 💪",
    "Interview yuk, bareng aku! 🐜",
  ];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setShowBubble(true);
      }, 350);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const positionClass =
    position === "bottom-left" ? "bottom-4 left-4" : "bottom-4 right-4";

  return (
    <div className={`fixed ${positionClass} z-50 flex flex-col items-center gap-1`}>
      
      {/* Speech Bubble */}
      <div className={`transition-all duration-300 ${showBubble ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div
          onClick={onGoToInterview}
          className="relative bg-white border-2 border-amber-400 text-gray-800 text-sm font-semibold px-4 py-2 rounded-2xl shadow-lg max-w-[190px] text-center cursor-pointer hover:bg-amber-50 transition-colors"
        >
          {messages[messageIndex]}
          <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[11px] border-l-transparent border-r-transparent border-t-amber-400"/>
          <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-white"/>
        </div>
      </div>

      {/* Gambar Semut */}
      <button
        onClick={onGoToInterview}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Mulai Interview"
        className="focus:outline-none"
        style={{
          transform: isHovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.2s ease",
          animation: "antFloat 3s ease-in-out infinite",
          filter: isHovered ? "drop-shadow(0 6px 16px rgba(200,149,108,0.5))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        }}
      >
        <img
          src={antImage}              // ← ganti ke "/ant-mascot.png" jika di folder public
          alt="Maskot Semut Interview"
          className="w-28 h-auto select-none"
          draggable={false}
        />
      </button>

      <p className="text-[11px] text-amber-700 font-semibold text-center select-none -mt-1">
        Klik untuk Interview!
      </p>

      <style>{`
        @keyframes antFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
      `}</style>
    </div>
  );
}