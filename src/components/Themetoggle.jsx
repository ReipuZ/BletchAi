import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // Inisialisasi: cek localStorage dulu, fallback ke preferensi sistem
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      const dark = saved === "dark";
      setIsDark(dark);
      applyTheme(dark);
    } else {
      // Ikuti preferensi sistem
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      applyTheme(prefersDark);
    }

    // Listen perubahan preferensi sistem (hanya kalau belum ada manual override)
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "20px",
        zIndex: 9999,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "1px solid var(--toggle-border)",
        background: "var(--toggle-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--toggle-shadow)",
        color: "var(--toggle-color)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.10)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Animated icon swap */}
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s ease, transform 0.3s ease",
        opacity: 1,
        transform: "rotate(0deg)",
      }}>
        {isDark
          ? <Sun size={18} strokeWidth={1.8} />
          : <Moon size={18} strokeWidth={1.8} />
        }
      </span>

      {/* Pulse ring saat di-hover */}
      <span style={{
        position: "absolute",
        inset: "-3px",
        borderRadius: "50%",
        border: "1px solid var(--toggle-color)",
        opacity: 0,
        transition: "opacity 0.2s ease",
        pointerEvents: "none",
      }}
        className="toggle-ring"
      />
    </button>
  );
}