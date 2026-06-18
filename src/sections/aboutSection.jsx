import antHappy from "../assets/image/ant-happy.png";

export default function FooterSection() {
  return (
    <footer className="bg-[#ECECEC] pt-24 pb-12">

      {/* Divider */}

      <div className="border-t border-zinc-300 mb-16" />

      <div className="max-w-7xl mx-auto px-12">

        {/* Logo */}

        <div className="flex flex-col items-center">

          <img
            src={antHappy}
            alt="Ant"
            className="w-28 mb-5"
          />

          <h1 className="text-6xl font-black tracking-tight">
            BLETCHAI
          </h1>

          <p className="mt-5 max-w-xl text-center text-zinc-600 leading-8">
            Membantu lulusan SMK mempersiapkan karier
            melalui AI Interview, Skill Academy,
            dan Career Recommendation.
          </p>

        </div>

        {/* Navigation */}

        <div className="flex justify-center gap-10 mt-14 text-lg font-medium">

          <a
            href="#home"
            className="hover:text-blue-500 transition"
          >
            Home
          </a>

          <a
            href="#interview"
            className="hover:text-blue-500 transition"
          >
            Interview
          </a>

          <a
            href="#stats"
            className="hover:text-blue-500 transition"
          >
            Progress
          </a>

          <a
            href="#faq"
            className="hover:text-blue-500 transition"
          >
            FAQ
          </a>

        </div>

        {/* Bottom */}

        <div className="mt-16 pt-8 border-t border-zinc-300 flex justify-between items-center">

          <p className="text-zinc-500">
            © 2026 BletchAI. All rights reserved.
          </p>

          <p className="text-zinc-500 italic">
            Built with ❤️ by Team BletchAI
          </p>

        </div>

      </div>

    </footer>
  );
}