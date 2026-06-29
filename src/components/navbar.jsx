import { useState, useEffect, useRef } from "react";
import {
  House, Mic, CircleHelp, BookOpen,
  LogOut, UserRound, Bell, Search, MessageCircle,
  BarChart2, ChevronDown, ChevronUp, X, Menu,
} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar({ onLogout, onLogin, localUser, isLogin, openStatsRef }) {
  const [firebaseUser, setFirebaseUser]           = useState(null);
  const [open, setOpen]                           = useState(false);
  const [search, setSearch]                       = useState("");
  const [searchOpen, setSearchOpen]               = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]       = useState(false);
  const [active, setActive]                       = useState("home");
  const [scrolled, setScrolled]                   = useState(false);
  const [interviewDropOpen, setInterviewDropOpen] = useState(false);
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
      if (mobileInterviewRef.current && !mobileInterviewRef.current.contains(e.target)) {
        // handled separately below
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuItems = [
    { name: "Dashboard",    icon: House,      target: "home" },
    { name: "Kursus",       icon: BookOpen,   target: "kursus" },
    { name: "Interview AI", icon: Mic,        target: "interview", hasDropdown: true },
    { name: "FAQ",          icon: CircleHelp, target: "faq" },
  ];

  useEffect(() => {
    const targets = menuItems.map((m) => document.getElementById(m.target)).filter(Boolean);
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
  }, []);

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

  const searchMenus = [
    { icon: <MessageCircle size={14} style={{ color: "#60A5FA" }} />, label: "Coba berbicara dengan Chatbot", desc: "Tanyakan apa saja seputar BletchAI",         action: () => scrollTo("home") },
    { icon: <Mic            size={14} style={{ color: "#22D3EE" }} />, label: "Mulai Interview",               desc: "Latih kemampuan interview kamu bersama AI", action: () => scrollTo("interview") },
    { icon: <BarChart2      size={14} style={{ color: "#A78BFA" }} />, label: "Lihat Statistik",               desc: "Pantau perkembangan kemampuan kamu",        action: handleLihatStatistik },
    { icon: <CircleHelp     size={14} style={{ color: "#60A5FA" }} />, label: "FAQ",                           desc: "Pertanyaan yang sering ditanyakan",         action: () => scrollTo("faq") },
  ];

  const filteredMenus = search.trim()
    ? searchMenus.filter((m) =>
        m.label.toLowerCase().includes(search.toLowerCase()) ||
        m.desc.toLowerCase().includes(search.toLowerCase()))
    : searchMenus;

  const dropdownStyle = {
    position: "absolute",
    right: 0,
    top: "44px",
    background: "rgba(10,10,10,0.88)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "14px",
    boxShadow: "0 20px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
    overflow: "hidden",
    transformOrigin: "top right",
    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
  };

  const inactiveColor       = "#8A8A9A";
  const inactiveHover       = "#C8C8D8";
  const inactiveBorder      = "1px solid transparent";
  const inactiveHoverBg     = "rgba(255,255,255,0.07)";
  const inactiveHoverBorder = "1px solid rgba(255,255,255,0.10)";

  const navBarStyle = (isMobile = false) => ({
    width: isMobile ? "calc(100% - 2.5rem)" : "calc(100% - 4rem)",
    maxWidth: isMobile ? "520px" : "1160px",
    marginTop: isMobile ? "10px" : "14px",
    background: scrolled ? "rgba(8,8,12,0.88)" : "rgba(8,8,12,0.72)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: scrolled ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.07)",
    boxShadow: scrolled
      ? "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
  });

  const InterviewDropdown = ({ isMobile = false }) => (
    <div style={{
      ...dropdownStyle,
      width: "260px",
      right: isMobile ? "auto" : "50%",
      left: isMobile ? "50%" : "auto",
      top: "40px",
      transform: interviewDropOpen
        ? `translateX(${isMobile ? "-50%" : "50%"}) translateY(0) scale(1)`
        : `translateX(${isMobile ? "-50%" : "50%"}) translateY(-8px) scale(0.96)`,
      opacity: interviewDropOpen ? 1 : 0,
      pointerEvents: interviewDropOpen ? "auto" : "none",
    }}>
      <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#555565", letterSpacing: "0.08em" }}>
          Interview AI
        </p>
      </div>

      <button
        onClick={() => scrollTo("interview")}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
        style={{ background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,211,238,0.06)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.20)" }}>
          <Mic size={13} style={{ color: "#22D3EE" }} />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "#CCCCCC" }}>Mulai Interview</p>
          <p className="text-[11px]" style={{ color: "#555565" }}>Latih kemampuan wawancara kamu</p>
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
          <p className="text-xs font-medium" style={{ color: "#CCCCCC" }}>Lihat Statistik</p>
          <p className="text-[11px]" style={{ color: "#555565" }}>Pantau perkembangan kemampuan kamu</p>
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
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.30)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#93C5FD", lineHeight: 1 }}>B</span>
          </div>
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "#E8E8F0", letterSpacing: "-0.01em" }}>
            Bletch AI
          </span>
        </div>

        <div className="w-px h-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.09)" }} />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {menuItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.target;

            if (item.hasDropdown) {
              return (
                <div key={item.name} className="relative" ref={interviewDropRef}>
                  <button
                    onClick={() => setInterviewDropOpen((v) => !v)}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={isActive ? {
                      background: "rgba(59,130,246,0.14)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      color: "#93C5FD",
                      border: "1px solid rgba(59,130,246,0.28)",
                      boxShadow: "inset 0 1px 0 rgba(59,130,246,0.18), 0 0 12px rgba(59,130,246,0.08)",
                    } : {
                      color: inactiveColor,
                      border: inactiveBorder,
                      background: "transparent",
                    }}
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
                      color: isActive ? "#93C5FD" : "#555565",
                      transform: interviewDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      marginLeft: "1px",
                    }} />
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)" }} />
                    )}
                  </button>
                  <InterviewDropdown />
                </div>
              );
            }

            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.target)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={isActive ? {
                  background: "rgba(59,130,246,0.14)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "#93C5FD",
                  border: "1px solid rgba(59,130,246,0.28)",
                  boxShadow: "inset 0 1px 0 rgba(59,130,246,0.18), 0 0 12px rgba(59,130,246,0.08)",
                } : {
                  color: inactiveColor,
                  border: inactiveBorder,
                  background: "transparent",
                }}
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
                    style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)" }} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="w-px h-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.09)" }} />

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
            <div style={{
              ...dropdownStyle,
              width: "280px",
              top: "40px",
              opacity: searchOpen ? 1 : 0,
              pointerEvents: searchOpen ? "auto" : "none",
              transform: searchOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
            }}>
              <div className="relative px-3 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2" style={{ color: "#444444" }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kursus atau topik..."
                  className="w-full text-sm rounded-xl py-1.5 pl-8 pr-3 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.09)", color: "#E2E8F0" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.40)"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                />
              </div>
              <p className="text-[11px] px-4 pt-2 pb-1" style={{ color: "#555555" }}>
                {search.trim() ? "Hasil pencarian" : "Menu cepat"}
              </p>
              {filteredMenus.length > 0 ? filteredMenus.map((m, i) => (
                <button key={i}
                  onClick={() => { setSearchOpen(false); setSearch(""); m.action(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}>
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#CCCCCC" }}>{m.label}</p>
                    <p className="text-[11px]" style={{ color: "#555555" }}>{m.desc}</p>
                  </div>
                </button>
              )) : <p className="text-xs px-4 py-3" style={{ color: "#444444" }}>Tidak ditemukan</p>}
              <div className="h-2" />
            </div>
          </div>

          {/* Notif */}
          <button className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ color: inactiveColor, background: "transparent", border: inactiveBorder }}
            onMouseEnter={e => { e.currentTarget.style.color = inactiveHover; e.currentTarget.style.background = inactiveHoverBg; e.currentTarget.style.border = inactiveHoverBorder; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = inactiveBorder; }}
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" style={{ boxShadow: "0 0 5px rgba(59,130,246,0.7)" }} />
          </button>

          {/* Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl transition-all duration-200"
              style={{ background: open ? "rgba(255,255,255,0.07)" : "transparent", border: open ? "1px solid rgba(255,255,255,0.10)" : inactiveBorder }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)"; }}
              onMouseLeave={e => { if (!open) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = inactiveBorder; } }}
            >
              {loggedIn ? (
                <div className="relative w-7 h-7 flex-shrink-0">
                  <img src={avatarSrc} alt="profile" className="w-7 h-7 rounded-full object-cover" style={{ outline: "1.5px solid rgba(255,255,255,0.16)" }} referrerPolicy="no-referrer" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400" style={{ border: "1.5px solid #080810", boxShadow: "0 0 5px rgba(52,211,153,0.6)" }} />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)" }}>
                  <UserRound size={14} style={{ color: "#666666" }} />
                </div>
              )}
              <span className="text-[13px] font-medium" style={{ color: "#D0D0DC" }}>{loggedIn ? (displayName || "User") : "Guest"}</span>
              <ChevronDown size={12} style={{ color: "#666670", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
            </button>
            <div style={{ ...dropdownStyle, width: "260px", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)" }}>
              {loggedIn ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <img src={avatarSrc} alt="profile" className="w-9 h-9 rounded-full object-cover" style={{ outline: "1.5px solid rgba(255,255,255,0.12)" }} referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>{displayName || "User"}</p>
                      <p className="text-xs truncate" style={{ color: "#555565" }}>{displayEmail}</p>
                    </div>
                  </div>
                  <button onClick={() => { setOpen(false); if (onLogin) onLogin("login"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "#999999", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "transparent" }} onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}><UserRound size={15} /> Ganti Akun</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "#F87171", background: "transparent" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><LogOut size={15} /> Keluar</button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}><p className="text-xs" style={{ color: "#555565" }}>Kamu belum masuk</p></div>
                  <button onClick={() => { setOpen(false); onLogin("login"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all" style={{ color: "#93C5FD", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "transparent" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><LogOut size={15} className="rotate-180" /> Masuk</button>
                  <button onClick={() => { setOpen(false); onLogin("register"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "#666666", background: "transparent" }} onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}><UserRound size={15} /> Daftar</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          MOBILE — floating top pill (mirip desktop, versi ringkas)
      ============================================================ */}
      <header
        className="md:hidden fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-500"
        style={navBarStyle(true)}
      >
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.30)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#93C5FD", lineHeight: 1 }}>B</span>
          </div>
          <span className="text-[13px] font-semibold tracking-tight" style={{ color: "#E8E8F0", letterSpacing: "-0.01em" }}>
            Bletch AI
          </span>
        </div>

        <div className="w-px h-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.09)" }} />

        {/* Nav links — mobile (icon + label, compact) */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {menuItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.target;

            if (item.hasDropdown) {
              return (
                <div key={item.name} className="relative" ref={mobileInterviewRef}>
                  <button
                    onClick={() => setInterviewDropOpen((v) => !v)}
                    className="relative flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200"
                    style={isActive ? {
                      background: "rgba(59,130,246,0.14)",
                      color: "#93C5FD",
                      border: "1px solid rgba(59,130,246,0.28)",
                    } : {
                      color: inactiveColor,
                      border: inactiveBorder,
                      background: "transparent",
                    }}
                  >
                    <Icon size={13} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="hidden xs:inline">Interview</span>
                    <ChevronDown size={9} style={{
                      color: isActive ? "#93C5FD" : "#555565",
                      transform: interviewDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }} />
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)" }} />
                    )}
                  </button>
                  <InterviewDropdown isMobile />
                </div>
              );
            }

            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.target)}
                className="relative flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200"
                style={isActive ? {
                  background: "rgba(59,130,246,0.14)",
                  color: "#93C5FD",
                  border: "1px solid rgba(59,130,246,0.28)",
                } : {
                  color: inactiveColor,
                  border: inactiveBorder,
                  background: "transparent",
                }}
              >
                <Icon size={13} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="hidden xs:inline">{item.name}</span>
                {isActive && (
                  <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)" }} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="w-px h-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.09)" }} />

        {/* Right — search + notif + avatar (mobile) */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ color: searchOpen ? "#93C5FD" : inactiveColor, background: searchOpen ? "rgba(59,130,246,0.12)" : "transparent", border: searchOpen ? "1px solid rgba(59,130,246,0.28)" : inactiveBorder }}
            >
              <Search size={13} />
            </button>

            {/* Search dropdown — positioned below, full pill width on mobile */}
            {searchOpen && (
              <div style={{
                position: "fixed",
                top: "58px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100vw - 2.5rem)",
                maxWidth: "480px",
                background: "rgba(10,10,10,0.92)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "16px",
                boxShadow: "0 20px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
                overflow: "hidden",
                zIndex: 60,
              }}>
                <div className="relative px-3 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <Search size={13} style={{ color: "#444444", position: "absolute", left: "22px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kursus atau topik..."
                    className="w-full text-sm rounded-xl py-2 pl-8 pr-3 outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#E2E8F0" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.40)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                    autoFocus
                  />
                </div>
                <p className="text-[11px] px-4 pt-2 pb-1" style={{ color: "#555555" }}>
                  {search.trim() ? "Hasil pencarian" : "Menu cepat"}
                </p>
                {filteredMenus.length > 0 ? filteredMenus.map((m, i) => (
                  <button key={i}
                    onClick={() => { setSearchOpen(false); setSearch(""); m.action(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}>
                      {m.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "#CCCCCC" }}>{m.label}</p>
                      <p className="text-[11px]" style={{ color: "#555555" }}>{m.desc}</p>
                    </div>
                  </button>
                )) : <p className="text-xs px-4 py-3" style={{ color: "#444444" }}>Tidak ditemukan</p>}
                <div className="h-2" />
              </div>
            )}
          </div>

          {/* Notif */}
          <button className="relative w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ color: inactiveColor, background: "transparent", border: inactiveBorder }}
          >
            <Bell size={13} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" style={{ boxShadow: "0 0 5px rgba(59,130,246,0.7)" }} />
          </button>

          {/* Avatar / akun */}
          <div className="relative" ref={mobileAvatarRef}>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 pl-1 pr-1.5 py-0.5 rounded-xl transition-all duration-200"
              style={{
                background: mobileMenuOpen ? "rgba(255,255,255,0.07)" : "transparent",
                border: mobileMenuOpen ? "1px solid rgba(255,255,255,0.10)" : inactiveBorder,
              }}
            >
              {loggedIn ? (
                <div className="relative w-6 h-6 flex-shrink-0">
                  <img src={avatarSrc} alt="profile" className="w-6 h-6 rounded-full object-cover" style={{ outline: "1.5px solid rgba(255,255,255,0.16)" }} referrerPolicy="no-referrer" />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ border: "1.5px solid #080810" }} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)" }}>
                  <UserRound size={12} style={{ color: "#666666" }} />
                </div>
              )}
              <ChevronDown size={10} style={{ color: "#666670", transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
            </button>

            {/* Mobile avatar dropdown */}
            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div style={{
                  position: "fixed",
                  top: "58px",
                  right: "1.25rem",
                  width: "240px",
                  background: "rgba(10,10,10,0.92)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  zIndex: 60,
                  animation: "dropIn 0.2s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  {loggedIn ? (
                    <>
                      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <img src={avatarSrc} alt="profile" className="w-9 h-9 rounded-full object-cover" style={{ outline: "1.5px solid rgba(255,255,255,0.12)" }} referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>{displayName || "User"}</p>
                          <p className="text-xs truncate" style={{ color: "#555565" }}>{displayEmail}</p>
                        </div>
                      </div>
                      <button onClick={() => { setMobileMenuOpen(false); if (onLogin) onLogin("login"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "#999999", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "transparent" }} onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}><UserRound size={15} /> Ganti Akun</button>
                      <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "#F87171", background: "transparent" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><LogOut size={15} /> Keluar</button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}><p className="text-xs" style={{ color: "#555565" }}>Kamu belum masuk</p></div>
                      <button onClick={() => { setMobileMenuOpen(false); onLogin("login"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all" style={{ color: "#93C5FD", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "transparent" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><LogOut size={15} className="rotate-180" /> Masuk</button>
                      <button onClick={() => { setMobileMenuOpen(false); onLogin("register"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "#666666", background: "transparent" }} onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}><UserRound size={15} /> Daftar</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer untuk konten tidak tertutup navbar mobile */}
      <div className="md:hidden" style={{ height: "58px" }} />

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @media (min-width: 420px) {
          .hidden.xs\\:inline { display: inline !important; }
        }
      `}</style>
    </>
  );
}