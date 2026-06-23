import { useState, useEffect, useRef } from "react";
import {
  House, Mic, ChartColumn, CircleHelp, BookOpen,
  LogOut, UserRound, Bell, Search, MessageCircle,
  BarChart2, ChevronDown,
} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar({ onLogout, onLogin, localUser, isLogin }) {
  const [firebaseUser, setFirebaseUser]     = useState(null);
  const [open, setOpen]                     = useState(false);
  const [search, setSearch]                 = useState("");
  const [searchOpen, setSearchOpen]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive]                 = useState("home");
  const [scrolled, setScrolled]             = useState(false);
  const isClicking                          = useRef(false);
  const dropdownRef                         = useRef(null);
  const searchRef                           = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setFirebaseUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target))   setSearchOpen(false);
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
    { name: "Dashboard",    icon: House,       target: "home" },
    { name: "Kursus",       icon: BookOpen,    target: "kursus" },
    { name: "Interview AI", icon: Mic,         target: "interview" },
    { name: "Progress",     icon: ChartColumn, target: "stats" },
    { name: "FAQ",          icon: CircleHelp,  target: "faq" },
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isClicking.current = false; }, 700);
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
    { icon: <MessageCircle size={14} style={{ color: "#60A5FA" }} />, label: "Coba berbicara dengan Chatbot", desc: "Tanyakan apa saja seputar BletchAI",         target: "home" },
    { icon: <Mic            size={14} style={{ color: "#22D3EE" }} />, label: "Mulai Interview",               desc: "Latih kemampuan interview kamu bersama AI", target: "interview" },
    { icon: <BarChart2      size={14} style={{ color: "#A78BFA" }} />, label: "Lihat Stats",                   desc: "Pantau perkembangan kemampuan kamu",        target: "stats" },
    { icon: <CircleHelp     size={14} style={{ color: "#60A5FA" }} />, label: "FAQ",                           desc: "Pertanyaan yang sering ditanyakan",         target: "faq" },
  ];

  const filteredMenus = search.trim()
    ? searchMenus.filter((m) =>
        m.label.toLowerCase().includes(search.toLowerCase()) ||
        m.desc.toLowerCase().includes(search.toLowerCase()))
    : searchMenus;

  /* ── Shared dropdown glass style ── */
  const dropdownStyle = {
    position: "absolute",
    right: 0,
    top: "44px",
    width: "260px",
    background: "rgba(10,10,10,0.82)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "14px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
    overflow: "hidden",
    transformOrigin: "top right",
    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP — floating glass navbar
      ══════════════════════════════════════ */}
      <header
        className="hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 z-50 items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-500"
        style={{
          width: "calc(100% - 3rem)",
          maxWidth: "920px",
          marginTop: "16px",
          /* ✦ Glass navbar — sedikit lebih gelap, tetap transparan */
          background: scrolled
            ? "rgba(10,10,10,0.75)"
            : "rgba(10,10,10,0.60)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 mr-1">
          <span className="text-[14px] font-bold tracking-tight" style={{ color: "#F1F5F9" }}>
            Bletch AI
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {menuItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.target;
            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.target)}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={isActive ? {
                  /* ✦ Active pill — glass biru */
                  background: "rgba(59,130,246,0.15)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "#93C5FD",
                  border: "1px solid rgba(59,130,246,0.25)",
                  boxShadow: "inset 0 1px 0 rgba(59,130,246,0.20)",
                } : {
                  color: "#555555",
                  border: "1px solid transparent",
                  background: "transparent",
                }}
                onMouseEnter={e => {
                  if (isActive) return;
                  e.currentTarget.style.color = "#AAAAAA";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.09)";
                }}
                onMouseLeave={e => {
                  if (isActive) return;
                  e.currentTarget.style.color = "#555555";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.name}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-px h-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Right: Search + Notif + Avatar */}
        <div className="flex items-center gap-1 flex-shrink-0">

          {/* ✦ Search icon button — glass hover */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ color: "#555555", background: "transparent", border: "1px solid transparent" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#AAAAAA";
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#555555";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.border = "1px solid transparent";
              }}
            >
              <Search size={15} />
            </button>

            {/* ✦ Search dropdown — glass panel */}
            <div style={{
              ...dropdownStyle,
              width: "280px",
              top: "40px",
              opacity: searchOpen ? 1 : 0,
              pointerEvents: searchOpen ? "auto" : "none",
              transform: searchOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
            }}>
              {/* Search input dalam dropdown */}
              <div className="relative px-3 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2" style={{ color: "#444444" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kursus atau topik..."
                  className="w-full text-sm rounded-xl py-1.5 pl-8 pr-3 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    color: "#E2E8F0",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                />
              </div>
              <p className="text-[11px] px-4 pt-2 pb-1" style={{ color: "#444444" }}>
                {search.trim() ? "Hasil pencarian" : "Menu cepat"}
              </p>
              {filteredMenus.length > 0 ? filteredMenus.map((m, i) => (
                <button key={i}
                  onClick={() => { scrollTo(m.target); setSearchOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* ✦ Icon box — glass square */}
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}>
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

          {/* ✦ Notif — glass hover */}
          <button
            className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ color: "#555555", background: "transparent", border: "1px solid transparent" }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#AAAAAA";
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "#555555";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.border = "1px solid transparent";
            }}
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"
              style={{ boxShadow: "0 0 4px rgba(59,130,246,0.6)" }} />
          </button>

          {/* ✦ Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all duration-200"
              style={{ background: "transparent", border: "1px solid transparent" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.09)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.border = "1px solid transparent";
              }}
            >
              {loggedIn ? (
                <div className="relative w-7 h-7 flex-shrink-0">
                  <img src={avatarSrc} alt="profile" className="w-7 h-7 rounded-full object-cover"
                    style={{ outline: "1.5px solid rgba(255,255,255,0.14)" }}
                    referrerPolicy="no-referrer" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400"
                    style={{ border: "2px solid #000000", boxShadow: "0 0 4px rgba(52,211,153,0.5)" }} />
                </div>
              ) : (
                /* ✦ Guest avatar — glass circle */
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}>
                  <UserRound size={14} style={{ color: "#666666" }} />
                </div>
              )}
              <span className="text-[13px] font-medium" style={{ color: "#CCCCCC" }}>
                {loggedIn ? (displayName || "User") : "Guest"}
              </span>
              <ChevronDown size={13} style={{
                color: "#555555",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }} />
            </button>

            {/* ✦ Account dropdown — glass panel */}
            <div style={{
              ...dropdownStyle,
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
            }}>
              {loggedIn ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <img src={avatarSrc} alt="profile" className="w-9 h-9 rounded-full object-cover"
                      style={{ outline: "1.5px solid rgba(255,255,255,0.12)" }}
                      referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>{displayName || "User"}</p>
                      <p className="text-xs truncate" style={{ color: "#555555" }}>{displayEmail}</p>
                    </div>
                  </div>
                  <button onClick={() => { setOpen(false); if (onLogin) onLogin("login"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: "#999999", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <UserRound size={15} /> Ganti Akun
                  </button>
                  <button onClick={handleLogout}
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
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs" style={{ color: "#555555" }}>Kamu belum masuk</p>
                  </div>
                  <button onClick={() => { setOpen(false); onLogin("login"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
                    style={{ color: "#93C5FD", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <LogOut size={15} className="rotate-180" /> Masuk
                  </button>
                  <button onClick={() => { setOpen(false); onLogin("register"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: "#666666", background: "transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <UserRound size={15} /> Daftar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          MOBILE — bottom glass nav bar
      ══════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-1"
        style={{
          /* ✦ Bottom nav — gelap tipis, tetap glass */
          background: "rgba(10,10,10,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center justify-around py-1.5">
          {menuItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.target;
            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.target)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 active:scale-90"
              >
                {/* ✦ Active icon — glass pill */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={isActive ? {
                    background: "rgba(59,130,246,0.15)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    boxShadow: "inset 0 1px 0 rgba(59,130,246,0.18)",
                  } : {
                    background: "transparent",
                    border: "1px solid transparent",
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.7}
                    style={{ color: isActive ? "#93C5FD" : "#444444" }} />
                </div>
                <span className="text-[10px] font-medium leading-none transition-colors"
                  style={{ color: isActive ? "#93C5FD" : "#444444" }}>
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* Tombol Akun */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl active:scale-90 transition-all"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              {loggedIn ? (
                <img src={avatarSrc} alt="profile" className="w-7 h-7 rounded-full object-cover"
                  style={{ outline: "1.5px solid rgba(255,255,255,0.14)" }}
                  referrerPolicy="no-referrer" />
              ) : (
                /* ✦ Guest mobile avatar — glass circle */
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}>
                  <UserRound size={14} style={{ color: "#555555" }} />
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none" style={{ color: "#444444" }}>Akun</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE — akun drawer (glass sheet)
      ══════════════════════════════════════ */}
      <>
        {/* Backdrop */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* ✦ Sheet — glass bottom drawer */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
          style={{
            background: "rgba(10,10,10,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 -16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
          }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>

          {loggedIn ? (
            <>
              <div className="px-5 py-3 flex items-center gap-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <img src={avatarSrc} alt="profile" className="w-10 h-10 rounded-full object-cover"
                  style={{ outline: "1.5px solid rgba(255,255,255,0.14)" }}
                  referrerPolicy="no-referrer" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#E2E8F0" }}>{displayName || "User"}</p>
                  <p className="text-xs" style={{ color: "#555555" }}>{displayEmail}</p>
                </div>
              </div>
              <button onClick={() => { setMobileMenuOpen(false); if (onLogin) onLogin("login"); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all"
                style={{ color: "#999999", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}
              >
                <UserRound size={16} /> Ganti Akun
              </button>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all"
                style={{ color: "#F87171", background: "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <LogOut size={16} /> Keluar
              </button>
            </>
          ) : (
            <>
              <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-sm" style={{ color: "#555555" }}>Kamu belum masuk</p>
              </div>
              <button onClick={() => { setMobileMenuOpen(false); onLogin("login"); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all"
                style={{ color: "#93C5FD", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <LogOut size={16} className="rotate-180" /> Masuk
              </button>
              <button onClick={() => { setMobileMenuOpen(false); onLogin("register"); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all"
                style={{ color: "#666666", background: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#EEEEEE"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}
              >
                <UserRound size={16} /> Daftar
              </button>
            </>
          )}
          <div className="h-4" />
        </div>
      </>
    </>
  );
}