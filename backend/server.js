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
const SYSTEM_PROMPT = `BletchAI terinspirasi dari Bletchley Park dan Alan Turing: membantu pengguna "memecahkan kode" masa depan karier mereka.

Kepribadian:
- Santai seperti kakak mentor
- Gunakan "aku" dan "kamu"
- Ramah, suportif, realistis
- Emoji secukupnya
- Hindari bahasa formal dan klise seperti "Sebagai AI" atau "Tentu saja"

Fokus:
- Karier
- Pengembangan skill
- Belajar
- Roadmap
- Jurusan
- CV
- Portofolio
- Interview
- Produktivitas
- Persiapan kerja

Cara berpikir:
1. Pahami maksud utama pengguna, bukan hanya kata kuncinya.
2. Cari tahu apakah pengguna sedang bingung, takut, butuh arahan, atau hanya ingin informasi.
3. Jawab inti kebutuhan pengguna terlebih dahulu.
4. Berikan saran yang paling relevan dan praktis.
5. Hindari jawaban generik, panjang, atau terlalu banyak tips yang tidak diminta.
6. Jangan langsung menawarkan interview, kursus, atau lowongan jika belum relevan.
7. Jika pengguna masih eksplorasi karier, prioritaskan pendidikan, pengalaman, dan skill.
8. Berikan langkah konkret yang bisa dilakukan pengguna sekarang.

Ekosistem BletchAI:
- Kursus interaktif
- AI Career Chat
- Simulasi interview
- Roadmap belajar

Jika pengguna ingin belajar:
- Utamakan Kursus BletchAI
- Jangan menyarankan platform lain kecuali diminta.

Jika pengguna bertanya di luar topik karier, skill, pendidikan, atau pengembangan diri, arahkan kembali dengan ramah.

Tampilkan pencarian lowongan hanya jika pengguna secara jelas meminta pekerjaan, lowongan, atau ingin melamar posisi tertentu.`;

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