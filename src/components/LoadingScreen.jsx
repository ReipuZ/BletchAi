import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Mulai fade out setelah 2 detik
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    // Hapus dari DOM setelah animasi fade selesai
    const removeTimer = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes blobPulse {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50%       { opacity: 0.20; transform: scale(1.15); }
        }
        @keyframes blobPulseCyan {
          0%, 100% { opacity: 0.05; transform: translateX(-50%) scale(1); }
          50%       { opacity: 0.14; transform: translateX(-50%) scale(1.2); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.08); }
          50%       { box-shadow: 0 0 36px rgba(59,130,246,0.30), inset 0 1px 0 rgba(255,255,255,0.12); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { opacity: 0.2; transform: scale(1); }
          40%            { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes scanLine {
          0%   { left: -60%; }
          100% { left: 160%; }
        }
        @keyframes cornerFade {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bl-blob, .bl-ring, .bl-ring-outer, .bl-logo-inner,
          .bl-dot, .bl-progress-bar, .bl-corner { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg-base, #0a0a0f)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          overflow: "hidden",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: fadeOut ? "none" : "auto",
        }}
      >
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(var(--border-soft, rgba(255,255,255,0.06)) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-soft, rgba(255,255,255,0.06)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }} />

        {/* Scanlines overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, opacity: 0.5,
          background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }} />

        {/* Blobs */}
        <div className="bl-blob" style={{
          position: "absolute", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none",
          width: 400, height: 400, top: -80, left: -80,
          background: "radial-gradient(circle, #3B82F6, transparent 70%)",
          animation: "blobPulse 6s ease-in-out infinite",
        }} />
        <div className="bl-blob" style={{
          position: "absolute", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none",
          width: 350, height: 350, bottom: -60, right: -60,
          background: "radial-gradient(circle, #8B5CF6, transparent 70%)",
          animation: "blobPulse 6s ease-in-out infinite 3s",
        }} />
        <div className="bl-blob" style={{
          position: "absolute", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none",
          width: 300, height: 200, bottom: "20%", left: "50%",
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          animation: "blobPulseCyan 6s ease-in-out infinite 1.5s",
        }} />

        {/* Corner decorations */}
        {[
          { top: 24, left: 24, borderTop: "1px solid var(--accent-light, #93c5fd)", borderLeft: "1px solid var(--accent-light, #93c5fd)" },
          { top: 24, right: 24, borderTop: "1px solid var(--accent-light, #93c5fd)", borderRight: "1px solid var(--accent-light, #93c5fd)" },
          { bottom: 24, left: 24, borderBottom: "1px solid var(--accent-light, #93c5fd)", borderLeft: "1px solid var(--accent-light, #93c5fd)" },
          { bottom: 24, right: 24, borderBottom: "1px solid var(--accent-light, #93c5fd)", borderRight: "1px solid var(--accent-light, #93c5fd)" },
        ].map((style, i) => (
          <div key={i} className="bl-corner" style={{
            position: "absolute", width: 20, height: 20,
            animation: "cornerFade 2s ease-in-out infinite alternate",
            animationDelay: `${i * 0.3}s`,
            ...style,
          }} />
        ))}

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>

          {/* Logo */}
          <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bl-ring-outer" style={{
              position: "absolute", inset: -10, borderRadius: "50%",
              border: "1px solid rgba(59,130,246,0.12)",
              animation: "ringPulse 2.4s ease-in-out infinite 0.4s",
            }} />
            <div className="bl-ring" style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid var(--accent-border, rgba(59,130,246,0.35))",
              animation: "ringPulse 2.4s ease-in-out infinite",
            }} />
            <div className="bl-logo-inner" style={{
              width: 44, height: 44, borderRadius: 14,
              background: "var(--accent-bg, rgba(59,130,246,0.12))",
              border: "1px solid var(--accent-border, rgba(59,130,246,0.35))",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "logoPulse 2.4s ease-in-out infinite",
            }}>
              <span style={{
                fontSize: 18, fontWeight: 700,
                color: "var(--accent-light, #93c5fd)",
                letterSpacing: "-0.5px",
                fontFamily: "inherit",
              }}>B</span>
            </div>
          </div>

          {/* Label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 15, fontWeight: 600,
              color: "var(--text-primary, #f0f0f5)",
              letterSpacing: "0.08em",
              fontFamily: "inherit",
            }}>BLETCH AI</span>

            {/* Loading dots */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 12, color: "var(--text-muted, #6b7280)",
                letterSpacing: "0.08em", fontFamily: "inherit",
              }}>Memuat</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} className="bl-dot" style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: "var(--accent-light, #93c5fd)",
                    animation: `dotBounce 1.4s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Progress scan bar */}
          <div style={{
            width: 200, height: 1,
            background: "var(--border-md, rgba(255,255,255,0.10))",
            borderRadius: 1, overflow: "hidden", position: "relative",
          }}>
            <div className="bl-progress-bar" style={{
              position: "absolute", left: 0, top: 0,
              width: "60%", height: "100%",
              background: "linear-gradient(90deg, transparent, var(--accent-light, #93c5fd), transparent)",
              animation: "scanLine 1.8s ease-in-out infinite",
            }} />
          </div>
        </div>
      </div>
    </>
  );
}