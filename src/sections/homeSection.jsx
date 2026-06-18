import { Search, Send } from "lucide-react";

export default function HomeSection() {
  const courses = [
    {
      title: "Teknik Otomotif",
      image:
        "https://images.unsplash.com/photo-1486006920555-c77dcf18193c",
    },
    {
      title: "Pemrograman",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    },
    {
      title: "Musik Digital",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    },
    {
      title: "Desain Teknik",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },
    {
      title: "Networking",
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
    },
    {
      title: "Data Analyst",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen px-12 py-12"
    >
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold">
          Halo, User
        </h1>

        <h2 className="text-3xl font-semibold mt-10">
          Apa yang ingin kamu pelajari hari ini?
        </h2>
      </div>

      {/* Search */}
      <div className="mt-12">
        <div
          className="
            bg-white
            rounded-full
            border-2
            border-zinc-300
            px-8
            py-5
            flex
            items-center
            gap-5
          "
        >
          <Search size={35} />

          <input
            type="text"
            placeholder="Tanyakan seputar layanan BLETCHAI..."
            className="
              flex-1
              outline-none
              text-xl
            "
          />

          <button>
            <Send size={32} />
          </button>
        </div>

        <p className="text-zinc-500 mt-3 ml-16">
          Chatbot akan membantu menjawab
          pertanyaan berdasarkan informasi
          yang tersedia.
        </p>
      </div>

      {/* Course */}
      <div className="mt-20">
        <h3 className="text-3xl italic text-zinc-600 mb-8">
          Pelatihan yang direkomendasikan
        </h3>

        <div className="grid grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="
                relative
                overflow-hidden
                rounded-[40px]
                h-[280px]
                cursor-pointer
                group
              "
            >
              <img
                src={course.image}
                alt={course.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition
                  duration-300
                  group-hover:scale-110
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-black/40
                  opacity-0
                  group-hover:opacity-100
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <h4 className="text-white text-2xl font-bold">
                  {course.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}