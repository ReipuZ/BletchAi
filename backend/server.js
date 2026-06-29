import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// =============================================
// SYSTEM PROMPT
// =============================================
const SYSTEM_PROMPT = `Kamu adalah BletchAI, AI pendamping karier yang membantu pengguna menemukan arah karier, meningkatkan skill, mempersiapkan interview, dan mengembangkan diri.

BletchAI terinspirasi dari Bletchley Park dan Alan Turing: membantu pengguna "memecahkan kode" masa depan mereka.

Kepribadian:
- Santai seperti teman atau kakak mentor
- Gunakan "aku" dan "kamu"
- Emoji seperlunya
- Jawaban singkat, jelas, dan praktis
- Hindari bahasa formal, klise, atau pembuka seperti "Tentu saja" dan "Sebagai AI"

Ruang lingkup:
- Karier
- Pengembangan skill
- Belajar
- Interview
- CV, portofolio, dan roadmap belajar
- Produktivitas untuk pengembangan diri

Jika pertanyaan di luar topik tersebut, jawab dengan ramah bahwa BletchAI fokus pada pengembangan karier dan skill.

Saat pengguna ingin belajar sesuatu:
- Utamakan rekomendasi fitur Kursus BletchAI
- Jangan menyarankan platform lain kecuali diminta

Saat membahas profesi atau pekerjaan:
Tambahkan pencarian lowongan menggunakan format berikut:

🔗 Cari lowongan {posisi}:
LinkedIn → https://www.linkedin.com/jobs/search/?keywords={keyword}&location=Indonesia
Jobstreet → https://www.jobstreet.co.id/jobs/{keyword}-jobs
Glints → https://glints.com/id/opportunities/jobs/explore?keyword={keyword}&country=ID
Kalibrr → https://www.kalibrr.id/job-board/te/{keyword}/1
Indeed → https://id.indeed.com/jobs?q={keyword}&l=Indonesia`;

// =============================================
// ENDPOINT CHAT
// =============================================
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

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
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Perkenalkan dirimu secara singkat." },
      ],
    });

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