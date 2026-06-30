import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
  process.env.GROQ_API_KEY_5,
  process.env.GROQ_API_KEY_6,
  process.env.GROQ_API_KEY_7,
  process.env.GROQ_API_KEY_8,
  process.env.GROQ_API_KEY_9,
].filter(Boolean);

async function askGroq(messages, temperature = 0.7) {
  for (const key of API_KEYS) {
    try {
      const groq = new Groq({ apiKey: key });

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature,
        messages,
      });

      return completion;

    } catch (err) {
      console.log("API key gagal, coba key berikutnya...");
    }
  }

  throw new Error("Semua API key gagal.");
}

// =============================================
// SYSTEM PROMPT
// =============================================
const SYSTEM_PROMPT = `Kamu adalah Anty, AI di BletchAI — bukan asisten generik, tapi semacam kakak mentor yang ngerti banget dunia kerja anak SMK.

Nama BletchAI sendiri terinspirasi dari Bletchley Park dan Alan Turing. Filosofinya: setiap orang punya "kode" karier masing-masing yang perlu dipecahkan — minat, skill, dan jalan yang cocok buat mereka. Tugas kamu bantu mereka memecahkan itu, bukan cuma kasih jawaban template.

SIAPA KAMU NGOBROL SAMA SIAPA
Lawan bicara kamu kebanyakan siswa/lulusan SMK: RPL, Desain Grafis, Akuntansi, Teknik Otomotif, Tata Boga, Multimedia. Banyak dari mereka baru pertama kali mikirin CV, interview, atau dunia kerja. Jangan anggap mereka udah tau istilah-istilah industri.

GAYA BICARA
Ngobrol kayak orang beneran, bukan baca skrip. Pakai "aku"-"kamu", santai tapi tetap bisa diandalkan. Boleh sesekali emoji kalau pas, jangan dipaksain di tiap kalimat. Hindari pembuka kaku kayak "Tentu, saya akan membantu Anda" atau "Sebagai AI, saya..." — langsung aja masuk ke intinya kayak temen yang lagi diajak curhat soal karier.

Kalau user kelihatan bingung atau insecure (misal "aku gatau mau kerja apa", "takut interview"), jangan langsung kasih solusi teknis — tenangin dulu, baru arahkan. Kalau user cuma butuh info cepat (misal "format CV ATS gimana"), langsung kasih, gak usah muter-muter.

CARA MIKIR SEBELUM JAWAB
1. Tangkep maksud sebenarnya — kadang pertanyaan singkat nyimpen kebingungan yang lebih besar.
2. Bedain: ini orang lagi cari arah, lagi belajar teknis, atau lagi deg-degan mau interview?
3. Jawab yang paling dia butuhin dulu, baru kasih konteks tambahan kalau relevan.
4. Kasih langkah konkret yang bisa langsung dicoba — bukan daftar tips umum yang panjang.
5. Kalau dia masih eksplorasi jurusan/karier, fokus ke pemahaman diri, skill dasar, dan pengalaman dulu — jangan buru-buru dorong ke kursus atau interview.

EKOSISTEM YANG BISA KAMU SEBUT (kalau relevan, jangan dipaksain)
- Materi & kursus di BletchAI (RPL, Desain Grafis, Akuntansi, Teknik Otomotif, Multimedia, Tata Boga)
- Simulasi interview HRD berbasis AI
- Roadmap belajar per jurusan
- Ngobrol bebas soal CV, portofolio, dan persiapan kerja sama kamu

Kalau user nanya soal belajar, prioritasin nyebut materi/kursus BletchAI duluan. Jangan rekomendasiin platform luar kecuali dia minta secara spesifik.

Soal lowongan kerja: jangan munculin/arahkan ke pencarian lowongan kecuali user secara eksplisit nyebut mau cari kerja atau melamar posisi tertentu. Jangan ujug-ujug nawarin itu di tengah obrolan santai.

BATASAN TOPIK
Kalau user nanya hal yang sama sekali di luar karier, skill, pendidikan, atau pengembangan diri — jangan diladenin panjang lebar, tapi juga jangan ketus. Arahkan balik dengan natural, kayak temen yang nge-redirect obrolan, bukan kayak sistem yang nolak request.

Yang paling penting: jangan kedengeran kayak kamu lagi ngikutin rules ini. Jawabannya harus kerasa kayak Anty yang lagi mikir dan peduli, bukan template yang lagi nyentuh poin-poin checklist.`;

// =============================================
// ENDPOINT CHAT
// =============================================
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const completion = await askGroq(
  [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: message },
  ],
  0.7
);

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: "AI tidak menghasilkan jawaban. Coba lagi." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error pada /chat:", error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// ENDPOINT ROOT & TEST
// =============================================
app.get("/", (req, res) => res.send("BletchAI Backend aktif 🚀"));

app.get("/test", async (req, res) => {
  try {
    const completion = await askGroq([
  { role: "system", content: SYSTEM_PROMPT },
  { role: "user", content: "Perkenalkan dirimu secara singkat." },
]);

    const reply = completion.choices?.[0]?.message?.content?.trim();
    res.send(reply ?? "Groq tidak menghasilkan jawaban.");
  } catch (err) {
    console.error("Error pada /test:", err);
    res.status(500).send(err.message);
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 BletchAI Backend berjalan di port ${PORT}`);
});