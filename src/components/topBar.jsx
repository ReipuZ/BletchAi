import { useState, useEffect, useRef } from "react";
import { LogOut, UserRound, Bell, Search, MessageCircle, Mic, BarChart2, CircleHelp, ChevronDown, X, Menu } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function TopBar({ onLogout, onLogin, activePage = "Home", collapsed, setCollapsed, localUser, isLogin }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocus(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = firebaseUser?.displayName || localUser?.name || null;
  const displayEmail = firebaseUser?.email || localUser?.email || null;
  const displayPhoto = firebaseUser?.photoURL || localUser?.photo || null;

  const loggedIn = isLogin || !!firebaseUser;

  const avatarSrc = displayPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || displayEmail || "User")}&background=A67C52&color=2A1B10&size=128`;

  const handleLogout = async () => {
    setOpen(false);
    try {
      if (firebaseUser) await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setFirebaseUser(null);
    if (onLogout) onLogout();
  };

  const handleSwitchAccount = () => {
    setOpen(false);
    if (onLogin) onLogin("login");
  };

  const searchMenus = [
    {
      icon: <MessageCircle size={14} className="text-[#A67C52]" />,
      label: "Coba berbicara dengan Chatbot",
      desc: "Tanyakan apa saja seputar BletchAI",
      action: () => { setSearchFocus(false); document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }); },
    },
    {
      icon: <Mic size={14} className="text-[#A67C52]" />,
      label: "Mulai Interview",
      desc: "Latih kemampuan interview kamu bersama AI",
      action: () => { setSearchFocus(false); document.getElementById("interview")?.scrollIntoView({ behavior: "smooth" }); },
    },
    {
      icon: <BarChart2 size={14} className="text-[#A67C52]" />,
      label: "Lihat Stats",
      desc: "Pantau perkembangan kemampuan kamu",
      action: () => { setSearchFocus(false); document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" }); },
    },
    {
      icon: <CircleHelp size={14} className="text-[#A67C52]" />,
      label: "FAQ",
      desc: "Pertanyaan yang sering ditanyakan",
      action: () => { setSearchFocus(false); document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }); },
    },
  ];

  const filteredMenus = search.trim()
    ? searchMenus.filter((m) =>
        m.label.toLowerCase().includes(search.toLowerCase()) ||
        m.desc.toLowerCase().includes(search.toLowerCase())
      )
    : searchMenus;

  return (
    <header className="relative sticky top-0 z-50 w-full h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-6 gap-3">

      {/* Kiri: Hamburger*/}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setCollapsed?.(!collapsed)}
          className="w-9 h-9 rounded-xl hover:bg-[#A67C52]/10 flex items-center justify-center transition text-zinc-500 hover:text-[#A67C52]"
          aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          <Menu size={18} />
        </button>

        <span className="text-[15px] font-semibold text-zinc-800">Bletch AI</span>
      </div>

      {/* Kanan: Search + Notif + Avatar */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              placeholder="Cari kursus atau topik..."
              className="w-64 bg-zinc-50 border border-zinc-200 text-zinc-800 placeholder-zinc-400 text-sm rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[#A67C52]/60 focus:bg-white transition"
            />
          </div>

          <div className={`absolute right-0 top-11 w-72 bg-white border border-zinc-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${
            searchFocus ? "opacity-100 translate-y-0 scale-100" : "opacity-0 pointer-events-none -translate-y-2 scale-95"
          }`}>
            <p className="text-zinc-400 text-xs px-4 pt-3 pb-1">
              {search.trim() ? "Hasil pencarian" : "Menu cepat"}
            </p>
            {filteredMenus.length > 0 ? filteredMenus.map((menu, i) => (
              <button key={i} onClick={menu.action}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-zinc-50 transition text-left">
                <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  {menu.icon}
                </div>
                <div>
                  <p className="text-zinc-700 text-xs font-medium">{menu.label}</p>
                  <p className="text-zinc-400 text-[11px]">{menu.desc}</p>
                </div>
              </button>
            )) : (
              <p className="text-zinc-400 text-xs px-4 py-2">Tidak ditemukan</p>
            )}
            <div className="h-2" />
          </div>
        </div>

        {/* Notif */}
        <button className="relative w-9 h-9 rounded-xl hover:bg-zinc-100 flex items-center justify-center transition text-zinc-500 hover:text-zinc-700">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A67C52]" />
        </button>

        {/* Avatar + nama */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-zinc-100 transition"
          >
            {loggedIn ? (
              <div className="relative">
                <img src={avatarSrc} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#639922] border-2 border-white" />
              </div>
            ) : (
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <UserRound size={18} className="text-zinc-500" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                  <X size={7} className="text-white" strokeWidth={3} />
                </span>
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-medium text-zinc-800 leading-none mb-0.5">
                {loggedIn ? (displayName || "User") : "Guest"}
              </p>
              <p className="text-[11px] text-zinc-400 leading-none">Siswa</p>
            </div>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          <div className={`absolute right-0 top-12 w-56 rounded-2xl bg-white border border-zinc-100 shadow-lg overflow-hidden transition-all duration-200 ${
            open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 pointer-events-none -translate-y-2 scale-95"
          }`}>
            {loggedIn ? (
              <>
                <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-3">
                  <img src={avatarSrc} alt="profile" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-zinc-800 text-sm font-medium truncate">{displayName || "User"}</p>
                    <p className="text-zinc-400 text-xs truncate">{displayEmail}</p>
                  </div>
                </div>
                <button
                  onClick={handleSwitchAccount}
                  className="w-full flex items-center gap-3 px-4 py-3 text-zinc-700 hover:bg-zinc-50 transition text-sm border-b border-zinc-100"
                >
                  <UserRound size={16} />
                  Ganti Akun
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition text-sm"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-zinc-100">
                  <p className="text-zinc-400 text-xs">Kamu belum masuk</p>
                </div>
                <button onClick={() => { setOpen(false); onLogin("login"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#A67C52] hover:bg-[#A67C52]/5 transition text-sm font-medium border-b border-zinc-100">
                  <LogOut size={16} className="rotate-180" />
                  Masuk
                </button>
                <button onClick={() => { setOpen(false); onLogin("register"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-zinc-700 hover:bg-zinc-50 transition text-sm">
                  <UserRound size={16} />
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute left-0 bottom-0 w-full h-6 translate-y-full pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0) 100%)" }} />
    </header>
  );
}