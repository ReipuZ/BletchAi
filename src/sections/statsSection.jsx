import antThinking from "../assets/image/ant-thinking.png";
import antHappy from "../assets/image/ant-happy.png";

const stats = [
  {
    title: "Pemilihan kata",
    value: 82,
    color: "bg-red-500",
  },
  {
    title: "Pemecahan masalah",
    value: 90,
    color: "bg-blue-500",
  },
  {
    title: "Kompetensi bidang",
    value: 95,
    color: "bg-green-500",
  },
];

const benefits = [
  {
    title: "Latih Kemampuan Komunikasimu",
    desc: "BletchAI menghadirkan berbagai skenario percakapan. Pilih respons terbaik untuk melatih penggunaan kata yang tepat dan profesional.",
  },
  {
    title: "Dapatkan Evaluasi dari AI",
    desc: "Setelah memilih jawaban, AI akan memberikan penjelasan, masukan, dan alasan mengapa suatu respons lebih efektif dan profesional.",
  },
  {
    title: "Tingkatkan Keterampilanmu",
    desc: "Temukan rekomendasi pengembangan diri dan keterampilan yang perlu ditingkatkan sesuai kebutuhanmu.",
  },
];

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="bg-[#ECECEC] px-12 py-20"
    >
      <div className="flex gap-10">

        {/* ANT */}
        <div className="w-[300px] flex justify-center items-start">
          <img
            src={antThinking}
            alt="Ant Thinking"
            className="w-full max-w-[260px]"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1">

          <p className="italic text-xl text-zinc-700 mb-8">
            *Sepertinya Keahlian interview mu semakin hari semakin baik
          </p>

          {/* Progress */}
          <div className="space-y-8">

            {stats.map((item) => (
              <div key={item.title}>
                <div className="flex justify-between mb-2">

                  <span className="text-xl">
                    {item.title}
                  </span>

                  <span className="font-semibold">
                    {item.value}%
                  </span>

                </div>

                <div className="h-5 rounded-full bg-gray-200 overflow-hidden">

                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{
                      width: `${item.value}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

          {/* TITLE */}
          <h2 className="text-5xl font-bold text-center mt-20 mb-10">
            Wujudkan Karier Impianmu dalam 3 Langkah!
          </h2>

          {/* CARD */}
          <div className="grid grid-cols-3 gap-6">

            {benefits.map((item) => (

              <div
                key={item.title}
                className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition"
              >

                <div className="h-2 w-full bg-black rounded-full mb-6" />

                <h3 className="text-2xl font-bold mb-4">
                  {item.title}
                </h3>

                <p className="text-zinc-600 leading-7">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* ANT HAPPY */}
      <div className="flex justify-end mt-8">
        <img
          src={antHappy}
          alt="Ant Happy"
          className="w-36"
        />
      </div>
    </section>
  );
}