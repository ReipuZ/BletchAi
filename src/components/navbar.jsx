import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // CHANGED: tambahan import
import {
  House, Mic, CircleHelp, BookOpen,
  LogOut, UserRound, Search, MessageCircle,
  BarChart2, ChevronDown, ChevronUp, X, Menu,
  History, // CHANGED: icon untuk menu History
  Sun, Moon, // CHANGED: icon untuk theme toggle (ganti Bell)
} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar({ onLogout, onLogin, localUser, isLogin, openStatsRef }) {
  const navigate = useNavigate(); // CHANGED
  const location = useLocation(); // CHANGED — dipakai untuk tahu apakah kita sedang di /history

  const [firebaseUser, setFirebaseUser]           = useState(null);
  const [open, setOpen]                           = useState(false);
  const [search, setSearch]                       = useState("");
  const [searchOpen, setSearchOpen]               = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]       = useState(false);
  const [active, setActive]                       = useState("home");
  const [scrolled, setScrolled]                   = useState(false);
  const [interviewDropOpen, setInterviewDropOpen] = useState(false);
  const [isDark, setIsDark]                       = useState(true); // CHANGED: state theme (gabungan dari ThemeToggle)
  const isClicking       = useRef(false);
  const dropdownRef      = useRef(null);
  const searchRef        = useRef(null);
  const interviewDropRef = useRef(null);
  const mobileInterviewRef = useRef(null);
  const mobileAvatarRef    = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setFirebaseUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current      && !dropdownRef.current.contains(e.target))      setOpen(false);
      if (searchRef.current        && !searchRef.current.contains(e.target))        setSearchOpen(false);
      if (interviewDropRef.current && !interviewDropRef.current.contains(e.target)) setInterviewDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // CHANGED: logic theme toggle dipindahkan ke sini (dari komponen ThemeToggle terpisah)
  // supaya tombolnya bisa langsung dipasang di navbar (gantiin lonceng), tidak perlu
  // render komponen mengambang terpisah lagi.
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      const dark = saved === "dark";
      setIsDark(dark);
      applyTheme(dark);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      applyTheme(prefersDark);
    }

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

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // CHANGED: History dikeluarkan dari menuItems — dia route (pindah halaman),
  // bukan scroll-to-section, jadi nggak pernah pas dengan logic active-color
  // berbasis IntersectionObserver yang dipakai item-item lain di sini.
  // History sekarang dipindah ke dropdown avatar (account menu).
  const menuItems = [
    { name: "Dashboard",    icon: House,      target: "home" },
    { name: "Kursus",       icon: BookOpen,   target: "kursus" },
    { name: "Interview AI", icon: Mic,        target: "interview", hasDropdown: true },
    { name: "FAQ",          icon: CircleHelp, target: "faq" },
  ];

  // CHANGED: item khusus History, dipakai di dropdown avatar (desktop & mobile)
  const historyItem = { name: "History", icon: History, target: "/history", isRoute: true };

  useEffect(() => {
    // CHANGED: kalau kita lagi di halaman /history, jangan jalankan observer
    // scroll-to-section (section-section itu tidak ada di halaman ini).
    if (location.pathname.startsWith("/history")) {
      setActive("/history");
      return;
    }

    const targets = menuItems
      .filter((m) => !m.isRoute) // CHANGED: skip item yang berupa route, bukan section
      .map((m) => document.getElementById(m.target))
      .filter(Boolean);
    if (!targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (isClicking.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(top.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // CHANGED: fungsi navigasi terpadu — item dengan isRoute pindah halaman,
  // selain itu tetap scroll-to-section seperti semula. Kalau dipanggil dari
  // halaman selain "/", scroll-to-section perlu balik ke "/" dulu dan
  // MENUNGGU section-nya benar-benar muncul di DOM (bukan delay tetap),
  // karena waktu render halaman utama setelah navigate() tidak pasti.
  const goTo = (item) => {
    setMobileMenuOpen(false);
    setInterviewDropOpen(false);

    if (item.isRoute) {
      isClicking.current = true;
      setActive(item.target);
      navigate(item.target);
      setTimeout(() => { isClicking.current = false; }, 700);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      waitForElementThenScroll(item.target);
      return;
    }

    scrollTo(item.target);
  };

  // CHANGED: helper — coba cari elemen section tiap frame (requestAnimationFrame)
  // sampai ketemu atau sampai batas waktu (2 detik) terlampaui, baru menyerah.
  // Ini menggantikan delay tetap (mis. setTimeout 80ms) yang tidak reliable
  // ketika halaman tujuan butuh waktu render lebih lama dari itu.
  const waitForElementThenScroll = (id, deadline = Date.now() + 2000) => {
    const el = document.getElementById(id);
    if (el) {
      scrollTo(id);
      return;
    }
    if (Date.now() >= deadline) return; // section tidak pernah muncul, diamkan saja
    requestAnimationFrame(() => waitForElementThenScroll(id, deadline));
  };

  const scrollTo = (id) => {
    isClicking.current = true;
    setActive(id);
    setMobileMenuOpen(false);
    setInterviewDropOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isClicking.current = false; }, 700);
  };

  const handleLihatStatistik = () => {
    setInterviewDropOpen(false);
    setMobileMenuOpen(false);

    // CHANGED: kalau lagi bukan di halaman utama, balik dulu sebelum scroll —
    // pakai helper yang sama (tunggu elemen muncul, bukan delay tetap)
    if (location.pathname !== "/") {
      navigate("/");
      const deadline = Date.now() + 2000;
      const tryOpen = () => {
        const el = document.getElementById("interview");
        if (el) {
          isClicking.current = true;
          setActive("interview");
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => { isClicking.current = false; }, 700);
          setTimeout(() => {
            if (openStatsRef?.current) openStatsRef.current();
          }, 500);
          return;
        }
        if (Date.now() >= deadline) return;
        requestAnimationFrame(tryOpen);
      };
      tryOpen();
      return;
    }

    isClicking.current = true;
    setActive("interview");
    document.getElementById("interview")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isClicking.current = false; }, 700);
    setTimeout(() => {
      if (openStatsRef?.current) openStatsRef.current();
    }, 500);
  };

  const loggedIn     = isLogin || !!firebaseUser;
  const displayName  = firebaseUser?.displayName || localUser?.name  || null;
  const displayEmail = firebaseUser?.email        || localUser?.email || null;
  const displayPhoto = firebaseUser?.photoURL     || localUser?.photo || null;
  const avatarSrc    = displayPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || displayEmail || "User")}&background=111111&color=E8E8ED&size=128`;

  const handleLogout = async () => {
    setOpen(false);
    try { if (firebaseUser) await signOut(auth); } catch (e) { console.error(e); }
    setFirebaseUser(null);
    if (onLogout) onLogout();
  };

  // CHANGED: tambahan satu entri "Lihat Riwayat" di quick search, konsisten
  // dengan entri search lain yang sudah ada (Chatbot, Interview, Statistik, FAQ)
  const searchMenus = [
    { icon: <MessageCircle size={14} style={{ color: "#60A5FA" }} />, label: "Coba berbicara dengan Chatbot", desc: "Tanyakan apa saja seputar BletchAI",         action: () => goTo({ target: "home" }) },
    { icon: <Mic            size={14} style={{ color: "#22D3EE" }} />, label: "Mulai Interview",               desc: "Latih kemampuan interview kamu bersama AI", action: () => goTo({ target: "interview" }) },
    { icon: <BarChart2      size={14} style={{ color: "#A78BFA" }} />, label: "Lihat Statistik",               desc: "Pantau perkembangan kemampuan kamu",        action: handleLihatStatistik },
    { icon: <History         size={14} style={{ color: "#34D399" }} />, label: "Lihat Riwayat Chat",            desc: "Buka kembali percakapan sebelumnya",        action: () => goTo(historyItem) }, // CHANGED
    { icon: <CircleHelp     size={14} style={{ color: "#60A5FA" }} />, label: "FAQ",                           desc: "Pertanyaan yang sering ditanyakan",         action: () => goTo({ target: "faq" }) },
  ];

  const filteredMenus = search.trim()
    ? searchMenus.filter((m) =>
        m.label.toLowerCase().includes(search.toLowerCase()) ||
        m.desc.toLowerCase().includes(search.toLowerCase()))
    : searchMenus;

  // ── Styles via CSS variables ──────────────────────────────────────────────

  const dropdownStyle = {
    position: "absolute",
    right: 0,
    top: "44px",
    background: "var(--bg-card)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid var(--border-md)",
    borderRadius: "14px",
    boxShadow: "0 20px 48px var(--shadow-card-lg), inset 0 1px 0 var(--card-inset)",
    overflow: "hidden",
    transformOrigin: "top right",
    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
  };

  // inactive nav item colors (from CSS vars — resolved at runtime via inline style)
  const inactiveColor       = "var(--text-secondary)";
  const inactiveHover       = "var(--text-primary)";
  const inactiveBorder      = "1px solid transparent";
  const inactiveHoverBg     = "var(--bg-surface)";
  const inactiveHoverBorder = "1px solid var(--border-soft)";

  const navBarStyle = (isMobile = false) => ({
    width: isMobile ? "calc(100% - 2rem)" : "calc(100% - 4rem)",
    maxWidth: isMobile ? "480px" : "1160px",
    marginTop: isMobile ? "8px" : "14px",
    background: scrolled ? "var(--bg-navbar-s)" : "var(--bg-navbar)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: scrolled ? "1px solid var(--border-strong)" : "1px solid var(--border-soft)",
    boxShadow: scrolled
      ? "0 8px 40px var(--shadow-card-lg), inset 0 1px 0 var(--card-inset)"
      : "0 4px 24px var(--shadow-card), inset 0 1px 0 var(--card-inset)",
  });

  // CHANGED: tombol theme toggle reusable, dipakai di versi desktop & mobile
  // (menggantikan posisi tombol lonceng/Bell sebelumnya)
  const ThemeToggleButton = ({ size = 15, className = "" }) => (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex items-center justify-center rounded-xl transition-all duration-200 ${className}`}
      style={{ color: inactiveColor, background: "transparent", border: inactiveBorder }}
      onMouseEnter={e => { e.currentTarget.style.color = inactiveHover; e.currentTarget.style.background = inactiveHoverBg; e.currentTarget.style.border = inactiveHoverBorder; }}
      onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = inactiveBorder; }}
    >
      {isDark
        ? <Sun size={size} strokeWidth={1.8} />
        : <Moon size={size} strokeWidth={1.8} />
      }
    </button>
  );

  const InterviewDropdown = ({ isMobile = false }) => (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        ...dropdownStyle,
        width: "240px",
        right: isMobile ? "auto" : "50%",
        left: isMobile ? "50%" : "auto",
        top: "36px",
        transform: interviewDropOpen
          ? `translateX(${isMobile ? "-50%" : "50%"}) translateY(0) scale(1)`
          : `translateX(${isMobile ? "-50%" : "50%"}) translateY(-8px) scale(0.96)`,
        opacity: interviewDropOpen ? 1 : 0,
        pointerEvents: interviewDropOpen ? "auto" : "none",
      }}
    >
      <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)", letterSpacing: "0.08em" }}>
          Interview AI
        </p>
      </div>
      <button
        onClick={() => goTo({ target: "interview" })}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
        style={{ background: "transparent", borderBottom: "1px solid var(--border-soft)" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,211,238,0.06)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.20)" }}>
          <Mic size={13} style={{ color: "#22D3EE" }} />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Mulai Interview</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Latih kemampuan wawancara kamu</p>
        </div>
      </button>
      <button
        onClick={handleLihatStatistik}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
        style={{ background: "transparent" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.06)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(167,139,250,0.10)", border: "1px solid rgba(167,139,250,0.22)" }}>
          <BarChart2 size={13} style={{ color: "#A78BFA" }} />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Lihat Statistik</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Pantau perkembangan kemampuan kamu</p>
        </div>
      </button>
      <div className="h-2" />
    </div>
  );

  return (
    <>
      {/* ============================================================
          DESKTOP NAVBAR
      ============================================================ */}
      <header
        className="hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 z-50 items-center gap-4 px-5 py-2 rounded-2xl transition-all duration-500"
        style={navBarStyle(false)}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer" /* CHANGED: cursor-pointer + onClick agar logo selalu balik ke home */
          onClick={() => goTo({ target: "home" })}
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-light)", lineHeight: 1 }}>B</span>
          </div>
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Bletch AI
          </span>
        </div>

        <div className="w-px h-5 flex-shrink-0" style={{ background: "var(--border-soft)" }} />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {menuItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.target;

            const activeStyle = {
              background: "var(--accent-bg)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "var(--accent-light)",
              border: "1px solid var(--accent-border)",
              boxShadow: "inset 0 1px 0 var(--accent-bg), 0 0 12px var(--accent-bg)",
            };

            if (item.hasDropdown) {
              return (
                <div key={item.name} className="relative" ref={interviewDropRef}>
                  <button
                    onClick={() => setInterviewDropOpen((v) => !v)}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={isActive ? activeStyle : { color: inactiveColor, border: inactiveBorder, background: "transparent" }}
                    onMouseEnter={e => {
                      if (isActive) return;
                      e.currentTarget.style.color = inactiveHover;
                      e.currentTarget.style.background = inactiveHoverBg;
                      e.currentTarget.style.border = inactiveHoverBorder;
                    }}
                    onMouseLeave={e => {
                      if (isActive) return;
                      e.currentTarget.style.color = inactiveColor;
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = inactiveBorder;
                    }}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.name}</span>
                    <ChevronDown size={11} style={{
                      color: isActive ? "var(--accent-light)" : "var(--text-muted)",
                      transform: interviewDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      marginLeft: "1px",
                    }} />
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
                    )}
                  </button>
                  <InterviewDropdown />
                </div>
              );
            }

            // CHANGED: dari scrollTo(item.target) jadi goTo(item) — supaya item route (History) bisa pindah halaman
            return (
              <button
                key={item.name}
                onClick={() => goTo(item)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={isActive ? activeStyle : { color: inactiveColor, border: inactiveBorder, background: "transparent" }}
                onMouseEnter={e => {
                  if (isActive) return;
                  e.currentTarget.style.color = inactiveHover;
                  e.currentTarget.style.background = inactiveHoverBg;
                  e.currentTarget.style.border = inactiveHoverBorder;
                }}
                onMouseLeave={e => {
                  if (isActive) return;
                  e.currentTarget.style.color = inactiveColor;
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = inactiveBorder;
                }}
              >
                <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="w-px h-5 flex-shrink-0" style={{ background: "var(--border-soft)" }} />

        {/* Right side */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ color: inactiveColor, background: "transparent", border: inactiveBorder }}
              onMouseEnter={e => { e.currentTarget.style.color = inactiveHover; e.currentTarget.style.background = inactiveHoverBg; e.currentTarget.style.border = inactiveHoverBorder; }}
              onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = inactiveBorder; }}
            >
              <Search size={15} />
            </button>
            <div
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                ...dropdownStyle,
                width: "280px",
                top: "40px",
                opacity: searchOpen ? 1 : 0,
                pointerEvents: searchOpen ? "auto" : "none",
                transform: searchOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
              }}
            >
              <div className="relative px-3 pt-3 pb-2" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kursus atau topik..."
                  className="w-full text-sm rounded-xl py-1.5 pl-8 pr-3 outline-none transition-all"
                  style={{
                    background: "var(--bg-surface)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-border)"; e.currentTarget.style.background = "var(--bg-surface-md)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border-soft)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                />
              </div>
              <p className="text-[11px] px-4 pt-2 pb-1" style={{ color: "var(--text-muted)" }}>
                {search.trim() ? "Hasil pencarian" : "Menu cepat"}
              </p>
              {filteredMenus.length > 0 ? filteredMenus.map((m, i) => (
                <button key={i}
                  onClick={() => { setSearchOpen(false); setSearch(""); m.action(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}>
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{m.desc}</p>
                  </div>
                </button>
              )) : <p className="text-xs px-4 py-3" style={{ color: "var(--text-muted)" }}>Tidak ditemukan</p>}
              <div className="h-2" />
            </div>
          </div>

          {/* CHANGED: tombol lonceng diganti tombol theme toggle (sun/moon) */}
          <ThemeToggleButton size={15} className="w-8 h-8" />

          {/* Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl transition-all duration-200"
              style={{
                background: open ? "var(--bg-surface)" : "transparent",
                border: open ? "1px solid var(--border-md)" : inactiveBorder,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.border = "1px solid var(--border-md)"; }}
              onMouseLeave={e => { if (!open) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = inactiveBorder; } }}
            >
              {loggedIn ? (
                <div className="relative w-7 h-7 flex-shrink-0">
                  <img src={avatarSrc} alt="profile" className="w-7 h-7 rounded-full object-cover"
                    style={{ outline: "1.5px solid var(--border-md)" }} referrerPolicy="no-referrer" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
                    style={{ background: "var(--dot-online)", border: "1.5px solid var(--bg-base)", boxShadow: "0 0 5px var(--dot-online)" }} />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
                  <UserRound size={14} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
              <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                {loggedIn ? (displayName || "User") : "Guest"}
              </span>
              <ChevronDown size={12} style={{
                color: "var(--text-muted)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }} />
            </button>

            <div
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                ...dropdownStyle,
                width: "260px",
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
                transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
              }}
            >
              {loggedIn ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <img src={avatarSrc} alt="profile" className="w-9 h-9 rounded-full object-cover"
                      style={{ outline: "1.5px solid var(--border-md)" }} referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{displayName || "User"}</p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{displayEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setOpen(false); goTo(historyItem); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-soft)", background: "transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <History size={15} /> Riwayat Chat
                  </button>
                  <button
                    onClick={() => { setOpen(false); if (onLogin) onLogin("login"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-soft)", background: "transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <UserRound size={15} /> Ganti Akun
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: "#F87171", background: "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <LogOut size={15} /> Keluar
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Kamu belum masuk</p>
                  </div>
                  <button
                    onClick={() => { setOpen(false); onLogin("login"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
                    style={{ color: "var(--accent-light)", borderBottom: "1px solid var(--border-soft)", background: "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--accent-bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <LogOut size={15} className="rotate-180" /> Masuk
                  </button>
                  <button
                    onClick={() => { setOpen(false); onLogin("register"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: "var(--text-muted)", background: "transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <UserRound size={15} /> Daftar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          MOBILE NAVBAR — compact pill, icon-only nav + right actions
      ============================================================ */}
      <header
        className="md:hidden fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl transition-all duration-500"
        style={navBarStyle(true)}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-1 flex-shrink-0 cursor-pointer" /* CHANGED: cursor-pointer + onClick */
          onClick={() => goTo({ target: "home" })}
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-light)", lineHeight: 1 }}>B</span>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Bletch AI
          </span>
        </div>

        <div className="w-px h-4 flex-shrink-0" style={{ background: "var(--border-soft)" }} />

        {/* Nav links — icon only on mobile */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {menuItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.target;

            const mobileActiveStyle = {
              background: "var(--accent-bg)",
              color: "var(--accent-light)",
              border: "1px solid var(--accent-border)",
            };

            if (item.hasDropdown) {
              return (
                <div key={item.name} className="relative" ref={mobileInterviewRef}>
                  <button
                    onClick={() => setInterviewDropOpen((v) => !v)}
                    className="relative flex items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200"
                    style={isActive ? mobileActiveStyle : { color: inactiveColor, border: inactiveBorder, background: "transparent" }}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                    <ChevronDown size={9} style={{
                      color: isActive ? "var(--accent-light)" : "var(--text-muted)",
                      transform: interviewDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }} />
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
                    )}
                  </button>
                  <InterviewDropdown isMobile />
                </div>
              );
            }

            // CHANGED: dari scrollTo(item.target) jadi goTo(item)
            return (
              <button
                key={item.name}
                onClick={() => goTo(item)}
                className="relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200"
                style={isActive ? mobileActiveStyle : { color: inactiveColor, border: inactiveBorder, background: "transparent" }}
              >
                <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="w-px h-4 flex-shrink-0" style={{ background: "var(--border-soft)" }} />

        {/* Right — search + theme toggle + avatar */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                color: searchOpen ? "var(--accent-light)" : inactiveColor,
                background: searchOpen ? "var(--accent-bg)" : "transparent",
                border: searchOpen ? "1px solid var(--accent-border)" : inactiveBorder,
              }}
            >
              <Search size={13} />
            </button>

            {searchOpen && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  position: "fixed",
                  top: "52px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "calc(100vw - 2rem)",
                  maxWidth: "440px",
                  background: "var(--bg-card)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1px solid var(--border-md)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 48px var(--shadow-search), inset 0 1px 0 var(--card-inset)",
                  overflow: "hidden",
                  zIndex: 60,
                }}
              >
                <div className="relative px-3 pt-3 pb-2" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  <Search size={13} style={{ color: "var(--text-muted)", position: "absolute", left: "22px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kursus atau topik..."
                    className="w-full text-sm rounded-xl py-2 pl-8 pr-3 outline-none"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-border)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--border-soft)"; }}
                    autoFocus
                  />
                </div>
                <p className="text-[11px] px-4 pt-2 pb-1" style={{ color: "var(--text-muted)" }}>
                  {search.trim() ? "Hasil pencarian" : "Menu cepat"}
                </p>
                {filteredMenus.length > 0 ? filteredMenus.map((m, i) => (
                  <button key={i}
                    onClick={() => { setSearchOpen(false); setSearch(""); m.action(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}>
                      {m.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{m.desc}</p>
                    </div>
                  </button>
                )) : <p className="text-xs px-4 py-3" style={{ color: "var(--text-muted)" }}>Tidak ditemukan</p>}
                <div className="h-2" />
              </div>
            )}
          </div>

          {/* CHANGED: tombol lonceng diganti tombol theme toggle (sun/moon) */}
          <ThemeToggleButton size={13} className="w-7 h-7" />

          {/* Avatar */}
          <div className="relative" ref={mobileAvatarRef}>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center gap-1 pl-1 pr-1 py-0.5 rounded-xl transition-all duration-200"
              style={{
                background: mobileMenuOpen ? "var(--bg-surface)" : "transparent",
                border: mobileMenuOpen ? "1px solid var(--border-md)" : inactiveBorder,
              }}
            >
              {loggedIn ? (
                <div className="relative w-6 h-6 flex-shrink-0">
                  <img src={avatarSrc} alt="profile" className="w-6 h-6 rounded-full object-cover"
                    style={{ outline: "1.5px solid var(--border-md)" }} referrerPolicy="no-referrer" />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--dot-online)", border: "1.5px solid var(--bg-base)" }} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
                  <UserRound size={12} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
              <ChevronDown size={9} style={{
                color: "var(--text-muted)",
                transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }} />
            </button>

            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  style={{ background: "var(--overlay)" }}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    position: "fixed",
                    top: "52px",
                    right: "1rem",
                    width: "220px",
                    background: "var(--bg-card)",
                    backdropFilter: "blur(28px)",
                    WebkitBackdropFilter: "blur(28px)",
                    border: "1px solid var(--border-md)",
                    borderRadius: "16px",
                    boxShadow: "0 20px 48px var(--shadow-card-lg), inset 0 1px 0 var(--card-inset)",
                    overflow: "hidden",
                    zIndex: 60,
                    animation: "dropIn 0.2s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {loggedIn ? (
                    <>
                      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                        <img src={avatarSrc} alt="profile" className="w-8 h-8 rounded-full object-cover"
                          style={{ outline: "1.5px solid var(--border-md)" }} referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{displayName || "User"}</p>
                          <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{displayEmail}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setMobileMenuOpen(false); goTo(historyItem); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-all"
                        style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-soft)", background: "transparent" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <History size={13} /> Riwayat Chat
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); if (onLogin) onLogin("login"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-all"
                        style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-soft)", background: "transparent" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <UserRound size={13} /> Ganti Akun
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-all"
                        style={{ color: "#F87171", background: "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <LogOut size={13} /> Keluar
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Kamu belum masuk</p>
                      </div>
                      <button
                        onClick={() => { setMobileMenuOpen(false); onLogin("login"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all"
                        style={{ color: "var(--accent-light)", borderBottom: "1px solid var(--border-soft)", background: "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--accent-bg)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <LogOut size={13} className="rotate-180" /> Masuk
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); onLogin("register"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-all"
                        style={{ color: "var(--text-muted)", background: "transparent" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <UserRound size={13} /> Daftar
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer mobile */}
      <div className="md:hidden" style={{ height: "52px" }} />

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
      `}</style>
    </>
  );
}