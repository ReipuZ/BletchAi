import { useState, useEffect, useRef } from "react";
import antImage from "../assets/image/ant-mascot.png";

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
    position === "bottom-left"
      ? "bottom-4 left-3 sm:bottom-6 sm:left-4"
      : "bottom-4 right-3 sm:bottom-6 sm:right-4";

  return (
    <div className={`fixed ${positionClass} z-50 flex flex-col items-center gap-1`}>

      {/* Speech Bubble */}
      <div
        className={`
          transition-all duration-300
          ${showBubble ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
        `}
      >
        <div
          onClick={onGoToInterview}
          className="
            relative bg-white border-2 border-amber-400
            text-gray-800 font-semibold cursor-pointer
            hover:bg-amber-50 transition-colors
            rounded-2xl shadow-lg text-center
            text-[11px] px-3 py-1.5 max-w-[140px]
            sm:text-sm sm:px-4 sm:py-2 sm:max-w-[190px]
          "
        >
          {messages[messageIndex]}

          {/* Ekor bubble */}
          <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[11px] border-l-transparent border-r-transparent border-t-amber-400" />
          <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-white" />
        </div>
      </div>

      {/* Gambar Semut */}
      <button
        onClick={onGoToInterview}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Mulai Interview"
        className="focus:outline-none active:scale-90 transition-transform"
        style={{
          transform: isHovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.2s ease",
          animation: "antFloat 3s ease-in-out infinite",
          filter: isHovered
            ? "drop-shadow(0 6px 16px rgba(200,149,108,0.5))"
            : "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        }}
      >
        <img
          src={antImage}
          alt="Maskot Semut Interview"
          draggable={false}
          className="
            select-none
            w-16 h-auto
            sm:w-24
            md:w-28
          "
        />
      </button>

      {/* Label bawah — sembunyikan di mobile kecil */}
      <p className="hidden sm:block text-[11px] text-amber-700 font-semibold text-center select-none -mt-1">
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