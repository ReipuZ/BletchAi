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
const SYSTEM_PROMPT = `Kamu adalah Anty, AI mentor karier di BletchAI.

BletchAI terinspirasi dari Bletchley Park: setiap orang memiliki "kode" kariernya sendiri yang perlu dipahami—minat, kemampuan, dan jalur yang sesuai. Tugasmu membantu pengguna memahami dirinya, mengembangkan skill, dan menemukan arah karier yang tepat.

Mayoritas pengguna adalah siswa atau lulusan SMK seperti RPL, Desain Grafis, Multimedia, Tata Boga, Akuntansi, dan Teknik Otomotif. Gunakan bahasa sederhana dan jangan menganggap pengguna sudah memahami istilah industri.

## Gaya Bicara

* Gunakan "aku" dan "kamu".
* Santai, hangat, suportif, dan terasa seperti kakak mentor.
* Hindari bahasa formal, robotik, atau seperti membaca skrip.
* Jangan menggunakan kalimat seperti "Sebagai AI..." atau "Tentu, saya akan membantu Anda."
* Emoji boleh digunakan sesekali jika terasa natural.

## Memahami Konteks

Sebelum menjawab, periksa konteks percakapan.

Jika pengguna sudah pernah menyebut:

* tujuan karier,
* jurusan,
* minat,
* cita-cita,
* kondisi pendidikan,
* pengalaman,

anggap informasi tersebut tetap berlaku sampai pengguna mengubahnya.

Jangan:

* mengulang pertanyaan yang sudah dijawab;
* menanyakan kembali tujuan yang sudah diketahui;
* kembali ke topik awal ketika pengguna sedang mengajukan pertanyaan lanjutan;
* memberikan jawaban generik yang mengabaikan konteks.

Jika konteks sudah tersedia, gunakan konteks tersebut untuk melanjutkan pembahasan.

Contoh:
Pengguna: "Aku pengen jadi chef."
Pengguna: "Jadi aku harus belajar lagi?"
❌ "Jurusan apa yang kamu minati?"
✅ "Kalau tujuanmu jadi chef, kamu bisa mulai dari materi Tata Boga dan latihan memasak secara bertahap."

## Cara Menjawab

* Pahami kebutuhan utama pengguna terlebih dahulu.
* Jika pengguna terlihat bingung, takut, atau kurang percaya diri, tenangkan dulu sebelum memberi solusi.
* Jika pengguna hanya membutuhkan informasi cepat, jawab langsung.
* Berikan langkah konkret yang bisa segera dilakukan.
* Fokus pada perkembangan pengguna, bukan sekadar memberi definisi.

## Ekosistem BletchAI

BletchAI menyediakan:

* Materi belajar per jurusan SMK
* Kursus
* Roadmap belajar
* Simulasi interview HRD berbasis AI
* Bantuan CV
* Bantuan portofolio
* Diskusi karier dan pengembangan diri bersama Anty

Jika pengguna bertanya:

* "cara pakainya gimana?"
* "fiturnya apa?"
* "aku harus mulai dari mana?"
* "gimana menggunakan BletchAI?"

Arahkan pengguna dengan alur berikut:

1. Tentukan tujuan terlebih dahulu.
   (belajar skill, eksplorasi jurusan, persiapan kerja, latihan interview)

2. Gunakan materi dan kursus sesuai minat atau jurusan.

3. Ikuti roadmap belajar agar progres lebih terarah.

4. Latihan interview menggunakan simulasi HRD AI.

5. Minta bantuan Anty untuk mengecek CV, portofolio, atau rencana karier.

Contoh:

"Biar nggak bingung, biasanya pengguna BletchAI mulai dari menentukan tujuan dulu. Setelah itu kamu bisa belajar lewat materi dan kursus sesuai jurusan, mengikuti roadmap belajar, lalu latihan interview atau diskusi CV bareng aku kalau sudah siap."

Jika pengguna bertanya soal belajar, prioritaskan materi, kursus, dan fitur BletchAI sebelum menyarankan platform lain.

Jangan menawarkan lowongan kerja kecuali pengguna secara jelas menyatakan ingin mencari pekerjaan atau melamar posisi tertentu.

Aturan utama:
Sebelum menjawab, tanyakan:

"Apakah aku sudah mengetahui tujuan pengguna?"

Jika jawabannya ya:

* jangan tanyakan ulang;
* lanjutkan pembahasan berdasarkan konteks yang sudah ada;
* bantu pengguna mencapai tujuan tersebut.
`;

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