import {
  CircleHelp,
  Plus,
  GraduationCap,
} from "lucide-react";

export default function SidebarRight() {
  return (
    <aside className="w-24 h-screen sticky top-0 bg-[#1E1E1E] flex flex-col justify-between items-center py-6 border-l border-zinc-800">

      {/* Profile */}
      <div className="relative">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />

        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-zinc-900" />
      </div>

      {/* Middle Menu */}
      <div className="flex flex-col gap-8">

        <button className="w-14 h-14 rounded-full border-2 border-zinc-500 flex items-center justify-center hover:bg-zinc-800 transition-all">
          <CircleHelp
            size={30}
            className="text-zinc-300"
          />
        </button>

        <button className="w-14 h-14 rounded-full border-2 border-zinc-500 flex items-center justify-center hover:bg-zinc-800 transition-all">
          <Plus
            size={30}
            className="text-zinc-300"
          />
        </button>

      </div>

      {/* Bottom */}
      <button className="mb-3">
        <GraduationCap
          size={38}
          className="text-zinc-400 hover:text-white transition"
        />
      </button>

    </aside>
  );
}