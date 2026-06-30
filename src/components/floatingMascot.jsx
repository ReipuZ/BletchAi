import { useState, useEffect, useRef } from "react";
import antImage from "../assets/image/bletchai_maskot.png";

export default function FloatingMascot({ onGoToInterview, position = "bottom-right", hidden = false }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const intervalRef = useRef(null);

  // Kontrol mount/unmount + animasi genie keluar-masuk
  const [shouldRender, setShouldRender] = useState(!hidden);
  const [genieClass, setGenieClass] = useState(hidden ? "genie-out" : "genie-in");

  const messages = [
    "Siap uji kemampuanmu?",
    "Yuk latihan interview sekarang!",
    "Aku siap temenin kamu!",
    "Jangan takut, mulai aja dulu!",
    "Interview yuk, bareng aku!",
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

  // Genie animation: keluar saat hidden=true, masuk lagi saat hidden=false
  useEffect(() => {
    if (hidden) {
      setGenieClass("genie-out");
      const t = setTimeout(() => setShouldRender(false), 550);
      return () => clearTimeout(t);
    } else {
      setShouldRender(true);
      // delay 1 frame supaya transisi "masuk" ter-trigger setelah mount
      const raf = requestAnimationFrame(() => setGenieClass("genie-in"));
      return () => cancelAnimationFrame(raf);
    }
  }, [hidden]);

  if (!shouldRender) return null;

  const positionClass =
    position === "bottom-left"
      ? "bottom-4 left-3 sm:bottom-6 sm:left-4"
      : "bottom-4 right-3 sm:bottom-6 sm:right-4";

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    setTimeout(() => {
      onGoToInterview?.();
      setIsClicked(false);
    }, 280);
  };

  return (
    <div
      className={`fixed ${positionClass} z-50 flex flex-col items-center gap-1.5 ${genieClass}`}
      style={{ transformOrigin: "bottom center" }}
    >
      <style>{`
        @keyframes antFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(0deg); }
        }
        @keyframes mascotGlowPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.5; }
        }
        @keyframes mascotTap {
          0%   { transform: translateY(0px) rotate(0deg); }
          40%  { transform: translateY(3px) rotate(-3deg); }
          70%  { transform: translateY(0px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes bubbleShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .mascot-bubble-shimmer {
          background-image: linear-gradient(
            120deg,
            var(--border-soft) 0%,
            var(--border-soft) 40%,
            rgba(59,130,246,0.6) 50%,
            var(--border-soft) 60%,
            var(--border-soft) 100%
          );
          background-size: 250% 100%;
          animation: bubbleShimmer 4s linear infinite;
        }

        /* ── Efek Genie ── */
        @keyframes genieOutKf {
          0%   { transform: translateY(0) scale(1, 1) skewX(0deg); opacity: 1; filter: blur(0px); }
          35%  { transform: translateY(6px) scale(1.08, 0.82) skewX(-9deg); opacity: 0.9; filter: blur(0.5px); }
          70%  { transform: translateY(34px) scale(0.35, 0.45) skewX(10deg); opacity: 0.4; filter: blur(2px); }
          100% { transform: translateY(58px) scale(0.04, 0.25) skewX(18deg); opacity: 0; filter: blur(5px); }
        }
        @keyframes genieInKf {
          0%   { transform: translateY(58px) scale(0.04, 0.25) skewX(18deg); opacity: 0; filter: blur(5px); }
          40%  { transform: translateY(20px) scale(0.5, 0.6) skewX(-10deg); opacity: 0.6; filter: blur(2px); }
          70%  { transform: translateY(-8px) scale(1.1, 1.08) skewX(4deg); opacity: 1; filter: blur(0px); }
          100% { transform: translateY(0) scale(1, 1) skewX(0deg); opacity: 1; filter: blur(0px); }
        }
        .genie-out {
          animation: genieOutKf 0.55s cubic-bezier(0.55, 0, 0.85, 0.35) forwards;
          pointer-events: none;
        }
        .genie-in {
          animation: genieInKf 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
        }
      `}</style>

      {/* Speech Bubble */}
      <div
        className={`
          transition-all duration-300
          ${showBubble ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
        `}
      >
        <div
          onClick={handleClick}
          className="
            relative cursor-pointer rounded-2xl shadow-lg text-center font-medium
            text-[10px] leading-snug px-2.5 py-1.5
            sm:text-[12px] sm:px-3 sm:py-2
            transition-colors duration-200
          "
          style={{
            width: "128px",
            background: "var(--bg-card)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-md)",
            boxShadow: `0 12px 32px var(--shadow-card), inset 0 1px 0 var(--card-inset)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-surface-md)";
            e.currentTarget.style.border = "1px solid var(--accent-border)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-card)";
            e.currentTarget.style.border = "1px solid var(--border-md)";
          }}
        >
          <div className="absolute inset-x-2 top-0 h-px mascot-bubble-shimmer rounded-full" />

          {messages[messageIndex]}

          <div
            className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[10px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: "var(--border-md)" }}
          />
          <div
            className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[8px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: "var(--bg-card)" }}
          />
        </div>
      </div>

      {/* Gambar Maskot */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Mulai Interview"
        className="relative focus:outline-none"
        style={{
          animation: isClicked
            ? "mascotTap 0.28s ease-in-out"
            : "antFloat 3s ease-in-out infinite",
        }}
      >
        <span
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)",
            transform: "scale(1.5)",
            opacity: isHovered || isClicked ? 0.7 : 0.3,
            animation: isHovered || isClicked ? "none" : "mascotGlowPulse 3s ease-in-out infinite",
          }}
        />

        <img
          src={antImage}
          alt="Maskot BletchAI Interview"
          draggable={false}
          className="
            relative select-none
            w-16 h-auto
            sm:w-24
            md:w-28
          "
          style={{
            filter: isHovered || isClicked
              ? "drop-shadow(0 8px 22px rgba(59,130,246,0.45))"
              : "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
            transition: "filter 0.25s ease",
          }}
        />
      </button>

      <p
        className="hidden sm:block text-[11px] font-semibold text-center select-none -mt-1"
        style={{ color: "var(--accent-light)" }}
      >
        Klik untuk Interview!
      </p>
    </div>
  );
}