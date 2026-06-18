import { ArrowUpRight } from "lucide-react";

export default function InterviewSection() {
  return (
    <section
      id="interview"
      className="bg-[#ECECEC] pt-24 pb-20 text-center"
    >
      <h3 className="text-5xl font-bold">
        Tingkatkan Keahlian
      </h3>

      <h1 className="text-[110px] leading-none font-black mt-2">
        interview mu!
      </h1>

      <p className="max-w-xl mx-auto mt-6 text-zinc-600 italic">
        Berlatih wawancara bersama Anty, asisten virtual BletchAI.
        Latih kemampuan interview-mu melalui simulasi interaktif dan
        dapatkan evaluasi berdasarkan hasil latihanmu.
      </p>

      <button
        className="
        mt-10
        inline-flex
        items-center
        gap-3
        bg-blue-500
        hover:bg-blue-600
        text-white
        px-8
        py-4
        rounded-full
        text-2xl
        transition"
      >
        Mulai Interview
        <ArrowUpRight size={28}/>
      </button>
    </section>
  );
}