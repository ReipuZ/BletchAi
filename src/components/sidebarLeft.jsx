import {
  House,
  LibraryBig,
  Compass,
  Mic,
  Menu,
  ChartColumn,
} from "lucide-react";

export default function SidebarLeft() {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const menuItems = [
    {
      name: "Home",
      icon: House,
      target: "home",
    },
    {
      name: "Library",
      icon: LibraryBig,
      target: "courses",
    },
    {
      name: "Stats",
      icon: ChartColumn,
      target: "stats",
    },
    {
      name: "Interview",
      icon: Mic,
      target: "interview",
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#1E1E1E] border-r border-zinc-800 flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="flex justify-center pt-8">
          <img
            src="/assets/image/logo.png"
            alt="Bletch AI"
            className="w-48"
          />
        </div>

        {/* Menu */}
        <nav className="mt-32 px-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() =>
                  scrollToSection(item.target)
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  text-white
                  text-2xl
                  py-3
                  hover:text-blue-400
                  transition-all
                "
              >
                <Icon size={24} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Icon */}
      <div className="p-5">
        <button className="text-zinc-400 hover:text-white transition">
          <Menu size={36} />
        </button>
      </div>
    </aside>
  );
}