import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
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
        @keyframes bl-blobPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }
        @keyframes bl-blobPulseCyan {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.12); }
        }
        @keyframes bl-dotBounce {
          0%, 80%, 100% { opacity: 0.2; transform: scale(1); }
          40%            { opacity: 0.8; transform: scale(1.35); }
        }
        @keyframes bl-scanLine {
          0%   { left: -60%; }
          100% { left: 160%; }
        }
        @keyframes bl-cornerFade {
          0%, 100% { opacity: 0.08; }
          50%       { opacity: 0.22; }
        }
        @keyframes bl-titleShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .bl-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 0.18em;
          background: linear-gradient(
            90deg,
            var(--text-primary) 20%,
            var(--accent-light) 50%,
            var(--text-primary) 80%
          );
          background-size: 400px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bl-titleShimmer 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bl-blob, .bl-dot, .bl-bar, .bl-corner, .bl-title {
            animation: none !important;
          }
        }
      `}</style>

      <div
        style={{
          position: "fixed", inset: 0,
          background: "var(--bg-base)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 9999, overflow: "hidden",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: fadeOut ? "none" : "auto",
        }}
      >
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(var(--border-soft) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }} />

        {/* Blob biru */}
        <div className="bl-blob" style={{
          position: "absolute", borderRadius: "50%",
          filter: "blur(140px)", pointerEvents: "none",
          width: 450, height: 450, top: -100, left: -100,
          background: "radial-gradient(circle, #3B82F6, transparent 70%)",
          opacity: 0.10,
          animation: "bl-blobPulse 7s ease-in-out infinite",
        }} />

        {/* Blob ungu */}
        <div className="bl-blob" style={{
          position: "absolute", borderRadius: "50%",
          filter: "blur(140px)", pointerEvents: "none",
          width: 380, height: 380, bottom: -80, right: -80,
          background: "radial-gradient(circle, #8B5CF6, transparent 70%)",
          opacity: 0.08,
          animation: "bl-blobPulse 7s ease-in-out infinite 3.5s",
        }} />

        {/* Blob cyan */}
        <div className="bl-blob" style={{
          position: "absolute", borderRadius: "50%",
          filter: "blur(140px)", pointerEvents: "none",
          width: 320, height: 220, bottom: "18%", left: "50%",
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          opacity: 0.07,
          animation: "bl-blobPulseCyan 7s ease-in-out infinite 1.5s",
        }} />

        {/* Corners */}
        {[
          { top: 24, left: 24, borderTop: "1px solid var(--accent-border)", borderLeft: "1px solid var(--accent-border)" },
          { top: 24, right: 24, borderTop: "1px solid var(--accent-border)", borderRight: "1px solid var(--accent-border)" },
          { bottom: 24, left: 24, borderBottom: "1px solid var(--accent-border)", borderLeft: "1px solid var(--accent-border)" },
          { bottom: 24, right: 24, borderBottom: "1px solid var(--accent-border)", borderRight: "1px solid var(--accent-border)" },
        ].map((s, i) => (
          <div key={i} className="bl-corner" style={{
            position: "absolute", width: 20, height: 20,
            animation: "bl-cornerFade 2.5s ease-in-out infinite",
            animationDelay: `${i * 0.4}s`,
            ...s,
          }} />
        ))}

        {/* Konten tengah */}
        <div style={{
          position: "relative", zIndex: 3,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 20,
        }}>

          {/* Title */}
          <span className="bl-title">BLETCH AI</span>

          {/* Memuat + dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.10em" }}>
              Memuat
            </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} className="bl-dot" style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "var(--accent-light)",
                  animation: "bl-dotBounce 1.4s ease-in-out infinite",
                  animationDelay: `${delay}s`,
                }} />
              ))}
            </div>
          </div>

          {/* Scan bar */}
          <div style={{
            width: 200, height: 1,
            background: "var(--border-md)",
            borderRadius: 1, overflow: "hidden", position: "relative",
          }}>
            <div className="bl-bar" style={{
              position: "absolute", left: 0, top: 0,
              width: "60%", height: "100%",
              background: "linear-gradient(90deg, transparent, var(--accent-light), transparent)",
              animation: "bl-scanLine 1.8s ease-in-out infinite",
            }} />
          </div>
        </div>
      </div>
    </>
  );
}