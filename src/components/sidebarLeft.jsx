import { useState, useEffect, useRef } from "react";
import {
  House,
  Mic,
  ChartColumn,
  CircleHelp,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function SidebarLeft({ collapsed }) {
  const [active, setActive] = useState("home");
  const isClicking = useRef(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveCollapsed = isMobile ? true : collapsed;

  const menuItems = [
    { name: "Dashboard",    icon: House,       target: "home" },
    { name: "Kursus",       icon: BookOpen,    target: "kursus" },
    { name: "Interview AI", icon: Mic,         target: "interview" },
    { name: "Progress",     icon: ChartColumn, target: "stats" },
    { name: "FAQ",          icon: CircleHelp,  target: "faq" },
  ];

  const scrollToSection = (sectionId) => {
    isClicking.current = true;
    setActive(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => { isClicking.current = false; }, 700);
  };

  useEffect(() => {
    const targets = menuItems
      .map((item) => document.getElementById(item.target))
      .filter(Boolean);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClicking.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(topMost.target.id);
      },
      { root: null, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menuItems]);

  return (
    <aside
      className={`
        relative h-screen sticky top-0 z-30
        bg-white border-r border-zinc-100
        transition-all duration-300 ease-in-out
        flex flex-col justify-between
        flex-shrink-0
        ${effectiveCollapsed ? "w-[60px] sm:w-[68px]" : "w-60"}
      `}
    >
      <div>
        {/* Menu */}
        <nav className="mt-2 px-2 sm:px-2.5 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.target;

            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.target)}
                title={effectiveCollapsed ? item.name : undefined}
                className={`
                  group w-full flex items-center box-border
                  ${effectiveCollapsed ? "justify-center px-0" : "gap-3 px-3"}
                  py-2.5 rounded-xl
                  transition-all duration-150
                  ${isActive
                    ? "bg-[#FDF6EE] text-[#A67C52]"
                    : "text-zinc-500 hover:bg-[#FDF6EE]/60 hover:text-[#C49A5A]"
                  }
                `}
              >
                {!effectiveCollapsed && (
                  <span className={`absolute left-0 w-[3px] h-6 rounded-r-full bg-[#A67C52] transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
                )}

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`
                    transition-colors duration-150 flex-shrink-0
                    ${isActive ? "text-[#A67C52]" : "text-zinc-400 group-hover:text-[#C49A5A]"}
                  `}
                />
                {!effectiveCollapsed && (
                  <span className={`text-[13.5px] transition-colors duration-150 ${isActive ? "font-semibold text-[#A67C52]" : "font-normal group-hover:text-[#C49A5A]"}`}>
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-2 sm:p-3 space-y-3">
        {!effectiveCollapsed && (
          <div className="rounded-2xl bg-[#FDF6EE] border border-[#EDD9BE]/60 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-[#A67C52] flex items-center justify-center flex-shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <p className="text-[13px] font-semibold text-zinc-800">AI Assistant</p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
              Butuh bantuan?<br />Tanya AI sekarang!
            </p>
            <button className="w-full flex items-center justify-center gap-1.5 bg-[#A67C52] hover:bg-[#8B6340] transition text-white text-xs font-medium py-2 rounded-xl">
              Mulai Chat <ArrowRight size={12} />
            </button>
          </div>
        )}

        {effectiveCollapsed && (
          <div className="flex justify-center">
            <button
              title="AI Assistant"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FDF6EE] border border-[#EDD9BE]/60 flex items-center justify-center hover:bg-[#F5E8D0] transition"
            >
              <Sparkles size={16} className="text-[#A67C52]" />
            </button>
          </div>
        )}

        <div className="border-t border-zinc-100 pt-3 text-center">
          {!effectiveCollapsed && (
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.08em]">
              v1.0.0
            </p>
          )}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 h-full w-5 translate-x-full pointer-events-none hidden sm:block"
        style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15), rgba(255,255,255,0))" }}
      />
    </aside>
  );
}